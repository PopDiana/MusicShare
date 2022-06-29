import React from 'react';
import {Link} from 'react-router-dom';
import './styles.css';

const Banner = () => {
    return (
        <div className='banner'>
            <div>
                <h2>Connect on MusicShare</h2>
                <p>A music streaming platform that lets you listen to all of 
                    your favourite songs - online and ad-free.</p>
                <Link to='/upload'>Upload a song</Link>
            </div>
        </div>
    );
};

export default Banner;
