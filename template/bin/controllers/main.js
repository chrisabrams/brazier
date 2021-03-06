import Brazier    from 'brazier-cli'
import fs         from 'fs'
import Handlebars from 'handlebars'
import mkdirp     from 'mkdirp'
import path       from 'path'
import through2   from 'through2'

var exec     = require('child_process').exec,
    execSync = require('child_process').execSync

class InitController extends Brazier.Controller {

  /*
  TODO: provide some validation that this is the project to destroy
  */
  destroy() {

    let cwd = process.cwd()

    execSync(`rm -rf ${cwd}/*`)

  }

  init(options = {}) {

    this.promptProperty({
      key: 'appName',
      default: cwd.split('/').pop(),
      label: 'App Name'
    })

    this.promptProperty({
      key: 'authorName',
      default: this.getGitUserName(),
      label: 'Author Name'
    })

    this.generateBinFile(appName, cwd)
    this.copyFiles( () => {
      this.link()
    })

  }

  promptProperty(options = {}) {

    var defaultValue = options.default,
        key          = options.key,
        promptLabel  = options.label,
        value        = defaultValue

    var promptValue  = this.prompt.question(`${promptLabel}: (${defaultValue})`)

    if(!super.isStringEmpty(promptValue)) {
      value = promptValue
    }

    this.store[key] = value

  }

}

InitController.prototype.cwd    = process.cwd()
InitController.prototype.prompt = new Brazier.prompt()
InitController.prototype.store  = {}

module.exports = InitController
