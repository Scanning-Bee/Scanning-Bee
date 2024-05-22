import { spawn } from 'child_process';
import http from 'http';
import { AddressInfo } from 'net';
import path from 'path';
import {
    app, BrowserWindow, dialog, ipcMain, Menu, MenuItemConstructorOptions, nativeImage, nativeTheme, screen, shell, Tray,
} from 'electron';
import Store from 'electron-store';
import fs from 'fs-extra';
import { AnnotationYaml, MAIN_EVENTS, RENDERER_EVENTS, RENDERER_QUERIES, Theme, THEME_STORAGE_ID } from '@scanning_bee/ipc-interfaces';

import { loadAnnotations, loadImages, loadMetadata, saveAnnotations } from './annotationUtils';
import { invokeBackend } from './backendInvoker';
import { isRunningDevMode } from './utils';

// Determine the mode (dev or production)
const IS_RUNNING_DEV_MODE = isRunningDevMode();

export const IS_MAC = process.platform === 'darwin';

const PROD_BUILD_ASSETS_PATH = path.join(__dirname, '../../assets'); // decided by `package.mjs`
const DEV_BUILD_ASSETS_PATH = path.join(process.cwd(), './build/assets');

const BUILD_ASSETS_PATH = fs.pathExistsSync(PROD_BUILD_ASSETS_PATH) ? PROD_BUILD_ASSETS_PATH : DEV_BUILD_ASSETS_PATH;

/**
 * Path where should we fetch our icon;
 * Note that the filename should end with `Template.png`,
 * @see https://stackoverflow.com/a/41998326/4355624
 */
const ICON_PATH = path.join(BUILD_ASSETS_PATH, 'scanning_bee.png');
const TEMPLATE_ICON_PATH = path.join(BUILD_ASSETS_PATH, 'scanning_bee.png');

class MainController {
    private isAppReady: boolean = false;

    private mainWindow: BrowserWindow | null = null;

    private splashWindow: BrowserWindow | null = null;

    private tray: Tray;

    public async invoke() {
        // TODO:
    }

    async initApp() {
        // To make the titlebar light in macos
        nativeTheme.themeSource = 'light';

        app.on('open-url', async (_event, url) => {
            shell.openExternal(url);
        });

        app.on('activate', () => {
            this.show();
        });

        // Quit when all windows are closed.
        app.on('window-all-closed', async () => {
            if (!IS_MAC) {
                app.quit();
            }
        });

        return app.whenReady().then(() => this.initApplication());
    }

    private async initApplication() {
        this.initBackend();

        this.initMainMenu();
        this.initTray();
        this.initSplash();
        this.initStore();
        this.initMainWindow();
    }

    private async initBackend() {
        const dockerProcess = spawn('docker', ['info']);

        dockerProcess.stdout.once('data', () => {
            invokeBackend();
        });

        dockerProcess.stderr.once('data', () => {
            console.error("Docker is not running, backend won't be started.");
        });

        dockerProcess.on('close', (code) => {
            console.log(`Docker engine check done with code: ${code}`);
        });

        dockerProcess.on('error', (err) => {
            console.error('Error while checking for docker engine', err);
        });
    }

