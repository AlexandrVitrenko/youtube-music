const FFmpeg = require('fluent-ffmpeg');

module.exports = async function download(stream, path, title) {
    return new Promise((resolve, reject) => {
        new FFmpeg({ source: stream })
            .on('error', (err) => {
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
