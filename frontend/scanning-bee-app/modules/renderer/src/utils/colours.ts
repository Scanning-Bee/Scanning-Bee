import CellType from '@frontend/models/cellType';

export type Theme = {
    primaryForeground: string;
    secondaryForeground: string;
    tertiaryForeground: string;
    primaryBackground: string;
    secondaryBackground: string;
    tertiaryBackground: string;
    primaryAccent: string;
    secondaryAccent: string;
    tertiaryAccent: string;
    primaryBorder: string;
    secondaryBorder: string;
    tertiaryBorder: string;
};

export const lightTheme: Theme = {
    primaryForeground: '#000000',
    secondaryForeground: '#313131',
    tertiaryForeground: '#484848',
    primaryBackground: '#F9C62A',
    secondaryBackground: '#F4AC18',
    tertiaryBackground: '#E89C08',
    primaryAccent: '#e31837',
    secondaryAccent: '#B8001A',
    tertiaryAccent: '#9B0018',
    primaryBorder: '#000000',
    secondaryBorder: '#313131',
    tertiaryBorder: '#484848',
};

export const darkTheme: Theme = {
    primaryForeground: '#F9C62A',
    secondaryForeground: '#F4AC18',
    tertiaryForeground: '#E89C08',
    primaryBackground: '#000000',
    secondaryBackground: '#313131',
    tertiaryBackground: '#484848',
    primaryAccent: '#e31837',
    secondaryAccent: '#B8001A',
    tertiaryAccent: '#9B0018',
    primaryBorder: '#F9C62A',
    secondaryBorder: '#F4AC18',
    tertiaryBorder: '#E89C08',
};

export const CellTypeColours: { [key in CellType]: string } = {
    [CellType.BEE_OCCLUDED]: 'rgb(255, 255, 0)',
    [CellType.EGG]: 'rgb(0, 255, 0)',
    [CellType.EMPTY]: 'rgb(0, 0, 255)',
    [CellType.HONEY_CLOSED]: 'rgb(255, 140, 0)',
    [CellType.LARVAE]: 'rgb(255, 255, 255)',
    [CellType.NECTAR]: 'rgb(255, 255, 204)',
    [CellType.NOT_CLASSIFIED]: 'rgb(255, 128, 128)',
    [CellType.POLLEN]: 'rgb(0, 0, 139)',
    [CellType.PUPPA]: 'rgb(165, 42, 42)',
};
