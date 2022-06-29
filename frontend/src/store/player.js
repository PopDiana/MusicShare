export const START_SONG = 'player/START_SONG';
export const PAUSE_SONG = 'player/PAUSE_SONG';
export const PLAY_SONG = 'player/PLAY_SONG';
export const PLAY_PLAYLIST = 'player/PLAY_PLAYLISTS';
export const UPDATE_SONG_INDEX = 'player/UPDATE_SONG_INDEX';
export const SHUFFLE = 'player/SHUFFLE';

export const startSong = (song) => ({
    type: START_SONG,
    song
});

export const playPlaylist = (songs, songIndex, playlistId) => ({
    type: PLAY_PLAYLIST,
    songs,
    songIndex,
    playlistId,
});

export const updateSongIndex = (songIndex) => ({
    type: UPDATE_SONG_INDEX,
    songIndex
});

export const pauseSong = () => ({
    type: PAUSE_SONG,
});

export const playSong = () => ({
    type: PLAY_SONG,
});


export const shufflePlaylist = () => ({
    type: SHUFFLE,
});

let newState = {
    songs: [],
    songIndex: 0,
    songId: 0,
    playlistId: 0,
    isPlaying: false,
    shuffle: false,
};

const playerReducer = (state = {}, action) => {
    switch (action.type) {
        case START_SONG:
            newState = { ...state, songs: [action.song], songIndex: 0, songId: action.song?.id, playlistId: 0, isPlaying: true, shuffle: false};
            return newState;
        case PLAY_PLAYLIST:        
            newState = { ...state, songs: action.songs, songIndex: action.songIndex, songId: action.songs[action.songIndex]?.id, playlistId: action.playlistId, isPlaying: true, shuffle: false};
            return newState;
        case UPDATE_SONG_INDEX:
            newState = { ...state, songIndex: action.songIndex, songId: state.songs[action.songIndex]?.id, isPlaying: true};
            return newState;
        case PAUSE_SONG:
            newState = { ...state, isPlaying: false};
            return newState;
        case PLAY_SONG:
            newState = { ...state, isPlaying: true};
            return newState;
        case SHUFFLE:
            newState = { ...state, shuffle: true};
            return newState;
        default:
            return state;
    }
};

export default playerReducer;
