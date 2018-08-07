var gulp = require('gulp'),
    sass = require('gulp-sass');

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.sass')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', function(){
    return gulp.watch('app/scss/**/*.sass', ['sass']);
});