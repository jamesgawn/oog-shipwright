import { deepmerge } from 'deepmerge-ts';
import { InteractionResponseType, MessageFlags, type APIInteractionResponse } from 'discord-api-types/v10';
import { defaultResponse } from '../utils/constants';

export class APIResponse extends Response {
    response?: APIInteractionResponse

    public constructor(response?: APIInteractionResponse, init?: ResponseInit) {
      super(JSON.stringify(deepmerge(defaultResponse, response)), {
            ...init,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.response = response;
    }

    static error(statusCode: number, message:string) {
      return new APIResponse({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
              content: message,
              flags: MessageFlags.Ephemeral,
          },
        },{
          status: statusCode
        });
    }

    static pong() {
      return new APIResponse({
        type: InteractionResponseType.Pong
      })
    }
}