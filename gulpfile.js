var gulp = require('gulp'),
    uglify = require("gulp-uglify"),
    csso = require("gulp-csso"),
    clean = require("gulp-clean"),
	ts = require('gulp-typescript'),
	merge = require('merge2'), 
	concat = require('gulp-concat');

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

gulp.task("ts-transpile", function(){
    var tsResult = gulp.src('dev/ts/*.ts')
        .pipe(ts({
            declaration: true,
            noExternalResolve: true
        }));

    return merge([
        tsResult.dts.pipe(gulp.dest('dist/definitions')),
        tsResult.js.pipe(gulp.dest('dist/js'))
    ]);
});

gulp.task("js-optimize", function(){
	return gulp.src('dev/js/*.js')
		.pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('js-concat', function(){
  	return gulp.src('dev/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task("optimize", ["css-optimize", "js-optimize"]);
gulp.task("buildSolution", ["clean", "optimize"]);