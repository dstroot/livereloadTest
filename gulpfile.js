/**
 * Module Dependencies
 */

var gulp = require('gulp');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var less = require('gulp-less');
var rimraf = require('gulp-rimraf');
var open = require('gulp-open');

/**
 * Clean
 */

// Return the stream so that gulp knows the task is asynchronous
// and waits for it to terminate before starting dependent tasks.

gulp.task('clean', function () {
  return gulp.src('public/css/bootstrap.css', { read: false })
    .pipe(rimraf());
});

/**
 * Process CSS
 */

gulp.task('styles', ['clean'], function () {
  return gulp.src('./bower_components/bootstrap/less/bootstrap.less')
    .pipe(less({}))
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

/**
 * Nodemon
 */

gulp.task('nodemon', function (cb) {
  livereload.listen();
  var called = false;
  nodemon({
    script: 'app.js',
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    setTimeout(function () {
      if (!called) {
        called = true;
        cb();
      }
    }, 1000);
  })
  .on('restart', function () {
    setTimeout(function () {
      livereload.changed('/');
    }, 1000);
  });
});

/**
 * Open the browser
 */

gulp.task('open', ['nodemon'], function () {
  var options = {
    url: 'http://localhost:3000/'
  };
  // any file or gulp will skip the task
  gulp.src('./public/index.html')
  .pipe(open('', options));
});

/**
 * Default
 */

gulp.task('default', ['open', 'styles'], function () {
  gulp.watch('public/*.html').on('change', livereload.changed);
  gulp.watch('./bower_components/bootstrap/less/bootstrap.less', ['styles']);
});