var Brazier  = require('brazier'),
    exec     = require('child_process').exec,
    fs       = require('fs'),
    mkdirp   = require('mkdirp'),
    path     = require('path'),
    sh       = require('execSync'),
    through2 = require('through2')

class InitController extends Brazier.Controller {

  /*
  TODO: provide some validation that this is the project to destroy
  */
  destroy() {

    let cwd = process.cwd()

    sh.run(`rm -rf ${cwd}/*`)

  }

  init(options = {}) {

    this.promptProperty({
      key: 'appName',
      default: cwd.split('/').pop(),
      prompt: 'App Name'
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
