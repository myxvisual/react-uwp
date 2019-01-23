const { exec } = require( 'child_process')

function runCommandsAndLog(...commands) {
  let commandsSize = 0
  let startIndex = 0

  if (!commands || (commandsSize = commands.length) === 0) {
    console.log('commands not found.')
    return []
  }

  function toNext() {
    startIndex += 1
    if (startIndex < commandsSize) {
      nextCommand()
    }
  }

  function nextCommand() {
    const commandType = commands[startIndex]
    const isStr = typeof commandType === 'string'
    const command = isStr ? commandType : commandType[0]
    const childProcess = exec(command, (error, stdout, stderr) => {
      const cb = isStr ? void 0 : commandType[1]
      if (cb) cb(error, stdout, stderr)
    })

    childProcess.stdout.on('data', data => { console.log(data) })
    childProcess.stderr.on('data', data => { console.error(data) })
    childProcess.on('exit', toNext)
    childProcess.on('error', toNext)
  
    return childProcess
  }

  nextCommand()
}

module.exports = runCommandsAndLog
