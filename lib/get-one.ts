/* eslint-disable no-bitwise */
import fs from 'fs-extra';
import ytdl from 'ytdl-core'
import { download } from './download';
import { Readable } from 'stream';

export const getOne = async (query: string) => {
    let info = null;
    try {
        info = await ytdl.getBasicInfo(query);
    } catch (error) {
        console.error(error);

        return;
    }

    const { title } = info;
    const stream: Readable = ytdl(query, { filter: 'audioonly',
        highWaterMark: 1 << 25 });

    await fs.ensureDir('music');
    try {
        download(stream, 'music', title);
    } catch (error) {
        console.error(error);
    }
};

