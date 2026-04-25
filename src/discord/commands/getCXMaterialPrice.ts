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
import { CommodityExchange } from '../../lib/CommodityExchange';
import { formatCurrency } from '../../utils/currencyHelper';

export class GetMaterialPriceCommand extends Command {
    public constructor(env: Env) {
        super({
            name: 'get-material-price',
            description: 'Get the current price of a specific material at a given commodity exchange',
            env: env
        });

        this.structure = {
            chatInput: {
                name: this.name,
                description: this.description,
                type: ApplicationCommandType.ChatInput,
                options: [
                    {
                        name: 'cx',
                        description: 'The code for the CX for the material.',
                        type: 3, // STRING
                        required: true,
                        choices: [
                            { name: "ANT", value: "AI1" },
                            { name: "BEN", value: "CI1" },
                            { name: "ARC", value: "CI2" },
                            { name: "MOR", value: "NC1" },
                            { name: "HUB", value: "NC2" },
                            { name: "HRT", value: "IC1" },
                        ]
                    },
                    {
                        name: 'ticker',
                        description: 'The material ticker for the material to get the price for.',
                        type: 3, // STRING
                        required: true
                    }
                ]
            },
        };
    }

    public override async chatInput(interaction: APIChatInputApplicationCommandInteraction) : Promise<APIResponse> {
        const cxOption = interaction.data.options?.find(option => option.name === 'cx');
        const cxValue = (cxOption && 'value' in cxOption) ? cxOption.value : undefined;

        const tickerOption = interaction.data.options?.find(option => option.name === 'ticker');
        const tickerValue = (tickerOption && 'value' in tickerOption) ? tickerOption.value : undefined;

        if (typeof cxValue !== 'string' || !['AI1', 'CI1', 'CI2', 'NC1', 'NC2', 'IC1'].includes(cxValue)) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,

            data: {
                content: `Invalid commodity exchange code: ${cxValue}`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        if (typeof tickerValue !== 'string' || tickerValue.length === 0) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Invalid material ticker: ${tickerValue}`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        const materialLibrary = new MaterialLibrary()
        const materialPrice = await materialLibrary.getMaterialPriceByTicker(cxValue as CommodityExchange, tickerValue)

        if (materialPrice === null) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Material with ticker ${tickerValue} not found at ${cxValue}.`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        if (materialPrice.Price === null) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Material with ticker ${tickerValue} has no price at ${cxValue}.`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        const formattedComponentInternalPrice = formatCurrency(materialPrice.Price, materialPrice.Currency);
        const content = `### ${materialPrice.MaterialName} - CX Price on ${cxValue}\n\n**Ticker:** ${tickerValue}\n**}\n**Price:** ${formattedComponentInternalPrice}`;

        return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: content
            },
        });
    }
}