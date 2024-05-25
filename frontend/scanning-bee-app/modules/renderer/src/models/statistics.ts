import CellType from './cellType';

export type AnnotatorStatistic = {
    fullName: string;
    username: string;
    totalAnnotations: number;
    totalImages: number;
    annotationsByCellType: Record<CellType, number>;
};
