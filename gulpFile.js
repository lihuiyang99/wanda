var gulp = require('gulp'),
	connect = require('gulp-connect'), //配置webserver
	concat = require('gulp-concat'), //合并js
	clean = require('gulp-clean'), //清理无用的文件和文件夹
	less = require('gulp-less'), //将less预处理为css
	csso = require('gulp-csso'), //css压缩
	uglify = require('gulp-uglify'), //js压缩
	imagemin = require('gulp-imagemin'), //图片压缩
	pngcrush = require('imagemin-pngcrush'),
	sourceMaps = require('gulp-sourcemaps'); //处理JS时，生成SourceMap

var webServerRoot = 'dist/',
	appName = 'mr-app',
	appJsPath = webServerRoot + 'asset/js/',
	appImgPath = webServerRoot + 'asset/img/',
	appJsName = appName + '.js',
	appCssPath = webServerRoot + 'asset/css/',
	appPlugPath = webServerRoot + 'asset/plug/';

gulp.task('default', ['build-dev', 'webserver', 'watch']);
gulp.task('build-dev', ['build-html-dev','build-less-dev', 'build-jsApp-dev', 'build-js-dev', 'build-img-dev','copy-reset', 'copy-plug']);


gulp.task('webserver', ['build-dev'], function() {
	connect.server({
		root: webServerRoot,
		port: 82,
		debug: true,
		livereload: true
	});
});

//html
gulp.task('build-html-dev', ['clean-html'], function() {
	return gulp.src("src/**/*.html")
		.pipe(gulp.dest(webServerRoot))
		.pipe(connect.reload())
});

gulp.task('clean-html', function() {
	return gulp.src(webServerRoot + '*.html')
		.pipe(clean())
		.pipe(connect.reload())
});

//less
gulp.task('build-less-dev', ['clean-style'], function() {
	return gulp.src('src/**/*.less')
		.pipe(sourceMaps.init())
		.pipe(less())
		.pipe(concat('style.css'))
		/*.pipe(csso())*/
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appCssPath))
		.pipe(connect.reload())
});

gulp.task('clean-style', function() {
	return gulp.src(appCssPath+"style.css")
		.pipe(clean())
});

gulp.task('clean-maps', function() {
	return gulp.src(webServerRoot + 'maps')
		.pipe(clean())
});

//js
gulp.task('build-jsApp-dev', ['clean-jsApp'], function() {
	return gulp.src([
			'src/asset/js/jquery-1.10.2.min.js',
			'src/asset/js/common.js',
		])
		.pipe(sourceMaps.init())
		.pipe(concat(appJsName))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appJsPath))
		.pipe(connect.reload())
});
gulp.task('clean-jsApp', function() {
	return gulp.src(appJsPath+appJsName)
		.pipe(clean())
});
gulp.task('build-js-dev', ['clean-js'], function() {
	return gulp.src('src/asset/js/js*.js')
		.pipe(sourceMaps.init())
		.pipe(concat("js.js"))
		.pipe(sourceMaps.write('../maps'))
		.pipe(gulp.dest(appJsPath))
		.pipe(connect.reload())
});

gulp.task('clean-js', function() {
	return gulp.src(appJsPath+"js.js")
		.pipe(clean())
});

// img
gulp.task('build-img-dev', ['clean-image'], function() {
	gulp.src('src/asset/img/**/*.*')
		.pipe(gulp.dest(appImgPath))
		.pipe(connect.reload())
});
//img( 压缩图片 )
gulp.task('imgmin', ['clean-image'], function() {
	return gulp.src('src/asset/img/**/*.*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngcrush()]
		}))
		.pipe(gulp.dest(appImgPath))
		//.pipe(notify({ message: 'img task ok' }));//缺少gulp-notif,暂不需要
});
gulp.task('clean-image', function() {
	return gulp.src(appImgPath)
		.pipe(clean())
});
//copy-reset
gulp.task('copy-reset', ['clean-reset'], function() {
	gulp.src(['src/asset/css/reset.css'])
		.pipe(gulp.dest(appCssPath))
		.pipe(connect.reload())
});
gulp.task('clean-reset', function() {
	return gulp.src(appCssPath+'reset.css')
		.pipe(clean())
});
//copy-plug
gulp.task('copy-plug', ['clean-plug'], function() {
	gulp.src(['src/asset/plug/**/*'])
		.pipe(gulp.dest(appPlugPath))
		.pipe(connect.reload())
});
gulp.task('clean-plug', function() {
	return gulp.src(appPlugPath)
		.pipe(clean())
});

gulp.task('watch', function() {
	gulp.watch('src/**/*.html', ['build-html-dev']);
	gulp.watch('src/**/*.less', ['build-less-dev']);
	gulp.watch('src/asset/css/reset.css', ['copy-reset']);
	gulp.watch(['src/**/common.js'], ['build-jsApp-dev']);
	gulp.watch(['src/**/js*.js'], ['build-js-dev']);
	gulp.watch('src/asset/img/**/*.*', ['build-img-dev']);
	gulp.watch('src/asset/plug/**/*.*', ['copy-plug']);
});