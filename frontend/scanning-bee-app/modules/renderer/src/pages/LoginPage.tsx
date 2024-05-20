import Background from '@assets/images/login-background.png';
import { Button, Divider, FormGroup, InputGroup } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
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
        if (userInfo.loggedIn) {
            setPage('home');
        }
    }, [userInfo.loggedIn, setPage]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [repeatPassword, setRepeatPassword] = useState(''); // [1]
    const [passwordsMatch, setPasswordsMatch] = useState(true); // [2]

    const [loginType, setLoginType] = useState<'login' | 'signin'>('login');

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
                        <FormGroup
                            label='Username'
                            labelFor='username'
                            labelInfo='(required)'
                            className='login-form-group'
                        >
                            <InputGroup
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
                                id='email'
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                fill
                            />
                        </FormGroup>}

                        {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match</p>}

                        <Button
                            className='login-button'
                            text={loginType === 'login' ? 'Login' : 'Sign in'}
                            onClick={() => {
                                if (loginType === 'login') {
                                    BackendInterface.getInstance().login({ username, password });
                                } else {
                                    setPasswordsMatch(password === repeatPassword); // [3]
                                    BackendInterface.getInstance().signin({ username, password, email, user_type: '2' });
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
