import {
  isChatInputApplicationCommandInteraction,
  isContextMenuApplicationCommandInteraction,
} from 'discord-api-types/utils/v10';
import type { APIApplicationCommandInteraction } from 'discord-api-types/v10';
import type { Env } from '../../types/Env';
import { commands } from '../commands';
import { logger } from '../../utils/logger';
import { APIResponse } from '../structures/APIResponse';

export class CommandHandler {
  public readonly env: Env;

  public constructor(env: Env) {
      this.env = env;
  }

  public async handle(interaction: APIApplicationCommandInteraction) {
      const Command = commands[interaction.data.name];
      logger.info("Processing chat command: " + interaction.data.name);

      if (Command) {
          const command = new Command(this.env);

          if (isChatInputApplicationCommandInteraction(interaction)) {
              return command.chatInput!(interaction);
          }

          if (isContextMenuApplicationCommandInteraction(interaction)) {
              return command.contextMenu!(interaction);
          }
      }
      logger.warn(`No handler found for command: ${interaction.data.name}.`);
      return APIResponse.error(501, "Unsupported Command Interaction")
  }
}