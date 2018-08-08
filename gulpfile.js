var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    concat          = require('gulp-concat'),
    uglifyjs        = require('gulp-uglifyjs'),
    cssnano         = require('gulp-cssnano'),
    rename          = require('gulp-rename'),
    autoPrefixer    = require('gulp-autoprefixer'),
    rm              = require('gulp-rimraf'),
    browserSync     = require('browser-sync');


// Очищаем папку с выхлопом
gulp.task('rm', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(rm());
});

gulp.task('sass', function(){
    return gulp.src('app/scss/**/*.sass')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function(){
    return gulp.src([
            'app/libs/jquery/dist/jquery.min.js',
            'app/libs/bootstrap4/dist/js/bootstrap.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglifyjs())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('default', ['rm', 'browser-sync', 'sass', 'scripts'], function(){
    gulp.watch('app/scss/**/*.sass', ['sass']);
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});