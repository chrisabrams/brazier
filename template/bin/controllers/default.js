import Brazier from 'brazier-cli'

class DefaultController extends Brazier.Controller {

  help(options = {}) {

    // The default is [] instead of [''] because the forEach loop below doesn't need to run when there are no commands
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

export default DefaultController
