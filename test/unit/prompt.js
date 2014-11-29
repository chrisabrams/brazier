var Prompt = require('../../src/prompt')

describe('Prompt', function() {

  it('should initialize', function(done) {

    var prompt = new Prompt()

    expect(prompt).to.be.an('object')

    done()

  })

})
