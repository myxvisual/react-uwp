// var Fontmin = require('fontmin')
 
// var fontmin = new Fontmin()
//     .src('./*.ttf')
//     .dest('./build/fonts')
 
// fontmin.run(function (err, files) {
//     if (err) {
//         throw err
//     }
 
//     console.log(files[0])
// })

var fs = require('fs')
var ttf2woff2 = require('ttf2woff2')
 
var input = fs.readFileSync('segoe-mdl2-assets.ttf')
 
fs.writeFileSync('segoe-mdl2-assets.woff2', ttf2woff2(input))