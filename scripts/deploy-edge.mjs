import fetch from 'node-fetch';

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

const workerScript = `
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Edge caching for static assets
  if (url.pathname.includes('/assets/')) {
    const cache = caches.default
    let response = await cache.match(request)
    
    if (!response) {
      response = await fetch(request)
      response = new Response(response.body, response)
      response.headers.set('Cache-Control', 'public, max-age=86400')
      event.waitUntil(cache.put(request, response.clone()))
    }
    return response
  }
  
  // A/B testing at edge
  const variant = Math.random() < 0.5 ? 'A' : 'B'
  const response = await fetch(request)
  response.headers.set('X-Variant', variant)
  return response
}
`;

export async function deployEdgeWorker() {
  if (!CLOUDFLARE_API_TOKEN || !ZONE_ID) {
    console.error('? Missing Cloudflare credentials');
    return;
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/scripts/torqued-edge`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/javascript'
    },
    body: workerScript
  });
  
  if (!response.ok) {
    throw new Error(`Edge deployment failed: ${await response.text()}`);
  }
  
  console.log('? Edge worker deployed globally');
}

(async () => {
  await deployEdgeWorker();
})();