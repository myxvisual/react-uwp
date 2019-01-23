const { execSync } = require('child_process')
const runCommandsAndLog = require('./runCommandsAndLog')

let version = execSync('git describe --abbrev=0 --tags').toString().trim() || 'v1.0.0'
console.log(`current git tag version is ${version}`)
version = version.slice(1)

const versionNum = Number(version.replace(/\./g, ''))
const nextVersionNum = versionNum + 1
const nextVersionStr = `${nextVersionNum}`
const nextVersion = `v${nextVersionStr.slice(0, nextVersionStr.length - 2)}${nextVersionStr.slice(-2).replace(/(\w)/g, $1 => `.${$1}`)}`
console.log(`next git tag version is ${nextVersion}`)

runCommandsAndLog(
  `git tag ${nextVersion}`,
  'git push origin --tags',
  'git push',
  'npm run changelog',
  'git add -A',
  `git commit -m "docs: Add ${nextVersion} changelog"`,
  'git push'
)
