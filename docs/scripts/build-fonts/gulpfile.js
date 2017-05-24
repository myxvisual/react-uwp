const fs = require('fs')
const path = require('path')
const gulp = require('gulp')

process.chdir(__dirname)

const fontsPath = 'v1705'
const inputs = [`${fontsPath}/*.ttf`]
const output = 'fonts/'

const ttf2woff = require('gulp-ttf2woff')
gulp.task('ttf2woff', () => {
  gulp.src(inputs)
    .pipe(ttf2woff())
    .pipe(gulp.dest(output))
})

const ttf2eot = require('gulp-ttf2eot')
gulp.task('ttf2eot', () => {
  gulp.src(inputs)
    .pipe(ttf2eot())
    .pipe(gulp.dest(output))
})

gulp.task('default', [
  'ttf2woff',
  'ttf2eot'
])

const ttf2woff2 = require('ttf2woff2')
for (const file of fs.readdirSync(fontsPath, 'utf8')) {
  console.log(file)
  fs.writeFileSync(
    path.join(__dirname, output, file),
    fs.readFileSync(path.join(__dirname, fontsPath, file))
  )
}
