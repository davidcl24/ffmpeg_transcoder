import { Worker } from "bullmq";
const worker = new Worker('ffmpeg-conversion', async (job) => {
    const { inputPath, outputFolder, resolutions, fileKey } = job.data;
    //ejecutar el comando ffmpeg
});
