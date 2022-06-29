import { React, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { addPlaylistToHistory, addSongToHistory } from '../../store/history';
import { pauseSong, playSong, updateSongIndex } from '../../store/player';
import { increasePlays } from '../../store/songs';
import './styles.css';

const Player = () => {

    var player = null;
    const songs = useSelector(state => (state.player.songs));
    const songIndex = useSelector(state => (state.player.songIndex));
    var isPlaying = useSelector(state => (state.player.isPlaying));
    var playlistId = useSelector(state => (state.player.playlistId));
    var songId = useSelector(state => (state.player.songId));
    const shuffle = useSelector(state => (state.player.shuffle));
    const currentUser = useSelector(state => (state.session.user));
    const dispatch = useDispatch();

    useEffect(() => {
        if (isPlaying && !player?.isPlaying()) {
            player?.audio?.current?.play();
        } else if (!isPlaying && player?.isPlaying()) {
            player?.audio?.current?.pause();
        }
    });

    const previous = () => {
        if (shuffle) {
            var index = Math.floor(Math.random() * songs.length);
        } else {
            var index = songIndex === 0 ? songs.length - 1 : songIndex - 1;
        }
        dispatch(updateSongIndex(+index));
    };

    const next = () => {
        if (shuffle) {
            var index = Math.floor(Math.random() * songs.length);
        } else {
            var index = songIndex < songs.length - 1 ? songIndex + 1 : 0;
        }
        dispatch(updateSongIndex(+index));

    };

    const play = () => {
        dispatch(playSong());
        if (currentUser) {
            if (songs.length > 1 && playlistId) {
                dispatch(addPlaylistToHistory(playlistId, currentUser?.id));
            } else if (songs.length === 1 || !playlistId) {
                dispatch(addSongToHistory(songId, currentUser?.id));
            }
        }
    };

    const songEnded = (id) => {
        if (id !== null || id !== undefined) {
            dispatch(increasePlays({
                id
            }));
        }
    };

    const pause = () => {
        dispatch(pauseSong());
    };

    if (!songs) return null;

    return (
        <div className='audio-player-container'>
            <AudioPlayer
                className='app-audio-player'
                autoPlay
                src={songs[songIndex]?.songUrl}
                onPlay={play}
                showSkipControls={true}
                showJumpControls={true}
                onClickPrevious={previous}
                onClickNext={next}
                onPause={pause}
                onEnded={songEnded(songs[songIndex]?.id)}
                ref={(node) => { player = node; }}
            />
            <div className='app-player-content'>
                <div className='song-art-small' style={{ backgroundImage: 'url(' + songs[songIndex]?.imageUrl + ')' }}></div>
                <div className='song-details-small'>
                    <Link className='song-username-small' to={{ pathname: `/users/${songs[songIndex]?.User?.id}` }}>{songs[songIndex]?.User?.username}</Link>
                    <Link className='song-link-text song-title-small' to={{ pathname: `/songs/${songs[songIndex]?.id}` }}>
                        <p>{songs[songIndex]?.title}</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Player;
