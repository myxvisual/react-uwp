const fs = require('fs')
let data = fs.readFileSync('./icons.txt', 'utf8')
data = data.split('\n')
data = data.map(str => ({
	[str.slice(5).replace('\r', '')]: `\\u${str.slice(0, 4)}`
})).reduce((prev, curr) => Object.assign({}, prev, curr), {})
console.log(data)
fs.writeFileSync('icons.ts', `export default ${JSON.stringify(data)}`)