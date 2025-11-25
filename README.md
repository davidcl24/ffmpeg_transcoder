# FFMPEG Transcoder

A small BullMQ worker that transcodes .mp4 file to HLS.

To start the app:

* Run `npm install` to install dependencies 
* Run `npm run build` to transpile the TypeScript code to JavaScript
* Start the endpoint with `node ./dist/index.js`

The app will now be working and listening to the Redis queue