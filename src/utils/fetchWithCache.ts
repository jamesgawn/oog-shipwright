import { logger } from "./logger";

export default async function fetchWithCache<T>(request: Request, minimumCacheSeconds: number = 60): Promise<T> {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);

  // Try to find the response in cache
  let response = await cache.match(cacheKey);
  if (response) {
    logger.info("Cache hit for " + request.url);
    return response.clone().json() as Promise<T>;
  }
  logger.info("Cache miss for " + request.url);
  // Cache miss: fetch from origin or external API
  response = await fetch(request);

  // Optionally, only cache successful responses
  if (response.status === 200) {
    const newHeaders = new Headers(response.headers);
    const cacheControl = newHeaders.get('Cache-Control');
    let ttl = minimumCacheSeconds;
    if (cacheControl) {
      const match = cacheControl.match(/max-age=(\d+)/);
      if (match && parseInt(match[1], 10) > minimumCacheSeconds) {
        ttl = parseInt(match[1], 10);
      }
    }
    newHeaders.set('Cache-Control', `public, max-age=${ttl}`);
    const cachedResponse = new Response(await response.clone().body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
    await cache.put(cacheKey, cachedResponse);
    logger.info("Response cached for " + request.url + " with cache configuration " + newHeaders.get("Cache-Control"));
    return response.clone().json() as Promise<T>;
  }
  return response.json() as Promise<T>;
}