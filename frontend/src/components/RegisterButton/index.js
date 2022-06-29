import React, {useState} from 'react';
import {Modal} from '../Modal';
import Register from '../Register';

const RegisterButton = () => {
    const [displayModal, setModalDisplay] = useState(false);

    return (
        <>
            <button onClick={() => setModalDisplay(true)}>Register</button>
            {displayModal && (
                <Modal onClose={() => setModalDisplay(false)}>
                    <Register />
                </Modal>
            )}
        </>
    );
};

export default RegisterButton;
