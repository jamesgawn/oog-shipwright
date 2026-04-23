import { IRequest } from "itty-router";
import { FioHandler } from "./FioHandler";

export type FioStorageLocation = {
  locationId: string,
  name: string,
  type: string
}

export class FioStorageHandler extends FioHandler {
  async handler(username: string) {
    let fioApi = this.context.fioApi;

    let storageLocations = [] as FioStorageLocation[];
    let storageData = [["Storage ID", "Storage Location", "Storage Type", "Last Updated", "Material Ticker", "Units"]] as (string | number)[][]
  
    let planets = await fioApi.getStoragePlanets(username);
    for (const planet of planets)
    {
      storageLocations = storageLocations.concat([{
        locationId: planet,
        name: planet,
        type: "Base"
      }]);
    }
  
    let warehouses = await fioApi.getSiteWarehouses(username);
    for (const warehouse of warehouses)
    {
      storageLocations = storageLocations.concat([{
        locationId: warehouse.StoreId,
        name: warehouse.LocationNaturalId,
        type: "Warehouse"
      }]);
    }
  
    let ships = await fioApi.getShips(username);
    for (const ship of ships)
    {
      storageLocations = storageLocations.concat([{
        locationId: ship.StoreId,
        name: ship.Registration,
        type: "Ship"
      }]);
    }
    
    for (const storageLocation of storageLocations) {
      let rawStore = await fioApi.getStorage(username, storageLocation.locationId);
      let rawStoredItems = rawStore.StorageItems;
  
      if (rawStoredItems && rawStoredItems.length > 0) {
        for (const rawStoredItem of rawStoredItems) {
          if (rawStoredItem.Type == "INVENTORY") {
            let storedItem = [rawStore.StorageId, storageLocation.name, storageLocation.type, rawStore.Timestamp, rawStoredItem.MaterialTicker, rawStoredItem.MaterialAmount];
            storageData = storageData.concat([storedItem])
          }
        }
      }
    }

    return storageData;
  }
}