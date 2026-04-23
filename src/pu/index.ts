import { AutoRouter } from "itty-router";
import { logger } from "../utils/logger";
import { APIResponse } from "../utils/APIResponse";
import { FioStorageHandler } from './fio/handlers/FioStorageHandler';
import fio from './fio'
import { TradeFinder, CommodityExchange, PriceType } from "./lib/TradeFinder";
import { MaterialLibrary } from "./lib/MaterialLibrary";

const router = AutoRouter({ base: '/pu' });

const materialLibrary = new MaterialLibrary();
const tradeFinder = new TradeFinder(materialLibrary);

router.get('/', () => new Response('Welcome to the Prosperous Universe helper APIs!'));

router.all("/fio/*", fio.fetch);  

router.get('/material/', (req) => {
  const materials = materialLibrary.getAllMaterials();
  return APIResponse.ok(materials);
});

router.get('/material/:id', (req) => {
  const material = materialLibrary.getMaterialByTicker(req.params.id);
  if (material) {
    return APIResponse.ok(material);
  } else {
    return APIResponse.notfound('Material not found');
  }
});

router.get('/material/:ticker/price/:cx', async (req) => {
 const { ticker, cx } = req.params;

  if (typeof cx !== 'string' || !['AI1', 'CI1', 'CI2', 'NC1', 'NC2', 'IC1'].includes(cx)) {
    return APIResponse.badrequest('Invalid commodity exchange code');
  }

  const material = await materialLibrary.getMaterialPriceByTicker(cx as CommodityExchange, ticker);
  if (material) {
    return APIResponse.ok(material);
  } else {
    return APIResponse.notfound('Material not found');
  }
});

router.get('/trade/', async (req) => {
  const { buyCX, sellCX, buyPriceType, sellPriceType, maxVolume, maxWeight, format } = req.query;

  if (!buyCX || !sellCX || !buyPriceType || !sellPriceType) {
    return APIResponse.badrequest('Missing query parameters, required: buyCX, sellCX, buyPriceType, sellPriceType');
  }
  if (typeof buyCX !== 'string' || !['AI1', 'CI1', 'CI2', 'NC1', 'NC2', 'IC1'].includes(buyCX)) {
    return APIResponse.badrequest('Invalid buyCX parameter');
  }
  if (typeof sellCX !== 'string' || !['AI1', 'CI1', 'CI2', 'NC1', 'NC2', 'IC1'].includes(sellCX)) {
    return APIResponse.badrequest('Invalid sellCX parameter');
  }
  if (typeof buyPriceType !== 'string' || !['ASK', 'BID', 'AVG'].includes(buyPriceType)) {
    return APIResponse.badrequest('Invalid buyPriceType parameter');
  }
  if (typeof sellPriceType !== 'string' || !['ASK', 'BID', 'AVG'].includes(sellPriceType)) {
    return APIResponse.badrequest('Invalid sellPriceType parameter');
  }

  // Convert maxVolume and maxWeight to numbers or undefined
  const maxVolumeNum = typeof maxVolume === 'string' && maxVolume.trim() !== '' ? Number(maxVolume) : undefined;
  const maxWeightNum = typeof maxWeight === 'string' && maxWeight.trim() !== '' ? Number(maxWeight) : undefined;

  const tradeOpportunities = await tradeFinder.findTradeOpportunities(
    buyCX as CommodityExchange,
    sellCX as CommodityExchange,
    buyPriceType as PriceType,
    sellPriceType as PriceType,
    maxVolumeNum,
    maxWeightNum
  );

  if (format === 'csv') {
    // Convert to CSV
    if (!tradeOpportunities.length) {
      return new Response('', {
        status: 200,
        headers: { 'Content-Type': 'text/csv' }
      });
    }
    const keys = Object.keys(tradeOpportunities[0]);
    const csvRows = [keys.join(',')];
    for (const row of tradeOpportunities) {
      csvRows.push(keys.map(k => JSON.stringify((row as Record<string, unknown>)[k] ?? '')).join(','));
    }
    const csv = csvRows.join('\n');
    return new Response(csv, {
      status: 200,
      headers: { 'Content-Type': 'text/csv' }
    });
  }

  // Default to JSON if format is not 'csv' or missing
  return APIResponse.ok(tradeOpportunities);
});

export default router