/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
import axios, { AxiosInstance } from 'axios';
import { ipcRenderer, shell } from 'electron';
import Annotation from '@frontend/models/annotation';
import { BeehiveCell } from '@frontend/models/beehive';
import CellType from '@frontend/models/cellType';
import { addAnnotation, getAnnotationsMetadata, saveChanges } from '@frontend/slices/annotationSlice';
import { resetBackendStatus } from '@frontend/slices/backendStatusSlice';
import { AppToaster } from '@frontend/Toaster';
import { addTrailingZeros } from '@frontend/utils/miscUtils';
import { AnnotationYaml, RENDERER_QUERIES } from '@scanning_bee/ipc-interfaces';

import { AUTH_ENDPOINTS, BACKEND_ENDPOINTS, ENDPOINT_URL } from './endpoints';
import {
    BagID,
    CellContentDto, CellContentID, CellDto, CellID, CellTypeDto, ContentDto, ContentID, FrameDto, FrameID, ImageDto, LoginDto, LogoutDto, RegisterResponseDto, SigninDto, LoginResponseDto, UserDto, UserTypeDto,
    UserTypeID,
} from './payloadTypes';
import StorageService from '@frontend/services/StorageService';
import { authorizeUser, unauthorizeUser } from '@frontend/slices/userInfoSlice';

type APIMethods = 'get' | 'post' | 'put' | 'delete';

export class BackendInterface {
    apiClient: AxiosInstance = null;

    static _instance: BackendInterface = null;

