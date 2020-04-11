const ytdl = require('ytdl-core');
const yts = require('yt-search');
const getOne = require('./lib/get-one');
const getPlaylist = require('./lib/get-playlist');

let query = ''; // youtube link or search query
const playlist = false;

const run = async () => {
    if (!ytdl.validateURL(query)) {
        const result = await yts(query);
        if (playlist) {
            query = result.playlists[0].url;
        } else {
            query = result.videos[0].url;
        }
    }

    if (playlist) {
        getPlaylist(query);
    } else {
        getOne(query);
    }

    process.on('unhandledRejection', (error) => console.error('Uncaught Promise Rejection', error));
};

run();
