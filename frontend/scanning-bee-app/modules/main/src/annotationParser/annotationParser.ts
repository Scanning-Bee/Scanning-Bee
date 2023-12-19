import fs from 'fs';
import yaml from 'js-yaml';

type AnnotationYaml = {
    annotated_image: string;
    annotation: string;
    center_x: number;
    center_y: number;
    orig_image: string;
    radius: number;
    sec: number;
    x_pos: number;
    y_pos: number;
};

export const loadAnnotations = (filePath: string) => {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(fileContents) as { annotation_data: { annotations: AnnotationYaml[] } };
        return data.annotation_data.annotations;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const loadImages = (folderPath: string) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    try {
        const files = fs.readdirSync(folderPath);
        return files.filter((file) => {
            const fileExtension = file.split('.').pop();

            if (!fileExtension) {
                return false;
            }

            return allowedExtensions.includes(fileExtension.toLowerCase());
        }).map(file => `file://${folderPath}/${file}`);
    } catch (e) {
        console.error(e);
        return null;
    }
};
