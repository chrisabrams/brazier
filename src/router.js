var EventEmitter = require('events').EventEmitter,
    _            = require('lodash')

function arraysEqual(a1, a2) {

  return JSON.stringify(a1) == JSON.stringify(a2)

}

class BrazierRouter {

  constructor(options = {}) {

    if(typeof options.argv != 'object') {
      throw new Error('options.argv must be provided to router.')
      return
    }

    // TODO: Figure out why you have to do this instead of Object.assign/util.inherits
    EventEmitter.call(this)
    this.emit = EventEmitter.prototype.emit
    this.on   = EventEmitter.prototype.on

    var argv = options.argv

    // Delete the app name from the list of commands, if it is included
    if(options.appName && argv._.indexOf(options.appName) > -1) {
      argv._.splice(argv._.indexOf(options.appName), 1)
    }

    // For when there are no commands
    if(arraysEqual(argv._, [])) {
      argv._ = ['']
    }

    this.argv = argv

    var keys = Object.create(options.argv)

    if(keys._) {
      delete keys._
    }

    this.keys = keys

    this.appCommands = []
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
    //console.log("isMatch?", "argv:", this.argv, "route:", options.commands, isMatched)
    if(isMatched) {

      this.routesMatched++

      this.emit('route:matched', {
        action      : action,
        appCommands : this.appCommands,
        controller  : controller,
        keys        : this.keys
      })

    }

  }

  start() {
    var _this = this

    this.routes.forEach( (route) => {

      // Don't include default/catch-all route for now; maybe later
      if(!arraysEqual(route.commands, [''])) {
        _this.appCommands.push({commands: route.commands, desc: route.desc})
      }

      _this.match(route)

    })

  }

}

/* TODO: Figure out why this doesn't work
Object.assign(BrazierRouter.prototype, EventEmitter)
*/

module.exports = BrazierRouter
