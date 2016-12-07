const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const cssBase64 = require('gulp-css-base64');
const notify = require("gulp-notify");
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const pump = require('pump');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssgrace = require('cssgrace');
const cssnext = require('cssnext');
const plumber = require('gulp-plumber');
const gulpSequence = require('gulp-sequence');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');

gulp.task('all', function (cb) {
    gulpSequence('html-staff','css-staff','js-staff','add-rev','revreplace', cb)
});

gulp.task('add-rev', function () {
    return gulp.src(["tmp/**/*.css", "tmp/**/*.js"])
        .pipe(rev())
        .pipe(gulp.dest('build'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build/map-json'))
        .pipe(notify({message: 'add-rev complete'}))
});

gulp.task("revreplace", function(){
    var manifest = gulp.src('build/map-json/rev-manifest.json');
    return gulp.src('build/**/*.html')
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest('build'))
        .pipe(notify({message: 'revreplace complete'}))
});

gulp.task('html-staff', function (cb) {
    gulpSequence('clean-html','htmlmin', cb)
});

gulp.task('css-staff', function (cb) {
    gulpSequence('clean-css','sass','imagemin','base64','minify-css', cb)
});

gulp.task('js-staff', function (cb) {
    gulpSequence('clean-scripts','babelify', 'js-uglify',cb)
});

/*htmlmin*/
gulp.task('htmlmin', ()=>
    gulp.src('src/views/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('tmp/views'))
        .pipe(gulp.dest('views'))
        .pipe(notify({message: 'htmlmin complete'}))
);

/*jsmin*/
gulp.task('js-uglify', (cb)=> {
    pump([
            gulp.src('tmp/**/*.js'),
            uglify(),
            gulp.dest('tmp'),
        ],
        cb
    )
    .pipe(notify({message: 'js-uglify complete'}))
});

/*cssmin*/
gulp.task('minify-css', ()=>
    gulp.src('tmp/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(sourcemaps.write({
            includeContent: false,
            sourceRoot: 'src'
        }))
        .pipe(gulp.dest('tmp'))
        .pipe(notify({message: 'minify-css complete'}))
);

/*babel+sourcemap*/
gulp.task('babelify', ()=>
    gulp.src('src/**/*.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'es2016', 'es2017', 'stage-3'],
            plugins: [["transform-runtime", {
                "polyfill": true,
                "regenerator": true
            }]]
        })).on('error', function (err) {
        console.log(err.stack);
        this.emit('end');
    }).pipe(sourcemaps.write({
        includeContent: false,
        sourceRoot: 'src'

    }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('tmp'))
        .pipe(notify({message: 'babel+sourcemap complete'}))
)

/*clean*/
gulp.task('clean-scripts', ()=>
    gulp.src(['tmp/public/**/*.js','public/*.js','!tmp/public/components/*.js','!public/components/*.js'], {read: false})
        .pipe(clean())
);

gulp.task('clean-css', ()=> {
    gulp.src(['tmp/public/**/*.css','public/*.css','!tmp/public/components/*.css','!public/components/*.css'], {read: false})
        .pipe(clean())
});

gulp.task('clean-html', ()=> {
    gulp.src(['tmp/views/*.html','views/*.html'], {read: false})
        .pipe(clean())
});

gulp.task('cleanStatic', ['clean-scripts', 'clean-css', 'clean-html'], ()=>
    notify({message: 'static files have been removed(cleaned)'})
);

/*package*/
gulp.task('scriptsPkg', ()=>
    gulp.src('src/scripts/*.js')
        .pipe(concat('scripts-aio.js'))
        .pipe(gulp.dest('build/scripts/'))
        .pipe(notify({message: 'scriptsPackage complete'}))
);

/*sass*/
gulp.task('sass', ()=> {
    var processors = [
        autoprefixer({
            browsers: ['last 3 version'],
            cascade: false,
            remove: false
        }),
        cssnext(),
        cssgrace
    ];
    return gulp.src('src/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write({
            includeContent: false,
            sourceRoot: 'src'
        }))
        .pipe(postcss(processors))
        .pipe(plumber.stop())
        .pipe(gulp.dest('tmp'))
        .pipe(notify({message: 'sass complete'}))
});

/*imagemin*/
gulp.task('imagemin', () =>
    gulp.src('src/**/*.{jpg,png,gif}')
        .pipe(imagemin())
        .pipe(gulp.dest('tmp'))
        .pipe(gulp.dest('build'))
        .pipe(notify({message: 'imagemin complete'}))
);

/*base64*/
gulp.task('base64', ()=>
    gulp.src('tmp/**/*.css')
        .pipe(cssBase64({
            // baseDir: "tmp/**/*.{jpg,png,gif}",
            maxWeightResource: 50 * 1024,
            extensionsAllowed: ['.gif', '.jpg', '.png']
        }))
        .pipe(gulp.dest('tmp'))
        .pipe(notify({message: 'base64 complete'}))
);

/*watch*/
gulp.task('watch', ()=>
    gulp.watch(['src/**/*.js'], ['babelify'])
);

gulp.task('default', ['all', 'watch'], ()=> {
    console.log('Task Default done');
});

// var gulp=require('gulp');
// var rev = require("gulp-rev");
// var revReplace = require("gulp-rev-replace");
// gulp.task("revision", function(){
//     return gulp.src(["tmp/**/*.css", "tmp/**/*.js"])
//         .pipe(rev())
//         .pipe(gulp.dest('tmp'))
//         .pipe(rev.manifest())
//         .pipe(gulp.dest('tmp'))
// });
//
// gulp.task("revreplace", ["revision"], function(){
//     var manifest = gulp.src("tmp/rev-manifest.json");
//
//     return gulp.src('tmp' + "/**/*.html")
//         .pipe(revReplace({manifest: manifest}))
//         .pipe(gulp.dest('tmp'));
// });