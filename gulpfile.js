var _ = require('lodash');
var gulp = require('gulp');
var serve = require('gulp-serve');
var template = require('gulp-template');
var watch = require('gulp-watch');
var spawn = require('cross-spawn');
var runSequence = require('run-sequence');
var childProcess = require("child_process");

var config = require('./config');
var rtmpServer = require('./rtmp/server');

var rtmpPort = 2035;
var streamDestfolder = 'd:/Projets/millenium_school/webcam/dist/';
var rtmpBaseUrl = `rtmp://${config.ip}:${rtmpPort}/live/`;

gulp.task('ffmpeg', (done) => {
  _.each(config.cams, (cam) => {
    var streamDestFileCam = `${streamDestfolder}${cam.streamCam}/${cam.streamCam}`;
    var streamDestFileSegments = `${streamDestfolder}${cam.streamCam}/segment%05d.ts`;
    var streamSourceUrl = `${rtmpBaseUrl}${cam.streamCam}`;
    console.log(`ffmpeg -re -i ${streamSourceUrl} -codec copy -map 0 -f segment -segment_list ${streamDestFileCam}.m3u8 -segment_time 10 -segment_list_type m3u8 -bsf:v h264_mp4toannexb ${streamDestFileSegments}`);
    var ffmpeg = childProcess.spawn("ffmpeg", [
        "-re",
        "-i", `${streamSourceUrl}`,
        "-map", "0:0",
        "-codec", "copy",
        "-f", "segment",
        "-segment_list", `${streamDestFileCam}.m3u8`,
        "-segment_time", "10",
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

gulp.task('build', () =>
	gulp.src('src/webcams.html')
		.pipe(template({ ip: config.ip, port: config.port, cams: config.cams }))
		.pipe(gulp.dest('dist'))
);

gulp.task('start', () => runSequence('build', 'rtmp', 'serve'));

gulp.task('watch', ['build'], () =>
  gulp.watch(['src/**/*', 'config/**/*'], ['build'])
);
