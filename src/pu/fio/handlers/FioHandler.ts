import { APIHandler } from "../../utils/APIHandler"
import { logger } from "../../utils/logger";
import { FioAPI, FioContext } from "../utils/FioApi"

export class FioHandler {
  protected context: FioContext;

  public constructor(context: FioContext) {
    this.context = context;
  }

}