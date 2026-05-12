import { MaterialLibrary } from '../../lib/MaterialLibrary';
import type { McpTool, McpToolResult } from '../types';

export const getMaterialTool: McpTool = {
  name: 'get_material',
  description: 'Get details for a specific material by its ticker symbol.',
  inputSchema: {
    type: 'object',
    properties: {
      ticker: {
        type: 'string',
        description: 'Material ticker symbol (e.g. "COF", "RAG", "RGO")',
      },
    },
    required: ['ticker'],
  },
};

export function getMaterial(
  args: Record<string, unknown>,
  materialLibrary: MaterialLibrary
): McpToolResult {
  const ticker = args.ticker;
  if (typeof ticker !== 'string' || ticker.trim() === '') {
    return {
      content: [{ type: 'text', text: 'Missing required parameter: ticker' }],
      isError: true,
    };
  }

  const material = materialLibrary.getMaterialByTicker(ticker.toUpperCase());
  if (!material) {
    return {
      content: [{ type: 'text', text: `No material found with ticker: ${ticker.toUpperCase()}` }],
      isError: true,
    };
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(material, null, 2) }],
  };
}
