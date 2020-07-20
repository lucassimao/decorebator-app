const dotenv = require('dotenv')
const fs = require('fs');
const path = require('path');


let envFilePath
if (process.env.NODE_ENV === 'production') {
  envFilePath = path.join(path.resolve('..'),'.env.production')
}
else {
  envFilePath = path.join(path.resolve('..'),'.env')
}
const envConfig = dotenv.parse(fs.readFileSync(envFilePath))

const config = {
  username: 'postgres',
  dialect: 'postgres',
  password: envConfig.POSTGRES_PASSWORD,
  database: envConfig.POSTGRES_DB,
}
module.exports = {
  development:config,
  test: config,
  production: config
};