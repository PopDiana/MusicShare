import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const NotFound = () => {
    return (
        <div className='not-found'>
            <div>
                <h1>404 Error: Not Found</h1>
                <h2>Page not found. Click <Link to='/'>here</Link> to return to the main page.</h2>
            </div>
        </div>
    );
};

export default NotFound;
