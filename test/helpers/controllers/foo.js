import BrazierController from '../../../src/controller'

class FooController extends BrazierController {

  bar(options) {

    this.keys = options.keys

  }

}

export default FooController
