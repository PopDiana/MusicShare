import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSongs } from '../../store/songs';
import { Link } from 'react-router-dom';
import { pauseSong, startSong } from '../../store/player';
import './styles.css';
import { getAllUsers } from '../../store/users';

const Discover = () => {

    const dispatch = useDispatch();
    const DEFAULT_SONGS_NUMBER = 4;
    const DEFAULT_USERS_NUMBER = 5;
    var songs = useSelector(state => Object.values(state.songs))
    var popularUsers = useSelector(state => Object.values(state.users))
    var playingSong = useSelector(state => (state.player.songId));
    var isPlaying = useSelector(state => (state.player.isPlaying));

    useEffect(() => {
        dispatch(getAllSongs());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const playSong = useCallback((song) => {
        dispatch(startSong(song));
    }, [dispatch]);

    const pausePlayingSong = () => {
        dispatch(pauseSong());
    }

    if (!songs) {
        return null;
    }

    var mostLikedSongs = songs;
    mostLikedSongs?.sort((a, b) => {
        return b.likes - a.likes;
    })
    mostLikedSongs = mostLikedSongs.slice(0, DEFAULT_SONGS_NUMBER);


    var hipHopSongs = songs;
    hipHopSongs = hipHopSongs.filter(song => song?.Genre?.id === 1);
    hipHopSongs = hipHopSongs.slice(0, DEFAULT_SONGS_NUMBER);


    var alternativeSongs = songs;
    alternativeSongs = alternativeSongs.filter(song => song?.Genre?.id === 2);
    alternativeSongs = alternativeSongs.slice(0, DEFAULT_SONGS_NUMBER);


    popularUsers?.sort((a, b) => {
        return b.followers - a.followers;
    })
    popularUsers = popularUsers.slice(0, DEFAULT_USERS_NUMBER);


    return (
        <div>
            <div className='most-liked app-text'>
                <div>
                    <h2>Top tracks</h2>
                    <h4>Most liked this week</h4>
                </div>
            </div>

            <div id='most-liked-songs' className='app-list'>

                <div>
                    {mostLikedSongs.map((song) => {
                        return (
                            <li key={song.id} className='song-card'>
                                <div className='card-image' style={{ backgroundImage: 'url(' + song.imageUrl + ')' }}>
                                    <div className='play-card-song'>
                                        <button className='play-button list-play-button' onClick={() => playingSong === song.id && isPlaying ? pausePlayingSong() : playSong(song)}>
                                            <i className={`fas ${playingSong === song.id && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <Link className='song-link-text' to={{ pathname: `/songs/${song.id}` }}>
                                    <p>{song.title}</p>
                                </Link>
                                <Link className='song-user-link-text' to={{ pathname: `/users/${song.User?.id}` }}>{song.User?.username}</Link>
                            </li>
                        );
                    })}
                </div>
            </div>

            <div className='popular-users app-text'>
                <div>
                    <h2>Popular users</h2>
                    <h4>Most followed profiles</h4>
                </div>
            </div>
            <div id='popular-users-profiles' className='app-list'>
                <div>{popularUsers.map((user) => {
                    return (<div className='profiles'><div className='profile-image' style={{ backgroundImage: 'url(' + user?.profileImageUrl + ')' }}></div>
                        <Link className='song-link-text' to={{ pathname: `/users/${user?.id}` }}> <h2 className='profile-username'>{user?.username}</h2> </Link></div>);
                })}</div>
            </div>

            <div className='genre-one app-text'>
                <div>
                    <h2>Hip hop</h2>
                    <h4>What's new on...</h4>
                </div>
            </div>
            <div id='genre-one' className='app-list'>

                <div>
                    {hipHopSongs.map((song) => {
                        return (
                            <li key={song.id} className='song-card'>
                                <div className='card-image' style={{ backgroundImage: 'url(' + song.imageUrl + ')' }}>
                                    <div className='play-card-song'>
                                        <button className='play-button list-play-button' onClick={() => playingSong === song.id && isPlaying ? pausePlayingSong() : playSong(song)}>
                                            <i className={`fas ${playingSong === song.id && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <Link className='song-link-text' to={{ pathname: `/songs/${song.id}` }}>
                                    <p>{song.title}</p>
                                </Link>
                                <Link className='song-user-link-text' to={{ pathname: `/users/${song.User?.id}` }}>{song.User?.username}</Link>
                            </li>
                        );
                    })}
                </div>
            </div>

            <div className='genre-two app-text'>
                <div>
                    <h2>Alternative</h2>
                    <h4>What's new on...</h4>
                </div>
            </div>
            <div id='genre-two' className='app-list last-list'>
                <div>
                    {alternativeSongs.map((song) => {
                        return (
                            <li key={song.id} className='song-card'>
                                <div className='card-image' style={{ backgroundImage: 'url(' + song.imageUrl + ')' }}>
                                    <div className='play-card-song'>
                                        <button className='play-button list-play-button' onClick={() => playingSong === song.id && isPlaying ? pausePlayingSong() : playSong(song)}>
                                            <i className={`fas ${playingSong === song.id && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <Link className='song-link-text' to={{ pathname: `/songs/${song.id}` }}>
                                    <p>{song.title}</p>
                                </Link>
                                <Link className='song-user-link-text' to={{ pathname: `/users/${song.User?.id}` }}>{song.User?.username}</Link>
                            </li>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default Discover;
