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
        console.log(error);

        return;
    }

    const { title } = info;

    const stream: Readable = ytdl(query, { filter: 'audioonly',
        highWaterMark: 1 << 25 });

    const path = 'music';
    await fs.ensureDir(path);
    try {
        download(stream, path, title);
    } catch (error) {
        console.log(error);
    }
};

