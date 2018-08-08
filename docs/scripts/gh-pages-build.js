const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const { execSync } = require('child_process')
const buildBowerRelease = require('./bower-release-build')

process.chdir(__dirname)

const rootDir = path.join('../../../', __dirname)
const usage = '\nbuild <vn.n.n[-pre[.n]]> | <HEAD> [-p]\n'
const versionsFile = './versions.json'
const { publicPath } = require('../config')

const args = process.argv
let version
if (args.length < 3) {
  version = 'HEAD'
} else if (/v\d{1,2}.\d{1,2}.\d{1,2}-?\w*\.?\d{0,2}/.test(args[2])) {
  version = args[2]
} else {
  console.log(usage)
  process.exit()
}

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
    execSyncWithLog(`git add ${versionsFile} && git commit -m "docs: Update ${versionNumber} to versions file" && git push`)
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
  execSyncWithLog('git reset --hard')
  execSyncWithLog('git checkout gh-pages')
  execSyncWithLog('git reset --hard')
  execSyncWithLog('git pull')

  if (versionIsHEAD) {
    execSyncWithLog('git checkout master')
  } else {
    execSyncWithLog(`git checkout tags/${version}`)
  }

  fse.emptyDirSync('../build')
  execSyncWithLog('cd ../../ && npm install && cd docs && npm run build')
  fse.copySync('../public', '../build', { overwrite: true })

  execSyncWithLog('git reset --hard')
  execSyncWithLog('git checkout gh-pages')
  fse.copySync('../build/README.md', '../../README.md', { overwrite: true })
  fse.copySync('../build/404.html', '../../404.html', { overwrite: true })

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

  execSyncWithLog('git add -A')
  execSyncWithLog(`git commit -m "Update ${version} Docs"`)
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
buildBowerRelease(versionNumber)
buildDocs()
