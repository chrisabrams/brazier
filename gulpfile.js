process.on('uncaughtException', console.log)

var babel          = require('gulp-babel'),
    concat         = require('gulp-concat'),
    glob           = require('glob'),
    gulp           = require('gulp'),
    mocha          = require('gulp-mocha')

gulp.task('b', function() {

  return gulp
    .src([
      './index.js',
      './src/**/*.js',
      './bin/**/*.js'
    ])
    .pipe(babel({presets: [
      "es2015",
      "stage-0"
    ]}))
    .pipe(concat('brazier.dist.js'))
    .pipe(gulp.dest(''))

})

gulp.task('mocha-cli', function() {

  return gulp
    .src([
      './test/helpers/cli/runner.js',
      './test/unit/**/*.js'
    ], {read: false})
    .pipe(mocha({reporter: 'spec'}))

})

gulp.task('t', ['mocha-cli'])
gulp.task('test', ['t'])
