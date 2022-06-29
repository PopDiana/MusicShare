import {fetch} from './fetch';

export const GET_SONGS = 'songs/GET_SONGS';
export const GET_SONG = 'songs/GET_SONG'
export const CREATE_SONG = 'songs/CREATE_SONG';
export const UPDATE_SONG = 'songs/UPDATE_SONG';
export const DELETE_SONG = 'songs/DELETE_SONG';

const loadSongs = (list) => ({
    type: GET_SONGS,
    list
});

const loadSong = (song) => ({
    type: GET_SONG,
    song
});

const addSong = (song) => ({
    type: CREATE_SONG,
    song
});

const updateSong = (song) => ({
    type: UPDATE_SONG,
    song
});

const removeSong = (id) => ({
    type: DELETE_SONG,
    id
});

export const getAllSongs = () => async (dispatch) => {
    const res = await fetch('/api/songs');

    if (res.ok) {
        const list = await res.json();
        dispatch(loadSongs(list.songs));
    }
};

export const getSong = (songId) => async (dispatch) => {
    const res = await fetch(`/api/songs/${songId}`);

    if (res.ok) {
        const song = await res.json();
        dispatch(loadSong(song.song));
    }
};

export const createSong = (data) => async (dispatch) => {
    const res = await fetch('/api/songs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const song = await res.json();
        dispatch(addSong(song));

        return song;
    }
};

export const editSong = (data) => async (dispatch) => {
    const res = await fetch(`/api/songs/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const song = await res.json();
        dispatch(updateSong(song));
        return res;
    }
};

export const addToPlaylist = (data) => async (dispatch) => {
    const res = await fetch(`/api/songs/addToPlaylist`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const song = await res.json();
        dispatch(updateSong(song));
        return res;
    }
};

export const deleteSong = (id) => async (dispatch) => {
    const res = await fetch(`/api/songs/${id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(removeSong(id));
    }
};

export const likeSong = (id, userId) => async (dispatch) => {
    const res = await fetch(`/api/songs/like/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId :userId})
    });

    if (res.ok) {
        const song = await res.json();
        dispatch(updateSong(song));
        return res;
    }
};

export const unlikeSong = (id, userId) => async (dispatch) => {
    const res = await fetch(`/api/songs/unlike/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId :userId})
    });

    if (res.ok) {
        const song = await res.json();
        dispatch(updateSong(song));
        return res;
    }
};


export const increasePlays = (id) => async (dispatch) => {
    const res = await fetch(`/api/songs/played`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
    });

    if (res.ok) {
        const song = await res.json();
        dispatch(updateSong(song));
        return res;
    }
};

let newState = {};

const songsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_SONGS:
            newState = {...state};
            action.list.forEach((song) => {
                newState[song.id] = song;
            });
            return newState;
        case GET_SONG:
            return {
                ...state,
                [action.song.id]: action.song
            }
        case CREATE_SONG:
            return {
                ...state,
                [action.song.newSong.id]: action.song.newSong
            }
        case UPDATE_SONG:
            return {
                ...state,
                [action.song.updatedSong.id]: action.song.updatedSong
            }
        case DELETE_SONG: {
            newState = {...state};
            delete newState[action.id];
            return newState;
        }
        default: 
            return state;
    }
};

export default songsReducer;
