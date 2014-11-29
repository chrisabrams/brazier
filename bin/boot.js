var Brazier = require('../index'),
    chalk   = require('chalk'),
    path    = require('path')

class BootController extends Brazier.Controller {

  constructor(options = {}) {

    if(typeof options.argv != 'object') {
      throw new Error('options.argv is required for BootController.')
      return
    }

    if(typeof options.pkg != 'object') {
      throw new Error('options.pkg is required for BootController.')
      return
    }

    if(typeof options.routes != 'object') {
      throw new Error('options.routes is required for BootController.')
      return
    }

    var pkg     = options.pkg,
        name    = this.capitaliseFirstLetter(pkg.name),
        version = pkg.version

    var prompt = new Brazier.Prompt()

    prompt.line(chalk.green('\n%s command-line generator version %s\n'), name, version)

    var router = new Brazier.Router({
      appName: name,
      argv: options.argv,
      routes: options.routes
    })

    router.on('route:matched', function(data) {

      var dispatcher = new Brazier.Dispatcher({
        controllerPath: (options.controllerPath || path.join(__dirname, './controllers/'))
      })

      dispatcher.dispatch(data)

    })

    router.start()

  }

  capitaliseFirstLetter(string) {

    return string.charAt(0).toUpperCase() + string.slice(1)

  }

}

module.exports = BootController
