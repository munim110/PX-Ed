import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context'

const registerURL = 'http://127.0.0.1:8000/api/users/'

const RegisterPage = () => {
    const { setUseNavbar, setAuthenticated, authenticated } = useGlobalContext();

    const [usernameError, setUsernameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [emptyPasswordError, setEmptyPasswordError] = React.useState(false);
    const [emptyConfirmPasswordError, setEmptyConfirmPasswordError] = React.useState(false);
    const [usernameAlreadyExistsError, setUsernameAlreadyExistsError] = React.useState(false);
    const [emailAlreadyExistsError, setEmailAlreadyExistsError] = React.useState(false);

    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    let usernameErrorText = 'Username is Required';
    let emailErrorText = 'Email is Required';
    let passwordErrorText = 'Password is Required';
    let confirmPasswordErrorText = 'Re-enter Password';
    let usernameAlreadyExistsErrorText = 'Username Already Exists';
    let emailAlreadyExistsErrorText = 'Email Already Exists';
    let passWordMismatchErrorText = 'Passwords Do Not Match';

    function registerUser(credential) {
        return fetch(registerURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credential)
        })
            .then(res => res.json())
            .catch(err => console.log(err))
    }


    useEffect(() => {
        setUseNavbar(false);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUsernameError(false);
        setEmailError(false);
        setPasswordError(false);
        setEmptyPasswordError(false);
        setUsernameAlreadyExistsError(false);
        setEmailAlreadyExistsError(false);
        setEmptyConfirmPasswordError(false);

        console.log(username, email, password, confirmPassword);

        if (username === '' || email === '' || password === '' || confirmPassword === '') {
            if (username == '') {
                setUsernameError(true);
            }
            if (email == '') {
                setEmailError(true);
            }
            if (password == '') {
                setEmptyPasswordError(true);
            }
            if (confirmPassword == '') {
                setEmptyConfirmPasswordError(true);
            }
        }
        else {
            if (password !== confirmPassword) {
                setPasswordError(true);
            }
            else {
                const registerData = await registerUser({ 'username': username, 'email': email, 'password': password });
                let registrationError = false;

                if (JSON.stringify(registerData).match('A user with that username already exists.') != null) {
                    setUsernameAlreadyExistsError(true);
                    registrationError = true;
                }
                if (JSON.stringify(registerData).match('user with this email address already exists.') != null) {
                    setEmailAlreadyExistsError(true);
                    registrationError = true;
                }

                if (!registrationError) {
                    console.log('Registration Successful');
                    localStorage.setItem('user', JSON.stringify(registerData));
                    setAuthenticated(true);
                }
            }
        }
    }

    let navigate = useNavigate();
    useEffect(() => {
        if (authenticated) {
            console.log("Authenticated at register");
            navigate('/home');
        }
    }, [authenticated]);

    return (
        <div className='auth-form-div'>
            <div className='auth-form-wrapper-signup'></div>
            <section className='auth-form-block-signup'>
                <header className='auth-form-header'>
                    <h1 className='auth-form-header-text'>Sign Up</h1>
                    <div className='auth-form-toggle'>
                        <span className='auth-form-toggle-span'><Link to='/login'>Already have an account? Click here</Link></span>
                    </div>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className='auth-form-input-wrapper'>
                        <div className='form-input-signup'>
                            <input className='form-input-field' type="text" id="username" placeholder="Username" onChange={
                                e => setUsername(e.target.value)
                            }></input>
                            {usernameError && <span className='auth-form-error-text'>{usernameErrorText}</span>}
                            {usernameAlreadyExistsError && <span className='auth-form-error-text'>{usernameAlreadyExistsErrorText}</span>}
                            <input className='form-input-field' type="email" id="email" placeholder="Email" onChange={
                                e => setEmail(e.target.value)
                            }></input>
                            {emailError && <span className='auth-form-error-text'>{emailErrorText}</span>}
                            {emailAlreadyExistsError && <span className='auth-form-error-text'>{emailAlreadyExistsErrorText}</span>}
                            <input className='form-input-field' type="password" id="password" placeholder="Password" onChange={
                                e => setPassword(e.target.value)
                            }></input>
                            {emptyPasswordError && <span className='auth-form-error-text'>{passwordErrorText}</span>}
                            <input className='form-input-field' type="password" id="confirm-password" placeholder="Confirm Password" onChange={
                                e => setConfirmPassword(e.target.value)
                            }></input>
                            {passwordError && <span className='auth-form-error-text'>{passWordMismatchErrorText}</span>}
                            {emptyConfirmPasswordError && <span className='auth-form-error-text'>{confirmPasswordErrorText}</span>}
                            <button className='form-submit-button' type='submit'>Sign Up</button>
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

export default RegisterPage