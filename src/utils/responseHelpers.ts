export function okCachedResponse(data: unknown, maxAgeSeconds: number = 86400): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${maxAgeSeconds}`,
    },
  });
}
