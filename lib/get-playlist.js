/* eslint-disable no-bitwise */
const fs = require('fs-extra');
const ytdl = require('ytdl-core');
const axios = require('axios');
const shortid = require('shortid');
const cheerio = require('cheerio');
const download = require('./download');
const getOne = require('./get-one');
const ytlist = require('youtube-playlist');

module.exports = async function getPlaylist(query) {
    let list = null;
    try {
        list = await ytlist(query, ['name', 'url']);
    } catch (error) {
        console.log('this is not a playlist');
        getOne(query);
    }

    const { playlist } = list.data;
    if (!playlist || playlist.length === 0) {
        console.log('the playlist is empty', query);

        return;
    }

    let title = null;
    if (!title) {
        try {
            const page = await axios.get(query);
            const $ = cheerio.load(page.data);
            const thumb = $('a').filter((i, el) => {
                return $(el).attr('href').startsWith('/playlist');
            }).get();
            title = thumb[0].children[0].data;
        } catch (error) {
            title = shortid.generate();
        }
    }

    const path = `music/${title}`;
    await fs.ensureDir(path);

    for (const element of playlist) {
        const { url } = element;
        const name =  element.name.replace('/', '');

        try {
            await ytdl.getInfo(url);
        } catch (error) {
            continue;
        }

        const stream = ytdl(url, { filter: 'audioonly',
            highWaterMark: 1 << 25 });

        try {
            download(stream, path, name);
        } catch (error) {
            console.log(error);
        }
    }
};
