import React, {useState} from 'react';
import {Modal} from '../Modal';
import EditProfile from '../EditProfile';
import './styles.css';

const EditProfileButton = () => {
    const [displayModal, setModalDisplay] = useState(false);

    return (
        <>
            <button id='edit-user-profile-button' onClick={() => setModalDisplay(true)}>Edit Profile</button>
            {displayModal && (
                <Modal onClose={() => setModalDisplay(false)}>
                    <EditProfile setModalDisplay={setModalDisplay}/>
                </Modal>
            )}
        </>
    );
};

export default EditProfileButton;
