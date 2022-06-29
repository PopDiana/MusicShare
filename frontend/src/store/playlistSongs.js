import { fetch } from './fetch';

export const GET_PLAYLIST_SONGS = 'playlistSongs/GET_PLAYLIST_SONGS';
export const DELETE_PLAYLIST_SONG = 'playlistSongs/DELETE_PLAYLIST_SONG';
export const UPDATE_PLAYLIST_SONG = 'playlistSongs/UPDATE_PLAYLIST_SONG';

const loadPlaylistSongs = (list) => ({
    type: GET_PLAYLIST_SONGS,
    list
});

const removePlaylistSong = (id) => ({
    type: DELETE_PLAYLIST_SONG,
    id
});

const updatePlaylistSong = (playlistSong) => ({
    type: UPDATE_PLAYLIST_SONG,
    playlistSong
});


export const getAllPlaylistSongs = (playlistId) => async (dispatch) => {
    const res = await fetch(`/api/songs/playlist/${playlistId}`);

    if (res.ok) {
        const list = await res.json();
        dispatch(loadPlaylistSongs(list.songs));
    }
};

export const deletePlaylistSong = (playlistId, id) => async (dispatch) => {
    const res = await fetch(`/api/songs/deletePlaylistSong/${id}/${playlistId}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(removePlaylistSong(id));
    }
};

export const likeSong = (id, userId) => async (dispatch) => {
    const res = await fetch(`/api/songs/like/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId })
    });

    if (res.ok) {
        const song = await res.json();
        dispatch(updatePlaylistSong(song));
        return res;
    }
};

export const unlikeSong = (id, userId) => async (dispatch) => {
    const res = await fetch(`/api/songs/unlike/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId })
    });

    if (res.ok) {
        const song = await res.json();
        dispatch(updatePlaylistSong(song));
        return res;
    }
};

let newState = {};

const playlistSongsReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_PLAYLIST_SONG:
            return {
                ...state,
                [action.playlistSong.updatedSong.id]: action.playlistSong.updatedSong
            }
        case DELETE_PLAYLIST_SONG: {
            newState = { ...state };
            delete newState[action.id];
            return newState;
        }
        case GET_PLAYLIST_SONGS: {
            newState = {};
            action.list.forEach((playlistSong) => {
                newState[playlistSong.id] = playlistSong;
            });
            return newState;
        }
        default:
            return state;
    }
};

export default playlistSongsReducer;
