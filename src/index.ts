import { Worker, Job } from "bullmq";
import { exec,  ExecException } from 'child_process';
import fs from 'fs';
import path from 'path';

const worker = new Worker(
    'ffmpeg-conversion',
    async (job: Job) => {
        const { inputPath, outputFolder, resolutions, fileKey  } = job.data;

        const cmd = `
        ffmpeg -i ${inputPath} \
        -filter_complex "
        [0:v]split=3[v1][v2][v3];
        [v1]scale=w=426:h=240[v1out];
        [v2]scale=w=854:h=480[v2out];
        [v3]scale=w=1280:h=720[v3out]
        " \
        -map [v1out] -map 0:a -c:v:0 libx264 -b:v:0 400k -c:a aac -b:a 128k -hls_time 10 -hls_playlist_type vod -hls_segment_filename ${outputFolder}/240p_%03d.ts ${outputFolder}/240p.m3u8 \
        -map [v2out] -map 0:a -c:v:1 libx264 -b:v:1 1000k -c:a aac -b:a 128k -hls_time 10 -hls_playlist_type vod -hls_segment_filename ${outputFolder}/480p_%03d.ts ${outputFolder}/480p.m3u8 \
        -map [v3out] -map 0:a -c:v:2 libx264 -b:v:2 2500k -c:a aac -b:a 128k -hls_time 10 -hls_playlist_type vod -hls_segment_filename ${outputFolder}/720p_%03d.ts ${outputFolder}/720p.m3u8
        `;
        
        exec(cmd, (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
            }
        });

        const masterPlaylist = `#EXTM3U
        #EXT-X-VERSION:3
        #EXT-X-STREAM-INF:BANDWIDTH=500000,RESOLUTION=426x240
        240p.m3u8
        #EXT-X-STREAM-INF:BANDWIDTH=1200000,RESOLUTION=854x480
        480p.m3u8
        #EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
        720p.m3u8
        `;

        fs.writeFileSync(path.join(outputFolder, 'master.m3u8'), masterPlaylist, 'utf8');
    }
);