import { logger } from "../../utils/logger";
import { MaterialLibrary } from "./MaterialLibrary";

export type PriceType = 'ASK' | 'BID' | 'AVG';
export type CommodityExchange = 'AI1' | 'CI1' | 'CI2' | 'NC1' | 'NC2' | 'IC1';
type ExchangeMaterialPrice = {
  MaterialTicker: string,
  ExchangeCode: CommodityExchange,
  MMBuy: number | null,
  MMSell: number | null,
  PriceAverage: number | null,
  AskCount: number | null,
  Ask: number | null,
  Supply: number | null,
  BidCount: number | null,
  Bid: number | null,
  Demand: number | null
}

export type TradeMaterialOrderBook = {
  BuyingOrders: TradeOrder[],
  SellingOrders: TradeOrder[]
  CXDataModelId: string,
  MaterialName: string,
  MaterialTicker: string,
  MaterialId: string,
  ExchangeName: string,
  ExchangeCode: string,
  Currency: string,
  Price: number | null,
  PriceTimeEpochMs: number | null,
  High: number | null,
  AllTimeHigh: number | null,
  Low: number | null,
  AllTimeLow: number | null,
  Ask: number | null,
  AskCount: number | null,
  Bid: number | null,
  BidCount: number | null,
  Supply: number,
  Demand: number,
  Traded: number,
  VolumeAmount: number,
  PriceAverage: number,
  NarrowPriceBandLow: number,
  NarrowPriceBandHigh: number,
  WidePriceBandLow: number,
  WidePriceBandHigh: number,
  MMBuy: number | null,
  MMSell: number | null,
  UserNameSubmitted: string,
  Timestamp: string
}

type TradeOrder = {
  OrderId: string,
  CompanyId: string,
  CompanyName: string,
  CompanyCode: string,
  ItemCount: number,
  ItemCost: number
}

export class TradeFinder {
  private materialsLibrary: MaterialLibrary;
  constructor(materialLibrary: MaterialLibrary) {
    this.materialsLibrary = materialLibrary;
  }

  public async findTradeOpportunities(
    buyCX: CommodityExchange,
    sellCX: CommodityExchange,
    buyPriceType: PriceType,
    sellPriceType: PriceType,
    maxVolume?: number,
    maxWeight?: number
  ) {
    //return buyCX + " " + sellCX + " " + buyPriceType + " " + sellPriceType;

    const cxMaterialPricesResponse = await fetch('https://rest.fnar.net/exchange/all');
    logger.debug("test");
    console.debug(cxMaterialPricesResponse);
    logger.debug(cxMaterialPricesResponse, `Fetched CX material prices from fnar.net`);
    const cxMaterialPrices = await cxMaterialPricesResponse.json() as ExchangeMaterialPrice[];

    // Filter out materials that don't have prices on both exchanges
    const filteredMaterials = cxMaterialPrices.filter(mat => 
      mat.ExchangeCode === buyCX && mat[buyPriceType === 'ASK' ? 'Ask' : buyPriceType === 'BID' ? 'Bid' : 'PriceAverage'] !== null
    ).map(buyMat => {
      const sellMat = cxMaterialPrices.find(sm => 
        sm.MaterialTicker === buyMat.MaterialTicker && 
        sm.ExchangeCode === sellCX && 
        sm[sellPriceType === 'ASK' ? 'Ask' : sellPriceType === 'BID' ? 'Bid' : 'PriceAverage'] !== null
      );
      return sellMat ? { buyMat, sellMat } : null;
    }).filter(pair => pair !== null) as { buyMat: ExchangeMaterialPrice, sellMat: ExchangeMaterialPrice }[];

    // Calculate potential profit for each material
    const tradeOpportunities = filteredMaterials.map(({ buyMat, sellMat }) => {
      const buyPrice = buyMat[buyPriceType === 'ASK' ? 'Ask' : buyPriceType === 'BID' ? 'Bid' : 'PriceAverage']!;
      const sellPrice = sellMat[sellPriceType === 'ASK' ? 'Ask' : sellPriceType === 'BID' ? 'Bid' : 'PriceAverage']!;
      const profitPerUnit = sellPrice - buyPrice;
      const profitMargin = (profitPerUnit / buyPrice) * 100;

      // Only calculate max profit if profit margin is greater than 0
      if (profitMargin > 0) {
        // Get material info for volume/weight
        const material = this.materialsLibrary.getMaterialByTicker(buyMat.MaterialTicker);
        let maxUnits = Infinity;
        if (material) {
          if (maxVolume !== undefined) {
            maxUnits = Math.min(maxUnits, Math.floor(maxVolume / material.Volume));
          }
          if (maxWeight !== undefined) {
            maxUnits = Math.min(maxUnits, Math.floor(maxWeight / material.Weight));
          }
        }
        // If material info missing, maxUnits stays Infinity
        let maxProfit: number | undefined = undefined;
        if (isFinite(maxUnits)) {
          maxProfit = profitPerUnit * maxUnits;
        }
        return {
          MaterialTicker: buyMat.MaterialTicker,
          BuyExchange: buyMat.ExchangeCode,
          SellExchange: sellMat.ExchangeCode,
          BuyPrice: buyPrice,
          SellPrice: sellPrice,
          ProfitPerUnit: profitPerUnit,
          ProfitMarginPercent: profitMargin / 100,
          MaxUnits: isFinite(maxUnits) ? maxUnits : undefined,
          MaxProfit: maxProfit,
          VolumePerUnit: material?.Volume,
          WeightPerUnit: material?.Weight
        };
      } else {
        return {
          MaterialTicker: buyMat.MaterialTicker,
          BuyExchange: buyMat.ExchangeCode,
          SellExchange: sellMat.ExchangeCode,
          BuyPrice: buyPrice,
          SellPrice: sellPrice,
          ProfitPerUnit: profitPerUnit,
          ProfitMarginPercent: profitMargin / 100
        };
      }
    });

  // Filter out negative profit margin
  const positiveTradeOpportunities = tradeOpportunities.filter(t => t.ProfitMarginPercent > 0);

  // Sort by profit margin descending
  positiveTradeOpportunities.sort((a, b) => b.ProfitMarginPercent - a.ProfitMarginPercent);

  logger.info(`Found ${positiveTradeOpportunities.length} trade opportunities between ${buyCX} and ${sellCX}`);

  return positiveTradeOpportunities;
  }
}