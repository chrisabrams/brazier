var Brazier  = require('../../index'),
    exec     = require('child_process').exec,
    fs       = require('fs'),
    Handlebars = require('handlebars'),
    mkdirp   = require('mkdirp'),
    path     = require('path'),
    sh       = require('execSync'),
    through2 = require('through2')

class InitController extends Brazier.Controller {

  constructor() {
    super()
  }

  copyFiles(cb) {

    var projectCwd  = path.join(__dirname, '../../'),
        destCwd     = this.cwd

    var filesToCopy = [
      {
        src: path.join(projectCwd, './template/bin/controllers/boot.js'),
        dest: path.join(destCwd, './bin/controllers/boot.js')
      },
      {
        src: path.join(projectCwd, './bin/controllers/default.js'),
        dest: path.join(destCwd, './bin/controllers/default.js')
      },
      {
        src: path.join(projectCwd, './template/bin/controllers/main.js'),
        dest: path.join(destCwd, './bin/controllers/main.js')
      },
      {
        src: path.join(projectCwd, './bin/routes.js'),
        dest: path.join(destCwd, './bin/routes.js')
      },
      {
        src: path.join(projectCwd, './template/package.json'),
        dest: path.join(destCwd, './package.json')
      }
    ]

    let filesToCopyLength = filesToCopy.length,
        filesCopiedCount = 0

    filesToCopy.forEach( (item) => {

      let destDir = item.dest.substring(0, item.dest.lastIndexOf('/')),
          _this   = this

      mkdirp(destDir)

      var fileSrc  = fs.readFileSync(item.src, 'utf8'),
          template = Handlebars.compile(fileSrc)

      fs.writeFileSync(item.dest, template(this.store), 'utf8')

    })

    cb()

  }

  /*
  TODO: provide some validation that this is the project to destroy
  */
  destroy() {

    sh.run(`rm -rf ${this.cwd}/*`)

  }

  generateBinFile(name) {

    var binFile = fs.readFileSync(path.join(__dirname, '../brazier'), 'utf8')
    mkdirp.sync(`${this.cwd}/bin`)
    fs.writeFileSync(`${this.cwd}/bin/${name}`, binFile, 'utf8')

  }

  init(options = {}) {

    this.prompt({
      binFile: true,
      key: 'appName',
      default: this.cwd.split('/').pop(),
      label: 'App Name'
    })

    this.prompt({
      key: 'authorName',
      default: this.getGitUserName(),
      label: 'Author Name'
    })

    this.prompt({
      key: 'authorEmail',
      default: this.getGitUserEmail(),
      label: 'Author Email'
    })

    this.prompt({
      key: 'license',
      default: 'MIT',
      label: 'License'
    })

    this.copyFiles( () => {
      this.link( (err) => {

        if(err) {
          process.exit(1)
        }

        else {
          process.exit(0)
        }

      })

    })

  }

  link(cb) {

    console.log("\nSetting up link..")

    exec('npm link', (err, stdout, stderr) => {

      if(err) {
        console.error(err)
        console.error(stderr)
        cb()
      }

      else {
        console.log(stdout)
        cb()
      }

    })

  }

}

module.exports = InitController
