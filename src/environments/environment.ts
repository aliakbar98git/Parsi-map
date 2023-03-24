// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const domain: string = 'localhost:49885';

export const environment = {
  production: false,
  expressPort: 4000,
  isSellerSite: false,
  domain: `http://${domain}`,
  apiUrl: `http://${domain}/api`,
  apiUniversalUrl: `http://${domain}/api`,
  cdnUrl: `http://${domain}/images`,
  redisPrefix: 'LocalDev-',
  redisPort: 6379,
  redisHost: '10.106.1.33',
  redisPassword: "5XKuPbCyZzWGa79LWK4ka5eBACqhTwpUqj+r7vl0UxiSIvi0Hfka28ryr5ewOcPNRrfvuoebTjOyrBO2",
  redisCacheDefault: 1,
  redisCacheHome: 1,
  redisCacheCategory: 1,
  redisCacheProduct: 1,
  logServer: 'http://services.newplus.gi:5341',
  logApiKey: '0r0m3G3JlP6Kf06tQkKc'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
