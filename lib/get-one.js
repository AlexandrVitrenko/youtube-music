/* eslint-disable no-bitwise */
const fs = require('fs-extra');
const ytdl = require('ytdl-core');
const download = require('./download');

module.exports = async function getOne(query) {
    let info = null;
    try {
        info = await ytdl.getBasicInfo(query);
    } catch (error) {
        console.log(error);

        return;
    }

    const { title } = info;

    const stream = ytdl(query, { filter: 'audioonly',
        highWaterMark: 1 << 25 });

    const path = 'music';
    await fs.ensureDir(path);
    try {
        download(stream, path, title);
    } catch (error) {
        console.log(error);
    }
};
