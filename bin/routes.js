module.exports = [
  {
    commands: ['destroy'],
    desc: 'Destroy a project',
    dest: 'main#destroy'
  },
  {
    commands: ['init'],
    desc: 'Initialize an application',
    dest: 'main#init'
  },
  {
    commands: [''],
    dest: 'default#help'
  }
]
