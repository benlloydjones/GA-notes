const gulp        = require('gulp');
const babel       = require('gulp-babel');
const sass        = require('gulp-sass');
const cleanCSS 	  = require('gulp-clean-css');
const uglify      = require('gulp-uglify');
const browserSync = require('browser-sync').create();

gulp.task('es6', () => {
  return gulp.src('src/js/*.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'));
});

gulp.task('sass', () => {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ compatibility: 'ie8'}))
    .pipe(gulp.dest('public/css'));
});

gulp.task('serve', ['es6', 'sass'], () => {
  browserSync.init({
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 7000,
    reloadDelay: 500,
    server: { baseDir: './' }
  });
});

gulp.task('default', ['sass', 'es6', 'serve'], () => {
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['es6']);
});
