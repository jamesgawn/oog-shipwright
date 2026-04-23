import { APIApplicationCommandAutocompleteInteraction, APIChatInputApplicationCommandInteraction, APIContextMenuInteraction, APIInteractionResponse, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { Env } from "../../types/Env";
import { APIResponse } from "./APIResponse";

export class Command {
  public readonly name: string;

  public readonly description: string;

  public readonly env: Env;

  public readonly guildIDs?: string[];

  public structure!: {
      chatInput?: RESTPostAPIApplicationCommandsJSONBody;
      user?: RESTPostAPIApplicationCommandsJSONBody;
      message?: RESTPostAPIApplicationCommandsJSONBody;
  };

  public constructor({
      name,
      description,
      env,
      guildIDs,
  }: {
      name: string;
      description: string;
      env: Env;
      guildIDs?: string[];
  }) {
      this.name = name;
      this.description = description;
      this.env = env;
      this.guildIDs = guildIDs;
  }

  public chatInput?(interaction: APIChatInputApplicationCommandInteraction): Promise<APIResponse>;
  public contextMenu?(interaction: APIContextMenuInteraction): Promise<APIResponse>;
  public autocomplete?(interaction: APIApplicationCommandAutocompleteInteraction,): Promise<APIResponse>;
  
};