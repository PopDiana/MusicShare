import { fetch } from './fetch';

export const GET_LIKED_SONGS = 'likedSongs/GET_LIKED_SONGS';


const loadLikedSongs = (list) => ({
    type: GET_LIKED_SONGS,
    list
});


export const getAllLikedSongs = (userId) => async (dispatch) => {
    const res = await fetch(`/api/songs/liked/${userId}`);

    if (res.ok) {
        const list = await res.json();
        dispatch(loadLikedSongs(list.songs));
    }
};

let newState = {};

const likedSongsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_LIKED_SONGS: {
            newState = {};
            action.list.forEach((song) => {
                newState[song.id] = song;
            });
            return newState;
        }
        default:
            return state;
    }
};

export default likedSongsReducer;
