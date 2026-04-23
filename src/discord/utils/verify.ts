import { Env } from "../../types/Env";
import { logger } from "../../utils/logger";
import { APIResponse } from "../structures/APIResponse";

// thanks to devsnek via https://gist.github.com/devsnek/77275f6e3f810a9545440931ed314dc1
function hex2bin(hex: string) {
    const buf = new Uint8Array(Math.ceil(hex.length / 2));
    for (let i = 0; i < buf.length; i += 1) {
        buf[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return buf;
}

let publicKey: CryptoKey | null = null;
const encoder = new TextEncoder();

export const verifyKey = async (request: Request, env: Env) => {
    try {
      const signature = hex2bin(request.headers.get('X-Signature-Ed25519')!);
      const timestamp = request.headers.get('X-Signature-Timestamp');
      const unknown = await request.clone().text();
  
      publicKey ??= await crypto.subtle.importKey(
          'raw',
          hex2bin(env.DISCORD_PUBLIC_KEY),
          {
              name: 'NODE-ED25519',
              namedCurve: 'NODE-ED25519',
          },
          true,
          ['verify'],
      );
  
      return crypto.subtle.verify(
          'NODE-ED25519',
          publicKey,
          signature,
          encoder.encode(timestamp + unknown),
      );
    } catch (err) {
      logger.error(err, "Unable to verify signature.")
      return false;
    }
}

export const withVerify = async (request: Request, env: Env) => {
  if (env.DISCORD_IGNORE_KEY == 'true') {
    
  } else {
    const verified = await verifyKey(request, env);
    if (!verified) {
      return APIResponse.error(401, "Unable to authenticate discord interaction.")
    }
  }

}