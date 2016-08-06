var gulp = require('gulp'),
    uglify = require("gulp-uglify"),
    csso = require("gulp-csso"),
    clean = require("gulp-clean"),
	ts = require('gulp-typescript'),
	merge = require('merge2'), 
	concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),
    spsave = require('gulp-spsave'),
    fs = require('fs');

var config = JSON.parse(fs.readFileSync('./config.json'));

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


gulp.task('upload-to-sp', function () {
    return gulp.src("./dist/js/*.js")
      .pipe(spsave({
          username: config.username,
          password: config.password,
          siteUrl: "https://jaredmatfess.sharepoint.com/sites/art",
          folder: "SiteAssets",
      }));
});

gulp.task('htmlNinja', function () {
  var target = gulp.src('./dev/html/htmlpre.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./dev/js/*.js', './dev/css/*.css'], {read: false});
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./dist/html/'));
});

var wiredep = require('wiredep').stream;
var mainBowerFiles = require('gulp-main-bower-files');
 
gulp.task('bowerAllTheThings', function(){
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles( ))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/libs'));
});

gulp.task('injectAllTheBower', function () {
  var target = gulp.src('./dev/html/htmlpre.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths: 
  var sources = gulp.src(['./dist/libs/*/*.js', './dist/libs/*/*.css'], {read: false});
 
  return target.pipe(inject(sources))
    .pipe(gulp.dest('./dist/html/'));
});

gulp.task("spsburgh", ["bowerAllTheThings", "injectAllTheBower"]);
gulp.task("optimize", ["css-optimize", "js-optimize"]);
gulp.task("buildSolution", ["clean", "optimize"]);