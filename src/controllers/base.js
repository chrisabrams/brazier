import fs     from 'fs'
import Prompt from '../prompt'

var execSync = require('child_process').execSync

class BrazierController {

  constructor(options = {}) {
    this.options = options

    this.initialize()
  }

  initialize() {

  }

  getGitUserEmail() {

    var email = execSync('git config user.email').toString()

    if(email) {
      email = email.replace(/\n/g, '')
    }

    else {
      email = ''
    }

    return email

  }

  getGitUserName() {

    var name = execSync('git config user.name').toString()

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

    // Store the entered value
    this.store[key]  = promptValue

    // Possible scenarios that change the value stored

    // Y/n prompts
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

      this.store[key] = value

    }

    // Nothing returned, nothing default
    if(this.isStringEmpty(promptValue) && !defaultValue) {

      value = promptValue
      this.store[key] = value

    }

    if(options.binFile) {

      this.generateBinFile(this.store[key], this.cwd)

    }

  }

}

BrazierController.prototype.cwd        = process.cwd()
BrazierController.prototype.matchRegex = /{{([^}}]+)}}/g
BrazierController.prototype.store      = {}

export default BrazierController
