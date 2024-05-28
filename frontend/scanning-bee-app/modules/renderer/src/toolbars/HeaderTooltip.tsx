import { Button, Divider, Icon, Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import BackendInterface from '@frontend/controllers/backendInterface/backendInterface';
import { resetAnnotations, useAnnotations, useAnnotationsFolder, useUnsavedChanges } from '@frontend/slices/annotationSlice';
import { useBackendStatus } from '@frontend/slices/backendStatusSlice';
import { useTheme } from '@frontend/slices/themeSlice';
import { getFileName } from '@frontend/utils/fileNameUtils';
import { isMac } from '@frontend/utils/platform';
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

const TooltipButton = (props: { folder: string, showFolderActionsMenu: boolean }) => {
    const theme = useTheme();

    const changesUnsaved = useUnsavedChanges();

    const buttonColour = theme.type === 'dark' ? theme.tertiaryBackground : theme.secondaryBackground;
    const outlineColour = theme.type === 'dark' ? theme.secondaryForeground : theme.tertiaryForeground;

    const handleClick = props.showFolderActionsMenu
        ? null
        : () => {
            if (!props.folder) BackendInterface.openFolderDialog();
        };

    const buttonText = props.showFolderActionsMenu
        ? 'Select Page'
        : props.folder ? getFileName(props.folder) + (changesUnsaved ? '  •' : '') : 'Select Folder';

    return (<Button
        outlined={theme.secondaryBackground === theme.tertiaryBackground}
        text={<p style={{ margin: 0, fontSize: 'small' }}>{buttonText}</p>}
        style={{
            backgroundColor: buttonColour,
            color: theme.secondaryForeground,
            borderColor: outlineColour,
        }}
        onClick={handleClick}
        className='header-button header-tooltip-button'
        minimal
    />);
};

const TooltipMenu = (props: { page: PageType, setPage: any, folder: string, hideFolderActionsMenu: boolean }) => {
    const { page, setPage, folder, hideFolderActionsMenu } = props;

    const dispatch = useDispatch();

    const annotations = useAnnotations();

    const backendStatus = useBackendStatus();

    return (<div style={{ padding: '10px' }}>
        <Menu>
            {
                folder && !hideFolderActionsMenu && <>
                    <p style={{ margin: '7px', fontWeight: 'bold' }}>{folder ? getFileName(folder) : 'None'}</p>
                    <Divider />
                    <MenuItem
                        text="Save Annotations Locally"
                        onClick={() => {
                            BackendInterface.saveAnnotations(annotations, folder);
                        }}
                        icon='floppy-disk'
                    />
                    <MenuItem
                        text='Save Annotations to Database'
                        onClick={() => {
                            BackendInterface.saveAnnotationsToDatabase(annotations);
                        }}
                        icon='database'
                        disabled={backendStatus !== 'online'}
                    />
                    <Divider />
                    <MenuItem
                        text='Select Another Folder'
                        onClick={() => {
                            BackendInterface.openFolderDialog();
                        }}
                        icon='folder-new'
                    />
                    <MenuItem
                        text='Open Folder Location'
                        onClick={() => {
                            if (folder) BackendInterface.showFolder(folder);
                        }}
                        icon='folder-open'
                    />
                    <MenuItem
                        text='Open Annotations File'
                        onClick={() => {
                            if (folder) BackendInterface.showFolder(`${folder}/annotations/annotations.yaml`);
                        }}
                        icon='document-open'
                    />
                    <MenuItem
                        text='Copy Folder Path'
                        onClick={() => {
                            if (folder) navigator.clipboard.writeText(folder);
                        }}
                        icon='clipboard'
                    />
                    <MenuItem
                        text='Close Folder'
                        onClick={() => {
                            dispatch(resetAnnotations());
                        }}
                        icon='cross'
                    />
                    <MenuDivider />
                </>
            }
            <MenuItem
                text='Home'
                onClick={() => {
                    if (page !== 'home') setPage('home');
                }}
                icon='home'
            />
            <MenuItem
                text='Manual Annotator'
                onClick={() => {
                    if (page !== 'manual-annotator') setPage('manual-annotator');
                }}
                icon='annotation'
            />
            <MenuItem
                text='Statistics'
                onClick={() => {
                    if (page !== 'statistics') setPage('statistics');
                }}
                icon='chart'
            />
            <MenuItem
                text='Beehive'
                onClick={() => {
                    if (page !== 'beehive') setPage('beehive');
                }}
                icon={'path-search'}
            />
        </Menu>
    </div>);
};

export const HeaderTooltip = (props: {
    page: PageType,
    setPage: any,
    goBack: any,
    goForward: any,
    getPreviousPage: any,
    getNextPage: any,
}) => {
    const theme = useTheme();

    const folder = useAnnotationsFolder();

    const hideFolderActionsMenu = props.page !== 'manual-annotator';

    return (<div
        className="header-container flex-center header-container-left"
        style={{ margin: isMac() ? '0 30px 0 -30px' : 0, width: '100%' }}
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
            disabled={!folder && !hideFolderActionsMenu}
            fill
            canEscapeKeyClose
            usePortal
            minimal
        >
            <TooltipButton folder={folder} showFolderActionsMenu={hideFolderActionsMenu} />
            <TooltipMenu
                page={props.page}
                setPage={props.setPage}
                folder={folder}
                hideFolderActionsMenu={hideFolderActionsMenu}
            />
        </Popover>
    </div>);
};
