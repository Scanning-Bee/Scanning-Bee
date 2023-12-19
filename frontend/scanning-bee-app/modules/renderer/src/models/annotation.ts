import { UUID } from 'crypto';

import CellType from './cellType';

export type AnnotationYaml = {
    annotated_image: string;
    annotation: CellType;
    center_x: number;
    center_y: number;
    orig_image: string;
    radius: number;
    sec: number;
    x_pos: number;
    y_pos: number;
};

export interface AnnotationProps {
    radius: number,
    center: number[],
    cell_type: CellType,
    source_name: string,
    timestamp: number,
    poses: number[],
}

export type AnnotationPropsWithID = AnnotationProps & { id: UUID };

export type AnnotationMutation = {
    id: UUID;
    mutations: Partial<AnnotationProps>;
};

export default class Annotation {
    id: UUID;

    radius: number;

    center: number[];

    cell_type: CellType;

    source_name: string;

    timestamp: number;

    poses: number[];

    constructor(
        annotationProps: AnnotationProps,
    ) {
        const {
            radius,
            center,
            cell_type,
            source_name,
            timestamp,
            poses,
        } = annotationProps;

        this.radius = radius;
        this.center = center;
        this.cell_type = cell_type;
        this.source_name = source_name;
        this.timestamp = timestamp;
        this.poses = poses;

        // Generate a UUID for this annotation
        this.id = crypto.randomUUID() as UUID;
    }

    static toYaml(annotation: Annotation): AnnotationYaml {
        const {
            radius,
            center,
            cell_type,
            source_name,
            timestamp,
            poses,
        } = annotation;

        return {
            radius,
            center_x: center[0],
            center_y: center[1],
            annotation: cell_type,
            orig_image: source_name,
            sec: timestamp,
            x_pos: poses[0],
            y_pos: poses[1],
            annotated_image: source_name,
        };
    }

    static fromYaml(yaml: AnnotationYaml): Annotation {
        const center = [yaml.center_x, yaml.center_y];
        const poses = [yaml.x_pos, yaml.y_pos];

        return new Annotation({
            radius: yaml.radius,
            center,
            cell_type: yaml.annotation,
            source_name: yaml.orig_image,
            timestamp: yaml.sec,
            poses,
        });
    }

    static toPlainObject(annotation: Annotation): AnnotationPropsWithID {
        return {
            id: annotation.id,
            radius: annotation.radius,
            center: annotation.center,
            cell_type: annotation.cell_type,
            source_name: annotation.source_name,
            timestamp: annotation.timestamp,
            poses: annotation.poses,
        };
    }

    static fromPlainObject(annotationProps: AnnotationPropsWithID): Annotation {
        const id = annotationProps.id as UUID;
        const propsWithNoId = { ...annotationProps };

        delete propsWithNoId.id;

        const newAnnotation = new Annotation(propsWithNoId);

        newAnnotation.id = id;

        return newAnnotation;
    }

    public applyMutation(mutation: AnnotationMutation): Annotation {
        Object.keys(mutation.mutations)
            .forEach((key) => {
                this[key] = mutation.mutations[key];
            });

        return this;
    }
}
