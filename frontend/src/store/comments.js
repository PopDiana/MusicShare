import { fetch } from './fetch';
import { getSong } from './songs';

export const GET_COMMENTS = 'comments/GET_COMMENTS';
export const DELETE_COMMENT  = 'comments/DELETE_COMMENT';


const loadComments = (list) => ({
    type: GET_COMMENTS,
    list
});

const removeComment = (id) => ({
    type: DELETE_COMMENT,
    id
});

export const getAllComments = (songId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${songId}`);

    if (res.ok) {
        const list = await res.json();
        dispatch(loadComments(list.comments));
    }
};

export const postComment = (data) => async (dispatch) => {
    const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const list = await res.json();
        dispatch(loadComments(list.comments));
        dispatch(getSong(data?.songId));
    }
};

export const editComment = (data) => async (dispatch) => {
    const res = await fetch(`/api/comments/${data.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const list = await res.json();
        dispatch(loadComments(list.comments));
        dispatch(getSong(data?.songId));
    }
};

export const deleteComment = (songId, id) => async (dispatch) => {
    const res = await fetch(`/api/comments/${songId}/${id}`, {
        method: 'DELETE'
    });

    if (res.ok) {
        dispatch(removeComment(id));
        dispatch(getSong(songId));
    }
};

let newState = {};

const commentsReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_COMMENTS: {
            newState = {};
            action.list.forEach((comment) => {
                newState[comment.id] = comment;
            });
            return newState;
        }
        case DELETE_COMMENT: {
            newState = {...state};
            delete newState[action.id];
            return newState;
        }
        default:
            return state;
    }
};

export default commentsReducer;
