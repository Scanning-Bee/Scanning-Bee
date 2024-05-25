/* eslint-disable max-len */
import { UUID } from 'crypto';
import { ipcRenderer } from 'electron';
import { useSelector } from 'react-redux';
import Annotation, { AnnotationMutation, AnnotationPropsWithID } from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import { RootState } from '@frontend/store';
import { focusOnImageButton } from '@frontend/utils/annotationUtils';
import { getFileName } from '@frontend/utils/fileNameUtils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnnotationYaml, MetadataWrapperYaml, RENDERER_QUERIES, RENDERER_QUERY_PAYLOADS, WorkspaceInfo } from '@scanning_bee/ipc-interfaces';

export enum ManualAnnotatorMode {
    Default = 'default',
    Brush = 'brush',
    Add = 'add',
    Delete = 'delete',
}
export type ManualAnnotatorModeParams = {
    cellType?: CellType;
};

// we put the metadata in a global variable so we can access it from the outside of the store. This is done to not populate the store
// further.
let metadata: MetadataWrapperYaml = null;

export const getAnnotationsMetadata = () => metadata;

type AnnotationsState = {
    // contains the plain object versions of the annotations. contains AnnotationProps and the id
    annotationObjects: AnnotationPropsWithID[];

    images: string[];
    shownImageUrl: string;

    activeAnnotationIds: UUID[];
    annotationsFolder: string | null;

    mode: ManualAnnotatorMode;
    modeParams: ManualAnnotatorModeParams;

    unsavedChanges: boolean;

    workspaceInfo: WorkspaceInfo;
};

const initialState: AnnotationsState = {
    annotationObjects: [],

    images: [], // file://blahblahblah
    shownImageUrl: null,

    activeAnnotationIds: [],
    annotationsFolder: null,

    mode: ManualAnnotatorMode.Default,
    modeParams: {},

    unsavedChanges: false,

    workspaceInfo: null,
};

const annotationSlice = createSlice({
    name: 'annotation',
    initialState,
    reducers: {
        openFolder(state, action: PayloadAction<{
            folder: string,
            annotations: AnnotationPropsWithID[],
            images: string[],
            metadata: MetadataWrapperYaml,
        }>) {
            const { folder, annotations, images, metadata: m } = action.payload;
            state.annotationsFolder = folder;
            state.annotationObjects = annotations;

            state.activeAnnotationIds = [];

            const sortedImages = [...images].sort((a, b) => {
                const imageNumberA = parseInt(a.split('.')[0].split('_')[1], 10);
                const imageNumberB = parseInt(b.split('.')[0].split('_')[1], 10);

                return imageNumberA - imageNumberB;
            });

            state.images = sortedImages;

            state.unsavedChanges = false;

            metadata = m;
        },
        showImageWithURL(state, action: PayloadAction<string>) {
            state.shownImageUrl = action.payload;

            focusOnImageButton(action.payload);
        },
        addAnnotation(state, action: PayloadAction<AnnotationPropsWithID>) {
            state.annotationObjects = [...state.annotationObjects, action.payload];

            state.unsavedChanges = true;
        },
        setAnnotations(state, action: PayloadAction<AnnotationPropsWithID[]>) {
            state.annotationObjects = action.payload;
        },
        removeAnnotation(state, action: PayloadAction<UUID>) {
            if (state.activeAnnotationIds.includes(action.payload)) {
                state.activeAnnotationIds = state.activeAnnotationIds.filter(id => id !== action.payload);
            }

            state.annotationObjects = state.annotationObjects.filter(annotation => annotation.id !== action.payload);

            state.unsavedChanges = true;
        },
        resetAnnotations(state) {
            state.annotationObjects = [];
            state.activeAnnotationIds = [];
            state.annotationsFolder = null;
        },
        setActiveAnnotations(state, action: PayloadAction<UUID[]>) {
            state.activeAnnotationIds = action.payload;
        },
        setAnnotationAsActive(state, action: PayloadAction<{ id: UUID, active: boolean }>) {
            const { id, active } = action.payload;

            if (active) {
                state.activeAnnotationIds = [...state.activeAnnotationIds, id];
            } else {
                state.activeAnnotationIds = state.activeAnnotationIds.filter(annotationId => annotationId !== id);
            }
        },
        mutateAnnotation(state, action: PayloadAction<AnnotationMutation>) {
            const mutation = action.payload;
            const index = state.annotationObjects.findIndex(annotation => annotation.id === mutation.id);

            const annotations = state.annotationObjects.map(Annotation.fromPlainObject);

            annotations[index] = annotations[index].applyMutation(mutation);

            state.annotationObjects = annotations.map(Annotation.toPlainObject);

            state.unsavedChanges = true;
        },
        setManualAnnotatorMode(state, action: PayloadAction<ManualAnnotatorMode>) {
            state.mode = action.payload;
        },
        setModeParams(state, action: PayloadAction<ManualAnnotatorModeParams>) {
            state.modeParams = action.payload;
        },
        saveChanges(state) {
            state.unsavedChanges = false;
        },
        setWorkspaceInfo(state, action: PayloadAction<WorkspaceInfo>) {
            state.workspaceInfo = action.payload;
        },
    },
});

