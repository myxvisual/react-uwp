const path = require('path')
const fse = require('fs-extra')
const child_process = require('child_process')

const buildPath = path.resolve(__dirname, '../build')

// empty build path.
if (fse.existsSync(buildPath)) {
  fse.emptyDirSync(buildPath, err => {
    if (err) throw err;
  })
} else {
  fse.mkdirSync(buildPath)
}

const copyFiles = [
  'README.md',
  'CHANGELOG.md',
  'LICENSE'
]

// copy file to build path.
for (const copyFile of copyFiles) {
  fse.copy(
    path.resolve(__dirname, '../', copyFile),
    path.resolve(buildPath, copyFile),
    err => {
      if (err) throw err;
    }
  )
}

const assetsFiles = [
  'styles/segoe-mdl2-assets/segoe-mdl2-assets.css',
  'styles/segoe-mdl2-assets/segoe-mdl2-assets.eot',
  'styles/segoe-mdl2-assets/segoe-mdl2-assets.svg',
  'styles/segoe-mdl2-assets/segoe-mdl2-assets.ttf',
  'styles/segoe-mdl2-assets/segoe-mdl2-assets.woff',
  'styles/segoe-mdl2-assets/segoe-mdl2-assets.woff2',
  'images/cortana.svg'
]

// copy assets to build path.
for (const assetsFile of assetsFiles) {
  fse.copy(
    path.resolve(__dirname, '../src', assetsFile),
    path.resolve(buildPath, assetsFile),
    err => {
      if (err) throw err;
    }
  )
}
