var BrazierController = require('../../../src/controller')

class FooController extends BrazierController {

  bar(options) {

    this.keys = options.keys

  }

}

module.exports = FooController
