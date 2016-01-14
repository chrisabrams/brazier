import readline from 'readline-sync'

class BrazierPrompt {

  constructor(options = {}) {

  }

  line() {

    console.log.apply(this, arguments)

  }

  /* NOTE:
  At the moment, a question can only be a single argument string. This is a limitation of readline.
  */
  question(string) {

    string = string + ' ' // Add space between question and prompt answer

    var answer = readline.question(string)

    return answer

  }

}

export default BrazierPrompt
