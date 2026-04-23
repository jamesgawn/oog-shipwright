import { IRequest, IRequestStrict, RequestHandler, ResponseHandler } from "itty-router"
import pino from "pino";


type CustomRequest = {
  traceId: string | null
} & IRequestStrict;

export const beforeHandler: RequestHandler<CustomRequest> = async (request) => {
  request.traceId = request.headers.get("cf-ray");

  logger.info({
    traceId: request.traceId,
    method: request.method,
		url: request.url
	}, "Starting Request")
}

export const finallyHandler: ResponseHandler<CustomRequest> = async (response, request) => {
  logger.info({
		traceId: request.traceId,
    method: request.method,
		url: request.url,
	}, "Completed Request")
}

export const logger = pino({
	name: 'ingenious-bot'
});
