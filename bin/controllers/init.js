var Brazier = require('../../index'),
    fs      = require('fs'),
    mkdirp  = require('mkdirp')

class InitController extends Brazier.Controller {

  constructor() {
    super()
  }

  generateBinFile(name, cwd) {

    var binFile = fs.readFileSync(path.join(__dirname, '../brazier'), 'utf8')
    mkdirp.sync(`${cwd}/bin`)
    fs.writeFileSync(`${cwd}/bin/${name}`, binFile, 'utf8')

  }

  start(options = {}) {

    var cwd = process.cwd()
    console.log("cwd", cwd)

    var prompt = new Brazier.Prompt()

    var appName = cwd.split('/').pop()

    var name = prompt.question(`What is the name of the app? (${appName})`)

    if(!super.isStringEmpty(name)) {
      appName = name
    }

    console.log("name ->", name)
    console.log("appName", appName)

    this.generateBinFile(appName, cwd)

  }

}

module.exports = InitController
