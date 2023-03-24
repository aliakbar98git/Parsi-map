import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import * as redis from 'redis';
import seqLogger from './src/logger';

import { AppServerModule } from './src/main.server';
import { environment } from './src/environments/environment';

const SSR_KEY_PREFIX: string = "SSR-";

// ssr DOM
const domino = require('domino');
const fs = require('fs');
const path = require('path');
// index from browser build!
const dist = getDistFolder();
const template = fs.readFileSync(path.join(dist, "index.html")).toString();
// for mock global window by domino
const win = domino.createWindow(template);
// mock
global['window'] = win;
// not implemented property and functions
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});
// mock documnet
global['document'] = win.document;
// othres mock
global['CSS'] = null;
// global['XMLHttpRequest'] = require('xmlhttprequest').XMLHttpRequest;
global['Prism'] = null;

global['navigator'] = win.navigator;

/*
const domino = require("domino");
const fs = require("fs");
const path = require("path");
const templateA = fs
  .readFileSync(path.join("dist/GplusUI/browser/fa", "index.html"))
  .toString();
const win = domino.createWindow(templateA);
win.Object = Object;
win.Math = Math;

global["window"] = win;
global["document"] = win.document;
global["branch"] = null;
global["object"] = win.object;
*/

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = getDistFolder();
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // Redis cache client
  const redisClient = redis.createClient({
    port: environment.redisPort,
    host: environment.redisHost,
    password: environment.redisPassword
  });

  // Creates a cache key using the request URL
  const cacheKey: (req: express.Request) => string = (req) => `${environment.redisPrefix}${SSR_KEY_PREFIX}${req.originalUrl}`;

  const getCacheExpirationTime = (url: string): number => {
    let expirationTime: number = environment.redisCacheDefault;
    if (url == "/") { // Home Page
      expirationTime = environment.redisCacheHome;
    } else if (url.startsWith("/category")) { // Category Page
      expirationTime = environment.redisCacheCategory;
    } else if (url.startsWith("/product")) { // Product Page
      expirationTime = environment.redisCacheProduct;
    }
    return expirationTime * 60;
  };

  // Middleware to send a cached response if one exists
  const cachedResponse: express.RequestHandler = (req, res, next) => {
    const key: string = cacheKey(req);
    redisClient.get(key, (error: Error, reply: string) => {
      if (reply?.length) {
        // Cache exists. Send the response.
        seqLogger.info({ cacheKey: key, responseLength: reply.length }, 'SSR Cache HIT. CacheKey: {cacheKey}, Response Length: {responseLength}');
        res.send(reply);
      } else {
        // Use the Universal engine to render a response.
        next();
      }
    });
  }
  // Middleware to render a response using the Universal engine
  const universalRenderer: express.RequestHandler = (req, res) => {
    const excludeRoutes = ['/profile', '/cart', '/compare', '/search', '/worldcup'];
    var result = excludeRoutes.findIndex((route) => { return req.url.startsWith(route); })
    if (result != -1) {
      res.sendFile(join(distFolder, 'index.html'));
    } else {
      res.render(
        indexHtml,
        { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] },
        (error: Error, html: string) => {
          if (error) {
            seqLogger.error({ reqURL: req.url, error: error }, 'SSR Renderer Error. URL: {reqURL}, Error: {error}');
            return req.next(error);
          }
          if (res.statusCode === 200) {
            // Cache the rendered HTML
            const key: string = cacheKey(req);
            const expirationTime: number = getCacheExpirationTime(req.url);
            redisClient.set(key, html, 'EX', expirationTime);
            seqLogger.info({ cacheKey: key, responseLength: html.length, expirationTime: expirationTime }, 'SSR Cache MISS. CacheKey: {cacheKey}, Expiration Time: {expirationTime}, Response Length: {responseLength}');
          }
          res.send(html);
        }
      );
    }
  };

  // All regular routes use the Universal engine
  server.get('*', cachedResponse, universalRenderer);

  return server;
}

function getDistFolder(): string {
  return environment.production ? join(__dirname, `../browser`) : join(process.cwd(), `dist/GplusUI/browser`);
}

function run(): void {
  const port = process.env.PORT || environment.expressPort;
  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
