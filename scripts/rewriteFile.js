const path = require('path')
const fs = require('fs')

process.chdir(__dirname)

const packageFile = '../build/package.json'
const typingFile = '../build/index.d.ts'
const packageData = JSON.parse(fs.readFileSync(packageFile))
packageData.scripts = void 0
packageData.devDependencies['@types/react-router'] = void 0

fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2))

fs.writeFileSync(typingFile, fs.readFileSync(typingFile, 'utf8') + '\n' + fs.readFileSync('../typings/index.d.ts', 'utf8'))
