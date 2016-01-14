import Controller from '../../../src/controller'
import Dispatcher from '../../../src/dispatcher'
import path       from 'path'

describe('Controller', function() {

  it('should initialize', function(done) {

    var controller = new Controller()

    expect(controller).to.be.an('object')

    done()

  })

  describe('Action', function() {

    it('should have keys', function(done) {

      var dispatcher = new Dispatcher({
        controllerPath: path.join(__dirname, '../../helpers/controllers/')
      })

      dispatcher.dispatch({controller: 'foo', action: 'bar', keys: {n: 'baz'}})

      // dispatcher.action.keys is assigned on the controller helper; it won't be assigned to the action's scope by default.
      expect(dispatcher.action.keys).to.be.an('object')
      expect(dispatcher.action.keys.n).to.equal('baz')

      done()

    })

    it('should not have keys', function(done) {

      var dispatcher = new Dispatcher({
        controllerPath: path.join(__dirname, '../../helpers/controllers/')
      })

      dispatcher.dispatch({controller: 'foo', action: 'bar'})

      expect(dispatcher.action.keys).to.equal(undefined)

      done()

    })

  })

})
