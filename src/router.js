var EventEmitter = require('events').EventEmitter,
    _            = require('lodash')

function arraysEqual(a1, a2) {

  return JSON.stringify(a1) == JSON.stringify(a2)

}

class BrazierRouter {

  constructor(options = {}) {

    // TODO: Figure out why you have to do this instead of Object.assign/util.inherits
    EventEmitter.call(this)
    this.emit = EventEmitter.prototype.emit
    this.on   = EventEmitter.prototype.on

    this.argv = options.argv

    var keys = Object.create(options.argv)

    if(keys._) {
      delete keys._
    }

    this.keys = keys

    this.routes = options.routes
    this.routesMatched = 0

  }

  isMatch(options) {

    // If the commands match
    if(this.argv._ && options.commands && arraysEqual(this.argv._, options.commands)) {

      return true

    }

    return false

  }

  match(options) {

    if(typeof options != 'object') {
      throw new Error('Options should be an object.')
      return
    }

    var tempDest = options.dest.split('#')

    if(tempDest.length < 2) {
      throw new Error('Destination must include controller and action.')
      return
    }

    var controller = tempDest[0],
        action     = tempDest[1]

    var isMatched = this.isMatch(options)

    if(isMatched) {
      this.routesMatched++
    }

    this.emit('route:matched', {controller: controller, action: action, keys: this.keys})

  }

  start() {
    var _this = this

    this.routes.forEach( (route) => {

      _this.match(route)

    })

  }

}

/* TODO: Figure out why this doesn't work
Object.assign(BrazierRouter.prototype, EventEmitter)
*/

module.exports = BrazierRouter
