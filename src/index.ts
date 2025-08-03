import { Worker, Job } from "bullmq";

const worker = new Worker(
    'ffmpeg-conversion',
    async (job: Job) => {
        const { inputPath, outputFolder, resolutions, fileKey  } = job.data;

        //ejecutar el comando ffmpeg
    }
);