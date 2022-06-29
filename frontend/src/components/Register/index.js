import React, {useState} from "react";
import { useDispatch } from "react-redux";
import { register } from "../../store/session";

const Register = () => {

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [bio, setBio] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const registerUser = (e) => {
        e.preventDefault();

        setErrors([]);

        if (password === confirmPassword) {
            setErrors([]);

            return dispatch(register({
                email,
                username,
                profileImageUrl,
                bio,
                password
            }))
                .catch(async (res) => {
                    const data = await res.json();

                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        }
        return setErrors(['Confirm password must match the password.']);
    };

    return (
        <form onSubmit={registerUser}>
            <ul>
                {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
            <div className='app-input'>
                <label>Email</label>
                <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='app-input'>
                <label>Username</label>
                <input type='type' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className='app-input'>
                <label htmlFor='profileImageUrl'>Profile image url</label>
                <input type='text' name='profileImageUrl' value={profileImageUrl} onChange={(e) => setProfileImageUrl(e.target.value)} />
            </div>
            <div className='app-input'>
                <label htmlFor='bio'>Bio</label>
                <textarea name='bio' value={bio} onChange={(e) => setBio(e.target.value)} ></textarea>
            </div>
            <div className='app-input'>
                <label>Password</label>
                <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='app-input'>
                <label>Confirm password</label>
                <input type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button>Register</button>
        </form>
    );
};

export default Register;
