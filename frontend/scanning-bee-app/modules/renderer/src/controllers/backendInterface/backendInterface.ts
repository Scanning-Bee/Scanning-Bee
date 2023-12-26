/* eslint-disable no-underscore-dangle */
import axios, { AxiosInstance } from 'axios';
import { ipcRenderer } from 'electron';
import Annotation, { AnnotationYaml } from '@frontend/models/annotation';

import { BACKEND_ENDPOINTS, ENDPOINT_URL } from './endpoints';
import { CellContentDto, CellDto, ContentDto, FrameDto, UserDto, UserTypeDto } from './payloadTypes';

type APIMethods = 'get' | 'post' | 'put' | 'delete';

export class BackendInterface {
    apiClient: AxiosInstance = null;

    static _instance: BackendInterface = null;

    constructor() {
        this.apiClient = axios.create({
            baseURL: ENDPOINT_URL,
            timeout: 1000,
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
        ipcRenderer.send('selectFolder');
    };

    public saveAnnotations = (annotations: Annotation[], targetFolder: string) => {
        const annotationsYaml: AnnotationYaml[] = annotations.map(annotation => Annotation.toYaml(annotation));

        ipcRenderer.send('saveAnnotations', { targetFolder, annotations: annotationsYaml });
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
                `Error while trying to query the backend API.\n\tEndpoint: ${endpoint}\n\tMethod: ${method}\n\tData: ${data}`,
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

    public updateCell = async (cell: CellDto) => {
        this.apiQuery<CellDto>(BACKEND_ENDPOINTS.CELL.PUT.UPDATE(cell.id), 'put', cell);
    };

    public getCellContents = async () => {
        this.apiQuery<CellContentDto[]>(BACKEND_ENDPOINTS.CELL_CONTENT.GET.LIST, 'get');
    };

    public getCellContentByImageName = async (imageName: string) => {
        this.apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.GET.BY_IMAGE_NAME(imageName), 'get');
    };

    public createCellContent = async (cellContent: CellContentDto) => {
        this.apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.POST.CREATE, 'post', cellContent);
    };

    public deleteCellContent = async (id: number) => {
        this.apiQuery<CellContentDto>(BACKEND_ENDPOINTS.CELL_CONTENT.DELETE.DELETE(id), 'delete');
    };

    public getContents = async () => {
        this.apiQuery<ContentDto[]>(BACKEND_ENDPOINTS.CONTENT.GET.LIST, 'get');
    };

    public getFrames = async () => {
        this.apiQuery<FrameDto[]>(BACKEND_ENDPOINTS.FRAME.GET.LIST, 'get');
    };

    public createFrame = async (frame: FrameDto) => {
        this.apiQuery<FrameDto>(BACKEND_ENDPOINTS.FRAME.POST.CREATE, 'post', frame);
    };

    public getUsers = async () => {
        this.apiQuery<UserDto[]>(BACKEND_ENDPOINTS.USER.GET.LIST, 'get');
    };

    public createUser = async (user: UserDto) => {
        this.apiQuery<UserDto>(BACKEND_ENDPOINTS.USER.POST.CREATE, 'post', user);
    };

    public getUserTypes = async () => {
        this.apiQuery<UserTypeDto[]>(BACKEND_ENDPOINTS.USER_TYPE.GET.LIST, 'get');
    };
}
