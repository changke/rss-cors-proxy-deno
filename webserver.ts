import { serve } from "https://deno.land/std@0.121.0/http/server.ts";

const port = 8080;

const addCorsHeader = (response: Response) => {
  const headers = new Headers(response.headers);
  if (!headers.has('access-control-allow-origin')) {
    headers.set('access-control-allow-origin', '*');
  }
  if (!headers.has('content-type')) {
    headers.set('content-type', 'text/xml; charset=utf-8');
  }
  return headers;
};

const urlValid = (url: string) => {
  if (!(url.startsWith('https://') || url.startsWith('http://'))) {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const getTargetUrl = (reqUrl: string) => {
  const urlObj = new URL(reqUrl);
  // target URL from query string "target"
  const url = decodeURIComponent(urlObj.searchParams.get('target') || '');
  return urlValid(url) ? url : '';
};

const handler = async (req: Request) => {
  // only GET requests allowed
  if (req.method.toUpperCase() !== 'GET') {
    return new Response('Only GET method allowed!', {status: 403});
  }

  try {
    const url = getTargetUrl(req.url);
    if (!url) {
      return new Response('Target URL invalid!', {status: 400});
    }

    const resp = await fetch(url);
    const xml = await resp.text();

    const headers = addCorsHeader(resp);

    return new Response(xml, {
      status: 200,
      headers: headers
    });
  } catch(e) {
    return new Response(e, {status: 500});
  }
};

console.log(`HTTP webserver running. Access it at: http://localhost:${port.toString()}/`);
await serve(handler, {port});
