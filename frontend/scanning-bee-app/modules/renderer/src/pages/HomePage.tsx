import BeeBlack from '@assets/images/bee-black.png';
import BeeWhite from '@assets/images/bee-white.png';
import { Icon, IconName } from '@blueprintjs/core';
import { useTheme } from '@frontend/slices/themeSlice';
import { StaticHomePageHexagonColours } from '@frontend/utils/colours';
import { repeatArray } from '@frontend/utils/miscUtils';
import { HexagonBase } from '@frontend/views/base/HexagonBase';
import React, { useEffect, useState } from 'react';

type HexagonCellData = {
    color: string;
    icon?: IconName | 'beehive';
    text?: string;
    page?: PageType;
};

type HexagonRowData = {
    cells: HexagonCellData[];
};

type HexagonGridData = {
    rows: HexagonRowData[];
};

const generateHexagonGrid = () => {
    const hexagonGrid: HexagonGridData = {
        rows: [],
    };

    const N = 3;

    const rowCount = 5 * N - 2;

    const repeatedColours = repeatArray(StaticHomePageHexagonColours, N + 1);

    let rowCellColours = repeatedColours.slice(0, 6 * N);

    for (let i = 0; i < rowCount; i++) {
        const row: HexagonRowData = {
            cells: [],
        };

        const isMiddleRow = i === Math.floor(rowCount / 2);

        let rowCellCount: number;

        if (i % 2 === 0) {
            rowCellCount = 6 * N;

            rowCellColours = rowCellColours.slice(0, rowCellCount);
        } else {
            rowCellCount = 6 * N + 1;

            rowCellColours = repeatedColours.slice(8 - (Math.ceil(i / 2) % 8), 9 - (Math.ceil(i / 2) % 8)).concat(rowCellColours);
        }

        for (let j = 0; j < rowCellCount; j++) {
            row.cells.push({
                color: rowCellColours[j],
            });
        }

        if (isMiddleRow) {
            const startIdx = Math.floor(row.cells.length / 2) - 2;

            row.cells[startIdx].icon = 'annotation';
            row.cells[startIdx].text = 'Manual Annotator';
            row.cells[startIdx].page = 'manual-annotator';

            row.cells[startIdx + 1].icon = 'timeline-bar-chart';
            row.cells[startIdx + 1].text = 'Annotation Statistics';
            row.cells[startIdx + 1].page = 'statistics';

            row.cells[startIdx + 2].icon = 'beehive';
            row.cells[startIdx + 2].text = 'Visual Beehive';
            row.cells[startIdx + 2].page = 'beehive';

            row.cells[startIdx + 3].icon = 'cog';
            row.cells[startIdx + 3].text = 'Settings';
            row.cells[startIdx + 3].page = 'settings';
        }

        hexagonGrid.rows.push(row);
    }

    return hexagonGrid;
};

const HexagonButton = (props: { onClick: () => void, color: string, icon?: IconName | 'beehive', text?: string }) => {
    const theme = useTheme();

    const interactable = props.onClick !== undefined;

    const [hovered, setHovered] = useState(false);

    return (
        <div
            className={`${interactable ? 'interactable ' : ''}static-hexagon-button`}
            onClick={props.onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <HexagonBase
                color={props.color}
                opacity={interactable ? 1 : 0.25}
                width={300}
                height={300}
            />
            {props.icon && !hovered && interactable
            && (props.icon === 'beehive'
                ? <img
                    src={theme.type === 'dark' ? BeeWhite : BeeBlack}
                    alt={'Scanning Bee Logo'}
                    style={{ width: '100px', position: 'absolute' }}
                />
                : <Icon icon={props.icon as IconName} iconSize={100} style={{ position: 'absolute' }}/>)

            }
            {props.text && hovered && interactable && <h1
                className='static-hexagon-button-text'
            >{props.text}
            </h1>}
        </div>
    );
};

export const HomePage = (props: {
    setPage: (arg: PageType) => void,
}) => {
    const { setPage } = props;

    const theme = useTheme();

    const hexagonGrid = generateHexagonGrid();

    const [xAxisOverflow, setXAxisOverflow] = useState(false);

    useEffect(() => {
        const resize = () => {
            const width = window.innerWidth;

            setXAxisOverflow(width < 1050);
        };

        window.addEventListener('resize', resize);

        resize();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <div
            style={{
                backgroundColor: theme.primaryBackground,
                color: theme.primaryForeground,
                display: 'flex',
            }}
            className='page'
        >
            <div
                className='static'
                style={{
                    overflowX: xAxisOverflow ? 'scroll' : 'hidden',
                }}
            >
                {hexagonGrid.rows.map((row, i) => (
                    <div
                        key={i}
                        className='static-hexagon-grid-row'
                    >
                        {row.cells.map((cell, _) => (
                            <HexagonButton
                                onClick={
                                    cell.page
                                        ? () => setPage(cell.page)
                                        : undefined
                                }
                                color={cell.color}
                                icon={cell.icon}
                                text={cell.text}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