export const {
    openFolder,
    showImageWithURL,
    addAnnotation,
    setAnnotations,
    removeAnnotation,
    resetAnnotations,
    setAnnotationAsActive,
    setActiveAnnotations,
    mutateAnnotation,
    setManualAnnotatorMode,
    setModeParams,
    saveChanges,
    setWorkspaceInfo,
} = annotationSlice.actions;

export const selectAnnotations = (state: RootState) => state.annotation.annotationObjects.map(Annotation.fromPlainObject);
export const selectShownImageUrl = (state: RootState) => state.annotation.shownImageUrl;
export const selectActiveAnnotationIds = (state: RootState) => state.annotation.activeAnnotationIds;
export const selectAnnotationsFolder = (state: RootState) => state.annotation.annotationsFolder;
export const selectImages = (state: RootState) => state.annotation.images;
export const selectMode = (state: RootState) => state.annotation.mode;
export const selectModeParams = (state: RootState) => state.annotation.modeParams;
export const selectUnsavedChanges = (state: RootState) => state.annotation.unsavedChanges;
export const selectWorkspaceInfo = (state: RootState) => state.annotation.workspaceInfo;

export const getAnnotations = () => (window as any).store.getState().annotation.annotationObjects.map(Annotation.fromPlainObject);
export const getShownImageUrl = () => (window as any).store.getState().annotation.shownImageUrl;
export const getActiveAnnotationIds = () => (window as any).store.getState().annotation.activeAnnotationIds;
export const getAnnotationsFolder = () => (window as any).store.getState().annotation.annotationsFolder;
export const getImages = () => (window as any).store.getState().annotation.images;
export const getManualAnnotatorMode = () => (window as any).store.getState().annotation.mode;
export const getManualAnnotatorModeParams = () => (window as any).store.getState().annotation.modeParams;
export const getUnsavedChanges = () => (window as any).store.getState().annotation.unsavedChanges;
export const getWorkspaceInfo = () => (window as any).store.getState().annotation.workspaceInfo;

export const useAnnotations = () => {
    const annotations = useSelector(selectAnnotations);
    return annotations;
};
export const useShownImageUrl = () => {
    const shownImageUrl = useSelector(selectShownImageUrl);
    return shownImageUrl;
};
export const useActiveAnnotations = () => {
    const activeAnnotationIds = useSelector(selectActiveAnnotationIds);
    const annotations = useSelector(selectAnnotations);

    const activeAnnotations = annotations.filter(annotation => activeAnnotationIds.includes(annotation.id));

    return activeAnnotations;
};
export const useActiveAnnotationIds = () => {
    const activeAnnotationIds = useSelector(selectActiveAnnotationIds);
    return activeAnnotationIds;
};
export const useAnnotationsFolder = () => {
    const annotationsFolder = useSelector(selectAnnotationsFolder);
    return annotationsFolder;
};

export const useImages = () => {
    const images = useSelector(selectImages);
    return images;
};

export const useManualAnnotatorMode = () => {
    const mode = useSelector(selectMode);
    return mode;
};

export const useManualAnnotatorModeWithParams = () => {
    const mode = useSelector(selectMode);
    const modeParams = useSelector(selectModeParams);

    return { mode, modeParams };
};

export const useUnsavedChanges = () => {
    const unsavedChanges = useSelector(selectUnsavedChanges);
    return unsavedChanges;
};

export const useWorkspaceInfo = () => {
    const workspaceInfo = useSelector(selectWorkspaceInfo);
    return workspaceInfo;
};

/**
 * various helper functions
 */
export const generateAnnotationsFromYaml = (yaml: AnnotationYaml[]): Annotation[] => yaml.map((annotationYaml) => {
    const annotation = Annotation.fromYaml(annotationYaml);

    return annotation;
});

export const createNewAnnotation = () => {
    const newAnnotationProps = {
        center: [480, 270],
        radius: 86,
        cell_type: CellType.NOT_CLASSIFIED,
        poses: [],
        source_name: getFileName(getShownImageUrl()),
        timestamp: 0,
    };

    const newAnnotation = new Annotation(newAnnotationProps);
    return addAnnotation(Annotation.toPlainObject(newAnnotation));
};

export const updateWorkspaceInfo = (updates: Partial<WorkspaceInfo>) => {
    const updatedWorkspaceInfo = {
        ...getWorkspaceInfo(),
        ...updates,
    };

    ipcRenderer.send(RENDERER_QUERIES.SET_WORKSPACE_INFO, {
        folder: getAnnotationsFolder(),
        workspaceInfo: updatedWorkspaceInfo,
    } as RENDERER_QUERY_PAYLOADS[RENDERER_QUERIES.SET_WORKSPACE_INFO]);

    return setWorkspaceInfo(updatedWorkspaceInfo);
};

export default annotationSlice.reducer;
