process.on('uncaughtException', console.log)

var concat         = require('gulp-concat'),
    glob           = require('glob'),
    gulp           = require('gulp'),
    mocha          = require('gulp-mocha')

gulp.task('mocha-cli', function() {

  return gulp
    .src([
      './test/helpers/cli/runner.js',
      //'./lib/polyfills/**/*.js',
      './test/unit/**/*.js'
    ], {read: false})
    .pipe(mocha({reporter: 'spec'}))

})

gulp.task('t', ['mocha-cli'])
gulp.task('test', ['t'])
