import { Button, Divider, Icon, Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { resetAnnotations, useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { getFileName } from '@frontend/utils/fileNameUtils';
import React from 'react';
import { useDispatch } from 'react-redux';

const HomeButton = (props: { setPage: any }) => {
    const { setPage } = props;

    const theme = useTheme();

    return (
        <Button
            minimal
            icon={<Icon icon="home" style={{ color: theme.secondaryForeground }} />}
            onClick={(e) => {
                e.preventDefault();
                setPage('home');
            }}
            style={{ padding: '5px', margin: '2px 5px 2px 2px' }}
            className='header-button'
        />
    );
};

const TooltipButton = (props: { folder: string }) => {
    const theme = useTheme();

    return (<Button
        outlined
        text={props.folder ? getFileName(props.folder) : 'Select Folder'}
        style={{
            width: '100%',
            display: 'inline',
            textAlign: 'center',
            backgroundColor: theme.secondaryBackground,
            color: theme.secondaryForeground,
            borderColor: theme.tertiaryForeground,
        }}
        onClick={() => {
            if (!props.folder) BackendInterface.getInstance().openFolderDialog();
        }}
        className='header-button'
    />);
};

const TooltipMenu = (props: { folder: string }) => {
    const dispatch = useDispatch();

    return (<div style={{ padding: '10px' }}>
        <Menu>
            <p style={{ margin: '7px', fontWeight: 'bold' }}>{props.folder ? getFileName(props.folder) : 'None'}</p>
            <Divider />
            <MenuItem
                text='Select Another Folder'
                onClick={() => {
                    BackendInterface.getInstance().openFolderDialog();
                }}
                icon='folder-new'
            />
            <MenuItem
                text='Open Folder Location'
                onClick={() => {
                    if (props.folder) BackendInterface.getInstance().openFolderAtLocation(props.folder);
                }}
                icon='folder-open'
            />
            <MenuItem
                text='Open Annotations File'
                onClick={() => {
                    if (props.folder) BackendInterface.getInstance().openFolderAtLocation(`${props.folder}/annotations/annotations.yaml`);
                }}
                icon='document-open'
            />
            <MenuItem
                text='Copy Folder Path'
                onClick={() => {
                    if (props.folder) navigator.clipboard.writeText(props.folder);
                }}
                icon='clipboard'
            />
            <MenuDivider />
            <MenuItem
                text='Close Folder'
                onClick={() => {
                    dispatch(resetAnnotations());
                }}
                icon='cross'
            />
        </Menu>
    </div>);
};

export const HeaderTooltip = (props: {
    page: any,
    setPage: any,
    goBack: any,
    goForward: any,
    getPreviousPage: any,
    getNextPage: any,
}) => {
    const theme = useTheme();

    const folder = useAnnotationsFolder();

    const hideTooltip = props.page === 'home' && !folder;

    if (hideTooltip) {
        return null;
    }

    return (<div
        className="header-container flex-center header-container-left"
        style={{ margin: '0 30px 0 -30px', width: '100%' }}
    >
        <Button
            icon={<Icon icon='arrow-left' style={{ color: theme.secondaryForeground }}/>}
            style={{ alignSelf: 'center' }}
            onClick={() => props.goBack()}
            disabled={!props.getPreviousPage()}
            minimal
            className='header-button'
        />
        <Button
            icon={<Icon icon='arrow-right' style={{ color: theme.secondaryForeground }}/>}
            style={{ alignSelf: 'center' }}
            onClick={() => props.goForward()}
            disabled={!props.getNextPage()}
            minimal
            className='header-button'
        />
        <HomeButton setPage={props.setPage} />
        <Popover
            interactionKind='click'
            position='bottom'
            disabled={!folder}
            fill
            canEscapeKeyClose
            usePortal
        >
            <TooltipButton folder={folder} />
            <TooltipMenu folder={folder} />
        </Popover>
    </div>);
};
