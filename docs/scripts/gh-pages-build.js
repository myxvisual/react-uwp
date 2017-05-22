const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const { execSync } = require('child_process')

const usage = '\nbuild <vn.n.n[-pre[.n]]> | <HEAD> [-p]\n'
const versionsFile = path.resolve(__dirname, './versions.json')
const { outputPath, publicPath } = require('../config')

const args = process.argv
if (args.length < 3) {
  console.log(usage, '\n')
  process.exit()
}

const version = args[2]
const versions = JSON.parse(fs.readFileSync(path.resolve(__dirname, versionsFile), 'utf8'))
const versionIsHEAD = version === 'HEAD'
const useForcePush = args[3] === '-p'
const versionNumber = versionIsHEAD ? (
  `v${JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')).version}`
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

fse.copySync(
  path.resolve(__dirname, '../public'),
  path.resolve(__dirname, '../../')
)
execSyncWithLog('git stash')

function saveVersionsFile() {
  if (!versions.includes(versionNumber)) {
    versions.push(versionNumber)
    versions.sort()
    fs.writeFileSync(versionsFile, JSON.stringify(versions, null, 2), 'utf8')
    execSyncWithLog(`git add ${versionsFile} && git commit -m "add ${versionNumber} to versions file"`)
  }
}

function savePublicVersionsFile() {
  const publicVersionsFile = path.resolve(__dirname, '../../versions.json')
  if (fs.existsSync(publicVersionsFile)) {
    const publicVersions = JSON.parse(fs.readFileSync(publicVersionsFile, 'utf8'))
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
  execSyncWithLog('git reset --hard HEAD')

  if (versionIsHEAD) {
    execSyncWithLog('git checkout master')
  } else {
    execSyncWithLog(`git checkout tags/${version}`)
  }

  execSyncWithLog('test -d \"./build\" && rm -r \"./build\" || exit 0')
  execSyncWithLog('cd ../../ && npm install && cd docs && npm run build')
  execSyncWithLog('git checkout gh-pages')

  if (versionIsHEAD) {
    const replaceHTML = fs.readFileSync('../build/index.html', 'utf8').replace(/\/static\//gim, '/HEAD/static/')
    fs.writeFileSync(
      path.resolve(__dirname, '../../index.html'),
      replaceHTML,
      'utf8'
    )
    fse.copySync(
      path.resolve(__dirname, '../build'),
      path.resolve(__dirname, '../../HEAD')
    )
  }

  fse.moveSync(
    path.resolve(__dirname, '../build'),
    path.resolve(__dirname, `../../${versionNumber}`)
  )

  if (versionIsHEAD) {
    fs.writeFileSync(
      path.resolve(__dirname, '../../release'),
      `./${versionNumber}`
    )
  }
  savePublicVersionsFile()

  execSyncWithLog('git stash pop')

  // execSyncWithLog(`git add ../../ && git commit -m 'Update ${version}' Docs`)

  // execSyncWithLog(`git push${useForcePush ? ' -f' : ''}`)
}

function replaceWebpackPublicPath(versionNumb) {
  const versionHTMLFile = `../../${versionNumb}/index.html`
  const replaceHTML = fs.readFileSync(versionHTMLFile, 'utf8').replace(/\/static\//gim, `/${versionNumb}/static/`)
  fs.writeFileSync(
    versionHTMLFile,
    replaceHTML,
    'utf8'
  )

  const webpackManifestFile = path.join(
    __dirname,
    `../../${versionNumb}`,
    'webpack-manifest.json'
  )
  const commonJSName = JSON.parse(fs.readFileSync(webpackManifestFile, 'utf8'))['common.js']
  const commonJSFile = path.join(
    __dirname,
    `../../${versionNumb}`,
    commonJSName
  )
  const replaceJS = fs.readFileSync(versionHTMLFile, 'utf8').replace(/\/static\//gim, `/${versionNumb}/static/`)
  fs.writeFileSync(
    commonJSFile,
    replaceJS,
    'utf8'
  )
}

saveVersionsFile()
buildDocs()
