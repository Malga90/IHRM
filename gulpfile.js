const gulp = require('gulp');	
const sass = require('gulp-sass');	
const cleanCSS = require('gulp-clean-css');	
const concat = require('gulp-concat');	
const pump = require('pump');	
const uglify = require('gulp-uglify');	
const imagemin = require('gulp-imagemin');	
const rename = require('gulp-rename');	

gulp.task('sass', function() {
        return gulp.src('src/scss/**/*.scss')	    
        .pipe(sass())	    
        .pipe(gulp.dest('dist/css'))	    
        .pipe(cleanCSS())	    
        .pipe(rename({suffix: '.min'}))	    
        .pipe(gulp.dest('dist/css'))	
});	

gulp.task('concat', function() {	    
    return gulp.src('src/js/*.js')	    
    .pipe(concat('script.js'))	    
    .pipe(gulp.dest('dist/js'))	
});	

gulp.task('compress', function(cb) {	    
    pump([	        
        gulp.src('dist/js/script.js'),	        
        // uglify(),	        
        rename({suffix: '.min'}),	        
        gulp.dest('dist/js')	    
    ], cb);	
});	

gulp.task('images', function() {	    
    return gulp.src('src/img/*.*')	    
    .pipe(imagemin({optimizationLevel: 7, progressive: true}))	    
    .pipe(gulp.dest('dist/img'));	
});

gulp.task('watch', function() {	    
    gulp.watch('src/scss/**/*.scss', ['sass']);	    
    gulp.watch('src/js/*.js', ['concat']);	    
    gulp.watch('dist/js/*.js', ['compress']);	    
    gulp.watch('src/img/*.*', ['images']);	
});	

gulp.task('default', ['sass', 'concat', 'compress', 'images', 'watch']);