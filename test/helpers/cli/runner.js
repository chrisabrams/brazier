require('6to5/register')
require('6to5/polyfill')

var chai      = require('chai'),
    sinon     = require('sinon'),
    sinonChai = require('sinon-chai')

chai.use(sinonChai)

global.expect = chai.expect
global.sinon  = sinon
