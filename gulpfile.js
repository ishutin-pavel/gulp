/*--------------------------------------------------------------
# Задачи
----------------------------------------------------------------
- собрать scss из папки blocks/ и положить в sass/_blocks.scss
- собрать js файлы из папки blocks/ и объединить с common.js
- перезагрузка сайта при изменении в файлах

/*--------------------------------------------------------------
# Install
----------------------------------------------------------------
https://gulpjs.com/
npm install gulp --save-dev

https://www.npmjs.com/package/gulp-sass
npm install node-sass gulp-sass --save-dev

https://www.npmjs.com/package/gulp-sourcemaps
npm install gulp-sourcemaps --save-dev

https://www.npmjs.com/package/gulp-concat
npm install gulp-concat --save-dev

https://www.npmjs.com/package/browser-sync
npm install browser-sync --save-dev

https://www.npmjs.com/package/autoprefixer
npm install autoprefixer --save-dev

*/
'use strict';

/*
 * Мои переменные
 */
//Локальный домен
const domain = 'kolodec-ot-mastera.rf';
//Папка с темой
const themename = 'primaria';
// Name of working theme folder
const root = '../' + themename + '/',
      scss = root + 'sass/',
      js = root + 'js/';

/*
 * Gulp
 */
const { dest, src, series, parallel, watch } = require('gulp');
const gulp = require('gulp');

/*
 * Плагины
 */
const concat = require('gulp-concat');
const sass = require('gulp-sass');
      sass.compiler = require('node-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

// Собираем SASS со всех блоков blocks/**/*.scss -> _blocks.scss
function taskSassBlock(cb) {
  return gulp.src(root + 'blocks/**/*.scss')
    .pipe(concat('_blocks.scss'))
    .pipe(gulp.dest(scss));
  cb();
}

// SASS
const taskSass = function(cb) {
  return gulp.src(scss + 'style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      //outputStyle: 'compressed',
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(scss + 'maps'))
    .pipe(gulp.dest(root))
    .pipe(browserSync.stream()); //Injecting css into browser
  cb();
}

// JavaScript
const taskJs = function(cb) {
  return src([
    js + 'common.js',
    root + 'blocks/**/*.js'
  ])
  .pipe(concat('main.js'))
  .pipe(gulp.dest(js));
  cb();
}

const reload = function(cb) {
  browserSync.reload();
  cb();
}


/*
 * Сервер
 */
const server = function() {
  browserSync.init({
      open: 'external',
      proxy: domain,
      port: 8080
  });
  watch(root + 'blocks/**/*.scss', taskSassBlock );
  watch(scss + '**/*.scss', taskSass );
  watch([root + '**/*.js', '!' + js + 'main.js'], series( taskJs, reload ) );
  watch(root + '**/*.php', reload );
}


exports.default = server;
