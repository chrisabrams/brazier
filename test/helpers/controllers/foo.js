var BrazierController = require('../../../src/controller')

class FooController extends BrazierController {

  constructor() {

  }

  bar(options) {

    this.keys = options.keys

  }

}

module.exports = FooController
