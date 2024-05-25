import CellType from '@frontend/models/cellType';
import { Theme } from '@scanning_bee/ipc-interfaces/src/miscTypes';

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
        type: 'dark',
        primaryForeground: '#FFFFFF',
        secondaryForeground: '#D9D9D9',
        tertiaryForeground: '#BFBFBF',
        primaryBackground: '#440000',
        secondaryBackground: '#660000',
        tertiaryBackground: '#990000',
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
    [CellType.BEE_OCCLUDED]: 'rgb(55, 12, 52)',
    [CellType.EGG]: 'rgb(200, 200, 200)',
    [CellType.EMPTY]: 'rgba(255, 102, 195, 1)',
    [CellType.HONEY_CLOSED]: 'rgba(129, 77, 1, 1)',
    [CellType.LARVAE]: 'rgba(93, 24, 235, 1)',
    [CellType.NECTAR]: 'rgba(191, 27, 27, 1)',
    [CellType.NOT_CLASSIFIED]: 'rgba(192, 145, 34, 1)',
    [CellType.POLLEN]: 'rgba(0, 190, 98, 1)',
    [CellType.PUPPA]: 'rgba(1, 150, 178, 1)',
};

export const StaticHomePageHexagonColours = [
    '#00bf63',
    '#c1ff72',
    '#ffde59',
    '#ff914d',
    '#ff5757',
    '#cb6ce6',
    '#5271ff',
    '#0097b2',
];

/**
 * is not an actual random function, essentially a hash function.
 * @param seed
 */
export const randomColour = (seed: string) => {
    const CHARS = 'öYİZXASüĞk3RbnrŞHIfgUÇ.Bv9QKLJM7yG6mçopğWDFC1OPdzxcT8Üh_qwulştje-i2E0s45NaVÖ';
    const len = seed.length;
    let sum = 0;

    for (let i = 0; i < seed.length; i++) {
        const char = seed.charAt(i);
        const index = CHARS.indexOf(char);
        sum += index * i;
    }

    const val = (sum / (77 * len)) * 16777216;
    let colour = (Math.floor(val - ((16777216 - val) * (len % 4)) / 10) % 16777216).toString(16);

    while (colour.length < 6) {
        colour = `B${colour}`;
    }

    return `#${colour}`;
};
