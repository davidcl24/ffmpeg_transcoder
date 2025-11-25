# FFMPEG Transcoder

A small BullMQ worker that transcodes .mp4 file to HLS.

## Characteristics
* It connects to a Redis queue to know when to start a new job.
* It automatically runs an FFMPEG command that transcodes .mp4 files to HLS.

## Configuration
It uses environment variables to determine the redis host.
```
REDIS_HOST=localhost
REDIS_PORT=6389
```

## Setup
To start the app:

* Run `npm install` to install dependencies 
* Run `npm run build` to transpile the TypeScript code to JavaScript
* Start the app with `node ./dist/index.js`

The app will now be working and listening to the Redis queue