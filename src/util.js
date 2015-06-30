var fs         = require('fs'),
    Handlebars = require('handlebars'),
    mkdirp     = require('mkdirp'),
    path       = require('path')

var Util = {}

Util.copyFiles = (options = {}) => {

  var destCwd = options.destCwd,
      files   = options.files,
      srcCwd  = options.srcCwd

  files.forEach( (item) => {

    let destDir = item.dest.substring(0, item.dest.lastIndexOf('/'))

    var template = fs.readFileSync(path.join(srcCwd, item.src), 'utf8')

    mkdirp(destDir)

    if(item.data) {
      template = Handlebars.compile(template)
      template = template(item.data)
    }

    fs.writeFileSync(path.join(destCwd, item.dest), template, 'utf8')

  })

}

module.exports = Util
