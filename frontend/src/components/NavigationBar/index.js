import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from '../ProfileButton';
import LoginButton from '../LoginButton';
import RegisterButton from '../RegisterButton';
import DemoLoginButton from '../Demo';
import Search from '../Search';
import './styles.css';

const NavigationBar = ({ isLoaded }) => {
    
    const currentUser = useSelector(state => state.session.user);
    let navigationButtons;

    if (currentUser) {
        navigationButtons = (
            <ProfileButton user={currentUser} />
        );
    } else {
        navigationButtons = (
            <>
                <RegisterButton />
                <LoginButton />
            </>
        );
    }

    return (
        <nav>
            <div>
                <div className='nav-left'>
                    <ul>
                        <li className='nav-app-title'>
                            <NavLink exact to='/'>
                                MUSICSHARE
                            </NavLink>
                        </li>
                        <li>
                            <NavLink exact to='/discover'>Discover</NavLink>
                        </li>
                        <li>
                            <NavLink exact to='/upload'>Upload</NavLink>
                        </li>
                    </ul>
                    <Search />
                </div>
                <div className='nav-right'>
                    <ul>
                        <li>
                            {isLoaded && navigationButtons}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
