var path = require('path');

var ip = '192.168.1.8';
var port = '8889';

var cams = [
  { streamCam: 'cam1' },
  { streamCam: 'cam2' },
  { streamCam: 'cam3' },
  // { streamCam: 'cam4' },
  // { streamCam: 'cam5' },
  // { streamCam: 'cam6' },
];

var rtmpPort = 2035;
var streamDestFolder = 'd:/Projets/millenium_school/webcam/dist/';
var rtmpBaseUrl = `rtmp://${ip}:${rtmpPort}/live/`;

module.exports = {
  ip: ip,
  port: port,
  cams: cams,
  streamDestFolder: streamDestFolder,
  rtmpBaseUrl: rtmpBaseUrl,
};
