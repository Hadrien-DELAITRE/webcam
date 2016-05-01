# webcam

## Requirements:

- gulp (`npm install -g gulp`)
- ffmpeg [ffmpeg windows install](http://taer-naguur.blogspot.fr/2013/09/compiling-x64x86-ffmpeg-with-fdk-aac-lib-on-64bit-windows-how-to.html)

You have to add ffmpeg folder in your path.
In order to serve RTMP stream, you can use OBS [OBS website](https://obsproject.com/)

## start RTMP and static file server:
`gulp start`

## start ffmpeg encoding from rtmp to HLS:
`gulp ffmpeg`

## build app:
`gulp build` or `gulp watch`
