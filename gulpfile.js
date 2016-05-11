var gulp = require('gulp'),
    uglify = require("gulp-uglify"),
    csso = require("gulp-csso"),
    clean = require("gulp-clean");

gulp.task("clean:css", function(){
	return gulp.src('dist/css/*.css', {read: false})
		.pipe(clean());
});

gulp.task("matfess", function(){
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

gulp.task("clean:js", function(){
	return gulp.src('dist/js/*.js', {read: false})
		.pipe(clean());
});

gulp.task("clean", ["clean:js", "clean:css"]);

gulp.task("css-optimize", function(){
	return gulp.src('dev/css/*.css')
		.pipe(csso())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task("js-optimize", function(){
	return gulp.src('dev/js/*.js')
		.pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task("buildSolution", ["clean:js", "clean:css", "css-optimize", "js-optimize"]);