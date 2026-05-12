import { JSON_RPC_ERRORS, type JsonRpcRequest, type JsonRpcResponse } from './types';
import { dispatch, tools } from './tools';

const MCP_PROTOCOL_VERSION = '2025-03-26';

function jsonRpcResponse(id: string | number | null, result: unknown): JsonRpcResponse {
  return { jsonrpc: '2.0', id, result };
}

function jsonRpcError(
  id: string | number | null,
  error: { code: number; message: string }
): JsonRpcResponse {
  return { jsonrpc: '2.0', id, error };
}

function respond(body: JsonRpcResponse): Response {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let rpc: JsonRpcRequest;
  try {
    rpc = await request.json<JsonRpcRequest>();
  } catch {
    return respond(jsonRpcError(null, JSON_RPC_ERRORS.PARSE_ERROR));
  }

  const id = rpc.id ?? null;

  switch (rpc.method) {
    case 'initialize':
      return respond(
        jsonRpcResponse(id, {
          protocolVersion: MCP_PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: { name: 'oog-shipwright', version: '1.0.0' },
        })
      );

    case 'notifications/initialized':
      return respond(jsonRpcResponse(id, {}));

    case 'tools/list':
      return respond(jsonRpcResponse(id, { tools }));

    case 'tools/call': {
      const params = rpc.params as { name?: string; arguments?: Record<string, unknown> };
      if (!params?.name) {
        return respond(jsonRpcError(id, JSON_RPC_ERRORS.INVALID_PARAMS));
      }
      const result = dispatch(params.name, params.arguments ?? {});
      return respond(jsonRpcResponse(id, result));
    }

    default:
      return respond(jsonRpcError(id, JSON_RPC_ERRORS.METHOD_NOT_FOUND));
  }
}
