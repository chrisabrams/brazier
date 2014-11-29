var BootController = require('../../../bin/boot')

describe('Boot', function() {

  it('should initialize', function(done) {

    var argv   = {_: []},
        pkg    = {name: '', version: ''},
        routes = []

    var boot = new BootController({
      argv: argv,
      pkg: pkg,
      routes: routes
    })

    expect(boot).to.be.an('object')
    expect(boot.capitaliseFirstLetter).to.be.a('function')

    done()

  })

  it('should capitalize first letter of string', function(done) {

    var str = BootController.prototype.capitaliseFirstLetter('foo')

    expect(str).to.equal('Foo')

    done()

  })

})
