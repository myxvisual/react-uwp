const fs = require('fs')
const { execSync } = require('child_process')

const usage = '\nbuild <vn.n.n[-pre[.n]]> | <HEAD> [-p]\n'
const versionsFile = './src/assets/versions.json'

const args = process.argv
if (args.length < 3) {
  console.log(usage, '\n')
  process.exit()
}

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
  execSyncWithLog('git reset --hard HEAD~1')

  if (version === 'HEAD') {
    execSyncWithLog('git checkout --detach master')
  } else {
    execSyncWithLog(`git checkout tags/${version}`)
  }

  execSyncWithLog('test -d \"./build\" && rm -r \"./build\" || exit 0')
  execSyncWithLog('cd ../ && npm install && cd docs && npm run build')
  
  execSyncWithLog('git checkout gh-pages')

  if (version === 'HEAD') {
    execSyncWithLog('git commit --amend --no-edit')
  } else {
    execSyncWithLog(`git add .. && git commit -m '${version}'`)
  }

  if (useForcePush) {
    execSyncWithLog('git push -f')
  }
}
