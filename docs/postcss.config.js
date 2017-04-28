module.exports = {
  plugins: [
    require('postcss-cssnext')({ browsers: ['> 0%'], remove: false }),
    require('postcss-nested')({ bubble: ['phone'] }),
    require('postcss-simple-vars'),
    require('postcss-import'),
    require('postcss-color-function'),
    require('postcss-modules-values')
  ]
}
