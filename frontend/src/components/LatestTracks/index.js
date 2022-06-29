import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { getAllSongs } from '../../store/songs';
import {Link} from 'react-router-dom';
import { pauseSong, startSong } from '../../store/player';
import './styles.css';

const LatestTracks = () => {

    const dispatch = useDispatch();
    var playingSong = useSelector(state => (state.player.songId));
    var isPlaying = useSelector(state => (state.player.isPlaying));
    
    var songs = useSelector(state => Object.values(state.songs));
    songs = songs.slice(0, 8);

    useEffect(() => {
        dispatch(getAllSongs());
    }, [dispatch]);

    const play = useCallback((song) => {
        dispatch(startSong(song));
    }, [dispatch]);

    const pause = () => {
        dispatch(pauseSong()); 
    }

    if (!songs) {
        return null;
    }

    songs?.sort((a, b) => {
        return b.id - a.id;
    })

    return (
        <div className='app-list'>
            <h2>Listen to the latest shared tracks below.</h2>
            <div>
                {songs.map((song) => {
                    return (
                        <li key={song.id} className='song-card'>
                            <div className='card-image' style={{backgroundImage:'url(' + song.imageUrl + ')'}}>
                                <div className='play-card-song'>
                                    <button className='play-button list-play-button' onClick={() =>  playingSong === song.id && isPlaying? pause() :play(song)}>
                                    <i className={`fas ${playingSong === song?.id && isPlaying ? "fa-pause" : "fa-play"}`}></i>
                                    </button>
                                </div>
                            </div>
                            <Link className='song-link-text' to={{pathname: `/songs/${song.id}`}}>
                                <p>{song.title}</p>
                            </Link>
                            <Link className='song-user-link-text' to={{pathname: `/users/${song.User?.id}`}}>{song.User?.username}</Link>
                        </li>
                    );
                })}
            </div>
        </div>
    );
};



export default LatestTracks;
