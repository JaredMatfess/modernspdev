//Load gulp
var gulp = require('gulp');

//Load gulp plugins
var concat = require('gulp-concat'); //bundle
var uglify = require('gulp-uglify'); //minify
var rename = require('gulp-rename'); //renaming to min
var spsave = require('gulp-spsave'); //upload to SharePoint

//Bundle JS files together into a single file
gulp.task('concat-js', function () {
    return gulp.src("./Scripts/**/*.js")
    .pipe(concat("GulpDemo.js"))
    .pipe(gulp.dest("./Output"))
});

//Minify the GulpDemo.js file. This task has a dependency on concat-js which means concat-js will always run before minify-js
gulp.task('minify-js', ['concat-js'], function () {
    return gulp.src("./Output/GulpDemo.js")
    .pipe(uglify())
    .pipe(rename({ suffix: '.min'}))
    .pipe(gulp.dest("./Output"))
});

//Upload GulpDemo.js and GulpDemo.min.js files to SharePoint. This task has a dependency on minify-js which means minify-js will always run before upload-to-sp
gulp.task('upload-to-sp', ['minify-js'], function () {
    return gulp.src("./Output/*.js")
      .pipe(spsave({
          username: "dev@yourtenant.onmicrosoft.com",
          password: "Password",
          siteUrl: "https://yourtenant.sharepoint.com/sites/dev/",
          folder: "Style Library/My Folder",
          checkin: true,
          checkinType: 1
      }));
});

//Watcher task. This will watch for any changes in the scenario1.js and scenario2.js files and then run the upload-to-sp task.
gulp.task('watch-js-upload-to-sp', function () {
    return gulp.watch("./Scripts/**/*.js", ['upload-to-sp']);
});