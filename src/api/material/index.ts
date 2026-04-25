import { AutoRouter, error } from "itty-router";
import { MaterialLibrary } from "../../lib/MaterialLibrary";
import { CommodityExchange } from "../../lib/CommodityExchange";
import { okCachedResponse } from "../../utils/responseHelpers";

const router = AutoRouter({ base: '/material' });

const materialLibrary = new MaterialLibrary(); 

router.get('/', () => {
  const materials = materialLibrary.getAllMaterials();
  return okCachedResponse(materials, 86400);
});

router.get('/:id', (req) => {
  const material = materialLibrary.getMaterialByTicker(req.params.id);
  if (material) {
    return okCachedResponse(material, 86400);
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
    return okCachedResponse(material, 60*10);
  } else {
    return error(404, 'Material not found');
  }
});

export default router