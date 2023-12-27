import { Position, Toaster } from '@blueprintjs/core';

export const AppToaster = Toaster.create({
    className: 'toaster',
    // usePortal: true,
    position: Position.TOP,
    // position: Position.LEFT_TOP,
    maxToasts: 6,
});
