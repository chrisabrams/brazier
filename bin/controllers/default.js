var Brazier = require('../../index')

class DefaultController extends Brazier.Controller {

  help(options = {}) {

    var appCommands = (options.appCommands || [])

    var prompt = new Brazier.Prompt()

    prompt.line('Commands\n')

    appCommands.forEach( (appCommand) => {

      var commands = appCommand.commands.join(' ')

      prompt.line('\t', commands, '\t', appCommand.desc)

    })

    prompt.line('\n')

  }

}

module.exports = DefaultController
