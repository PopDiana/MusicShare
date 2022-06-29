import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import fileSaver from 'file-saver';
import { getAllPlaylistSongs, deletePlaylistSong, likeSong, unlikeSong } from '../../store/playlistSongs';
import { pauseSong, playPlaylist } from '../../store/player';
import NoItems from '../NoItems';
import './styles.css';


const PlaylistSongs = () => {

    const { playlistId } = useParams();
    const user = useSelector(state => (state.session.user));
    var playingSong = useSelector(state => (state.player.songId));
    var isPlaying = useSelector(state => (state.player.isPlaying));
    var songs = useSelector(state => Object.values(state.playlistSongs));
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllPlaylistSongs(playlistId));
    }, [dispatch, playlistId]);

    const play = (index) => {
        dispatch(playPlaylist(songs, index, +playlistId));
    };

    const removeSong = (songId) => {
        dispatch(deletePlaylistSong(playlistId, songId));
    };

    const like = (songId) => {
        dispatch(likeSong(songId, user?.id));
    }

    const unlike = (songId) => {
        dispatch(unlikeSong(songId, user?.id));
    }

    const pause = () => {
        dispatch(pauseSong());
    }

    const download = (song) => {
        fileSaver.saveAs(
            song?.songUrl
        );
    }

    const plays = (song) => {
        return Math.floor(song.plays / 2);
    }

    if (!songs) {
        return null;
    } 

    return (
        <div className='app-list' id="app-playlist">
            <div>
                {songs.length === 0 ? <><NoItems></NoItems></> : <></>}
                {songs.map((song, index) => {
                    return (
                        <div>
                            <li key={song.id} className='playlist-song'>
                                <div className="playlist-song-container">
                                    <div className="playlist-song-main">
                                        <div className="playlist-song-image" style={{ backgroundImage: 'url(' + song.imageUrl + ')' }}>

                                        </div>
                                        <div className="playlist-song-details">
                                            <Link className='song-user-link-text' to={{ pathname: `/users/${song.User?.id}` }}>{song.User?.username}</Link>
                                            &nbsp;-&nbsp;
                                            <Link className='song-link-text' to={{ pathname: `/songs/${song.id}` }}> {song.title}</Link>
                                            <div className="playlist-song-likes">
                                                <i className="fas fa-heart"></i>  {song.likes} </div>
                                            <div className="playlist-song-plays">
                                                <i className="fas fa-play"></i> {plays(song)}  </div>
                                        </div>
                                    </div>

                                    <div className="playlist-song-actions">
                                        <button id="playlist-like-button" className='play-button list-play-button' onClick={() => song?.Likes?.find(like => like.userId === user?.id) ? unlike(song.id) : like(song.id)}>
                                            <i id="playlist-like-song-icon" className={`${song?.Likes?.find(like => like.userId === user?.id) ? "fa fa-heart" : "fa fa-heart-o"}`}></i></button>
                                        <button id="playlist-play-button" className='play-button list-play-button' onClick={() => playingSong === song.id && isPlaying ? pause() : play(+index)}>
                                            <i id="playlist-play-song-icon" className={`fas ${playingSong === song.id && isPlaying ? "fa-pause" : "fa-play"}`}></i>
                                        </button>
                                        <button id="playlist-download-button" className='play-button list-play-button' onClick={() => download(song)}>
                                            <i id="playlist-download-song-icon" className="fas fa-download"></i>
                                        </button>
                                        <button id="remove-song-button" className='play-button list-play-button' onClick={() => removeSong(song.id)}>
                                            <i id="trash-icon" className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PlaylistSongs;
