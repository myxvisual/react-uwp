const fs = require('fs')
const { execSync } = require('child_process')

const usage = '\nbuild <vn.n.n[-pre[.n]]> | <HEAD> [-p]\n'
const versionsFile = './src/assets/versions.json'

const args = process.argv

if (args.length < 3) exit(usage)

const version = args[2]
const useForcePush = args[3] === '-p'

function execSyncWithLog(command) {
  console.log(command)
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    console.error(error.output[1])
    process.exit(error.status)
 }
}

function buildDocs() {
  process.chdir(__dirname)
  execSyncWithLog('git checkout gh-pages')
}
