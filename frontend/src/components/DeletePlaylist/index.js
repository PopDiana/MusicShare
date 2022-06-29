import React from 'react';
import {useDispatch} from 'react-redux';
import { useHistory } from 'react-router';
import { deletePlaylist } from '../../store/playlists';

const DeletePlaylist = ({playlistId}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const deleteUserPlaylist = (playlistId) => {
        dispatch(deletePlaylist(playlistId));
        history.push('/discover');
    };

    return (
        <>
            <button id='delete-playlist-button' onClick={() => deleteUserPlaylist(playlistId)}>Delete</button>
        </>
    );
};

export default DeletePlaylist;
