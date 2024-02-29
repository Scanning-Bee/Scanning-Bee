import React from 'react';

export const TooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload) {
        return (
            <div className="custom-tooltip">
                <p className="label">
                    <b>{`${label}`}</b> : {`${payload}`}
                </p>
            </div>
        );
    }

    return null;
};
