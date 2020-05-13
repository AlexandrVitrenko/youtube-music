import ytdl from 'ytdl-core'
import yts from 'yt-search';
import { getOne } from './lib/get-one';
import { getPlaylist } from './lib/get-playlist';

let query = 'ария 1100'; // youtube link or search query
const playlist = false;

const run = async () => {
    if (!ytdl.validateURL(query)) {
        const result = await yts(query);
        query = playlist ? result.playlists[0].url : result.videos[0].url;
    }

    if (playlist) {
        getPlaylist(query);
    } else {
        getOne(query);
    }

    process.on('unhandledRejection', (error) => console.error('Uncaught Promise Rejection', error));
};

run();
