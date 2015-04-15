var gulp          = require('gulp');
var gutil         = require('gulp-util');
var less          = require('gulp-less');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var minifyHTML    = require('gulp-minify-html');
var jade          = require('gulp-jade');
var concat        = require('gulp-concat');
var path          = require('path');
var uglifyJS      = require('gulp-uglify');
var livereload    = require('gulp-livereload');
var tinylr        = require('tiny-lr');
var server        = tinylr();
var nodemon       = require('gulp-nodemon');
var jshint        = require('jshint');
var express       = require('express');
var app           = express();

gulp.task('jade', function() {

  gulp.src('./*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload(server));
});

gulp.task('uglifyJS', function() {

  gulp.src('./js/*.js')
  // .pipe(uglifyJS())
  .pipe(gulp.dest('./dist/'))
  .pipe(livereload(server));
});

gulp.task('sass', function() {

  var bannersAndLanding = ['./stylesheets/gallery.scss'];

  gulp.src(bannersAndLanding)
  .pipe(sass({ compress: true }).on('error', gutil.log))
  .pipe(concat('gallery.min.css'))
  .pipe(autoprefixer()) 
  .pipe(gulp.dest('./dist/'))
  .pipe(livereload(server));


});

gulp.task('less', function() {
  var widget = ['./stylesheets/widget.less'];

  gulp.src(widget)
  .pipe(less({ compress: true }).on('error', gutil.log))
  .pipe(concat('widget.min.css'))
  .pipe(autoprefixer()) 
  .pipe(gulp.dest('./dist/'))
  .pipe(livereload(server));

});

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint());
});

gulp.task('express', function() {
  nodemon({ 
    script: 'server.js', 
    ext: 'html js', 
    ignore: ['ignored.js'] 
  })
  .on('change', ['lint'])
  .on('restart', function () {
    console.log('Server Restarted!');
  });


  // if would like only static serving trough gulp
  //app.use(express.static(path.resolve('./dist')));

  //app.listen(1337);
  //gutil.log('Listening on port: 1337');
});


gulp.task('watch', function() {
  server.listen(35729, function(err) {
    if(err)
      return  console.log(err);

    gulp.watch('./*.jade', ['jade']);
    gulp.watch('./stylesheets/*.sass', ['sass']);
    gulp.watch('./stylesheets/*.scss', ['sass']);
    gulp.watch('./stylesheets/*.less', ['less']);
    gulp.watch('./js/*.js', ['uglifyJS']);
  });
});


gulp.task('default', ['jade', 'sass', 'less',  'uglifyJS', 'express', 'watch']); 

