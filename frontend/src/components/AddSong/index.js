import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { genreOptions } from '../Genres/GenreOptions';
import { createSong } from '../../store/songs';
import './styles.css';
import { sendSongForVerification } from '../../utils/api';


const AddSong = () => {
    const currentUser = useSelector(state => state.session.user);
    const userId = currentUser.id;
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [songUrl, setSongUrl] = useState('');
    const [genreId, setGenreId] = useState(null);
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const reset = () => {
        setTitle('');
        setImageUrl('');
        setSongUrl('');
        setGenreId(null);
    };

    const uploadSong = (e) => {
        e.preventDefault();

        setErrors([]);

        dispatch(createSong({
            userId,
            title,
            imageUrl,
            songUrl,
            genreId
        }))
            .then((data) => {
                var songObject = {
                   id: data.newSong?.id,
                   title,
                   username: currentUser.username,
                   userId,
                   email: currentUser.email
                };
                sendSongForVerification(songObject);
                history.push(`/users/${userId}`) }
                )
            .catch(async (res) => {
                const data = await res.json();

                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });

        reset();
    };

    return (
        <div>
            <h2>Upload your new song below.</h2>
            <form onSubmit={uploadSong}>
                <ul>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
                <div className='app-input'>
                    <label htmlFor='title'>Title</label>
                    <input type='text' name='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className='app-input'>
                    <label htmlFor='genre'>Genre</label>
                    <select
                        name="genre"
                        className="genre"
                        value={genreId}
                        onChange={e => setGenreId(+e.target.value)}>
                        {genreOptions.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </div>
                <div className='app-input'>
                    <label htmlFor='imageUrl'>Image url</label>
                    <input type='text' name='imageUrl' value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>
                <div className='app-input'>
                    <label htmlFor='songUrl'>Song url</label>
                    <input type='text' name='songUrl' value={songUrl} onChange={(e) => setSongUrl(e.target.value)} />
                </div>
                <div className='app-form-button upload-song-buttons'>
                    <button>Upload</button>
                    <Link className='main-button' to={'/'}>Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default AddSong;
