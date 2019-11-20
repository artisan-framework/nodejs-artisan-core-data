var gulp = require('gulp');
var dts = require('dts-generator').default;
var ts = require('gulp-typescript');
var tslint = require('gulp-tslint');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('compile:clean', function() {
   return gulp.src(['./index.d.ts', 'lib/'], { read: false, allowEmpty: true })
      .pipe(clean());
});

gulp.task('compile:copyStaticAssets', function() {
   return gulp.src(['./src/**/*', '!./**/*.ts'])
      .pipe(gulp.dest('lib'));
});

gulp.task('compile:ts', function() {
   return tsProject.src()
        .pipe(plumber({
            errorHandler: function (err) {
               this.emit('end');
            }
         }))
        .pipe(tsProject())
        .pipe(gulp.dest('lib'));
});

gulp.task('compile:ts:lint', function() {
   const program = require('tslint').Linter.createProgram('./tsconfig.json');

   return gulp.src('src/**/*.ts')
        .pipe(plumber({
            errorHandler: function (err) {
               this.emit('end');
            }
         }))
        .pipe(tslint({
           formatter: "verbose",
           tslint: require('tslint'),
           program
        }))
        .pipe(tslint.report());
});

gulp.task('compile:dts', function() {
   return dts({
      prefix: `${ require('./package.json').name }/lib`,
      project: '.',
      out: 'index.d.ts',
      indent: '   '
   })
});

gulp.task('default',
   gulp.series(
      'compile:clean',
      gulp.parallel(
         'compile:copyStaticAssets',
         'compile:ts:lint',
         'compile:ts',
         'compile:dts'
      )
   )
);

gulp.task('watch',
   gulp.series(
      'default',
      function() {
         gulp.watch(['./src/**/*'], 'default');
      }
   )
);
