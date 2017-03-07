const fs = require('fs')
const path = require('path')

fs.readFile('./src/controls/Button/index.tsx', 'utf8', (err, data) => {
	console.log(data)
})

