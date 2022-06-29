import React, {useState} from 'react';
import {Modal} from '../Modal';
import Login from '../Login';

const LoginButton = () => {
    const [displayModal, setModalDisplay] = useState(false);

    return (
        <>
            <button onClick={() => setModalDisplay(true)}>Login</button>
            {displayModal && (
                <Modal onClose={() => setModalDisplay(false)}>
                    <Login />
                </Modal>
            )}
        </>
    );
};


export default LoginButton;
