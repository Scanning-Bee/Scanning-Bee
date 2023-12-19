import { UUID } from 'crypto';
import { useSelector } from 'react-redux';
import Annotation, { AnnotationMutation, AnnotationPropsWithID, AnnotationYaml } from '@frontend/models/annotation';
import { RootState } from '@frontend/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AnnotationsState = {
    // contains the plain object versions of the annotations. contains AnnotationProps and the id
    annotationObjects: AnnotationPropsWithID[];
    images: string[];
    activeAnnotationId: UUID | null;
    annotationsFolder: string | null;
};

const initialState: AnnotationsState = {
    annotationObjects: [],
    images: [], // file://blahblahblah
    activeAnnotationId: null,
    annotationsFolder: null,
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
        },
        addAnnotation(state, action: PayloadAction<AnnotationPropsWithID>) {
            state.annotationObjects = [...state.annotationObjects, action.payload];
        },
        setAnnotations(state, action: PayloadAction<AnnotationPropsWithID[]>) {
            state.annotationObjects = action.payload;
        },
        removeAnnotation(state, action: PayloadAction<UUID>) {
            if (state.activeAnnotationId === action.payload) {
                state.activeAnnotationId = null;
            }

            state.annotationObjects = state.annotationObjects.filter(annotation => annotation.id !== action.payload);
        },
        resetAnnotations(state) {
            state.annotationObjects = [];
            state.activeAnnotationId = null;
            state.annotationsFolder = null;
        },
        setActiveAnnotation(state, action: PayloadAction<UUID | null>) {
            state.activeAnnotationId = action.payload;
        },
        mutateAnnotation(state, action: PayloadAction<AnnotationMutation>) {
            const mutation = action.payload;
            const index = state.annotationObjects.findIndex(annotation => annotation.id === mutation.id);

            const annotations = state.annotationObjects.map(Annotation.fromPlainObject);

            annotations[index] = annotations[index].applyMutation(mutation);

            state.annotationObjects = annotations.map(Annotation.toPlainObject);
        },
    },
});

export const {
    openFolder,
    addAnnotation,
    setAnnotations,
    removeAnnotation,
    resetAnnotations,
    setActiveAnnotation,
    mutateAnnotation,
} = annotationSlice.actions;

export const selectAnnotations = (state: RootState) => state.annotation.annotationObjects.map(Annotation.fromPlainObject);
export const selectActiveAnnotationId = (state: RootState) => state.annotation.activeAnnotationId;
export const selectAnnotationsFolder = (state: RootState) => state.annotation.annotationsFolder;
export const selectImages = (state: RootState) => state.annotation.images;

export const useAnnotations = () => {
    const annotations = useSelector(selectAnnotations);
    return annotations;
};
export const useActiveAnnotation = () => {
    const activeAnnotationId = useSelector(selectActiveAnnotationId);
    const annotations = useSelector(selectAnnotations);

    const activeAnnotation = annotations.find(annotation => annotation.id === activeAnnotationId);

    return activeAnnotation;
};
export const useActiveAnnotationId = () => {
    const activeAnnotationId = useSelector(selectActiveAnnotationId);
    return activeAnnotationId;
};
export const useAnnotationsFolder = () => {
    const annotationsFolder = useSelector(selectAnnotationsFolder);
    return annotationsFolder;
};

export const useImages = () => {
    const images = useSelector(selectImages);
    return images;
};

export const generateAnnotationsFromYaml = (yaml: AnnotationYaml[]): Annotation[] => yaml.map((annotationYaml) => {
    const annotation = Annotation.fromYaml(annotationYaml);

    return annotation;
});

export default annotationSlice.reducer;
