const domain: string = 'giseller.ir';

export const environment = {
  production: true,
  expressPort: 4000,
  isSellerSite: true,
  domain: `https://core.${domain}`,
  apiUrl: `https://core.${domain}/api`,
  apiUniversalUrl: `http://localhost:8080/api`,
  cdnUrl: 'https://cdn.goldiranplus.ir/images',
  redisPrefix: 'Sellers-',
  redisPort: 6379,
  redisHost: '192.168.43.28',
  redisPassword: "N9veq7qIUv9YFz00I4BB54GAjMk67rLYwuInN2KFvFTwvqkPWJiIiREBEsui589C4GMRsGJmyD9EUADR",
  redisCacheDefault: 5,
  redisCacheHome: 5,
  redisCacheCategory: 5,
  redisCacheProduct: 5,
  logServer: 'http://crpl01g79.gi-crp.org:5341',
  logApiKey: 'vtMfRsYF53HOHKBaJN4r'
};
