# RSS CORS Proxy

A CORS proxy server for fetching RSS sources written in [Deno](https://deno.com/), can be used with [Deno Deploy](https://deno.com/deploy).

## Why

It is relatively easy to parse RSS in browser because there is the [`DOMParser` API](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser).

So one can [try write an RSS reader in JS](https://css-tricks.com/how-to-fetch-and-parse-rss-feeds-in-javascript/) that runs on localhost.

But most RSS sources cannot be simply `fetch`ed locally because of CORS policy.

One workaround would be a proxy server that retrieves RSS sources and adds CORS header to allow local consuming.

```text
┌───────┐        ┌─────┐    ┌──────┐
│Browser│        │Proxy│    │Target│
└───┬───┘        └──┬──┘    └──┬───┘
    │               │          │    
    │ CORS fetch()  │          │    
    │──────────────>│          │    
    │               │          │    
    │               │ fetch()  │    
    │               │─────────>│    
    │               │          │    
    │               │Response()│    
    │               │<─────────│    
    │               │          │    
    │CORS Response()│          │    
    │<──────────────│          │    
┌───┴───┐        ┌──┴──┐    ┌──┴───┐
│Browser│        │Proxy│    │Target│
└───────┘        └─────┘    └──────┘
```

There is no stable native `fetch` API in Node.js LTS [yet](https://nodejs.org/dist/latest-v21.x/docs/api/globals.html#fetch), but [Deno](https://deno.land/) [has](https://docs.deno.com/runtime/manual/runtime/web_platform_apis#fetch-api). And like Node, [only a few lines](https://docs.deno.com/runtime/manual/runtime/http_server_apis) are needed to start a webserver in Deno.

This project takes a target RSS feed URL, fetches the content and sends to response with added CORS header.

Inspired by [this repo](https://github.com/justjavac/deno_deploy_cors_proxy).

## How

You need to deploy this code on a server that runs Deno.

The easiest way would be to use [Deno Deploy](https://deno.com/deploy). Create a new playground, paste the code and deploy.

To use, visit `https://[your-deploy-id].deno.dev/?target=RSS_URL`, and make sure "RSS_URL" is encoded with `encodeURIComponent()`.

Example: to fetch `https://hnrss.org/frontpage` locally:

1. Encode the URL to `https%3A%2F%2Fhnrss.org%2Ffrontpage`.
2. Visit `https://[your-deploy-id].deno.dev/?target=https%3A%2F%2Fhnrss.org%2Ffrontpage` to get the proxy-ed response.
