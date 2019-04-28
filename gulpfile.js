var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var combiner = require('stream-combiner2');
var ts = require("gulp-typescript");

// Compiles SCSS files from /scss into /css
gulp.task('sass', function () {
	return gulp.src('public/scss/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Compile LESS files from /less into /css
gulp.task('less', function () {
	var combined = combiner.obj([
		gulp.src(['public/less/*.less'])
		.pipe(less({
			paths: ['.']
		}))
		// .pipe(cleanCSS({
		// 	compatibility: 'ie8'
		// }))
		// .pipe(rename({
		// 	suffix: '.min'
		// }))
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
	]);

	combined.on('error', console.error.bind(console));
	return combined;
});

// Minify compiled CSS
gulp.task('minify-css', ['less', 'sass'], function () {
	return gulp.src(['public/css/*.css', '!public/css/*.min.css'])
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// Minify JS
gulp.task('minify-js', function () {
	return gulp.src(['public/js/*.js', '!public/js/*.min.js'])
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('public/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('minify', ['minify-js', 'minify-css']);

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function () {

	// gulp.src(['bower_components/ionicons/*/*', '!**/src/*', '!**/less/*', '!**/scss/*'])
	// 	.pipe(gulp.dest('public/vendor/ionicons'));

	gulp.src(['bower_components/fastclick/lib/*'])
		.pipe(gulp.dest('public/vendor/fastclick'));

	// gulp.src(['bower_components/chartjs/dist/*'])
	// 	.pipe(gulp.dest('public/vendor/chartjs'));

	// gulp.src(['bower_components/jvectormap/*/*',
	// 	'bower_components/jvectormap/jquery.jvectormap.min.js',
	// 	'bower_components/jvectormap/jquery.jvectormap.css',
	// 	'bower_components/jvectormap/jquery.jvectormap.js',
	// 	'bower_components/jvectormap/jquery.jvectormap.json'
	// ]).pipe(gulp.dest('public/vendor/jvectormap'));

	// gulp.src(['bower_components/jvectormap-maps/jquery-jvectormap-world-mill.js'])
	// 	.pipe(gulp.dest('public/vendor/jvectormap'));

	// gulp.src(['bower_components/jquery.slimscroll/jquery.slimscroll.min.js'])
	// 	.pipe(gulp.dest('public/vendor/slimscroll'));

	// gulp.src(['bower_components/jquery.sparkline.bower/dist/jquery.sparkline.min.js'])
	// 	.pipe(gulp.dest('public/vendor/sparkline'));

	// gulp.src(['bower_components/bootstrap/dist/**/*',
	// 	'!**/npm.js', '!**/bootstrap-theme.*'
	// ]).pipe(gulp.dest('public/vendor/bootstrap'));

	gulp.src(['bower_components/bootstrap-social/*.css',
		'bower_components/bootstrap-social/*.less',
		'bower_components/bootstrap-social/*.scss'
	]).pipe(gulp.dest('public/vendor/bootstrap-social'));

	// gulp.src(['bower_components/flot/*.js'])
	// 	.pipe(gulp.dest('public/vendor/flot'));

	// gulp.src(['bower_components/flot.tooltip/js/*.js'])
	// 	.pipe(gulp.dest('public/vendor/flot-tooltip'));

	gulp.src(['bower_components/font-awesome/**/*',
		'!bower_components/font-awesome/*.json',
		'!bower_components/font-awesome/.*'
	]).pipe(gulp.dest('public/vendor/font-awesome'));

	gulp.src(['bower_components/font-awesome/fonts/**/*'])
		.pipe(gulp.dest('public/font/fa/'));

	// gulp.src(['bower_components/jquery/dist/jquery.js',
	// 	'bower_components/jquery/dist/jquery.min.js'
	// ]).pipe(gulp.dest('public/vendor/jquery'));

	gulp.src(['bower_components/tether/dist/js/*.js'])
		.pipe(gulp.dest('public/vendor/tether'))

	// gulp.src(['bower_components/metisMenu/dist/*'])
	// 	.pipe(gulp.dest('public/vendor/metisMenu'));

	// gulp.src(['bower_components/morrisjs/*.js', 'bower_components/morrisjs/*.css', '!bower_components/morrisjs/Gruntfile.js'])
	// 	.pipe(gulp.dest('public/vendor/morrisjs'));

	// gulp.src(['bower_components/raphael/raphael.js', 'bower_components/raphael/raphael.min.js'])
	// 	.pipe(gulp.dest('public/vendor/raphael'));

	// gulp.src(['bower_components/simple-line-icons/*/*'])
	// 	.pipe(gulp.dest('public/vendor/simple-line-icons'));

	// gulp.src(['bower_components/jquery-easing-original/jquery.easing.min.js',
	// 	'bower_components/jquery-easing-original/jquery.easing.js',
	// 	'bower_components/jquery-easing-original/jquery.easing.compatibility.js',
	// ]).pipe(gulp.dest('public/vendor/jquery-easing-original'));

	gulp.src(['bower_components/MDBootstrap/*/**/*', ])
		.pipe(gulp.dest('public/vendor/mdbootstrap'));

	gulp.src(['bower_components/MDBootstrap/font/**/*'])
		.pipe(gulp.dest('public/font/'));

	gulp.src(['bower_components/toastr/*.min.*'])
		.pipe(gulp.dest('public/vendor/toastr/'));

	gulp.src(['bower_components/moment/min/moment.min.js'])
		.pipe(gulp.dest('public/vendor/moment/'));
});

// Run everything
gulp.task('default', ['minify-css', 'minify-js', 'copy', 'tsc']);

var tsProject = ts.createProject("tsconfig.json");
gulp.task("tsc", function () {
	return tsProject.src()
		.pipe(tsProject())
		.js.pipe(gulp.dest("dist"));
});

// Configure the browserSync task
gulp.task('browserSync', function () {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
		browser: "google chrome",
		port: 3001,
	});
});

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js', 'tsc'], function () {
	process.env.dev = true;
	gulp.watch('public/less/*.less', ['less']);
	gulp.watch('public/css/*.css', ['minify-css']);
	gulp.watch('public/js/*.js', ['minify-js']);
	gulp.watch(['**/*.ts', '!public/**/*.ts'], ['tsc']);
	// Reloads the browser whenever HTML or JS files change
	gulp.watch('public/view/**/*.html', browserSync.reload);
	gulp.watch('public/js/**/*.js', browserSync.reload);
	gulp.watch('public/app/**/*.js', browserSync.reload);
});