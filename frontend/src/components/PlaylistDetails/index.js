import React, { useState, useEffect } from 'react';
import { Modal } from '../Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getAllPlaylists } from '../../store/playlists';
import EditPlaylist from '../EditPlaylist';
import DeletePlaylist from '../DeletePlaylist';
import { pauseSong, playPlaylist, shufflePlaylist } from '../../store/player';
import './styles.css';

const PlaylistDetails = () => {

    const [displayModal, setModalDisplay] = useState(false);
    const { playlistId } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(state => (state.session.user));
    const playlist = useSelector(state => (state.playlists));
    const songs = useSelector(state => Object.values(state.playlistSongs));
    var playingPlaylist = useSelector(state => (state.player.playlistId));
    var isPlaying = useSelector(state => (state.player.isPlaying));
    const playlistObj = playlist[playlistId];
    let playlistButtons;

    useEffect(() => {
        dispatch(getAllPlaylists());
    }, [dispatch, playlistId]);

    const play = () => {
        dispatch(playPlaylist(songs, 0, +playlistId));
    };

    const pause = () => {
        dispatch(pauseSong());
    }
    const shuffle = () => {
        dispatch(playPlaylist(songs, Math.floor(Math.random() * songs.length), +playlistId));
        dispatch(shufflePlaylist());
    }

    if (playlistObj?.User?.id === user?.id) {
        playlistButtons = (
            <>
                <button id='edit-playlist-button' className='portal-edit-button' onClick={() => setModalDisplay(true)}>Edit</button>
                <DeletePlaylist playlistId={playlistId} />
            </>
        );
    }

    return (
        <div className='song-portal-large' style={{ backgroundImage: 'url(' + playlistObj?.imageUrl + ')' }}>
            <div className='playlist-container'>
                <div className='playlist-details'>
                    <div>             
                        <button className='play-button' onClick={() => playingPlaylist === playlistObj?.id && isPlaying ? pause() : play()}>
                            <i className={`fas ${playingPlaylist === playlistObj?.id && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                        </button>
                        {playlistObj?.isSecret ? <h4 id='playlist-is-secret'>Secret <i className='fa fa-lock'></i></h4> : <span></span>}
                        <div>
                            <h2>{playlistObj?.name}</h2>

                            <h3>Created by:
                                <Link className='playlist-user-link' to={{ pathname: `/users/${playlistObj?.User?.id}` }}>
                                    {playlistObj?.User?.username} </Link>
                            </h3>
                            <h4 id='playlist-description'>{playlistObj?.description}</h4>
                        </div>
                    </div>
                    <div>
                        {playlistButtons}
                        {displayModal && (
                            <Modal onClose={() => setModalDisplay(false)}>
                                <EditPlaylist setModalDisplay={setModalDisplay} />
                            </Modal>
                        )}
                           <button onClick={() => shuffle()} className='shuffle-button'><b><i className='fa fa-random'></i>SHUFFLE</b></button>
                    </div>
                </div>
                <div className='playlist-image-large' style={{ backgroundImage: 'url(' + playlistObj?.imageUrl + ')' }}>
                </div>
            </div>
        </div>
    );
};



export default PlaylistDetails;
