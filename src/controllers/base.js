import fs     from 'fs'
import Prompt from '../prompt'

var sh = require('child_process').execSync

class BrazierController {

  constructor(options = {}) {
    this.options = options

    this.initialize()
  }

  initialize() {

  }

  getGitUserEmail() {

    var email = sh.exec('git config user.email').stdout

    if(email) {
      email = email.replace(/\n/g, '')
    }

    else {
      email = ''
    }

    return email

  }

  getGitUserName() {

    var name = sh.exec('git config user.name').stdout

    if(name) {
      name = name.replace(/\n/g, '')
    }

    else {
      name = ''
    }

    return name

  }

  isStringEmpty(entry) {

    /*
    TODO: strip spaces
    */
    if(typeof entry == 'undefined' || entry == null || (typeof entry == 'string' && entry == '')) {

      return true

    }

    return false

  }

  prompt(options = {}) {

    var prompt = new Prompt()

    var defaultValue = options.default,
        key          = options.key,
        promptLabel  = options.label,
        value        = defaultValue

    var promptValue  = prompt.question(`${promptLabel}: (${defaultValue})`)

    if(options.valueAsBoolean) {

      if(promptValue == '') {

        promptValue = defaultValue

      }

      switch(promptValue) {

        case true:
        case 'y':
        case 'Y':

          value = true

          break;

        default:

          value = false

      }

    }

    else {

      if(this.isStringEmpty(promptValue) && !defaultValue) {

        value = promptValue

      }

    }

    this.store[key] = value

    if(options.binFile) {

      this.generateBinFile(this.store[key], this.cwd)

    }

  }

}

BrazierController.prototype.cwd        = process.cwd()
BrazierController.prototype.matchRegex = /{{([^}}]+)}}/g
BrazierController.prototype.store      = {}

export default BrazierController
