import FFmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';

export const download = async (stream: Readable, path: string, title: string) => {
    return new Promise((resolve, reject) => {
        new (FFmpeg as any)({ source: stream })
            .on('error', (err: string) => {
                reject(err);
            })
            .on('end', () => {
                resolve(console.log(`${title} complete`));
            })
            .withAudioCodec('libmp3lame')
            .toFormat('mp3')
            .saveToFile(`${path}/${title}.mp3`);
    });
};
