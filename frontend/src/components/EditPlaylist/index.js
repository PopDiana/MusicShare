import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from 'react-router-dom';
import { editPlaylist } from "../../store/playlists";
import "./styles.css";

const EditPlaylist = ({ setModalDisplay }) => {

    const currentUser = useSelector(state => state.session.user);
    const { playlistId } = useParams();
    const playlist = useSelector(state => state.playlists[`${playlistId}`]);
    const userId = currentUser.id;
    const dispatch = useDispatch();
    const [name, setName] = useState(playlist.name);
    const [imageUrl, setImageUrl] = useState(playlist.imageUrl);
    const [description, setDescription] = useState(playlist.description);
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const editUserPlaylist = (e) => {
        e.preventDefault();

        setErrors([]);
        var checkbox = document.getElementById('make-secret');
        var isSecret = checkbox.checked;
        dispatch(editPlaylist({
            id: playlistId,
            userId,
            name,
            imageUrl,
            description,
            isSecret
        }))
            .then(() => history.push(`/playlists/${playlistId}`))
            .catch(async (res) => {
                const data = await res.json();

                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });

        setModalDisplay(false);
    };

    return (
        <form onSubmit={editUserPlaylist}>
            <ul>
                {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
            <div className='app-input'>
                <label>Playlist name</label>
                <input type='type' value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className='app-input'>
                <label htmlFor='imageUrl'>Cover image url</label>
                <input type='text' name='imageUrl' value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
            </div>
            <div className='app-input'>
                <label htmlFor='description'>Description</label>
                <textarea name='description' value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
            <div className='app-input secret-playlist-checkbox-input'>
                <input type="checkbox" name='make-secret' id="make-secret" defaultChecked></input>
                <label htmlFor='make-secret'>Make secret</label>
            </div>
            <button>Save Playlist</button>
        </form>
    );
};

export default EditPlaylist;
