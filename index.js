require('babel/register')
require('babel/polyfill')

var Brazier = {
  Controller : require('./src/controller'),
  Dispatcher : require('./src/dispatcher'),
  Prompt     : require('./src/prompt'),
  Router     : require('./src/router')
}

module.exports = Brazier
