import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { AnnotationYaml, MetadataWrapperYaml, MetadataYaml, RawMetadataWrapperYaml } from '@scanning_bee/ipc-interfaces';

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

const getImageNames = (folderPath: string) => {
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    try {
        const files = fs.readdirSync(folderPath);
        return files.filter((file) => {
            const fileExtension = file.split('.').pop();

            if (!fileExtension) {
                return false;
            }

            return allowedExtensions.includes(fileExtension.toLowerCase());
        });
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const loadImages = (folderPath: string) => {
    const imageNames = getImageNames(folderPath);

    return imageNames.map(imageName => `file://${path.join(folderPath, imageName)}`);
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

const normalizeMetadata = (folderPath: string, rawMetadata: RawMetadataWrapperYaml) => {
    // this function fixes the unreasonably confusing and inconsistent metadata format that includes the previous image name instead of the
    // current image name. This function checks the next image entry's prev_image field and sets the current image name to that value. For
    // the last image, the prev_image field is set to the only remaining image name.
    const rawMetadataEntries = rawMetadata.image_data;
    const imageNames = getImageNames(folderPath);

    const entryImageNames = [];

    const normalizedMetadata: MetadataWrapperYaml = {
        bag_name: rawMetadata.bag_name,
        image_data: [],
    };

    for (let i = 0; i < rawMetadataEntries.length - 1; i++) {
        const originalEntry = rawMetadataEntries[i];
        const nextEntry = rawMetadataEntries[i + 1];

        const entry: MetadataYaml = {
            sec: originalEntry.sec,
            x_pos: originalEntry.x_pos,
            y_pos: originalEntry.y_pos,
            image_name: null,
        };

        entry.image_name = nextEntry.prev_image;

        normalizedMetadata.image_data.push(entry);

        entryImageNames.push(nextEntry.prev_image);
    }

    const remainingImageName = imageNames.find(imageName => !entryImageNames.includes(imageName));

    const lastImageEntry: MetadataYaml = {
        sec: rawMetadataEntries[rawMetadataEntries.length - 1].sec,
        x_pos: rawMetadataEntries[rawMetadataEntries.length - 1].x_pos,
        y_pos: rawMetadataEntries[rawMetadataEntries.length - 1].y_pos,
        image_name: remainingImageName,
    };

    normalizedMetadata.image_data.push(lastImageEntry);

    return normalizedMetadata;
};

export const loadMetadata = (folderPath: string) => {
    const filePath = path.join(folderPath, 'metadata.yaml');

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = yaml.load(fileContents) as { images: RawMetadataWrapperYaml };
        return normalizeMetadata(folderPath, data.images);
    } catch (e) {
        console.error(e);
        return null;
    }
};
