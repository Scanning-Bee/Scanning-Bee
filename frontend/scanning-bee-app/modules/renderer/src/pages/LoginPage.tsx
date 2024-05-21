import Background from '@assets/images/login-background.png';
import { Button, Divider, FormGroup, InputGroup } from '@blueprintjs/core';
import BackendInterface from '@frontend/controllers/backendInterface/backendInterface';
import StorageService from '@frontend/services/StorageService';
import { useUserInfo } from '@frontend/slices/userInfoSlice';
import { LoginFooter } from '@frontend/toolbars/LoginFooter';
import React, { useEffect, useState } from 'react';

export const LoginPage = (props: { setPage: (arg: PageType) => void }) => {
    const { setPage } = props;

    const userInfo = useUserInfo();

    useEffect(() => {
        const accessToken = StorageService.getAccessToken();

        if (accessToken) {
            setPage('home');
        }
    }, []);

    useEffect(() => {
        if (userInfo.loggedIn || true) {
            setPage('home');
        }
    }, [userInfo.loggedIn, setPage]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [repeatPassword, setRepeatPassword] = useState(''); // [1]
    const [passwordsMatch, setPasswordsMatch] = useState(true); // [2]

    const [loginType, setLoginType] = useState<'login' | 'signin'>('login');

    const [loginError, setLoginError] = useState(false);

    console.log(loginError);

    useEffect(() => {
        setLoginError(false);
        setPasswordsMatch(true);
    }, [loginType]);

    return (
        <div
            style={{
                backgroundImage: `url(${Background})`,
                backgroundSize: 'cover',
                color: 'white',
                display: 'flex',
                backgroundPosition: 'right',
            }}
            className='page'
        >
            <div className='login-component shadowed'>
                <div
                    className='login-header'
                />

                <div
                    className='login-form'
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            loginError && <p style={{ color: 'red' }}>
                                Could not {loginType === 'login' ? 'login' : 'sign in'}. Please try again.
                            </p>
                        }
                        {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match</p>}
                        <FormGroup
                            label='Username'
                            labelFor='username'
                            labelInfo='(required)'
                            className='login-form-group'
                        >
                            <InputGroup
                                className='login-input'
                                id='username'
                                value={username}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                fill
                            />
                        </FormGroup>
                        <FormGroup
                            label='Password'
                            labelFor='password'
                            labelInfo='(required)'
                            className='login-form-group'
                        >
                            <InputGroup
                                id='password'
                                className='login-input'
                                value={password}
                                type='password'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                fill
                            />
                        </FormGroup>
                        {loginType === 'signin' && <FormGroup
                            label='Repeat Password'
                            labelFor='password'
                            labelInfo='(required)'
                            className='login-form-group'
                        >
                            <InputGroup
                                className='login-input'
                                id='repeat-password'
                                value={repeatPassword}
                                type='password'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepeatPassword(e.target.value)}
                                fill
                            />
                        </FormGroup>}
                        {loginType === 'signin' && <FormGroup
                            label='Email'
                            labelFor='email'
                            labelInfo='(required)'
                            className='login-form-group'
                        >
                            <InputGroup
                                className='login-input'
                                id='email'
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                fill
                            />
                        </FormGroup>}

                        <Button
                            className='login-button'
                            text={loginType === 'login' ? 'Login' : 'Sign in'}
                            onClick={async () => {
                                if (loginType === 'login') {
                                    const success = await BackendInterface.login({ username, password });

                                    setLoginError(!success);
                                } else {
                                    const pwdMatch = password === repeatPassword;
                                    setPasswordsMatch(pwdMatch); // [3]

                                    if (!pwdMatch) return;

                                    const success = await BackendInterface
                                        .signin({ username, password, email, user_type: '2' });

                                    setLoginError(!success);
                                }
                            }}
                            intent={loginType === 'login' ? 'primary' : 'success'}
                            fill
                        />

                        <Divider />

                        <div
                            className='login-signin-switch'
                        >
                            <p>
                                {
                                    loginType === 'login'
                                        ? 'Don\'t have an account?'
                                        : 'Already have an account?'
                                }
                            </p>
                            <Button
                                minimal
                                text={
                                    loginType === 'login'
                                        ? 'Sign up'
                                        : 'Log in'
                                }
                                onClick={() => {
                                    setLoginType(loginType === 'login' ? 'signin' : 'login');
                                }}
                                className={loginType === 'login' ? 'login-switch-button' : 'signin-switch-button'}
                            />
                        </div>
                    </div>
                </div>

            </div>
            <div className='login-footer'>
                <LoginFooter />
            </div>
        </div>
    );
};
