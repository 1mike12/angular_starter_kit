var devDir = "dev/";
var publicDir = "public/";

var sassFiles = devDir + "styles/*.scss";
var cssDir = devDir + "styles/";
var angularFiles = [devDir + "angular/**/*.js"];
var scripts = devDir + "scripts/**/*.js";

var gulp = require('gulp');
var util = require("gulp-util"); //for util.log()
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

gulp.task('sass', function () {
    return gulp.src(sassFiles)
        .pipe(plugins.sass()
            .on('error', plugins.sass.logError))
        .pipe(gulp.dest(cssDir))
        .pipe(plugins.livereload());
});

gulp.task('scripts', function () {
    return gulp.src(scripts)
        .pipe(plugins.concat("compiled.js"))
        .pipe(gulp.dest("scripts"))
        .pipe(plugins.livereload());
});

gulp.task('angular', function () {
    return gulp.src(angularFiles)
        .pipe(plugins.concat("angularCompiled.js"))
        .pipe(gulp.dest("scripts"))
        .pipe(plugins.livereload());
});

gulp.task('watch', function () {
    plugins.livereload.listen();
    gulp.watch(sassFiles, ['sass']);
    gulp.watch(angularFiles, ["angular"]);
    gulp.watch(scripts, ["scripts"]);
});

gulp.task('lib', function () {
    var filesArray = plugins.mainBowerFiles({includeDev: true});
    var jsFilter = plugins.filter('*.js');
    var cssFilter = plugins.filter('*.css');
    var fontFilter = plugins.filter(['*.eot', '*.woff', '*.woff2', '*.svg', '*.ttf']);
    gulp.src(filesArray)
        .pipe(jsFilter)
        .pipe(plugins.concat('compiled.js'))
        .pipe(gulp.dest('lib/scripts'))
        .pipe(jsFilter.restore())

        //css part
        .pipe(cssFilter)
        .pipe(plugins.concat("compiled.css"))
        .pipe(gulp.dest('lib/css'))
        .pipe(cssFilter.restore())

        //vendor
        .pipe(fontFilter)
        .pipe(plugins.flatten())
        .pipe(gulp.dest("lib/fonts"))
});