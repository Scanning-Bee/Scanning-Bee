import { UUID } from 'crypto';
import { useSelector } from 'react-redux';
import Annotation, { AnnotationMutation, AnnotationPropsWithID } from '@frontend/models/annotation';
import CellType from '@frontend/models/cellType';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnnotationYaml } from '@scanning_bee/ipc-interfaces';

export enum ManualAnnotatorMode {
    Default = 'default',
    Brush = 'brush',
    Add = 'add',
    Delete = 'delete',
}
export type ManualAnnotatorModeParams = {
    cellType?: CellType;
};

type AnnotationsState = {
    // contains the plain object versions of the annotations. contains AnnotationProps and the id
    annotationObjects: AnnotationPropsWithID[];
    images: string[];
    activeAnnotationIds: UUID[];
    annotationsFolder: string | null;

    mode: ManualAnnotatorMode;
    modeParams: ManualAnnotatorModeParams;
};

const initialState: AnnotationsState = {
    annotationObjects: [],
    images: [], // file://blahblahblah
    activeAnnotationIds: [],
    annotationsFolder: null,
    mode: ManualAnnotatorMode.Default,
    modeParams: {},
};

const annotationSlice = createSlice({
    name: 'annotation',
    initialState,
    reducers: {
        openFolder(state, action: PayloadAction<{ folder: string, annotations: AnnotationPropsWithID[], images: string[] }>) {
            const { folder, annotations, images } = action.payload;
            state.annotationsFolder = folder;
            state.annotationObjects = annotations;
            state.images = images;
            state.activeAnnotationIds = [];
        },
        addAnnotation(state, action: PayloadAction<AnnotationPropsWithID>) {
            state.annotationObjects = [...state.annotationObjects, action.payload];
        },
        setAnnotations(state, action: PayloadAction<AnnotationPropsWithID[]>) {
            state.annotationObjects = action.payload;
        },
        removeAnnotation(state, action: PayloadAction<UUID>) {
            if (state.activeAnnotationIds.includes(action.payload)) {
                state.activeAnnotationIds = state.activeAnnotationIds.filter(id => id !== action.payload);
            }

            state.annotationObjects = state.annotationObjects.filter(annotation => annotation.id !== action.payload);
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
        },
        setManualAnnotatorMode(state, action: PayloadAction<ManualAnnotatorMode>) {
            state.mode = action.payload;
        },
        setModeParams(state, action: PayloadAction<ManualAnnotatorModeParams>) {
            state.modeParams = action.payload;
        },
    },
});

export const {
    openFolder,
    addAnnotation,
    setAnnotations,
    removeAnnotation,
    resetAnnotations,
    setAnnotationAsActive,
    setActiveAnnotations,
    mutateAnnotation,
    setManualAnnotatorMode,
    setModeParams,
} = annotationSlice.actions;

export const selectAnnotations = (state: RootState) => state.annotation.annotationObjects.map(Annotation.fromPlainObject);
export const selectActiveAnnotationIds = (state: RootState) => state.annotation.activeAnnotationIds;
export const selectAnnotationsFolder = (state: RootState) => state.annotation.annotationsFolder;
export const selectImages = (state: RootState) => state.annotation.images;
export const selectMode = (state: RootState) => state.annotation.mode;
export const selectModeParams = (state: RootState) => state.annotation.modeParams;

export const useAnnotations = () => {
    const annotations = useSelector(selectAnnotations);
    return annotations;
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

export const generateAnnotationsFromYaml = (yaml: AnnotationYaml[]): Annotation[] => yaml.map((annotationYaml) => {
    const annotation = Annotation.fromYaml(annotationYaml);

    return annotation;
});

export default annotationSlice.reducer;
