import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import ConfirmModal from './confirm-modal';

const ConfirmDialogCustom = props => {
    return new Promise(resolve => {
        let el = document.createElement('div');
        const handleResolve = result => {
            unmountComponentAtNode(el);
            el = null;
            resolve(result);
        };

        render(<ConfirmModal {...props} onClose={handleResolve} />, el);
    });
};

export default ConfirmDialogCustom;
