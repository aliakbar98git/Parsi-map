const domain: string = 'master.goldiranplus.ir'

export const environment = {
  production: true,
  expressPort: 4000,
  isSellerSite: false,
  domain: `https://core.${domain}`,
  apiUrl: `https://core.${domain}/api`,
  apiUniversalUrl: `http://localhost:8080/api`,
  cdnUrl: `https://cdn.${domain}/images`,
  redisPrefix: 'MasterPlus-',
  redisPort: 6379,
  redisHost: '10.106.1.33',
  redisPassword: "5XKuPbCyZzWGa79LWK4ka5eBACqhTwpUqj+r7vl0UxiSIvi0Hfka28ryr5ewOcPNRrfvuoebTjOyrBO2",
  redisCacheDefault: 2,
  redisCacheHome: 2,
  redisCacheCategory: 2,
  redisCacheProduct: 2,
  logServer: `http://services.${domain}:5341`,
  logApiKey: 'UzOI9nNCbA4rW40YBSRI'
};
