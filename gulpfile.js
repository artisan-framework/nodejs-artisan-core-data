var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var clean = require('gulp-clean');

var tsProject = ts.createProject('./tsconfig.json', {
   typescript: require('typescript')
});

gulp.task('default', ['compile:tsc']);
gulp.task('clean', ['compile:clean']);

gulp.task('compile:tsc', function () {
   return gulp.src('lib/**/*.ts')
      .pipe(ts(tsProject))
      .pipe(babel({
         presets: ['es2015']
      }))
      .pipe(gulp.dest('dist'));
});

gulp.task('compile:clean', function () {
   return gulp.src([ 'dist' ])
      .pipe(clean({ read: false }));
});