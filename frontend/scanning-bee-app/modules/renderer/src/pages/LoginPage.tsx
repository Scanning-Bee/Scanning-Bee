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
                        <Button
                            text='Login'
                            className='login-button'
                            intent='primary'
                            onClick={() => {
                                BackendInterface.getInstance().login({ username, password });
                            }}
                            fill
                        />
                    </div>

                    <Divider
                        style={{
                            margin: '20px 0',
                            backgroundColor: 'white',
                        }}
                    />

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
                        <FormGroup
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
                        </FormGroup>
                        <Button
                            className='login-button'
                            text='Sign in'
                            onClick={() => {
                                BackendInterface.getInstance().signin({ username, password, email, user_type: '2' });
                            }}
                            intent='success'
                            fill
                        />
                    </div>
                </div>

            </div>
            <div className='login-footer'>
                <LoginFooter />
            </div>
        </div>
    );
};
