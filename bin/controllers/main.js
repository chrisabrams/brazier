var Brazier  = require('../../index'),
    exec     = require('child_process').exec,
    fs       = require('fs'),
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

    /*
    TODO: optimize this ghetto shit
    */
    filesToCopy.forEach( (item) => {

      let destDir = item.dest.substring(0, item.dest.lastIndexOf('/')),
          _this   = this

      mkdirp(destDir)

      fs.createReadStream(item.src)
        .pipe(through2.obj(function (chunk, enc, t2cb) {

          var str = chunk.toString()
          var matches = str.match(_this.matchRegex)

          if(matches) {

            matches.forEach( (match) => {

              var split1 = match.split('{{')

              if(split1.length > 1) {

                var key    = null,
                    split2 = split1[1].split('}}')

                if(split2.length > 1) {

                  key = split2[0]

                }

                if(key) {

                  str = str.replace(match, _this.store[key])

                }

              }

            })

          }

          t2cb(null, str)

        }))
        .pipe(fs.createWriteStream(item.dest))
        .on('finish', () => {

          filesCopiedCount++

          if(filesToCopyLength == filesCopiedCount) {
            cb()
          }

        })

    })

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

  getGitUserEmail() {

    var email = sh.exec('git config user.email').stdout

    if(email) {
      email = email.replace(/\n/g, '')
    }

    else {
      email = ''
    }

    return email

  }

  getGitUserName() {

    var name = sh.exec('git config user.name').stdout

    if(name) {
      name = name.replace(/\n/g, '')
    }

    else {
      name = ''
    }

    return name

  }

  init(options = {}) {

    this.promptProperty({
      binFile: true,
      key: 'appName',
      default: this.cwd.split('/').pop(),
      label: 'App Name'
    })

    this.promptProperty({
      key: 'authorName',
      default: this.getGitUserName(),
      label: 'Author Name'
    })

    this.promptProperty({
      key: 'authorEmail',
      default: this.getGitUserEmail(),
      label: 'Author Email'
    })

    this.promptProperty({
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

    if(options.binFile) {

      this.generateBinFile(key, this.cwd)

    }

  }

}

InitController.prototype.cwd    = process.cwd()
InitController.prototype.prompt = new Brazier.Prompt()
InitController.prototype.store  = {}

module.exports = InitController
