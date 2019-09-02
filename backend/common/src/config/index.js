const env = process.env.NODE_ENV || 'development'

if (env == 'production' && !process.env.JWT_SECRET_KEY)
    throw 'Jwt secret key must be provided as an environment variable in production'

const baseConfig = {
    env,
    isDev: env == 'development',
    isTest: env == 'test',
    defaultPageSize: 10,
    domain: 'https://decorebator.com',
    jwtSecretKey: process.env.JWT_SECRET_KEY || '112358132134'
}

let envConfig = {}

switch (env) {
    case 'development':
        envConfig = require('./dev')
        break
    case 'test':
        envConfig = require('./testing')
        break
    case 'production':
        envConfig = require('./production')
}

module.exports = Object.assign(baseConfig, envConfig)