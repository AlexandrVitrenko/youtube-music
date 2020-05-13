/* eslint-disable no-bitwise */
import fs from 'fs-extra';
import ytdl from 'ytdl-core';
import axios from 'axios';
import shortid from 'shortid';
import cheerio from 'cheerio';
import { download } from './download';
import { getOne } from './get-one';
import ytlist from 'youtube-playlist';

export const getPlaylist = async (query: string) => {
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
    try {
        const { data } = await axios.get(query);
        const $ = cheerio.load(data);
        const thumb = $('a').filter((i, el: any) => {
            return $(el).attr('href').startsWith('/playlist');
        }).get();
        title = thumb[0].children[0].data;
    } catch (error) {
        title = shortid.generate();
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
