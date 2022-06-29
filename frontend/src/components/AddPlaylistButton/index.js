import React, {useState} from 'react';
import {Modal} from '../Modal';
import AddPlaylist from '../AddPlaylist';

const AddPlaylistButton = () => {
    const [displayModal, setModalDisplay] = useState(false);

    return (
        <>
            <button className='add-playlist-button' onClick={() => setModalDisplay(true)}><i className="fa fa-plus"></i> New Playlist</button>
            {displayModal && (
                <Modal onClose={() => setModalDisplay(false)}>
                    <AddPlaylist setModalDisplay={setModalDisplay}/>
                </Modal>
            )}
        </>
    );
};

export default AddPlaylistButton;
