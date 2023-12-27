import { Button, Divider, Menu, MenuDivider, MenuItem, Popover } from '@blueprintjs/core';
import { openFolderAtLocation, openFolderDialog } from '@frontend/controllers/backendInterface';
import { resetAnnotations, useAnnotationsFolder } from '@frontend/slices/annotationSlice';
import { getFileName } from '@frontend/utils/fileNameUtils';
import React from 'react';
import { useDispatch } from 'react-redux';

const TooltipButton = (props: { folder: string }) => <Button
    outlined
    text={props.folder ? getFileName(props.folder) : 'Select Folder'}
    style={{ width: '100%', display: 'inline', textAlign: 'center' }}
    onClick={() => {
        if (!props.folder) openFolderDialog();
    }}
    className='header-button'
/>;

const TooltipMenu = (props: { folder: string }) => {
    const dispatch = useDispatch();

    return (<div style={{ padding: '10px' }}>
        <Menu>
            <p style={{ margin: '7px', fontWeight: 'bold' }}>{props.folder ? getFileName(props.folder) : 'None'}</p>
            <Divider />
            <MenuItem
                text='Select Another Folder'
                onClick={() => {
                    openFolderDialog();
                }}
                icon='folder-new'
            />
            <MenuItem
                text='Open Folder Location'
                onClick={() => {
                    if (props.folder) openFolderAtLocation(props.folder);
                }}
                icon='folder-open'
            />
            <MenuItem
                text='Open Annotations File'
                onClick={() => {
                    if (props.folder) openFolderAtLocation(`${props.folder}/annotations/annotations.yaml`);
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

export const HeaderTooltip = (props: { page: any, setPage: any }) => {
    const folder = useAnnotationsFolder();

    return (<div className="header-container flex-center header-container-left" style={{ width: '35%', marginLeft: '10px' }}>
        {props.page === 'manual-annotator'
        && <Popover
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
        }
    </div>);
};
