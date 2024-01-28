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
        primaryAccent: '#FFFFFF',
        secondaryAccent: '#D9D9D9',
        tertiaryAccent: '#BFBFBF',
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
