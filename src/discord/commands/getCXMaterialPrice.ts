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
                        name: 'material',
                        description: 'The ticker for the material to get the price for.',
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

        const materialOption = interaction.data.options?.find(option => option.name === 'material');
        const materialValue = (materialOption && 'value' in materialOption) ? materialOption.value : undefined;

        if (typeof cxValue !== 'string' || !['AI1', 'CI1', 'CI2', 'NC1', 'NC2', 'IC1'].includes(cxValue)) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,

            data: {
                content: `Invalid commodity exchange code: ${cxValue}`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

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
        const materialPrice = await materialLibrary.getMaterialPriceByTicker(cxValue as CommodityExchange, materialValue)

        if (materialPrice === null) {
          return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `Material with ticker ${materialValue} not found at ${cxValue}.`,
                flags: MessageFlags.Ephemeral,
            },
          });
        }

        return new APIResponse({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: `**Material prices for ${materialValue}**\n**Ask**: ${materialPrice.Ask}, with volume: ${materialPrice.AskCount}\n**Bid**: ${materialPrice.Bid}, with volume: ${materialPrice.BidCount}`,
            },
        });
    }
}