    private initMainMenu() {
        app.setAboutPanelOptions({
            applicationName: 'Scanning Bee',
            applicationVersion: app.getVersion(),
            version: app.getVersion(),
            iconPath: ICON_PATH,
        });

        let generalSubmenuItems: MenuItemConstructorOptions[] = [{
            label: 'About Scanning Bee',
            click: () => { app.showAboutPanel(); },
        }];

        if (IS_MAC) {
            const servicesMenu = new Menu();

            generalSubmenuItems = generalSubmenuItems.concat([
                { type: 'separator' },
                { label: 'Services', role: 'services', submenu: servicesMenu },
                { type: 'separator' },
                { label: 'Hide Scanning Bee', role: 'hide', accelerator: 'Command+H' },
                { label: 'Hide Others', role: 'hideOthers', accelerator: 'Command+Alt+H' },
                { label: 'Show All', role: 'unhide' },
                { type: 'separator' },
                {
                    label: 'Quit Scanning Bee',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => app.quit(),
                },
            ]);
        }

        const template: MenuItemConstructorOptions[] = [
            {
                label: 'General',
                submenu: generalSubmenuItems,
            },
            {
                label: 'File',
                submenu: [
                    {
                        role: 'close',
                    },
                ],
            },
            {
                label: 'Edit',
                submenu: [
                    {
                        type: 'separator',
                    },
                    {
                        label: 'Cut',
                        accelerator: 'CmdOrCtrl+X',
                        role: 'cut',
                    },
                    {
                        label: 'Copy',
                        accelerator: 'CmdOrCtrl+C',
                        role: 'copy',
                    },
                    {
                        label: 'Paste',
                        accelerator: 'CmdOrCtrl+V',
                        role: 'paste',
                    },
                    {
                        label: 'Paste and Match Style',
                        accelerator: 'Shift+CmdOrCtrl+V',
                        role: 'pasteAndMatchStyle',
                    },
                    {
                        label: 'Delete',
                        accelerator: 'delete',
                        role: 'delete',
                    },
                    {
                        label: 'Select All',
                        accelerator: 'CmdOrCtrl+A',
                        role: 'selectAll',
                    },
                ],
            },
            {
                label: 'View',
                submenu: [
                    {
                        label: 'Reload',
                        accelerator: 'CmdOrCtrl+R',
                        click: () => this.reload(),
                    },
                    {
                        label: 'Enter Full Screen',
                        accelerator: (() => (IS_MAC ? 'Ctrl+Command+F' : 'F11'))(),
                        role: 'togglefullscreen',
                    },
                    {
                        type: 'separator',
                    },
                    {
                        role: 'resetZoom',
                    },
                    {
                        role: 'zoomIn',
                    },
                    {
                        role: 'zoomIn',
                        accelerator: 'CommandOrControl+=',
                        registerAccelerator: true,
                        visible: false,
                        enabled: true,
                    },
                    {
                        role: 'zoomOut',
                    },
                ],
            },
            {
                label: 'Window',
                role: 'window',
                submenu: [
                    {
                        label: 'Minimize',
                        accelerator: 'CmdOrCtrl+M',
                        role: 'minimize',
                    },
                ],
            },
        ];

        if (IS_RUNNING_DEV_MODE) {
            template.forEach((field) => {
                if (field.label === 'View') {
                    (field.submenu as MenuItemConstructorOptions[]).push({
                        label: 'Toggle Developer Tools',
                        accelerator: (() => (IS_MAC ? 'Alt+Command+I' : 'Ctrl+Shift+I'))(),
                        role: 'toggleDevTools',
                    });
                }
            });
        }

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    private initSplash() {
        this.splashWindow = new BrowserWindow({
            width: 500, // width of the window
            height: 345, // height of the window
            show: false, // don't show until window is ready
            icon: path.join(BUILD_ASSETS_PATH, 'scanning_bee.png'),
            transparent: true,
            frame: false,
            webPreferences: {
                // contextIsolation: false,
                backgroundThrottling: true, // fix for main window freezing
            },
            alwaysOnTop: true,
        });
        this.splashWindow.setResizable(false);
        this.splashWindow.on('ready-to-show', () => {
            this.splashWindow!.show();
        });
        this.splashWindow.on('closed', () => {
            this.splashWindow = null;
        });

        this.splashWindow.loadURL(`file://${path.join(BUILD_ASSETS_PATH, 'scanning_bee_splash.png')}`);
    }

    private initStore() {
        Store.initRenderer();
    }

    private initMainWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1600, // width of the window
            height: 1200, // height of the window
            minWidth: 1180,
            minHeight: 800,
            show: false, // don't show until window is ready
            icon: path.join(BUILD_ASSETS_PATH, 'scanning_bee.png'),
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
                webSecurity: false,
                webviewTag: true,
                contextIsolation: false,
                backgroundThrottling: true, // fix for main window freezing
            },
            titleBarStyle: 'hidden',
            trafficLightPosition: { x: 12, y: 11 }, // only valid for macOS
            titleBarOverlay: true,
        });

        this.mainWindow.once('ready-to-show', async () => {
            setTimeout(() => {
                this.mainWindow!.show();

                if (this.splashWindow) {
                    this.splashWindow.destroy();
                    this.splashWindow = null;
                }

                this.isAppReady = true;
            }, 1_000);
        });

        const setFullScreen = (_event: any, isFullScreen: boolean) => {
            if (this.isAppReady && this.mainWindow) {
                this.mainWindow.setFullScreen(isFullScreen);
            }
        };

        const themeChangeHandler = async (_event: any, theme?: Theme) => {
            console.log('hey!');

            console.log(theme);

            const headerBackground = theme
                ? (theme.type === 'dark' ? theme.secondaryBackground : theme.tertiaryBackground)
                : '#DCE0E5';

            if (this.mainWindow.setTitleBarOverlay) {
                this.mainWindow.setTitleBarOverlay({
                    color: headerBackground,
                    symbolColor:
                        theme.type === 'light' ? '#000' : '#fff',
                });
            }
        };

        const loginPageHandler = (_event: any, show: boolean) => {
            if (!show) {
                const DEFAULT_THEME = {
                    themeType: 'light',
                    secondaryBackground: '#DCE0E5',
                };

                themeChangeHandler(
                    null,
                    new Store<Record<string, any>>().get(THEME_STORAGE_ID) || DEFAULT_THEME,
                );
                return;
            }

            if (this.mainWindow.setTitleBarOverlay) {
                this.mainWindow.setTitleBarOverlay({
                    color: '#220d4b',
                    symbolColor: '#fff',
                });
            }
        };

        const zoomChangeHandler = async () => {
            if (this.mainWindow) {
                const zoomFactor = await this.mainWindow.webContents.executeJavaScript('window.devicePixelRatio');

                const { scaleFactor } = screen.getDisplayMatching(this.mainWindow.getBounds());

                if (IS_MAC && this.mainWindow.setTrafficLightPosition) {
                    this.mainWindow.setTrafficLightPosition({ x: 12, y: Math.round((11 * zoomFactor) / scaleFactor) });
                } else if (this.mainWindow.setTitleBarOverlay) {
                    // change title bar height
                    this.mainWindow.setTitleBarOverlay({
                        height: Math.floor((20 * zoomFactor) / scaleFactor),
                    });
                }
            }
        };

        const openFolderAtLocation = async (folderPath: string) => {
            const annotationsFilePath = path.join(folderPath, 'annotations', 'annotations.yaml');

            if (!fs.pathExistsSync(annotationsFilePath)) {
                fs.ensureDirSync(path.join(folderPath, 'annotations'));
                saveAnnotations([], folderPath);
            }

            const annotations = loadAnnotations(annotationsFilePath);
            const imageUrls = loadImages(folderPath);
            const metadata = loadMetadata(folderPath);

            this.send(MAIN_EVENTS.ANNOTATIONS_PARSED, { folder: folderPath, annotations, images: imageUrls, metadata });
        };

        ipcMain.on(RENDERER_EVENTS.FULL_SCREEN, setFullScreen);

        ipcMain.on(RENDERER_EVENTS.LOGIN_PAGE, loginPageHandler);

        ipcMain.on(RENDERER_QUERIES.OPEN_FOLDER_AT_LOCATION, (_event, folderPath: string) => {
            openFolderAtLocation(folderPath);
        });

        ipcMain.on(RENDERER_QUERIES.SELECT_FOLDER, (_event) => {
            dialog.showOpenDialog({
                properties: ['openDirectory'],
            }).then((result) => {
                if (!result.canceled) {
                    const folderPath = result.filePaths[0];

                    openFolderAtLocation(folderPath);
                }
            }).catch((err) => {
                console.log(err);
            });
        });

        ipcMain.on(
            RENDERER_QUERIES.SAVE_ANNOTATIONS,
            (_event, { targetFolder, annotations }: { targetFolder: string, annotations: AnnotationYaml[] }) => {
                try {
                    saveAnnotations(annotations, targetFolder);

                    this.send(MAIN_EVENTS.SAVE_ANNOTATIONS_SUCCESS, { targetFolder });
                } catch (e) {
                    this.send(MAIN_EVENTS.SAVE_ANNOTATIONS_ERROR, { targetFolder, error: e });
                }
            },
        );

        ipcMain.on(RENDERER_QUERIES.INVOKE_BACKEND, () => {
            this.initBackend();
        });

        ipcMain.on(RENDERER_EVENTS.ZOOM_CHANGE, zoomChangeHandler);
        ipcMain.on(RENDERER_EVENTS.THEME_CHANGE, themeChangeHandler);
        zoomChangeHandler();
        themeChangeHandler(null, new Store<Record<string, any>>().get(THEME_STORAGE_ID));

        this.mainWindow.once('closed', () => {
            // Dereference the window object, usually you would store windows
            // in an array if your app supports multi windows, this is the time
            // when you should delete the corresponding element.
            this.mainWindow = null;
        });

        this.mainWindow.on('enter-full-screen', () => this.send(MAIN_EVENTS.FULL_SCREEN, true));

        this.mainWindow.on('leave-full-screen', () => this.send(MAIN_EVENTS.FULL_SCREEN, false));

        // --use-built-frontend tells electron to use the frontend files from the build folder
        // this flag is necessary while using with `yarn prod` command, since it will not
        // be using the built frontend.
        // The packaged application automatically uses the built frontend files without this flag.
        if (IS_RUNNING_DEV_MODE && process.argv.indexOf('--use-built-frontend') === -1) {
            this.mainWindow.loadURL('http://localhost:8083/index.html');
        } else {
            const serverBasePath = path.join(__dirname, '../renderer');

            const server = http.createServer((req, res) => {
                const stream = fs.createReadStream(path.join(serverBasePath, req.url!));

                stream.on('error', () => {
                    res.writeHead(404);
                    res.end();
                });
                stream.pipe(res);
            });

            server.listen(0, 'localhost', () => {
                this.mainWindow!.loadURL(`http://localhost:${(server.address() as AddressInfo).port}/index.html`);
            });
        }
    }

    private initTray() {
        // On macOS applications use a template icon rather than the actual icon
        const templateIcon = nativeImage.createFromPath(TEMPLATE_ICON_PATH);
        this.tray = new Tray(IS_MAC ? templateIcon.resize({ width: 16, height: 16 }) : ICON_PATH);

        this.tray.setContextMenu(Menu.buildFromTemplate([
            {
                label: 'Show Scanning Bee',
                click: () => this.show(),
            },
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize',
            },
            { type: 'separator' },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => app.quit(),
            },
        ]));

        // On macos the context menu opens with single click, so it won't make sense to add a onclick listener
        if (!IS_MAC) {
            this.tray.on('click', () => this.show());
        }
    }

    public async reload() {
        if (IS_RUNNING_DEV_MODE) {
            app.exit(491); // Webpack will restart the app for us, see webpack.dev.config.js.
        } else {
            app.relaunch();
            app.quit();
        }
    }

    public show() {
        if (this.isAppReady && this.mainWindow) {
            this.mainWindow.show();

            if (this.mainWindow.isMinimized()) {
                this.mainWindow.restore();
            }

            this.mainWindow.focus();
        } else if (!this.mainWindow) {
            this.initMainWindow();
        }
    }

    public send(channel: string, ...args: any[]) {
        if (this.isAppReady && this.mainWindow) {
            return this.mainWindow.webContents.send(channel, ...args);
        }
        return null;
    }
}

export default new MainController();
