import React from 'react';
import {useDispatch} from 'react-redux';
import { useHistory } from 'react-router';
import { deleteSong } from '../../store/songs';

const DeleteSong = ({songId}) => {

    const dispatch = useDispatch();
    const history = useHistory();

    const songDelete = (songId) => {
        dispatch(deleteSong(songId));
        history.push('/discover');
    };

    return (
        <>
            <button id='delete-song-button' className="portal-edit-button" onClick={() => songDelete(songId)}>Delete</button>
        </>
    );
};


export default DeleteSong;
