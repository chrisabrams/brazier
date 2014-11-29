var Brazier = require('../../../index')

describe('Index', function() {

  it('should initialize', function(done) {

    expect(Brazier).to.be.an('object')
    expect(Brazier.Controller).to.be.a('function')
    expect(Brazier.Dispatcher).to.be.a('function')
    expect(Brazier.Prompt).to.be.a('function')
    expect(Brazier.Router).to.be.a('function')

    done()

  })

})
