var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var prefix = require('gulp-autoprefixer');
var minyfyCSS = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-ruby-sass');
var angularTemplates = require('gulp-angular-templates');

gulp.task('js', function () {
  gulp.src(['src/**/module.js', 'src/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('js/'));
});

gulp.task('html', function () {
  return gulp.src('src/**/*.html')
    .pipe(angularTemplates({module: 'app'}))
    .pipe(gulp.dest('src/template_cache/'));
});

gulp.task('watch', ['js'], function () {
  gulp.watch('src/**/*.js', ['js']);
});

gulp.task('css', function () {
    gulp.src('./scss/*.scss')
    .pipe(sass())
    .pipe(prefix('last 15 versions'))
    .pipe(minyfyCSS(''))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest('./css'));
});

