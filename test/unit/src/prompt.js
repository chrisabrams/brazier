import Prompt   from '../../../src/prompt'
import readline from 'readline-sync'

describe('Prompt', function() {

  it('should initialize', function(done) {

    var prompt = new Prompt()

    expect(prompt).to.be.an('object')
    expect(prompt.line).to.be.a('function')
    expect(prompt.question).to.be.a('function')

    done()

  })

  it('should print a line', function(done) {

    sinon.stub(console, 'log')

    var prompt = new Prompt()

    prompt.line('foo')

    expect(console.log).to.be.called.once

    console.log.restore()

    done()

  })

  it('should ask a question', function(done) {

    sinon.stub(readline, 'question')

    var prompt = new Prompt()

    prompt.question('foo')

    expect(readline.question).to.be.called.once

    readline.question.restore()

    done()

  })

})
