const ejs = require('ejs')
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')

const __DEV__ = process.env.NODE_ENV !== 'production'
const {
  outputPath,
  publicPath,
  hostName,
  port
} = require('../config')
const joinDirname = (...paths) => path.join(__dirname, ...paths)
const buildPath = joinDirname(`../${outputPath}/${publicPath}`)


if (fs.existsSync(buildPath)) {
  buildHTML()
} else {
  mkdirp(buildPath, (err) => {
    if (err) console.error(err)
    buildHTML()
  })
}

function buildHTML() {
  const manifest = __DEV__ ? null : JSON.parse(
    fs.readFileSync(joinDirname('../', `./${outputPath}/${publicPath}/webpack-manifest.json`), 'utf8')
  )
  const vendorManifest = __DEV__ ? null : JSON.parse(
    fs.readFileSync(joinDirname('../', `./${outputPath}/${publicPath}/webpack-dll-manifest.json`), 'utf8')
  )

  const name = 'app'
  fs.writeFileSync(
    joinDirname(`../${outputPath}/index.html`),
    ejs.render(
      fs.readFileSync(joinDirname('../src/views/index.ejs'), 'utf8'),
      {
        __DEV__,
        name: __DEV__ ? `/${publicPath}/js/${name}.js` : `/${publicPath}/${manifest[`${name}.js`]}`,
        proxy: __DEV__ ? `http://${hostName}:${port}` : '',
        common: __DEV__ ? `/${publicPath}/js/common.js` : `/${publicPath}/${manifest['common.js']}`,
        vendor: __DEV__ ? `/${publicPath}/vendor.dev.dll.js` : `/${publicPath}/${vendorManifest['vendor.js']}`
      }
    )
  )
}
