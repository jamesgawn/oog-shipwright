import { APIInteractionResponse } from "discord-api-types/v10";

export const defaultResponse: Partial<APIInteractionResponse> = {
  data: {
      allowed_mentions: {
          parse: [],
      },
  },
};