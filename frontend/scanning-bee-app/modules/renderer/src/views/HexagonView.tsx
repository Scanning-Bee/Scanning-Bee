import React from 'react';

import { HexagonBase } from './base/HexagonBase';

export const HexagonView = (props: {
    color: string,
    scale?: number,
}) => {
    const { color, scale } = props;

    return (
        <HexagonBase
            scale={scale}
            color={color}
        />
    );
};
