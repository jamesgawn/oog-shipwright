import { DiscordSnowflake } from '@sapphire/snowflake';
import {
    type APIChatInputApplicationCommandInteraction,
    ApplicationCommandType,
    InteractionResponseType,
    MessageFlags,
    APIInteractionResponse,
} from 'discord-api-types/v10';
import { Command } from '../structures/Command';
import { Env } from '../../types/Env';
import { APIResponse } from '../structures/APIResponse';

export class PingCommand extends Command {
    public constructor(env: Env) {
        super({
            name: 'ping',
            description: 'Pong!',
            env: env
        });

        this.structure = {
            chatInput: {
                name: this.name,
                description: this.description,
                type: ApplicationCommandType.ChatInput,
            },
        };
    }

    public override async chatInput(interaction: APIChatInputApplicationCommandInteraction) : Promise<APIResponse> {
        const startTime = DiscordSnowflake.timestampFrom(interaction.id);
        const endTime = Date.now();

        return new APIResponse({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "Pong! "+[endTime - startTime]+"ms",
                    flags: MessageFlags.Ephemeral,
                },
            });
    }
}