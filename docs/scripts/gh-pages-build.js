const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const usage = '\nbuild <vn.n.n[-pre[.n]]> | <HEAD> [-p]\n'
const versionsFile = '../public/versions.json'

const args = process.argv
if (args.length < 3) {
  console.log(usage, '\n')
  process.exit()
}

const version = args[2]
let versions
const versionIsHEAD = version === 'HEAD'
const useForcePush = args[3] === '-p'
const versionNumber = versionIsHEAD ? (
  JSON.parse(fs.writeFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')).version
) : version

function execSyncWithLog(command) {
  console.log(command)
  try {
    execSync(command, { stdio: 'inherit' })
  } catch (error) {
    console.error(error.output[1])
    process.exit(error.status)
 }
}

function saveVersionsFile() {
  versions = JSON.parse(fs.readFileSync(versionsFile, 'utf8'))
  if (!version.includes(versionNumber)) {
    versions.push(versionNumber)
    versions.sort()
    fs.writeFileSync(versionsFile, JSON.stringify(versions, null, 2), 'utf8')
    execSyncWithLog(`git add ${versionsFile} && git commit -m "add ${versionNumber} to versions file"`)
  }
}

function savePublicVersionsFile() {
  const publicVersionsFile = '../../versions.json'
  if (fs.existsSync(publicVersionsFile)) {
    const publicVersions = JSON.parse(fs.writeFileSync('../../versions.json', 'utf8'))
    if (!publicVersions.includes(versionNumber)) {
      publicVersions.push(versionNumber)
      publicVersions.sort()
    }
    fs.writeFileSync(publicVersionsFile, JSON.stringify(publicVersions, null, 2), 'utf8')
  } else {
    fs.writeFileSync(publicVersionsFile, JSON.stringify(versions, null, 2), 'utf8')
  }
}

function buildDocs() {
  process.chdir(__dirname)
  execSyncWithLog('git checkout gh-pages')
  execSyncWithLog('git reset --hard HEAD~1')

  if (versionIsHEAD) {
    execSyncWithLog('git checkout --detach master')
  } else {
    execSyncWithLog(`git checkout tags/${version}`)
  }

  execSyncWithLog('test -d \"./build\" && rm -r \"./build\" || exit 0')
  execSyncWithLog('cd ../../ && npm install && cd docs && npm run build')
  execSyncWithLog('git checkout gh-pages')
  execSyncWithLog(`mv ../build ../../${version}`)

  if (versionIsHEAD) {
    execSyncWithLog(`ln -sfh ./${versionNumber} ../release`)
  }
  savePublicVersionsFile()

  if (versionIsHEAD) {
    execSyncWithLog('git commit --amend --no-edit')
  } else {
    execSyncWithLog(`git add ../../ && git commit -m '${version}'`)
  }

  execSyncWithLog(`git push${useForcePush ? ' -f' : ''}`)
}

saveVersionsFile()
buildDocs()
