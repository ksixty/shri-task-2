'use strict';

const gulp = require('gulp'),
  path = require('path'),
  fs = require('fs'),
  del = require('del'),
  rename = require('gulp-rename'),
  gutil = require('gulp-util'),
  plumber = require('gulp-plumber'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  data = require('gulp-data'),
  cache = require('gulp-cached'),
  cachebust = require('gulp-cache-bust'),
  eslint = require('gulp-eslint'),
  babel = require("gulp-babel"),
  duration = require('gulp-duration'),
  runSequence = require('run-sequence'),
  clean = require('gulp-clean')

// Ресурсы проекта
const paths = {
  scripts: 'source/',
  js: './',
};

// Одноразовая сборка проекта
gulp.task('default', function() {
  gulp.src(paths.scripts + '*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(concat('mobControls.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js));
});