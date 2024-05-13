import React from 'react';

export const HexagonBase = (props: {
    color: string,
    opacity?: number,
    width?: string | number,
    height?: string | number,
    scale?: number,
}) => {
    const { color, opacity, width, height, scale } = props;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={width || 42 * (scale || 1)}
            zoomAndPan="magnify"
            viewBox="0 0 2598 2999.999989"
            height={height || 48 * (scale || 1)}
            preserveAspectRatio="xMidYMid meet"
            version="1.0"
            fill={color}
            color={color}
            fillOpacity={opacity || 1}
            stroke="none"
        >
            <defs>
                <clipPath
                    id="b87f4d996d"
                >
                    <path
                        d="M 9.9375 0 L 2588.0625 0 L 2588.0625 3000 L 9.9375 3000 Z M 9.9375 0 "
                        clipRule="nonzero"
                    />
                </clipPath>
                <clipPath
                    id="572cd5f733"
                >
                    <path
                        d="M 1299 0 L 2588.0625 750 L 2588.0625 2250 L 1299 3000 L 9.9375 2250 L 9.9375 750 Z M 1299 0 "
                        clipRule="nonzero"
                    />
                </clipPath>
            </defs>
            <g clipPath="url(#b87f4d996d)">
                <g clipPath="url(#572cd5f733)">
                    <path
                        d="M 9.9375 0 L 2588.0625 0 L 2588.0625 3001.097656 L 9.9375 3001.097656 Z M 9.9375 0 "
                    />
                </g>
            </g>
        </svg>
    );
};
