const fs = require('fs')

process.chdir(__dirname)

const packageFile = '../build/package.json'
const originTypingFile = '../typings/index.d.ts'
const buildTypingFile = '../build/index.d.ts'
const packageData = JSON.parse(fs.readFileSync(packageFile))
packageData.scripts = void 0
packageData.devDependencies['@types/react-router'] = void 0

fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2))

fs.writeFileSync(buildTypingFile, fs.readFileSync(originTypingFile, 'utf8'))
