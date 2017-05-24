const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const { execSync } = require('child_process')

process.chdir(__dirname)

const usage = '\nbuild <vn.n.n[-pre[.n]]> | <HEAD> [-p]\n'
const versionsFile = './versions.json'
const { outputPath, publicPath } = require('../config')

const args = process.argv
if (args.length < 3) {
  console.log(usage, '\n')
  process.exit()
}

const version = args[2]
const versions = JSON.parse(fs.readFileSync(versionsFile, 'utf8'))
const versionIsHEAD = version === 'HEAD'
const useForcePush = args[3] === '-p'
const versionNumber = versionIsHEAD ? (
  `v${JSON.parse(fs.readFileSync('../../package.json', 'utf8')).version}`
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
  if (!versions.includes(versionNumber)) {
    versions.push(versionNumber)
    versions.sort()
    fs.writeFileSync(versionsFile, JSON.stringify(versions, null, 2), 'utf8')
    execSyncWithLog(`git add ${versionsFile} && git commit -m "add ${versionNumber} to versions file"`)
  }
}

function savePublicVersionsFile() {
  const publicVersionsFile = '../../versions.json'
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
  execSyncWithLog('git checkout gh-pages')
  execSyncWithLog('git reset --hard')
  execSyncWithLog('git pull')

  if (versionIsHEAD) {
    execSyncWithLog('git checkout master')
  } else {
    execSyncWithLog(`git checkout tags/${version}`)
  }

  fse.emptyDirSync('../build')
  fse.moveSync('../public', '../build/public', { overwrite: true })
  execSyncWithLog('cd ../../ && npm install && cd docs && npm run build')
  execSyncWithLog('git checkout gh-pages')
  fse.moveSync('../build/public', '../../', { overwrite: true })

  if (versionIsHEAD) {
    const replaceHTML = fs.readFileSync('../build/index.html', 'utf8').replace(/\/static\//gim, '/HEAD/static/')
    fs.writeFileSync(
      '../../index.html',
      replaceHTML,
      'utf8'
      )
    const buildDocsFolder = '../../HEAD'
    if (fs.existsSync(buildDocsFolder)) {
      fse.emptyDirSync(buildDocsFolder)
    }
    fse.copySync(
      '../build',
      buildDocsFolder
    )
    replaceWebpackPublicPath('HEAD')
  }

  const buildDocsFolder = `../../${versionNumber}`
  if (fs.existsSync(buildDocsFolder)) {
    fse.emptyDirSync(buildDocsFolder)
  }
  fse.moveSync(
    '../build',
    buildDocsFolder
  )
  replaceWebpackPublicPath(versionNumber)

  if (versionIsHEAD) {
    fs.writeFileSync(
     '../../release',
      `./${versionNumber}`
    )
  }
  savePublicVersionsFile()

  execSyncWithLog(`git add -A && git commit -m 'Update ${version}' Docs`)
  execSyncWithLog(`git push${useForcePush ? ' -f' : ''}`)
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
    `../../${versionNumb}/${publicPath}`,
    'webpack-manifest.json'
  )
  const commonJSName = JSON.parse(fs.readFileSync(webpackManifestFile, 'utf8'))['common.js']
  const commonJSFile = path.join(
    __dirname,
    `../../${versionNumb}`,
    publicPath,
    commonJSName
  )
  const replaceJS = fs.readFileSync(commonJSFile, 'utf8').replace(/\/static\//gim, `/${versionNumb}/static/`)
  fs.writeFileSync(
    commonJSFile,
    replaceJS,
    'utf8'
  )
}

saveVersionsFile()
buildDocs()
