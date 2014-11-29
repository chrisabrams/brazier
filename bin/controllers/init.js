var Brazier = require('../../index')

class InitController extends Brazier.Controller {

  start(options = {}) {

    var prompt = new Brazier.Prompt()

    var name = prompt.question('What is the name of the app?')

    console.log("name ->", name)

  }

}

module.exports = InitController
