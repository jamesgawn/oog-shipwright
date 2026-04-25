export type CommodityExchange = 'AI1' | 'CI1' | 'CI2' | 'NC1' | 'NC2' | 'IC1';

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