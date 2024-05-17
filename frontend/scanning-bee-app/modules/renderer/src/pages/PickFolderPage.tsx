import { Button } from '@blueprintjs/core';
import { BackendInterface } from '@frontend/controllers/backendInterface/backendInterface';
import { useTheme } from '@frontend/slices/themeSlice';
import { getRecentlyOpenedFolders } from '@frontend/utils/annotationUtils';
import { getFileName, getParentFolder, shortenFileName, shortenFolderPath } from '@frontend/utils/fileNameUtils';
import React from 'react';

const RecentlyOpenedFolders = ({ folders }: { folders: string[] }) => {
    const theme = useTheme();

    return (
        <div className='recently-opened-folders'>
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>Recently opened folders</p>
            {(
                folders.map((folder, index) => (
                    <Button
                        key={index}
                        text={
                            <div className='recently-opened-folder-button'>
                                <p style={{
                                    color: theme.primaryForeground,
                                }} className='nomargin ellipsis-overflow recently-opened-folder-title'>
                                    {shortenFileName(getFileName(folder), 35)}
                                </p>
                                <p style={{
                                    color: theme.secondaryForeground,
                                }} className='nomargin ellipsis-overflow recently-opened-folder-parent'>
                                        at {shortenFolderPath(getParentFolder(folder), 35)}
                                </p>
                            </div>
                        }
                        minimal
                        fill
                        onClick={() => {
                            console.log('Opening folder:', folder);
                            BackendInterface.getInstance().openFolderAtLocation(folder);
                        }}
                        style={{
                            padding: '5px',
                            margin: '0',
                        }}
                    />
                ))
            )}
        </div>
    );
};

export const PickFolderPage = () => {
    const theme = useTheme();

    const recentlyOpenedFolders = getRecentlyOpenedFolders();

    return (<div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: theme.primaryBackground,
        color: theme.primaryForeground,
        justifyContent: 'center',
    }} className='page'>
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Button
                    text='Open a folder'
                    minimal
                    large
                    onClick={() => {
                        BackendInterface.getInstance().openFolderDialog();
                    }}
                    intent='success'
                    icon='folder-new'
                    style={{ padding: '5px', margin: '2px' }}
                />
                <p style={{ fontWeight: 'normal', fontSize: '16px' }} className='nomargin'>
                    to start annotating, view your annotations or have a look at the statistics.
                </p>
            </div>
            {
                recentlyOpenedFolders.length > 0
                && <RecentlyOpenedFolders folders={recentlyOpenedFolders} />
            }
        </div>
    </div>);
};
