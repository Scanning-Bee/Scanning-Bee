import React from 'react';

import { HexagonBase } from './base/HexagonBase';

export const HexagonView = (props: {
    color: string,
}) => {
    const { color } = props;

    return (
        <HexagonBase
            color={color}
        />
    );
};
