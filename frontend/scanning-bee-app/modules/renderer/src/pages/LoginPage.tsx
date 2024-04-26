import ScanningBeeLogoSmall from '@assets/images/scanning_bee_logo_small.png';
import { Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import StorageService from '@frontend/services/StorageService';
import { useTheme } from '@frontend/slices/themeSlice';
import { useUserInfo } from '@frontend/slices/userInfoSlice';
import React, { useEffect, useState } from 'react';

export const LoginPage = (props: { setPage: (arg: PageType) => void }) => {
    const { setPage } = props;

    const userInfo = useUserInfo();

    const theme = useTheme();

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

    return (
        <div
            style={{
                backgroundColor: theme.primaryBackground,
                color: theme.primaryForeground,
                display: 'flex',
            }}
            className='page'
        >
            <div className='home'>
                <img
                    src={ScanningBeeLogoSmall}
                    className='login-logo'
                    alt={'Scanning Bee Logo'}
                />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <FormGroup
                        label='Username'
                        labelFor='username'
                        labelInfo='(required)'
                        style={{ marginRight: '10px' }}
                        inline
                    >
                        <InputGroup
                            id='username'
                            value={username}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup
                        label='Password'
                        labelFor='password'
                        labelInfo='(required)'
                        style={{ marginRight: '10px' }}
                        inline
                    >
                        <InputGroup
                            id='password'
                            value={password}
                            type='password'
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                    </FormGroup>
                    <Button
                        icon='log-in'
                        text='Login'
                        onClick={() => {
                            BackendInterface.getInstance().login({ username, password });
                        }}
                        minimal
                        outlined
                        small
                        style={{ width: 'min-content', alignSelf: 'center' }}
                    />
                </div>
            </div>
        </div>
    );
};
