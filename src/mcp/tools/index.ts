import { MaterialLibrary } from '../../lib/MaterialLibrary';
import type { McpTool, McpToolResult } from '../types';
import { getMaterial, getMaterialTool } from './getMaterial';
import { listMaterials, listMaterialsTool } from './listMaterials';

export const tools: McpTool[] = [listMaterialsTool, getMaterialTool];

const materialLibrary = new MaterialLibrary();

export function dispatch(name: string, args: Record<string, unknown>): McpToolResult {
  switch (name) {
    case 'list_materials':
      return listMaterials(args, materialLibrary);
    case 'get_material':
      return getMaterial(args, materialLibrary);
    default:
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
}
