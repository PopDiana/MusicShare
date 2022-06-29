import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { getAllPlaylists } from '../../store/playlists';
import { addToPlaylist } from "../../store/songs";
import './styles.css';

const AddToPlaylist = ({ setModalDisplay }) => {

    const currentUser = useSelector(state => state.session.user);
    const userId = currentUser.id;
    const { songId } = useParams();
    const playlists = useSelector(state => Object.values(state.playlists));
    const filteredPlaylists = playlists.filter(playlist => playlist.userId === +userId);
    const dispatch = useDispatch();
    const [playlistId, setPlaylistId] = useState(null);
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        dispatch(getAllPlaylists());
    }, [dispatch]);

    const addSongToPlaylist = (e) => {
        e.preventDefault();

        setErrors([]);

        dispatch(addToPlaylist({
            playlistId,
            songId
        }))
            .catch(async (res) => {
                const data = await res.json();

                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });

        setModalDisplay(false)
    };

    return (
        <div>
            <h3 id='add-to-playlist-title'>Add to playlist</h3>
            <form onSubmit={addSongToPlaylist}>
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
                <div className='app-input'>
                    <label>Playlist name</label>
                    <select
                        name='playlist'
                        className='playlist'
                        value={playlistId}
                        onChange={e => setPlaylistId(+e.target.value)}>
                        <option value="" selected disabled hidden>Choose playlist</option>
                        {filteredPlaylists.map(playlist => (
                            <option key={playlist.id} value={playlist.id}>{playlist.name}</option>
                        ))}
                    </select>
                </div>
                <button>Save</button>
            </form>
        </div>
    );
};

export default AddToPlaylist;
