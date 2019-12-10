const path = require('path')
const fse = require('fs-extra')
const fs = require('fs')

process.chdir(__dirname)

const buildPath = path.resolve(__dirname, '../build')

// mkdir build path.
if (!fse.existsSync(buildPath)) {
  fse.mkdirSync(buildPath)
}

const copyFiles = [
  'README.md',
  'package.json',
  'CHANGELOG.md',
  'LICENSE',
  'src/index.d.ts'
]

// copy file to build path.
for (const copyFile of copyFiles) {
  fse.copySync(
    path.resolve(__dirname, '../', copyFile),
    path.resolve(buildPath, path.basename(copyFile)),
    { overwrite: true }
  )
}

const packageFile = '../build/package.json'
const packageData = JSON.parse(fs.readFileSync(packageFile))
packageData.scripts = void 0
packageData.devDependencies = void 0

fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2))
