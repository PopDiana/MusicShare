import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../store/session';

import './styles.css';

const ProfileButton = ({user}) => {

    const dispatch = useDispatch();
    const [displayUserMenu, setDisplayUserMenu] = useState(false);

    const open = () => {
        if (displayUserMenu) return;
        setDisplayUserMenu(true);
    };

    useEffect(() => {
        if (!displayUserMenu) return;
        const close = () => {
            setDisplayUserMenu(false);
        };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [displayUserMenu]);


    const logOut = (e) => {
        e.preventDefault();
        dispatch(logout());
    };

    return (
        <>
            <button onClick={open} style={{backgroundImage:'url(' + user?.profileImageUrl + ')'}} className='profile-button'>
            </button>
            {displayUserMenu && (
                <ul className='profile-dropdown'>
                    <li><b>Signed in as: <br/> {user.username}</b></li>
                    <li><b>User options</b></li>
                    <li>
                        <Link to={{pathname: `/users/${user.id}`}}>Profile</Link>
                    </li>
                    <li>
                        <button onClick={logOut}>Log out</button>
                    </li>
                </ul>
            )}
        </>
    );
};


export default ProfileButton;
