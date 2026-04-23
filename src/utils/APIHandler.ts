import { Env } from "../types/Env";
import { logger } from '../utils/logger';

export abstract class APIHandler { 
    private env: Env;

    public constructor(env: Env) {
        this.env = env;
    }

}