import { Env } from "../../types/Env";
import { Command } from "../structures/Command";
import * as ping from "./ping";
import * as getCXMaterialPrice from "./getCXMaterialPrice";
import * as getShipComponentInternalPrice from "./getShipComponentInternalPrice";

export const commands = {
  ping: ping.PingCommand,
  "get-material-price": getCXMaterialPrice.GetMaterialPriceCommand
} as {
  ping: new (env: Env) => ping.PingCommand,
  "get-material-price": new (env: Env) => getCXMaterialPrice.GetMaterialPriceCommand,
  "get-ship-component-price": new (env: Env) => getShipComponentInternalPrice.GetShipComponentInternalPriceCommand,
  [key: string]: (new (env: Env) => Command) | undefined,
};
