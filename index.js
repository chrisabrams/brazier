require('6to5/register')
require('6to5/polyfill')

var Brazier = {
  Controller : require('./src/controller'),
  Dispatcher : require('./src/dispatcher'),
  Prompt     : require('./src/prompt'),
  Router     : require('./src/router')
}

module.exports = Brazier
