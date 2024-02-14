/* eslint-disable no-underscore-dangle */
import axios, { AxiosInstance } from 'axios';
import { ipcRenderer, shell } from 'electron';
import Annotation from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import { addAnnotation } from '@frontend/slices/annotationSlice';
import { AppToaster } from '@frontend/Toaster';
import { AnnotationYaml, RENDERER_QUERIES } from '@scanning_bee/ipc-interfaces';

import { BACKEND_ENDPOINTS, ENDPOINT_URL } from './endpoints';
import {
    CellContentDto, CellDto, CellTypeDto, ContentDto, FrameDto, ImageDto, UserDto, UserTypeDto,
} from './payloadTypes';

type APIMethods = 'get' | 'post' | 'put' | 'delete';

export class BackendInterface {
    apiClient: AxiosInstance = null;

    static _instance: BackendInterface = null;

    constructor() {
        this.apiClient = axios.create({
            baseURL: ENDPOINT_URL,
            timeout: 10_000,
        });
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new BackendInterface();
        }

        return this._instance;
    }

    // Function to request opening the dialog
    public openFolderDialog = () => {
        ipcRenderer.send(RENDERER_QUERIES.SELECT_FOLDER);
    };

    public saveAnnotations = (annotations: Annotation[], targetFolder: string) => {
        const annotationsYaml: AnnotationYaml[] = annotations.map(annotation => Annotation.toYaml(annotation));

        ipcRenderer.send(RENDERER_QUERIES.SAVE_ANNOTATIONS, { targetFolder, annotations: annotationsYaml });
    };

    public openFolderAtLocation = (folder: string) => {
        shell.openPath(folder);
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

    public getAllCells = async () => {
        this.apiQuery<CellDto[]>(BACKEND_ENDPOINTS.CELL.GET.LIST, 'get');
    };

    public getCellById = async (id: number) => {
        this.apiQuery<CellDto>(BACKEND_ENDPOINTS.CELL.GET.BY_ID(id), 'get');
    };

    public getCellByLocation = async () => {
        this.apiQuery<CellDto>(BACKEND_ENDPOINTS.CELL.GET.BY_LOCATION, 'get');
    };

    public createCell = async (cell: CellDto) => {
        this.apiQuery<CellDto>(BACKEND_ENDPOINTS.CELL.POST.CREATE, 'post', cell);
    };

    public getCellContents = async () => {
        this.apiQuery<CellContentDto[]>(BACKEND_ENDPOINTS.CELL_CONTENT.GET.LIST, 'get');
    };

    public getCellContentByImageName = async (imageName: string) => {
        this.apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.GET.BY_IMAGE_NAME(imageName), 'get');
    };

    public createCellContent = async (cellContent: CellContentDto) => this
        .apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.POST.CREATE, 'post', cellContent);

    public deleteCellContent = async (id: number) => this
        .apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.DELETE.DELETE(id), 'delete');

    public getContents = async () => this.apiQuery<ContentDto[]>(BACKEND_ENDPOINTS.CONTENT.GET.LIST, 'get');

    public getFrames = async () => this.apiQuery<FrameDto[]>(BACKEND_ENDPOINTS.FRAME.GET.LIST, 'get');

    public createFrame = async (frame: FrameDto) => this.apiQuery<FrameDto>(BACKEND_ENDPOINTS.FRAME.POST.CREATE, 'post', frame);

    public getUsers = async () => this.apiQuery<UserDto[]>(BACKEND_ENDPOINTS.USER.GET.LIST, 'get');

    public createUser = async (user: UserDto) => this.apiQuery<UserDto>(BACKEND_ENDPOINTS.USER.POST.CREATE, 'post', user);

    public getUserTypes = async () => this.apiQuery<UserTypeDto[]>(BACKEND_ENDPOINTS.USER_TYPE.GET.LIST, 'get');

    public getImages = async () => this.apiQuery<ImageDto[]>(BACKEND_ENDPOINTS.IMAGE.GET.LIST, 'get');

    public createImage = async (image: ImageDto) => this.apiQuery<ImageDto>(BACKEND_ENDPOINTS.IMAGE.POST.CREATE, 'post', image);

    public getCellContentByAI = async (imageName: string) => this
        .apiQuery<CellContentDto[]>(BACKEND_ENDPOINTS.AI.GET.BY_IMAGE_NAME(imageName), 'get');

    public saveAnnotationsToDatabase = async (annotations: Annotation[]) => {
        let success = true;

        AppToaster.show({
            message: 'Saving annotations to database...',
            intent: 'primary',
        });

        for (let i = 0; i < annotations.length; i += 1) {
            const annotation = annotations[i];

            // TODO:
            const imageId = (() => {
                if (annotation.source_name === 'image_32.jpeg') {
                    return 6;
                } if (annotation.source_name === 'image_33.jpeg') {
                    return 7;
                } if (annotation.source_name === 'image_34.jpeg') {
                    return 8;
                } if (annotation.source_name === 'image_35.jpeg') {
                    return 9;
                }
                return 5;
            })();
            // TODO:

            const obj = {
                radius: annotation.radius,
                center_x: annotation.center[0],
                center_y: annotation.center[1],
                content: CellTypeDto[annotation.cell_type],
                user: 1,
                timestamp: `${annotation.timestamp}`,
                frame: 1,
                image: imageId,
            } as CellContentDto;

            // eslint-disable-next-line no-await-in-loop
            const res = await this.createCellContent(obj);
            if (!res) {
                success = false;
            }
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
}
