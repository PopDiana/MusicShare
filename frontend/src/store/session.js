import {fetch} from './fetch';

const SET_LOGGED_USER = 'session/SET_LOGGED_USER';
const REMOVE_LOGGED_USER = 'session/REMOVE_LOGGED_USER';

const setLoggedUser = (user) => {
    return {
        type: SET_LOGGED_USER,
        user
    };
};

const removeLoggedUser = () => {
    return {
        type: REMOVE_LOGGED_USER,
    };
};

export const login = (user) => async (dispatch) => {
    const {credential, password} = user;

    const res = await fetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        }),
    });

    const data = await res.json();
    dispatch(setLoggedUser(data.user));
    return res;
};

export const register = (user) => async (dispatch) => {
    const {username, email, profileImageUrl, bio, password} = user;

    const res = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
            username,
            email,
            profileImageUrl,
            bio,
            password
        }),
    });

    const data = await res.json();
    dispatch(setLoggedUser(data.user));
    return res;
};

export const restoreUser = () => async (dispatch) => {
    const res = await fetch('/api/session');

    const data = await res.json();

    dispatch(setLoggedUser(data.user));
    return res;
};

export const logout = () => async (dispatch) => {
    const res = await fetch('/api/session', {
        method: 'DELETE',
    });

    dispatch(removeLoggedUser());

    return res;
};

const initialState = {user: null};

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case SET_LOGGED_USER:
            newState = Object.assign({}, state);
            newState.user = action.user;
            return newState;
        case REMOVE_LOGGED_USER:
            newState = Object.assign({}, state);
            newState.user = null;
            return newState;
        default:
            return state;
    }
};

export default sessionReducer;