var gulp   = require('gulp'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-css'),
    cssv   = require('gulp-css-validator'),
    debug  = require('gulp-debug'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');

gulp.task('default', ['css', 'js']);

gulp.task('css', function() {
  gulp.src('./app/styles/*.css')
    // .pipe(debug({verbose: true}))
    .pipe(cssv())
    .pipe(cssmin())
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('js', function() {
  gulp.src('./app/scripts/*.js')
    // .pipe(debug({verbose: true}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(gulp.dest('./dist'))
});

gulp.task('watch', function () {
   gulp.watch([
            './app/styles/*.css',
            './app/scripts/*.js'
         ],
         ['default'])
});