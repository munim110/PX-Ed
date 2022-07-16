import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context'

const authURL = 'http://127.0.0.1:8000/auth/';

function authRequest(credential) {
    return fetch(authURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credential)
    })
        .then(res => res.json())
        .catch(err => console.log(err))
}

const LoginPage = () => {
    const [usernameError, setUsernameError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [emptyPasswordError, setEmptyPasswordError] = React.useState(false);
    const [emptyUsernameError, setEmptyUsernameError] = React.useState(false);

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const { setUseNavbar, setAuthenticated, authenticated } = useGlobalContext();

    let usernameErrorText = 'Username Does Not Exist';
    let passwordErrorText = 'Password is Incorrect';
    let emptyUsernameErrorText = 'Username is Required';
    let emptyPasswordErrorText = 'Password is Required';

    useEffect(() => {
        setUseNavbar(false);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameError(false);
        setPasswordError(false);
        setEmptyPasswordError(false);
        setEmptyUsernameError(false);

        if (username == '' || password == '') {
            if (username == '') {
                setEmptyUsernameError(true);
            }
            else if (password == '') {
                setEmptyPasswordError(true);
            }
        }
        else {
            const authData = await authRequest({ 'username': username, 'password': password });
            if (JSON.stringify(authData).match('User does not exist') != null) {
                setUsernameError(true);
            }
            else if (JSON.stringify(authData).match('non_field_errors') != null) {
                setPasswordError(true);
            }
            else {
                localStorage.setItem('user', JSON.stringify(authData));
                setAuthenticated(true);
            }
        }
    }

    let navigate = useNavigate();
    useEffect(() => {
        if (authenticated) {
            console.log("Authenticated");
            navigate('/home');
        }
    }, [authenticated]);

    return (
        <div className='auth-form-div'>
            <div className='auth-form-wrapper-login'></div>
            <section className='auth-form-block-login'>
                <header className='auth-form-header'>
                    <h1 className='auth-form-header-text'>Welcome Back</h1>
                    <div className='auth-form-toggle'>
                        <span className='auth-form-toggle-span'><Link to='/register'>Don't have an account? Click here</Link></span>
                    </div>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className='auth-form-input-wrapper'>
                        <div className='form-input-login'>
                            <input className='form-input-field' type="text" id="username" placeholder="Username" onChange={
                                e => setUsername(e.target.value)
                            }></input>
                            {usernameError && <span className='auth-form-error-text'>{usernameErrorText}</span>}
                            {emptyUsernameError && <span className='auth-form-error-text'>{emptyUsernameErrorText}</span>}
                            <input className='form-input-field' type="password" id="password" placeholder="Password" onChange={
                                e => setPassword(e.target.value)
                            }></input>
                            {passwordError && <span className='auth-form-error-text'>{passwordErrorText}</span>}
                            {emptyPasswordError && <span className='auth-form-error-text'>{emptyPasswordErrorText}</span>}
                            <button className='form-submit-button' type='submit'>Login</button>
                        </div>
                    </div>
                </form>
                <div className='auth-form-toggle form-center'>
                    <span className='auth-form-toggle-span'><Link to='/'>Go Back</Link></span>
                </div>
            </section>
        </div>
    );
}

export default LoginPage;