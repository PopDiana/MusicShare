import {fetch} from './fetch';

export const GET_HISTORY = 'history/GET_HISTORY';
export const ADD_PLAYLIST_TO_HISTORY = 'history/ADD_PLAYLIST_TO_HISTORY';
export const ADD_SONG_TO_HISTORY = 'history/ADD_SONG_TO_HISTORY';
export const DELETE_HISTORY  = 'history/DELETE_HISTORY';

const loadHistory = (list) => ({
    type: GET_HISTORY,
    list
});

export const getListeningHistory = (userId) => async (dispatch) => {
    const res = await fetch(`/api/history/${userId}`);

    if (res.ok) {
        const list = await res.json();
        dispatch(loadHistory(list.history));
    }
};

export const addPlaylistToHistory = (playlistId, userId) => async (dispatch) => {
    const res = await fetch(`/api/history/addPlaylist/${userId}/${playlistId}`);

    if (res.ok) {
        const list = await res.json();
        dispatch(loadHistory(list.history));
    }
};

export const addSongToHistory = (songId, userId) => async (dispatch) => {
    const res = await fetch(`/api/history/addSong/${userId}/${songId}`);

    if (res.ok) {
        const list = await res.json();
        dispatch(loadHistory(list.history));
    }
};


export const deleteHistory = (id) => async (dispatch) => {
    const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(loadHistory([]));
    }
};

let newState = {};

const historyReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_HISTORY:
            newState = action.list;
            return newState;
        default:
            return state;
    }
};

export default historyReducer;
