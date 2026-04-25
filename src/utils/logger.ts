import { error, IRequest, IRequestStrict, RequestHandler, ResponseHandler } from "itty-router"
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

export const catchHandler = async (err: unknown, request: IRequest) => {
  const traceId = (request as CustomRequest).traceId ?? null;
  const status = typeof err === 'object' && err !== null && 'status' in err && typeof err.status === 'number'
    ? err.status
    : 500;

  logger.error({
    err,
    traceId,
    method: request.method,
    url: request.url,
  }, "Unhandled request error")

  if (err instanceof Response) {
    return err;
  }

  if (status < 500 && err instanceof Error && err.message) {
    return error(status, err.message);
  }

  return error(status, 'Internal Server Error');
}

export const logger = pino({
	name: 'ingenious-bot'
});
