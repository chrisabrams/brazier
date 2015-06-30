var fs         = require('fs'),
    Handlebars = require('handlebars'),
    mkdirp     = require('mkdirp'),
    path       = require('path')

var Util = {}

Util.lowerCaseFirstLetter = (s) => s.charAt(0).toLowerCase() + s.slice(1)
Util.singularCase         = (s) => s.substring(0, s.length - 1)
Util.upperCaseFirstLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/*
TODO: This could definitely be better optimized
*/
Util.copyFiles = (options = {}) => {

  if(options instanceof Array) {

    options.forEach( (item) => {

      let destDir = item.dest.substring(0, item.dest.lastIndexOf('/'))

      var template = fs.readFileSync(item.src, 'utf8')

      /*
      TODO: Ideally, only make the same path once.
      */
      mkdirp(destDir)

      if(item.data) {
        template = Handlebars.compile(template)
        template = template(item.data)
      }

      fs.writeFileSync(item.dest, template, 'utf8')

    })

  }

  else {

    var destCwd = options.destCwd,
        files   = options.files,
        srcCwd  = options.srcCwd

    files.forEach( (item) => {

      let destDir = item.dest.substring(0, item.dest.lastIndexOf('/'))

      var template = fs.readFileSync(path.join(srcCwd, item.src), 'utf8')

      /*
      TODO: Ideally, only make the same path once.
      */
      mkdirp(path.join(destCwd, destDir))

      if(item.data) {
        template = Handlebars.compile(template)
        template = template(item.data)
      }

      fs.writeFileSync(path.join(destCwd, item.dest), template, 'utf8')

    })

  }

}

Handlebars.registerHelper('lowerCase', (s) => {

  return Util.lowerCaseFirstLetter(s)

})

Handlebars.registerHelper('singularCase', (s) => {

  return Util.singularCase(s)

})

Handlebars.registerHelper('upperCase', (s) => {

  return Util.upperCaseFirstLetter(s)

})

module.exports = Util
