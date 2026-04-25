import { IRequest, StatusError } from 'itty-router';
import { logger } from '../../../utils/logger';
import { Env } from '../../../types/Env';
import fetchWithCache from '../../../utils/fetchWithCache';

export type FioContext = {
  fioApi: FioAPI
} & Env

type StorageSpace = {
  WeightCapacity: number,
  WeightLoad: number,
  VolumeCapacity: number,
  VolumeLoad: number,
}

type Warehouse = {
    WarehouseId: string,
    StoreId: string,
    Units: number,
    NextPaymentTimestampEpochMs: number,
    FeeAmount: number,
    FeeCurrency: string,
    LocationName: string,
    LocationNaturalId: string,
    UserNameSubmitted: string
} & StorageSpace

export type Ship = {
  ShipId: string,
  StoreId: string,
  StlFuelStoreId: string,
  FtlFuelStoreId: string,
  Registration: string,
  Name: string,
  UserNameSubmitted: string
}

type StorageItem = {
  MaterialId: string,
  MaterialName: string,
  MaterialTicker: string,
  MaterialCategory: string,
  MaterialWeight: number,
  MaterialVolume: number,
  MaterialAmount: number,
  MaterialValue: number,
  MaterialValueCurrency: string,
  Type: string,
  TotalWeight: number,
  TotalVolume: number
}

type Storage = {
  StorageItems: StorageItem[]
  StorageId: string,
  AddressableId: string,
  Name: string,
  FixedStorage: boolean,
  Timestamp: string,
  Type: string,
  UserNameSubmitted: String
} & StorageSpace

export class FioAPI {
  private cache = caches.default;
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getStoragePlanets(username: string) {
    return this.getFioData<string[]>('/storage/planets/' + username);
  }

  async getSiteWarehouses(username: string) {
    return this.getFioData<Warehouse[]>('/sites/warehouses/' + username);
  }

  async getShips(username: string) {
    return this.getFioData<Ship[]>('/ship/ships/' + username);
  }

  async getStorage(username: string, storageLocationId: string) {
    return this.getFioData<Storage>('/storage/' + username + '/' + storageLocationId);
  }

  async getFioData<T>(path: string, attempt?: number) : Promise<T> {
    if (!attempt) {
      attempt = 0
    }
    if (attempt > 5) {
      logger.error("Failed request to " + path + " after " + attempt + " attempts");
    }
  
    await FioAPI.sleep(750 * attempt);
  
    let headers = {
      "Authorization" : this.apiKey
    };
  
    let url = "https://rest.fnar.net" + path;
  
    let params = {
      "method":"GET",
      "headers": headers,
      "accept": "application/json",
      "signal": AbortSignal.timeout(1000)
    };
    logger.info("Starting request (attmept " + (attempt + 1) + ") to " + url)
    let response;
    
    try {
      response = await fetchWithCache<T>(new Request(url, params));
      logger.info("Finished request to " + url)
      let json = await response;
      return json as T;
    }
    catch (err) {
      logger.info(err, "Initial request (attmept " + (attempt + 1) + ") failed, retrying " + url)
      return this.getFioData(path, attempt + 1);
    }
  }

  static async sleep(delay: number) {
    return new Promise(f => setTimeout(f, delay));
  }

  static withFioApi(request: IRequest, context: FioContext) {
    let apiKey = request.headers.get("fioApiKey");
    if (apiKey) 
    {
      logger.info("Found FIO API key, returning FIO API.")
      context.fioApi = new FioAPI(apiKey);
    } else {
      logger.error("Failed to find FIO API key.")
      throw new StatusError(500, "No fioApiKey provided in header.")
    } 
  }
}