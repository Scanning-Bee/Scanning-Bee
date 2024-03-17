import CellType from '@frontend/models/cellType';

export type Theme = {
    title: string;
    type: 'light' | 'dark';
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

export const Themes: Theme[] = [
    {
        title: 'Light',
        type: 'light',
        primaryForeground: '#000000',
        secondaryForeground: '#313131',
        tertiaryForeground: '#484848',
        primaryBackground: '#FFFFFF',
        secondaryBackground: '#D9D9D9',
        tertiaryBackground: '#BFBFBF',
        primaryAccent: '#E89C08',
        secondaryAccent: '#F4AC18',
        tertiaryAccent: '#F9C62A',
        primaryBorder: '#000000',
        secondaryBorder: '#313131',
        tertiaryBorder: '#484848',
    },
    {
        title: 'Dark',
        type: 'dark',
        primaryForeground: '#FFFFFF',
        secondaryForeground: '#D9D9D9',
        tertiaryForeground: '#BFBFBF',
        primaryBackground: '#000000',
        secondaryBackground: '#313131',
        tertiaryBackground: '#484848',
        primaryAccent: '#F9C62A',
        secondaryAccent: '#F4AC18',
        tertiaryAccent: '#E89C08',
        primaryBorder: '#FFFFFF',
        secondaryBorder: '#D9D9D9',
        tertiaryBorder: '#BFBFBF',
    },
    {
        title: 'METU',
        type: 'light',
        primaryForeground: '#000000',
        secondaryForeground: '#313131',
        tertiaryForeground: '#484848',
        primaryBackground: '#FFFFFF',
        secondaryBackground: '#f32837',
        tertiaryBackground: '#FF4D6D',
        primaryAccent: '#E89C08',
        secondaryAccent: '#F4AC18',
        tertiaryAccent: '#F9C62A',
        primaryBorder: '#000000',
        secondaryBorder: '#313131',
        tertiaryBorder: '#484848',
    },
    {
        title: 'Bees',
        type: 'light',
        primaryForeground: '#000000',
        secondaryForeground: '#313131',
        tertiaryForeground: '#484848',
        primaryBackground: '#F9C62A',
        secondaryBackground: '#F4AC18',
        tertiaryBackground: '#E89C08',
        primaryAccent: '#FFFFFF',
        secondaryAccent: '#D9D9D9',
        tertiaryAccent: '#BFBFBF',
        primaryBorder: '#000000',
        secondaryBorder: '#313131',
        tertiaryBorder: '#484848',
    },
];

export const CellTypeColours: { [key in CellType]: string } = {
    [CellType.BEE_OCCLUDED]: 'rgb(0, 0, 0)',
    [CellType.EGG]: 'rgb(200, 200, 200)',
    [CellType.EMPTY]: 'rgba(255, 102, 195, 1)',
    [CellType.HONEY_CLOSED]: 'rgba(129, 77, 1, 1)',
    [CellType.LARVA]: 'rgba(93, 24, 235, 1)',
    [CellType.NECTAR]: 'rgba(191, 27, 27, 1)',
    [CellType.NOT_CLASSIFIED]: 'rgba(192, 145, 34, 1)',
    [CellType.POLLEN]: 'rgba(0, 190, 98, 1)',
    [CellType.PUPA]: 'rgba(1, 150, 178, 1)',
};
