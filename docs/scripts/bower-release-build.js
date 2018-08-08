const fs = require('fs')
const fse = require('fs-extra')
const { execSync } = require('child_process')

process.chdir(__dirname)

const outDir = '../../../'
const bowerDir = '../../../react-uwp-bower'

const outDirOptions = { cwd: outDir, stdio: 'inherit' }
const bowerDirOptions = { cwd: bowerDir, stdio: 'inherit' }

module.exports = function buildBowerRelease(version) {
  if (!fs.existsSync(bowerDir)) {
    execSync('git clone https://github.com/myxvisual/react-uwp-bower', outDirOptions)
  }

  fse.copySync('../public/static', bowerDir, { overwrite: true })
  const logs = execSync('git tag').toString()
  const isExistVersion = logs.includes(version)
  if (!isExistVersion) {
    try {
      execSync(`git add -A && git commit --allow-empty -m ${(version) || 'Update bower files'} && git tag ${version} && git push origin --tags`, bowerDirOptions)
    } catch (err) {
      console.error(err)
    }
    console.log('bower-release is finished')
  }
}
