var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    concat          = require('gulp-concat'),
    uglifyjs        = require('gulp-uglifyjs'),
    cssnano         = require('gulp-cssnano'),
    rename          = require('gulp-rename'),
    autoPrefixer    = require('gulp-autoprefixer'),
    runSequence     = require('run-sequence'),
    rm              = require('gulp-rimraf'),
    cache           = require('gulp-cache'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    browserSync     = require('browser-sync');


// Очищаем папку с выхлопом
gulp.task('rm', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(rm());
});

gulp.task('flush-cache', function(){
    return cache.clearAll();
});

// Собираем стили
gulp.task('sass', ['csslibs'], function(){
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(autoPrefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css/'));
});

// Компилируем CSS разных библиотек в один файл и сжимаем его
gulp.task('csslibs', function(){
    return gulp.src([
            'app/libs/bootstrap4/dist/css/bootstrap.min.css',
            'app/libs/animate.css/animate.min.css'
        ])
        .pipe(concat('libs.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('./dist/css/'))
});

// Собираем JS
gulp.task('scripts', function(){
    return gulp.src([
            'app/libs/jquery/dist/jquery.min.js',
            'app/libs/bootstrap4/dist/js/bootstrap.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglifyjs())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('img', function(){
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync', function(){
    browserSync({
        server: 'dist'
    });
});

// билдим все
gulp.task('build', ['sass', 'scripts', 'img']);

// watch
gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/js/**/*.js', ['scripts']);
    gulp.watch('app/img/*', ['img']);
});

// default
gulp.task('default', function (callback) {
    runSequence('rm', 'build', 'browser-sync', 'watch', callback);
});