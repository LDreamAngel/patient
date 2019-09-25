'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEV_USER: JSON.stringify(process.env.DEV_USER),
  OPEN_PROXY: true//是否开启代理,开启需重启vue-cli
})
