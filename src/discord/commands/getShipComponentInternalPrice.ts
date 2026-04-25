import {
    type APIChatInputApplicationCommandInteraction,
    ApplicationCommandType,
    ComponentType,
    InteractionResponseType,
    MessageFlags,
} from 'discord-api-types/v10';
import { Command } from '../structures/Command';
import { Env } from '../../types/Env';
import { APIResponse } from '../structures/APIResponse';
import { MaterialLibrary } from '../../lib/MaterialLibrary';
import shipComponents from '../../reference/ship-components.json';
import { formatCurrency } from '../../utils/currencyHelper';

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
                        name: 'ticker',
                        description: 'The ticker for the ship component. e.g. LHP',
                        type: 3, // STRING
                        required: true
                    }
                ]
            },
        };
    }

    public override async chatInput(interaction: APIChatInputApplicationCommandInteraction) : Promise<APIResponse> {
        const tickerOption = interaction.data.options?.find(option => option.name === 'ticker');
        const tickerValue = (tickerOption && 'value' in tickerOption) ? tickerOption.value : undefined;

        if (typeof tickerValue !== 'string' || tickerValue.length === 0) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Invalid ticker: ${tickerValue}`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        const materialLibrary = new MaterialLibrary()
        const componentDetails = materialLibrary.getMaterialByTicker(tickerValue);
        if (componentDetails === null) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Unable to find ticker ${tickerValue}.`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        const componentInternalPrice = Number(shipComponents[tickerValue as keyof typeof shipComponents]);
        if (isNaN(componentInternalPrice)) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Unable to find internal price for ticker ${tickerValue}.`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }
        
        const formattedComponentInternalPrice = formatCurrency(componentInternalPrice);
        const displayContent = `## ${componentDetails?.Name} Internal Price\n\n **Ticker:** ${tickerValue}\n**Category:** ${componentDetails?.CategoryName}\n**Internal Price:** ${formattedComponentInternalPrice}`;

        return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: displayContent
            },
        });
    }
}