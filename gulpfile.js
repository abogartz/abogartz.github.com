var gulp = require('gulp');
var $ = require('gulp-load-plugins')({pattern: '*'});

gulp.task('compileVendorJS', function () {
    return gulp.src($.mainBowerFiles({filter: "**/*.js"}))
        .pipe($.filelog())
        .pipe($.concat('vendor.js'))
        .pipe(gulp.dest('./lib'))
        .pipe($.notify({message: 'Vendor JS compiled!'}));
});