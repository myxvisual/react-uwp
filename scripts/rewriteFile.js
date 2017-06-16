const path = require('path')
const fs = require('fs')

process.chdir(__dirname)

const packageFile = '../build/package.json'
const typingFile = '../build/index.d.ts'
const packageData = JSON.parse(fs.readFileSync(packageFile))
packageData.scripts = void 0
const unUseDevDependencies = [
  'babel-eslint',
  'babel-eslint',
  'babel-preset-es2015',
  'babel-preset-react',
  'babel-preset-stage-0',
  'conventional-changelog-cli',
  'cross-env',
  'eslint',
  'eslint-config-airbnb',
  'eslint-plugin-babel',
  'eslint-plugin-import',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-react',
  'fs-extra',
  'husky',
  'npm-run-all',
  'tslint',
  'tslint-eslint-rules',
  'tslint-no-circular-imports'
]
for (const devDependencies of unUseDevDependencies) {
  packageData.devDependencies[devDependencies] = void 0
}

fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2))

fs.writeFileSync(typingFile, fs.readFileSync(typingFile, 'utf8') + '\n' + fs.readFileSync('../typings/index.d.ts', 'utf8'))
