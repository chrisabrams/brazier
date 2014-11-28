var path = require('path')

class BrazierDispatcher {

  constructor(options = {}) {

    this.options = options

    this.controllerPath = options.controllerPath

    if(typeof this.controllerPath != 'string') {
      throw new Error('options.controllerPath must be defined.')
      return
    }

  }

  dispatch(routeOptions) {

    var Controller = this.getController(routeOptions)
    var controller = this.controller = new Controller()
    var action     = this.action     = new controller[routeOptions.action]({keys: routeOptions.keys})

  }

  getController(routeOptions) {

    return require(path.join(this.controllerPath, routeOptions.controller))

  }

}

module.exports = BrazierDispatcher
