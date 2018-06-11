var gulp = require('gulp'); 
var babel = require('gulp-babel'); 
var livereload = require('gulp-livereload'); 


gulp.task('babel', function () {
    console.log('babel tasks has started'); 
    return gulp.src('src/**/*.js')
    .pipe(babel( {
        presets: ['es2015']
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload()); 
}); 

gulp.task('default', ['babel'], function () {
	console.log('Starting default task');
});

gulp.task('watch', ['default'], function () {
	console.log('Starting watch task');
	require('./dist/app.js');
	livereload.listen();
    gulp.watch('src/**/*.js', ['babel']);
});