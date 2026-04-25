import { Env } from "../../types/Env";
import { Command } from "../structures/Command";
import * as ping from "./ping";
import * as getCXMaterialPrice from "./getCXMaterialPrice";
import * as getShipComponentInternalPrice from "./getShipComponentInternalPrice";

export const commands = {
  ping: ping.PingCommand,
  "get-material-price": getCXMaterialPrice.GetMaterialPriceCommand,
  "get-ship-component-internal-price": getShipComponentInternalPrice.GetShipComponentInternalPriceCommand,
} as {
  ping: new (env: Env) => ping.PingCommand,
  "get-material-price": new (env: Env) => getCXMaterialPrice.GetMaterialPriceCommand,
  "get-ship-component-internal-price": new (env: Env) => getShipComponentInternalPrice.GetShipComponentInternalPriceCommand,
  [key: string]: (new (env: Env) => Command) | undefined,
};
