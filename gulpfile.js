var _ = require('lodash');
var gulp = require('gulp');
var rename = require('gulp-rename');
var serve = require('gulp-serve');
var template = require('gulp-template');
var watch = require('gulp-watch');
var spawn = require('cross-spawn');
var runSequence = require('run-sequence');
var childProcess = require("child_process");

var config = require('./config');
var rtmpServer = require('./rtmp/server');

gulp.task('ffmpeg', (done) => {
  _.each(config.cams, (cam) => {
    var streamDestFileCam = `${config.streamDestFolder}${cam.streamCam}/${cam.streamCam}`;
    var streamDestFileSegments = `${config.streamDestFolder}${cam.streamCam}/segment%05d.ts`;
    var streamSourceUrl = `${config.rtmpBaseUrl}${cam.streamCam}`;
    console.log(`ffmpeg -re -i ${streamSourceUrl} -codec copy -map 0 -f segment -segment_list ${streamDestFileCam}.m3u8 -segment_time 10 -segment_list_type m3u8 -bsf:v h264_mp4toannexb ${streamDestFileSegments}`);
    var ffmpeg = childProcess.spawn("ffmpeg", [
        "-re",
        "-i", `${streamSourceUrl}`,
        "-map", "0:0",
        "-codec", "copy",
        "-f", "segment",
        "-segment_list", `${streamDestFileCam}.m3u8`,
        "-segment_time", "10",
        "-segment_wrap", "10",
        "-segment_list_type", "m3u8",
        "-bsf:v", "h264_mp4toannexb",
        `${streamDestFileSegments}`,
    ]);

    ffmpeg.stderr.on('data', (data) => {
      console.log(`[ffmpeg-${cam.streamCam}]: ${data}`);
    });

    ffmpeg.on('close', (code) => {
      console.log(`[ffmpeg-${cam.streamCam}]: child process exited with code ${code}`);
    });
  });
});

gulp.task('serve', serve({
  hostname: null,
  root: ['dist'],
  port: 8889,
  middleware: function(req, res, next) {
  // custom optional middleware
  res.setHeader('MIME-Type', 'application/x-mpegURL');
  next();
  }
}));

gulp.task('rtmp', (done) => {
  rtmpServer(done);
});

gulp.task('all', () =>
	gulp.src('src/all.html')
		.pipe(template({ ip: config.ip, port: config.port, cams: config.cams }))
		.pipe(gulp.dest('dist'))
);

gulp.task('build', _.map(config.cams, (cam) => `build${_.capitalize(cam.streamCam)}`).concat('all'), () =>
	gulp.src('src/webcams.html')
		.pipe(template({ ip: config.ip, port: config.port, cams: config.cams }))
		.pipe(gulp.dest('dist'))
);

_.each(config.cams, (cam) => {
  gulp.task(`build${_.capitalize(cam.streamCam)}`, () =>
  	gulp.src('src/webcam.html')
  		.pipe(template({ ip: config.ip, port: config.port, cam: cam }))
      .pipe(rename(`${cam.streamCam}.html`))
  		.pipe(gulp.dest(`dist/`))
  );
})

gulp.task('start', () => runSequence('build', 'rtmp', 'serve'));

gulp.task('watch', ['build'], () =>
  gulp.watch(['src/**/*', 'config/**/*'], ['build'])
);
