const path = require('path')
const fse = require('fs-extra')
const child_process = require('child_process')
process.chdir(__dirname)

const buildPath = path.resolve(__dirname, '../build')

// empty build path.
if (fse.existsSync(buildPath)) {
  fse.emptyDirSync(buildPath, err => {
    if (err) throw err
  })
} else {
  fse.mkdirSync(buildPath)
}

const copyFiles = [
  'README.md',
  'package.json',
  'CHANGELOG.md',
  'LICENSE'
]

// copy file to build path.
for (const copyFile of copyFiles) {
  fse.copy(
    path.resolve(__dirname, '../', copyFile),
    path.resolve(buildPath, copyFile),
    err => {
      if (err) throw err
    }
  )
}

const assetsFiles = [
  // 'styles/fonts/segoe-mdl2-assets/segoe-mdl2-assets.css',
  // 'styles/fonts/segoe-mdl2-assets/segmdl2.svg',
  // 'styles/fonts/segoe-mdl2-assets/segmdl2.ttf',
  // 'styles/fonts/segoe-mdl2-assets/segmdl2.woff',
  // 'styles/fonts/segoe-mdl2-assets/segmdl2.woff2',
  // 'styles/fonts/segoe-mdl2-assets/segmdl2.eot',
  // '__assets__'
]

// copy assets to build path.
for (const assetsFile of assetsFiles) {
  fse.copy(
    path.resolve(__dirname, '../src', assetsFile),
    path.resolve(buildPath, assetsFile),
    err => {
      if (err) console.error(err)
    }
  )
}
