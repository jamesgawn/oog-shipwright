import { APIInteraction, APIInteractionResponse, APIPingInteraction, InteractionResponseType, InteractionType } from "discord-api-types/v10";
import { Env } from "../../types/Env";
import { CommandHandler } from "./CommandHandler";
import { APIResponse } from "../structures/APIResponse";

export class InteractionHandler {
  public readonly env: Env;

  public constructor(env: Env) {
      this.env = env;
  }

  public async handle(interaction: APIInteraction | APIPingInteraction) : Promise<APIResponse> {
    
    switch (interaction.type) {
      case InteractionType.Ping:
        return APIResponse.pong();        

      case InteractionType.ApplicationCommand:
        const commandHandler = new CommandHandler(this.env);
        return commandHandler.handle(interaction);
      
      default: 
        return APIResponse.error(501, "Unsupported Interaction");
    }
    
  }
}