import { environment } from '@environments/environment';

let bunyan = require('bunyan');
let seq = require('bunyan-seq');

const seqLogger = bunyan.createLogger({
  name: 'Goldiran Plus Frontend',
  streams: [
    {
      stream: process.stdout,
      level: 'warn',
    },
    seq.createStream({
      serverUrl: environment.logServer,
      apiKey: environment.logApiKey,
      level: 'info'
    })
  ]
});

export default seqLogger;
