# RSS CORS Proxy

A CORS proxy for fetching RSS sources, can be easily used with Deno Deploy.

## Why

It is relatively easy to parse RSS in browser because there is `DOMParser` API.

So one can [try write an RSS reader in JS](https://css-tricks.com/how-to-fetch-and-parse-rss-feeds-in-javascript/) that runs on localhost.

But most RSS sources cannot be simply `fetch`ed locally because of CORS policy.

One workaround would be a simple proxy server that retrieves RSS sources and adds CORS header to allow local consuming.

```
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

There is no native `fetch` API in Node.js, but [Deno](https://deno.land/) has [one](https://deno.land/manual@v1.17.3/runtime/web_platform_apis#codefetchcode-api). And like Node, [only a few lines](https://deno.land/manual@v1.17.3/examples/http_server#using-the-codestdhttpcode-library) are needed to start a webserver in Deno.

This piece of code takes a target RSS feed URL, fetches the content and sends to response with added CORS headers.

Inspired by [this repo](https://github.com/justjavac/deno_deploy_cors_proxy).

## How

You need to deploy this code on a server that runs Deno.

The easiest way would be to use [Deno Deploy](https://deno.com/deploy). Just create a new playground, paste the code and deploy.

To use, visit `https://your-deploy-id.deno.dev/?target=RSS_URL`, make sure "RSS_URL" is encoded with `encodeURIComponent()`.

Example: to fetch `https://hnrss.org/frontpage` locally:

1. Encode the URL to `https%3A%2F%2Fhnrss.org%2Ffrontpage`.
2. Visit `https://your-deploy-id.deno.dev/?target=https%3A%2F%2Fhnrss.org%2Ffrontpage` to get the proxy-ed response.
