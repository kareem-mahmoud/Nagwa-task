// -----------------important runner--------------------
const { src, dest, lastRun, watch, series } = require('gulp');
const htmlmin = require('gulp-html-minifier');
const sass = require('gulp-sass')(require('sass'));
const CleanCss = require('gulp-clean-css');
const img = require('gulp-image');
const minify = require('gulp-minify');
const iconMini = require('gulp-fa-minify');
const bSync = require('browser-sync').create();


// html file
function HTMLFile() {
    return src('*.html',{ since: lastRun(HTMLFile) })
           .pipe(htmlmin({collapseWhitespace: true}))
           .pipe(dest('./Production'));
}
// style file
function style() {
    return src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(CleanCss({compatibility: 'ie8'}))
    .pipe(dest('./Production/css'));
}
// images
function images() {
    return src('./images/**/*', { since: lastRun(images) }).pipe(img()).pipe(dest('./Production/images'));
}
//  javaScript
function js() {
    return src('./main-script.js').pipe(minify()).pipe(dest('./Production/js'));
}


//  javaScript
function bootstrap() {
    return src('./node_modules/bootstrap/dist/js/bootstrap.bundle.js').pipe(minify()).pipe(dest('./Production/js'));
}
// jquery
function jquery() {
    return src('./node_modules/jquery/dist/jquery.js').pipe(minify()).pipe(dest('./Production/js'));
}
// javaScript fonts
function jsF() {
    return src('./node_modules/@fortawesome/fontawesome-free/js/all.js')
            .pipe(iconMini({
                fas: ['paper-plane','blog','chevron-down','home','map-marker-alt','external-link-square-alt','shield-alt','map','phone'],
                fab: ['youtube','facebook-f','google','instagram','linkedin-in','twitter','yahoo','yelp','foursquare']
            }))
            .pipe(minify())
            .pipe(dest('./Production/js'));
}
  


function watchFile() {
    bSync.init({
        server: {
            baseDir: "./"
        }
    });
    watch(['*.html','./sass/**/*.scss','./images/**/*','./main-script.js',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.js','./node_modules/jquery/dist/jquery.js',
    './node_modules/@fortawesome/fontawesome-free/js/all.js'], 
    series(HTMLFile,style,images,js,bootstrap,jquery,jsF)).on('change', bSync.reload);
}

module.exports = {watchFile,HTMLFile,style,images,js,bootstrap,jquery,jsF};