    constructor() {
        this.apiClient = axios.create({
            baseURL: ENDPOINT_URL,
            timeout: 10_000,
        });

        this.apiClient.interceptors.request.use((config) => {
            const token = StorageService.getAccessToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        this.apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response.status === 401) {
                    StorageService.clearTokens();
                    (window as any).store.dispatch(unauthorizeUser());
                    (window as any).RendererController.setPage('login');
                }

                return Promise.reject(error);
            },
        );
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new BackendInterface();
        }

        return this._instance;
    }

    public openFolderAtLocation = (folder: string) => {
        ipcRenderer.send(RENDERER_QUERIES.OPEN_FOLDER_AT_LOCATION, folder);
    };

    // Function to request opening the dialog
    public openFolderDialog = () => {
        ipcRenderer.send(RENDERER_QUERIES.SELECT_FOLDER);
    };

    public saveAnnotations = (annotations: Annotation[], targetFolder: string) => {
        const annotationsYaml: AnnotationYaml[] = annotations.map(annotation => Annotation.toYaml(annotation));

        ipcRenderer.send(RENDERER_QUERIES.SAVE_ANNOTATIONS, { targetFolder, annotations: annotationsYaml });

        const { dispatch } = (window as any).store;

        dispatch(saveChanges());
    };

    public showFolder = (folder: string) => {
        shell.openPath(folder);
    };

    public invokeBackend = () => {
        ipcRenderer.send(RENDERER_QUERIES.INVOKE_BACKEND);

        resetBackendStatus();
    };

    private async apiQuery<RequestDto>(endpoint: string, method: APIMethods, data?: RequestDto): Promise<RequestDto | null> {
        try {
            const res = await this.apiClient.request<RequestDto>({
                url: endpoint,
                method,
                data,
            });

            return res.data;
        } catch (error) {
            console.error(
                'Error while trying to query the backend API.',
                endpoint,
                method,
                data,
                error,
            );
            return null;
        }
    }

    public signin = async (data: SigninDto) => {
        const res: RegisterResponseDto = await this.apiQuery<any>(AUTH_ENDPOINTS.SIGNIN, 'post', data);

        const { dispatch } = (window as any).store;

        dispatch(authorizeUser());

        StorageService.setAccessToken(res.access);
        StorageService.setRefreshToken(res.refresh);

        (window as any).RendererController.setPage('home');
    }

    public login = async (data: LoginDto) => {
        const res: LoginResponseDto = await this.apiQuery<any>(AUTH_ENDPOINTS.LOGIN, 'post', data);

        const { dispatch } = (window as any).store;

        dispatch(authorizeUser());

        StorageService.setAccessToken(res.access_token);
        StorageService.setRefreshToken(res.refresh_token);

        (window as any).RendererController.setPage('home');
    }

    public logout = async () => {
        const refresh_token = StorageService.getRefreshToken();

        this.apiQuery<LogoutDto>(AUTH_ENDPOINTS.LOGOUT, 'post', { refresh_token });

        StorageService.clearTokens();

        const { dispatch } = (window as any).store;

        dispatch(unauthorizeUser());

        (window as any).RendererController.setPage('login');
    }

    // * CELLS
    public getAllCells = async () => {
        this.apiQuery<CellDto[]>(BACKEND_ENDPOINTS.CELL.GET.LIST, 'get');
    };

    public getCellById = async (id: CellID) => {
        this.apiQuery<CellDto>(BACKEND_ENDPOINTS.CELL.GET.BY_ID(id), 'get');
    };

    public getCellByLocation = async (x: number, y: number) => {
        this.apiQuery<CellDto>(BACKEND_ENDPOINTS.CELL.GET.BY_LOCATION(x, y), 'get');
    };

    public createCell = async (cell: CellDto) => {
        this.apiQuery<CellDto>(BACKEND_ENDPOINTS.CELL.POST.CREATE, 'post', cell);
    };

    public updateCell = async (id: CellID, cell: CellDto) => {
        this.apiQuery<CellDto>(BACKEND_ENDPOINTS.CELL.PUT.UPDATE(id), 'put', cell);
    };

    public deleteCell = async (id: CellID) => {
        this.apiQuery<CellDto>(BACKEND_ENDPOINTS.CELL.DELETE.BY_ID(id), 'delete');
    };

    // * FRAMES
    public getFrames = async () => this.apiQuery<FrameDto[]>(BACKEND_ENDPOINTS.FRAME.GET.LIST, 'get');

    public getFrameById = async (id: FrameID) => this.apiQuery<FrameDto>(BACKEND_ENDPOINTS.FRAME.GET.BY_ID(id), 'get');

    public createFrame = async (frame: FrameDto) => this.apiQuery<FrameDto>(BACKEND_ENDPOINTS.FRAME.POST.CREATE, 'post', frame);

    public updateFrame = async (id: FrameID, frame: FrameDto) => this
        .apiQuery<FrameDto>(BACKEND_ENDPOINTS.FRAME.PUT.UPDATE(id), 'put', frame);

    public deleteFrame = async (id: FrameID) => this.apiQuery<FrameDto>(BACKEND_ENDPOINTS.FRAME.DELETE.BY_ID(id), 'delete');

    // * CONTENT
    public getContents = async () => this.apiQuery<ContentDto[]>(BACKEND_ENDPOINTS.CONTENT.GET.LIST, 'get');

    public getContentById = async (id: ContentID) => this.apiQuery<ContentDto>(BACKEND_ENDPOINTS.CONTENT.GET.BY_ID(id), 'get');

    public createContent = async (content: ContentDto) => this
        .apiQuery<ContentDto>(BACKEND_ENDPOINTS.CONTENT.POST.CREATE, 'post', content);

    public deleteContent = async (id: ContentID) => this.apiQuery<ContentDto>(BACKEND_ENDPOINTS.CONTENT.DELETE.BY_ID(id), 'delete');

    // * CELL CONTENT
    public getCellContents = async () => {
        this.apiQuery<CellContentDto[]>(BACKEND_ENDPOINTS.CELL_CONTENT.GET.LIST, 'get');
    };

    public getCellContentByImageName = async (imageName: string) => {
        this.apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.GET.BY_IMAGE_NAME(imageName), 'get');
    };

    public getCellContentByImageNameRectangle = async (imageName: string) => {
        this.apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.GET.BY_IMAGE_NAME_RECT(imageName), 'get');
    };

    public getCellContentByLocation = async (x: number, y: number) => {
        this.apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.GET.BY_LOCATION(x, y), 'get');
    };

    public createCellContent = async (cellContent: CellContentDto) => this
        .apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.POST.CREATE, 'post', cellContent);

    public deleteCellContent = async (id: CellContentID) => this
        .apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.DELETE.BY_ID(id), 'delete');

    // * USERS
    public getUsers = async () => this.apiQuery<UserDto[]>(BACKEND_ENDPOINTS.USER.GET.LIST, 'get');

    public createUser = async (user: UserDto) => this.apiQuery<UserDto>(BACKEND_ENDPOINTS.USER.POST.CREATE, 'post', user);

    // * USER TYPES
    public getUserTypes = async () => this.apiQuery<UserTypeDto[]>(BACKEND_ENDPOINTS.USER_TYPE.GET.LIST, 'get');

    public createUserType = async (userType: UserTypeDto) => this
        .apiQuery<UserTypeDto>(BACKEND_ENDPOINTS.USER_TYPE.POST.CREATE, 'post', userType);

    public deleteUserType = async (id: UserTypeID) => this.apiQuery<UserTypeDto>(BACKEND_ENDPOINTS.USER_TYPE.DELETE.BY_ID(id), 'delete');

    // * IMAGES
    public getImages = async () => this.apiQuery<ImageDto[]>(BACKEND_ENDPOINTS.IMAGE.GET.LIST, 'get');

    public getImageByLocation = async (x: number, y: number) => this
        .apiQuery<ImageDto>(BACKEND_ENDPOINTS.IMAGE.GET.BY_LOCATION(x, y), 'get');

    public getImageByLocationAndTimestamp = async (x: number, y: number, timestamp: Date) => this
        .apiQuery<ImageDto[]>(BACKEND_ENDPOINTS.IMAGE.GET.BY_LOCATION_AND_TIMESTAMP(x, y, timestamp), 'get');

    public createImage = async (image: ImageDto) => this.apiQuery<ImageDto>(BACKEND_ENDPOINTS.IMAGE.POST.CREATE, 'post', image);

    public scrapeImages = async (data: { path: string }) => this.apiQuery<{
        path: string;
    }>(BACKEND_ENDPOINTS.IMAGE.POST.SCRAPE, 'post', data);

    // * AI
    public getCellContentByAI = async (imageName: string) => this
        .apiQuery<CellContentDto[]>(BACKEND_ENDPOINTS.AI.GET.BY_IMAGE_NAME(imageName), 'get');

    // * BAG
    public getBags = async () => this.apiQuery<ImageDto[]>(BACKEND_ENDPOINTS.BAG.GET.LIST, 'get');

    public getBagById = async (id: BagID) => this.apiQuery<ImageDto>(BACKEND_ENDPOINTS.BAG.GET.BY_ID(id), 'get');

    public createBag = async (bag: ImageDto) => this.apiQuery<ImageDto>(BACKEND_ENDPOINTS.BAG.POST.CREATE, 'post', bag);

    public saveAnnotationsToDatabase = async (annotations: Annotation[]) => {
        const metadata = getAnnotationsMetadata();

        const imageDtos = {} as { [image_name: string]: ImageDto };

        let success = true;

        AppToaster.show({
            message: 'Saving annotations to database...',
            intent: 'primary',
        });

        for (let i = 0; i < annotations.length; i += 1) {
            const annotation = annotations[i];
            const imageName = annotation.source_name;

            const imageMetadata = metadata.image_data.find(meta => meta.image_name === imageName);

            if (!Object.keys(imageDtos).includes(imageName)) {
                const matchingImages = await this.getImageByLocationAndTimestamp(
                    imageMetadata.x_pos,
                    imageMetadata.y_pos,
                    new Date(imageMetadata.sec),
                );

                let imageDto = matchingImages ? matchingImages[0] : null;

                if (!imageDto || !imageDto.id) {
                    imageDto = await this.createImage({
                        image_name: imageName,
                        timestamp: addTrailingZeros(new Date(imageMetadata.sec).toISOString()),
                        x_pos: imageMetadata.x_pos,
                        y_pos: imageMetadata.y_pos,
                        bag: imageMetadata.bag_name,
                    });
                }

                imageDtos[imageName] = imageDto;
            }

            const annotationTimestamp = annotation.timestamp ? new Date(annotation.timestamp) : new Date();

            const obj = {
                radius: annotation.radius,
                center_x: annotation.center[0],
                center_y: annotation.center[1],
                content: CellTypeDto[annotation.cell_type],
                user: 1,
                timestamp: `${addTrailingZeros(annotationTimestamp.toISOString())}`,
                frame: 1,
                image: imageDtos[imageName].id,
            } as CellContentDto;

            // eslint-disable-next-line no-await-in-loop
            const res = await this.createCellContent(obj);
            if (!res) {
                success = false;
            }
        }

        if (success) {
            const { dispatch } = (window as any).store;

            dispatch(saveChanges());
        }

        AppToaster.show({
            message: success ? 'Annotations saved successfully!' : 'Error while saving annotations!',
            intent: success ? 'success' : 'danger',
        });
    };

    public generateAnnotationsByAI = async (imageName: string) => {
        const { dispatch } = (window as any).store;

        AppToaster.show({
            message: 'Generating annotations by AI...',
            intent: 'primary',
        });

        try {
            const res = await this.getCellContentByAI(imageName);

            res.map((cellContent) => {
                const annotation = new Annotation({
                    cell_type: CellType.NOT_CLASSIFIED,
                    center: [cellContent.center_x, cellContent.center_y],
                    radius: cellContent.radius,
                    timestamp: 0,
                    source_name: imageName,
                    poses: [0, 0],
                });

                dispatch(addAnnotation(Annotation.toPlainObject(annotation)));

                return null;
            });

            AppToaster.show({
                message: 'Annotations generated successfully!',
                intent: 'success',
            });
        } catch (error) {
            AppToaster.show({
                message: 'Error while generating annotations!',
                intent: 'danger',
            });
        }
    };

    /**
     * Returns the beehive data closest to the given time.
     */
    public getBeehiveData = (
        beehiveName: string,
        timestampToLookFor?: number,
    ): BeehiveCell[] => {
        // DUMMY FOR NOW. TODO:

        console.log(
            'Getting beehive data from',
            beehiveName,
            'closest to:',
            timestampToLookFor || 'CURRENT',
        );

        const cellCount = 450;

        const cellCountPerRow = 30;

        const cells: BeehiveCell[] = [];

        const cellWidth = 48;
        const cellHeight = 42;

        let rowNumber = -1;

        const cellTypes = Object.keys(CellType);

        for (let i = 0; i < cellCount; i += 1) {
            if (i % cellCountPerRow === 0) {
                rowNumber += 1;
            }

            const cellTypeIdx = Math.floor(Math.random() * 16) + 1;

            const cellType = cellTypeIdx <= 8 ? cellTypes[cellTypeIdx] : 'NOT_CLASSIFIED';

            cells.push({
                cellType: CellType[cellType],
                id: i,
                x: (i % cellCountPerRow) * cellWidth + (rowNumber % 2 === 0 ? 0 : cellWidth / 2),
                y: rowNumber * cellHeight,
            });
        }

        return cells;
    };

    public getBeehiveTimestamps = (beehiveName: string): number[] => {
        console.log('Getting beehive timestamps for', beehiveName);

        return [
            '2021-01-01T00:00:00.000Z',
            '2021-01-28T00:00:00.000Z',
        ].map(ts => new Date(ts).getTime());
    };
}
