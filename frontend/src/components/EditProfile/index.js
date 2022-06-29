import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "../../store/users";

const EditProfile = ({setModalDisplay}) => {

    const currentUser = useSelector(state => state.session.user);
    const userId = currentUser.id;
    const dispatch = useDispatch();
    const [username, setUsername] = useState(currentUser.username);
    const [profileImageUrl, setProfileImageUrl] = useState(currentUser.profileImageUrl);
    const [bio, setBio] = useState(currentUser.bio);
    const [errors, setErrors] = useState([]);
  
    const editProfile = (e) => {
        e.preventDefault();

        setErrors([]);

        dispatch(editUser({
            userId,
            username,
            profileImageUrl,
            bio,
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
        <form onSubmit={editProfile}>
            <ul>
                {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
            <div className='app-input'>
                <label>Username</label>
                <input type='type' value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className='app-input'>
                <label htmlFor='profileImageUrl'>Profile image url</label>
                <input type='text' name='profileImageUrl' value={profileImageUrl} onChange={(e) => setProfileImageUrl(e.target.value)} required />
            </div>
            <div className='app-input'>
                <label htmlFor='bio'>Bio</label>
                <textarea name='bio' value={bio} onChange={(e) => setBio(e.target.value)} required ></textarea>
            </div>
            <button>Save</button>
        </form>
    );
};



export default EditProfile;
