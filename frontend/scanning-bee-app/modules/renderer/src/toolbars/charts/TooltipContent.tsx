import React from 'react';

type LabelPayload = {
    label: any;
    payload: any;
};

export const TooltipContent = (props: { active: boolean, labelPayloads: LabelPayload[] }) => {
    const { active, labelPayloads } = props;

    if (active && labelPayloads.length > 0) {
        return (
            <div className="custom-tooltip">
                {labelPayloads.map(({ label, payload }, i) => <p className="label">
                    <b key={i}>{`${label}`}</b> : {`${payload}`} <br/>
                </p>)}
            </div>
        );
    }

    return null;
};
