var Controller = require('../../src/controller')

describe('Controller', function() {

  it('should initialize', function(done) {

    var controller = new Controller()

    expect(controller).to.be.an('object')

    done()

  })

})
