import fetchWithCache from "../../utils/fetchWithCache";
import { materials } from "./Materials";
import { CommodityExchange, TradeMaterialOrderBook } from "./TradeFinder";

type Material = {
  "MaterialId": string;
  "CategoryName": string;
  "CategoryId": string;
  "Name": string;
  "Ticker": string;
  "Weight": number;
  "Volume": number;
}

export class MaterialLibrary {
  private materials: Material[];
  private materialsMap: Map<string, Material>;
  
  constructor() {
    this.materials = materials as Material[];
    this.materialsMap = new Map(this.materials.map(mat => [mat.Ticker, mat]));
  }

  public getMaterialByTicker(materialId: string): Material | undefined {
    return this.materialsMap.get(materialId);
  }

  public async getMaterialPriceByTicker(commodityExchange: CommodityExchange, materialTicker: string): Promise<TradeMaterialOrderBook> {
    const response = await fetchWithCache(new Request(`https://rest.fnar.net/exchange/${materialTicker}.${commodityExchange}`));
    return await response.json();
  }

  public getAllMaterials(): Material[] {
    return Array.from(this.materialsMap.values());
  }
}