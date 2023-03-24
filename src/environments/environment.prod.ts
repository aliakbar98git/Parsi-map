const domain: string = 'localhost:49885'

export const environment = {
  production: true,
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
  redisCacheDefault: 2,
  redisCacheHome: 2,
  redisCacheCategory: 2,
  redisCacheProduct: 2,
  logServer: 'http://services.newplus.gi:5341',
  logApiKey: '0r0m3G3JlP6Kf06tQkKc'
};
