var fs = require('fs')

class BrazierController {

  constructor(options = {}) {
    this.options = options

    this.initialize()
  }

  initialize() {

  }

  isStringEmpty(entry) {

    /*
    TODO: strip spaces
    */
    if(typeof entry == 'undefined' || entry == null || (typeof entry == 'string' && entry == '')) {

      return true

    }

    return false

  }

}

module.exports = BrazierController
