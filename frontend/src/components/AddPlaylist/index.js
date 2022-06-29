import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPlaylist } from "../../store/playlists";

const AddPlaylist = ({ setModalDisplay }) => {

    const currentUser = useSelector(state => state.session.user);
    const userId = currentUser.id;
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState([]);

    const addPlaylist = (e) => {
        e.preventDefault();

        setErrors([]);

        var checkbox = document.getElementById('make-secret');
        var isSecret = checkbox.checked;
        dispatch(createPlaylist({
            userId,
            name,
            imageUrl,
            description,
            isSecret
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
        <form onSubmit={addPlaylist}>
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

export default AddPlaylist;
