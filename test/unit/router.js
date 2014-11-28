var Router = require('../../src/router')

describe('Router', function() {

  it('should initialize', function(done) {

    var routeOptions = {
      commands: ['foo'],
      dest: 'foo#bar'
    }

    var routes = [routeOptions]

    var argv = { _: [], a: 'beep', b: 'boop' }

    var router = new Router({
      argv: argv,
      routes: routes
    })

    expect(router).to.be.an('object')
    expect(router.argv).to.be.an('object')
    expect(router.isMatch).to.be.a('function')
    expect(router.match).to.be.a('function')
    expect(router.routes).to.be.an('array')
    expect(router.start).to.be.a('function')

    done()

  })

  it('should determine match is true', function(done) {

    var routeOptions = {
      commands: ['foo'],
      dest: 'foo#bar'
    }

    var routes = [routeOptions]

    var argv = { _: ['foo']}

    var router = new Router({
      argv: argv,
      routes: routes
    })

    var isMatch = router.isMatch(routeOptions)

    expect(isMatch).to.equal(true)

    done()

  })

  it('should determine match is false', function(done) {

    var routeOptions = {
      commands: ['foo'],
      dest: 'foo#bar'
    }

    var routes = [routeOptions]

    var argv = { _: ['foobar']}

    var router = new Router({
      argv: argv,
      routes: routes
    })

    var isMatch = router.isMatch(routeOptions)

    expect(isMatch).to.equal(false)

    done()

  })

  it('should match blank command ``', function(done) {

    var routes = [{
      commands: [''],
      dest: 'default#help'
    }]

    var argv = { _: ['']}

    sinon.spy(Router.prototype, 'match')
    sinon.spy(Router.prototype, 'start')

    var router = new Router({
      argv: argv,
      routes: routes
    })

    router.start()

    expect(router.start).to.have.been.called
    expect(router.match).to.have.been.called
    expect(router.routesMatched).to.equal(1)

    Router.prototype.match.restore()
    Router.prototype.start.restore()

    done()

  })

  it('should match command `generate`', function(done) {

    var routes = [{
      commands: ['generate'],
      dest: 'generate#model'
    }]

    var argv = { _: ['generate']}

    sinon.spy(Router.prototype, 'match')
    sinon.spy(Router.prototype, 'start')

    var router = new Router({
      argv: argv,
      routes: routes
    })

    router.start()

    expect(router.start).to.have.been.called
    expect(router.match).to.have.been.called
    expect(router.routesMatched).to.equal(1)

    Router.prototype.match.restore()
    Router.prototype.start.restore()

    done()

  })

  it('should fire event on route match', function(done) {

    var routes = [{
      commands: ['generate'],
      dest: 'generate#model'
    }]

    var argv = { _: ['generate']}

    var router = new Router({
      argv: argv,
      routes: routes
    })

    router.on('route:matched', function(res) {

      expect(res).to.be.an('object')
      expect(res.controller).to.equal('generate')
      expect(res.action).to.equal('model')

      done()

    })

    router.start()

  })

  it('should not match command `generate foo` with route `generate`', function(done) {

    var routes = [{
      commands: ['generate', 'foo'],
      dest: 'generate#model'
    }]

    var argv = { _: ['generate']}

    sinon.spy(Router.prototype, 'match')
    sinon.spy(Router.prototype, 'start')

    var router = new Router({
      argv: argv,
      routes: routes
    })

    router.start()

    expect(router.start).to.have.been.called
    expect(router.match).to.have.been.called
    expect(router.routesMatched).to.equal(0)

    Router.prototype.match.restore()
    Router.prototype.start.restore()

    done()

  })

  it('should match commands `generate model`', function(done) {

    var routes = [{
      commands: ['generate', 'model'],
      dest: 'generate#model'
    }]

    var argv = { _: ['generate', 'model']}

    sinon.spy(Router.prototype, 'match')
    sinon.spy(Router.prototype, 'start')

    var router = new Router({
      argv: argv,
      routes: routes
    })

    router.start()

    expect(router.start).to.have.been.called
    expect(router.match).to.have.been.called
    expect(router.routesMatched).to.equal(1)

    Router.prototype.match.restore()
    Router.prototype.start.restore()

    done()

  })

  it('should match commands `generate model -n foo`', function(done) {

    var routes = [{
      commands: ['generate', 'model'],
      dest: 'generate#model'
    }]

    var argv = { _: ['generate', 'model'], n: 'foo'}

    sinon.spy(Router.prototype, 'match')
    sinon.spy(Router.prototype, 'start')

    var router = new Router({
      argv: argv,
      routes: routes
    })

    router.start()

    expect(router.start).to.have.been.called
    expect(router.match).to.have.been.called
    expect(router.routesMatched).to.equal(1)

    Router.prototype.match.restore()
    Router.prototype.start.restore()

    done()

  })

})
