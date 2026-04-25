import { AutoRouter, error } from "itty-router";
import { MaterialLibrary } from "../../lib/MaterialLibrary";
import { CommodityExchange } from "../../lib/CommodityExchange";

const router = AutoRouter({ base: '/material' });

const materialLibrary = new MaterialLibrary(); 

router.get('/', (req) => {
  const materials = materialLibrary.getAllMaterials();
  return materials;
});

router.get('/:id', (req) => {
  const material = materialLibrary.getMaterialByTicker(req.params.id);
  if (material) {
    return material;
  } else {
    return error(404, 'Material not found');
  }
});

router.get('/:ticker/price/:cx', async (req) => {
 const { ticker, cx } = req.params;

  if (typeof cx !== 'string' || !['AI1', 'CI1', 'CI2', 'NC1', 'NC2', 'IC1'].includes(cx)) {
    return error(400, 'Invalid commodity exchange code');
  }

  const material = await materialLibrary.getMaterialPriceByTicker(cx as CommodityExchange, ticker);
  if (material) {
    return material;
  } else {
    return error(404, 'Material not found');
  }
});

export default router