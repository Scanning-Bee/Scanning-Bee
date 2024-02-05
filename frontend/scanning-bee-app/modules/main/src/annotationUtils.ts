import fs from 'fs';
import yaml from 'js-yaml';
import { AnnotationYaml } from '@scanning_bee/ipc-interfaces';

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

export const saveAnnotations = (annotations: AnnotationYaml[], targetFolder: string) => {
    const data = {
        annotation_data: {
            annotations,
        },
    };

    const yamlString = yaml.dump(data);

    fs.writeFileSync(`${targetFolder}/annotations/annotations.yaml`, yamlString);
};
