import {fetch} from './fetch';

export const GET_USERS = 'users/GET_USERS';
export const UPDATE_USER = 'users/UPDATE_USER';

export const loadUsers = (list) => ({
    type: GET_USERS,
    list
});

const updateUser = (user) => ({
    type: UPDATE_USER,
    user
});

export const getAllUsers = () => async (dispatch) => {
    const res = await fetch('/api/users');
    if (res.ok) {
        const list = await res.json();
        dispatch(loadUsers(list.users));
    }
};

export const editUser = (data) => async (dispatch) => {
    const res = await fetch(`/api/users/${data.userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        const user = await res.json();
        dispatch(updateUser(user));
        return res;
    }
};

export const followUser = (id, userId) => async (dispatch) => {
    const res = await fetch(`/api/users/follow/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId :userId})
    });

    if (res.ok) {
        const user = await res.json();
        dispatch(updateUser(user));
        return res;
    }
};

export const unfollowUser = (id, userId) => async (dispatch) => {
    const res = await fetch(`/api/users/unfollow/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId :userId})
    });

    if (res.ok) {
        const user = await res.json();
        dispatch(updateUser(user));
        return res;
    }
};


let newState = {
    users: null
};

const usersReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_USERS:
            newState = {...state};
            action.list.forEach((user) => {
                newState[user.id] = user;
            });

            return newState;
        case UPDATE_USER:
            return {
                ...state,
                [action.user.updatedUser.id]: action.user.updatedUser
            }
        default:
            return state;
    }
};

export default usersReducer;
