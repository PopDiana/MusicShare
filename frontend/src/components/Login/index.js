import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import { login } from '../../store/session';

const Login = () => {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const userLogin = (e) => {
        e.preventDefault();

        setErrors([]);

        return dispatch(login({
            credential,
            password,
        }))
            .catch(async (res) => {
                const data = await res.json();

                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    return (
        <form onSubmit={userLogin}>
            <ul>
                {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
            <div className='app-input'>
                <label htmlFor='credential'>Username or email</label>
                <input type='text' name='credential' value={credential} onChange={(e) => setCredential(e.target.value)} />
            </div>
            <div className='app-input'>
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button>Login</button>
        </form>
    );
};

export default Login;
