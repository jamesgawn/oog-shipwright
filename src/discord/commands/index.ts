import { Env } from "../../types/Env";
import { Command } from "../structures/Command";
import * as ping from "./ping";
import * as getMaterialPrice from "./getMaterialPrice";

export const commands = {
  ping: ping.PingCommand,
  "get-material-price": getMaterialPrice.GetMaterialPriceCommand
} as {
  ping: new (env: Env) => ping.PingCommand,
  "get-material-price": new (env: Env) => getMaterialPrice.GetMaterialPriceCommand,
  [key: string]: (new (env: Env) => Command) | undefined,
};
