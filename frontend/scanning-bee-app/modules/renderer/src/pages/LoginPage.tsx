import Background from '@assets/images/login-background.png';
import { Button, Divider, FormGroup, InputGroup, Radio, RadioGroup } from '@blueprintjs/core';
import BackendInterface from '@frontend/controllers/backendInterface/backendInterface';
import StorageService from '@frontend/services/StorageService';
import { Roles } from '@frontend/slices/permissionSlice';
import { useUserInfo } from '@frontend/slices/userInfoSlice';
import { LoginFooter } from '@frontend/toolbars/LoginFooter';
import { RENDERER_EVENTS } from '@scanning_bee/ipc-interfaces';
import { ipcRenderer } from 'electron';
import React, { useEffect, useState } from 'react';

export const LoginPage = (props: { setPage: (arg: PageType) => void }) => {
    const { setPage } = props;

    const userInfo = useUserInfo();

    useEffect(() => {
        const accessToken = StorageService.getAccessToken();

        if (accessToken) {
            BackendInterface.afterAuth();
        }
    }, []);

    useEffect(() => {
        if (userInfo.loggedIn) {
            setPage('home');
        }
    }, [userInfo.loggedIn, setPage]);

    const [firstName, setFirstName] = useState(''); // [1]
    const [lastName, setLastName] = useState(''); // [2]
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<Roles>(Roles.ANNOTATOR); // [3]

    const [repeatPassword, setRepeatPassword] = useState(''); // [1]
    const [passwordsMatch, setPasswordsMatch] = useState(true); // [2]

    const [loginType, setLoginType] = useState<'login' | 'signin'>('login');

    const [loginError, setLoginError] = useState(false);

    useEffect(() => {
        ipcRenderer.send(RENDERER_EVENTS.LOGIN_PAGE, true);

        return () => {
            ipcRenderer.send(RENDERER_EVENTS.LOGIN_PAGE, false);
        };
    }, []);

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
                        {loginType === 'signin' && <FormGroup
                            label='First Name'
                            labelFor='first_name'
                            labelInfo='(required)'
                            className='login-form-group'
                        >
                            <InputGroup
                                className='login-input'
                                id='first_name'
                                value={firstName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                                fill
                            />
                        </FormGroup>}
                        {loginType === 'signin' && <FormGroup
                            label='Last Name'
                            labelFor='last_name'
                            labelInfo='(required)'
                            className='login-form-group'
                        >
                            <InputGroup
                                className='login-input'
                                id='last_name'
                                value={lastName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                                fill
                            />
                        </FormGroup>}
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
                        {loginType === 'signin' && <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                            <p className='nomargin'>Role</p>
                            <RadioGroup
                                onChange={e => setRole(parseInt(e.currentTarget.value, 10))}
                                selectedValue={role}
                                className='signin-role-radio-group'
                                inline
                            >
                                <Radio label="Biolog" value={1} />
                                <Radio label="Annotator" value={2} style={{ marginRight: 'unset' }} />
                            </RadioGroup>
                        </div>}

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
                                        .signin({
                                            username,
                                            password,
                                            email,
                                            user_type: role.toString(),
                                            first_name: firstName,
                                            last_name: lastName,
                                        });

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
