import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';
import { genreOptions } from '../Genres/GenreOptions';
import { editSong } from '../../store/songs';
import { sendSongForVerification } from '../../utils/api';
import './styles.css';

const EditSong = () => {

    const { songId } = useParams();
    const currentUser = useSelector(state => state.session.user);
    const userId = currentUser.id;
    const song = useSelector(state => state.songs[`${songId}`]);
    const dispatch = useDispatch();
    const [title, setTitle] = useState(song.title);
    const [imageUrl, setImageUrl] = useState(song.imageUrl);
    const [songUrl, setSongUrl] = useState(song.songUrl);
    const [genreId, setGenreId] = useState(song.genreId);
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const edit = (e) => {
        e.preventDefault();

        setErrors([]);

        dispatch(editSong({
            id: songId,
            userId,
            genreId,
            title,
            imageUrl,
            songUrl
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
                history.push(`/songs/${songId}`)
            })
            .catch(async (res) => {
                const data = await res.json();

                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    return (
        <div>
            <h2>Make a change to your song below.</h2>
            <form onSubmit={edit}>
                <ul>
                    {errors.map((error) => (
                        <li key={error}>{error}</li>
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
                    <label htmlFor='imageUrl'>Image Url</label>
                    <input type='text' name='imageUrl' value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                </div>
                <div className='app-input'>
                    <label htmlFor='songUrl'>Song Url</label>
                    <input type='text' name='songUrl' value={songUrl} onChange={(e) => setSongUrl(e.target.value)} />
                </div>
                <div className='app-form-button upload-song-buttons'>
                    <button>Save</button>
                    <Link className='main-button' to={{ pathname: `/songs/${songId}` }}>Cancel</Link>
                </div>
            </form>
        </div>
    );
};

export default EditSong;
