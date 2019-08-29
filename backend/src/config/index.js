const env = process.env.NODE_ENV || 'development'

const baseConfig = {
    env,
    isDev: env == 'development',
    isTest: env == 'test',
    defaultPageSize: 10
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
