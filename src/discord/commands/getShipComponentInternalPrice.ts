import {
    type APIChatInputApplicationCommandInteraction,
    ApplicationCommandType,
    InteractionResponseType,
    MessageFlags,
} from 'discord-api-types/v10';
import { Command } from '../structures/Command';
import { Env } from '../../types/Env';
import { APIResponse } from '../structures/APIResponse';
import { MaterialLibrary } from '../../lib/MaterialLibrary';
import shipComponents from '../../reference/ship-components.json';

export class GetShipComponentInternalPriceCommand extends Command {
    public constructor(env: Env) {
        super({
            name: 'get-ship-component-price',
            description: 'Get the current internal price paid for a ship component',
            env: env
        });

        this.structure = {
            chatInput: {
                name: this.name,
                description: this.description,
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        name: 'component',
                        description: 'The ticker for the ship component. e.g. LHP',
                        type: 3, // STRING
                        required: true
                    }
                ]
            },
        };
    }

    public override async chatInput(interaction: APIChatInputApplicationCommandInteraction) : Promise<APIResponse> {
        const materialOption = interaction.data.options?.find(option => option.name === 'component');
        const materialValue = (materialOption && 'value' in materialOption) ? materialOption.value : undefined;

        if (typeof materialValue !== 'string' || materialValue.length === 0) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Invalid material ticker: ${materialValue}`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        const materialLibrary = new MaterialLibrary()
        const componentDetails = materialLibrary.getMaterialByTicker(materialValue);
        if (componentDetails === null) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Unable to find ticker ${materialValue}.`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        const componentInternalPrice = shipComponents[materialValue as keyof typeof shipComponents];
        if (componentInternalPrice === null) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Unable to find internal price for ticker ${materialValue}.`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `**Ticker:** ${materialValue}\n**Name:** ${componentDetails?.Name}\n**Internal Price:** ${componentInternalPrice} AIC`,
            },
        });
    }
}