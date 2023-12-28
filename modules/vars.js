import dotenv from 'dotenv';

dotenv.config();

const VARS = {
  APP_CONTEXT: '',
  IOT_API_ENDPOINT: process.env.IOT_API_ENDPOINT ?? 'https://openapi.tuyacn.com',
  IOT_CLIENT_ID: process.env.IOT_CLIENT_ID ?? '',
  IOT_CLIENT_SECRET: process.env.IOT_CLIENT_SECRET ?? ''
};

BigInt.prototype.toJSON = function() {
  return this.toString();
};
console.info('### VARS ###');
console.info(VARS);

export {
  VARS,
};
