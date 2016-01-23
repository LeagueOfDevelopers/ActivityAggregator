var gulp = require('gulp');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('prefixCss', function () {
	return gulp.src('public/styles/main.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('public/styles/compiled'));
});

gulp.task('scripts', function() {
  return gulp.src('public/js/*.js')
    .pipe(concat('build.js'))
    .pipe(gulp.dest('public/js/'));
});

//Watch task
gulp.task('default', function() {
    gulp.watch('public/styles/main.css',['prefixCss']);
    gulp.watch('public/js/*.js',['scripts']);
});