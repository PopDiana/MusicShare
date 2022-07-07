import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Modal } from '../Modal';
import DeleteSong from '../DeleteSong';
import AddToPlaylist from '../AddToPlaylist';
import fileSaver from 'file-saver';
import { pauseSong, startSong } from '../../store/player';
import { getAllSongs, likeSong, unlikeSong } from '../../store/songs';
import './styles.css';

const SongCover = () => {

    const { songId } = useParams();
    const user = useSelector(state => (state.session.user));
    const songs = useSelector(state => (state.songs));
    const song = songs[songId];
    var playingSong = useSelector(state => (state.player.songId));
    var isPlaying = useSelector(state => (state.player.isPlaying));
    const history = useHistory();
    const dispatch = useDispatch();
    const [displayModal, setModalDisplay] = useState(false);

    let songEditButtons;
    let songLikeButton;
    let addToPlaylistButton;
    let downloadButton;

    useEffect(() => {
        dispatch(getAllSongs());
    }, [dispatch, songId]);

    const play = useCallback((song) => {
        dispatch(startSong(song));
    }, [dispatch]);

    const pause = () => {
        dispatch(pauseSong());
    }

    const edit = (songId) => {
        history.push(`/songs/${songId}/edit`);
    };

    const like = (songId) => {
        dispatch(likeSong(songId, user?.id));
    }

    const unlike = (songId) => {
        dispatch(unlikeSong(songId, user?.id));
    }

    const download = () => {
        fileSaver.saveAs(
            song?.songUrl
        );
    }

    if (song?.User.id === user?.id) {
        songEditButtons = (
            <>
                <button id='edit-song-button' className='portal-edit-button' onClick={() => edit(songId)}>Edit</button>
                <DeleteSong songId={songId} />
            </>
        );
    }

    if (user?.id) {
        var isLiked = song?.Likes?.find(like => like.userId === user?.id);
        songLikeButton = (
            <>
                <button className='portal-like-button' onClick={() => isLiked ? unlike(songId) : like(songId)}>
                    <i className={`${isLiked ? "fa fa-heart" : "fa fa-heart-o"}`}></i> {song?.likes} </button>
            </>
        );
        addToPlaylistButton = (
            <>
                <button className='portal-add-to-playlist-button' onClick={() => setModalDisplay(true)}><i className="fa fa-plus"></i> Add to Playlist</button>
                {displayModal && (
                    <Modal onClose={() => setModalDisplay(false)}>
                        <AddToPlaylist setModalDisplay={setModalDisplay} />
                    </Modal>
                )}
            </>
        );
        downloadButton = (
            <>
                <button className='portal-add-to-playlist-button' onClick={() => download()}>
                    <i className="fa fa-download"></i> Download</button>
            </>
        );
    }

    return (
        <div className='song-portal-large' style={{ backgroundImage: 'url(' + song?.imageUrl + ')' }}>
            <div className='song-backdrop-container'>
                <div className='portal-song-details'>
                    <div>
                        <button className='play-button' onClick={() => playingSong === song.id && isPlaying ? pause() : play(song)}>
                            <i className={`fas ${playingSong === song?.id && isPlaying ? "fa-pause" : "fa-play"}`}></i>
                        </button>
                        <div>
                            <h2>{song?.title}</h2>
                            <h3><Link className='song-user-link' to={{ pathname: `/users/${song?.User.id}` }}>{song?.User.username}</Link>
                            &nbsp;-&nbsp;{song?.createdAt}</h3>
                            <Link to={{ pathname: `/genre/${song?.Genre?.name}` }}><h4>{song?.Genre?.name}</h4></Link>
                        </div>
                    </div>
                    <div>
                        {songEditButtons}
                        {songLikeButton}
                        {addToPlaylistButton}
                        {downloadButton}
                    </div>
                </div>
                <div className='song-image-large' style={{ backgroundImage: 'url(' + song?.imageUrl + ')' }}>
                </div>
            </div>
        </div>
    );
};

export default SongCover;
