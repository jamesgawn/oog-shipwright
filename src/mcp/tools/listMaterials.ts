import { MaterialLibrary } from '../../lib/MaterialLibrary';
import type { McpTool, McpToolResult } from '../types';

export const listMaterialsTool: McpTool = {
  name: 'list_materials',
  description: 'List all available materials in Prosperous Universe. Optionally filter by category name.',
  inputSchema: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: 'Filter by category name (case-insensitive partial match, e.g. "metals", "gases")',
      },
    },
  },
};

export function listMaterials(
  args: Record<string, unknown>,
  materialLibrary: MaterialLibrary
): McpToolResult {
  let materials = materialLibrary.getAllMaterials();

  const category = args.category;
  if (typeof category === 'string' && category.trim() !== '') {
    const filter = category.toLowerCase();
    materials = materials.filter((m) => m.CategoryName.toLowerCase().includes(filter));
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(materials, null, 2) }],
  };
}
