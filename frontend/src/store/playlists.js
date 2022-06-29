import {fetch} from './fetch';

export const GET_PLAYLISTS = 'playlists/GET_PLAYLISTS';
export const GET_PLAYLIST = 'playlist/GET_PLAYLIST'
export const CREATE_PLAYLIST = 'playlists/CREATE_PLAYLIST';
export const UPDATE_PLAYLIST  = 'playlists/UPDATE_PLAYLIST';
export const DELETE_PLAYLIST  = 'playlists/DELETE_PLAYLIST';

const loadPlaylists = (list) => ({
    type: GET_PLAYLISTS,
    list
});

const loadPlaylist = (playlist) => ({
    type: GET_PLAYLIST,
    playlist
});

const addPlaylist = (playlist) => ({
    type: CREATE_PLAYLIST,
    playlist
});

const updatePlaylist = (playlist) => ({
    type: UPDATE_PLAYLIST,
    playlist
});

const removePlaylist = (id) => ({
    type: DELETE_PLAYLIST,
    id
});

export const getAllPlaylists = () => async (dispatch) => {
    const res = await fetch('/api/playlists');

    if (res.ok) {
        const list = await res.json();
        dispatch(loadPlaylists(list.playlists));
    }
};

export const getPlaylist = (playlistId) => async (dispatch) => {
    const res = await fetch(`/api/playlists/${playlistId}`);

    if (res.ok) {
        const playlist = await res.json();
        dispatch(loadPlaylist(playlist.playlist));
    }
};

export const createPlaylist = (data) => async (dispatch) => {
    const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const playlist = await res.json();
        dispatch(addPlaylist(playlist));

        return playlist;
    }
};

export const editPlaylist = (data) => async (dispatch) => {
    const res = await fetch(`/api/playlists/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const playlist = await res.json();
        dispatch(updatePlaylist(playlist));
        return res;
    }
};

export const deletePlaylist = (id) => async (dispatch) => {
    const res = await fetch(`/api/playlists/${id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(removePlaylist(id));
    }
};

let newState = {};

const playlistsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_PLAYLISTS:
            newState = {...state};
            action.list.forEach((playlist) => {
                newState[playlist.id] = playlist;
            });
            return newState;
        case GET_PLAYLIST:
            return {
                ...state,
                [action.playlist.id]: action.playlist
            }
        case CREATE_PLAYLIST:
            return {
                ...state,
                [action.playlist.newPlaylist.id]: action.playlist.newPlaylist
            }
        case UPDATE_PLAYLIST:
            return {
                ...state,
                [action.playlist.updatedPlaylist.id]: action.playlist.updatedPlaylist
            }
        case DELETE_PLAYLIST: {
            newState = {...state};
            delete newState[action.id];
            return newState;
        }
        default:
            return state;
    }
};

export default playlistsReducer;
