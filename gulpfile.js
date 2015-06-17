var gulp = require('gulp')
var electron = require('electron-prebuilt')
var childProcess = require('child_process')

var options = {}

gulp.task('run', function () {
  var electrofly = childProcess.spawn(electron, ['./app'], {
    stdio: 'inherit'
  })

  electrofly.on('close', function () {
    process.exit()
  })
})

gulp.task('default', ['run'])