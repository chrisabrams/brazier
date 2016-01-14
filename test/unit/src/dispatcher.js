import Dispatcher from '../../../src/dispatcher'
import path       from 'path'

describe('Dispatcher', function() {

  it('should initialize', function(done) {

    var dispatcher = new Dispatcher({
      controllerPath: path.join(__dirname, '../../helpers/controllers/')
    })

    expect(dispatcher).to.be.an('object')
    expect(dispatcher.options).to.be.an('object')
    expect(dispatcher.dispatch).to.be.a('function')
    expect(dispatcher.getController).to.be.a('function')

    done()

  })

  it('should get controller', function(done) {

    var dispatcher = new Dispatcher({
      controllerPath: path.join(__dirname, '../../helpers/controllers/')
    })

    var Controller = dispatcher.getController({controller: 'foo'})

    expect(Controller).to.be.a('function')

    done()

  })

  it('should dispatch', function(done) {

    var dispatcher = new Dispatcher({
      controllerPath: path.join(__dirname, '../../helpers/controllers/')
    })

    dispatcher.dispatch({controller: 'foo', action: 'bar'})

    expect(dispatcher.controller).to.be.an('object')
    expect(dispatcher.action).to.be.an('object')

    done()

  })

})
