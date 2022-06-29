import { fetch } from './fetch';

export const GET_FOLLOWING_USERS = 'following/GET_FOLLOWING_USERS';


const loadFollowingUsers = (list) => ({
    type: GET_FOLLOWING_USERS,
    list
});


export const getAllFollowingUsers = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/following/${userId}`);

    if (res.ok) {
        const list = await res.json();
        dispatch(loadFollowingUsers(list.users));
    }
};

let newState = {};

const followingReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_FOLLOWING_USERS: {
            newState = {};
            action.list.forEach((following) => {
                newState[following.id] = following;
            });
            return newState;
        }
        default:
            return state;
    }
};

export default followingReducer;
