import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { translate } from 'react-jhipster';
import { Modal } from 'reactstrap';

export interface IDialogDirtyCheckProps {
  onLeave?: () => void;
  onStay?: () => void;
  partternType?: any;
}

export const DIRTYCHECK_PARTTERN = {
  PARTTERN1: 1,
  PARTTERN2: 2
};

const DialogDirtyCheck = async (props: IDialogDirtyCheckProps) => {
  const partternType = props.partternType ? props.partternType : DIRTYCHECK_PARTTERN.PARTTERN2;
  const ConfirmModal = ({ onClose }) => {
    return (
      <Modal isOpen style={{ overlay: { zIndex: 10 } }} zIndex="9999">
        <div className="popup-esr2 width-500 max-width-none" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <div className="popup-esr2-title font-weight-bold">
                {partternType === DIRTYCHECK_PARTTERN.PARTTERN2
                  ? translate('global.dialog-dirtycheck.parttern2.title')
                  : translate('global.dialog-dirtycheck.parttern1.title')}
              </div>
              <form className="form-group">
                {partternType === DIRTYCHECK_PARTTERN.PARTTERN2 ? translate('messages.WAR_COM_0005') : translate('messages.WAR_COM_0007')}
              </form>
            </div>
            <div className="popup-esr2-footer">
              <button className="button-cancel" onClick={() => onClose(false)}>
                {partternType === DIRTYCHECK_PARTTERN.PARTTERN2
                  ? translate('global.dialog-dirtycheck.parttern2.cancel')
                  : translate('global.dialog-dirtycheck.parttern1.cancel')}
              </button>
              <button className="button-blue" onClick={() => onClose(true)}>
                {partternType === DIRTYCHECK_PARTTERN.PARTTERN2
                  ? translate('global.dialog-dirtycheck.parttern2.confirm')
                  : translate('global.dialog-dirtycheck.parttern1.confirm')}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const ConfirmDialog = propsConfirm => {
    return new Promise(resolve => {
      let el = document.createElement('div');
      const handleResolve = result => {
        unmountComponentAtNode(el);
        el = null;
        resolve(result);
      };

      render(<ConfirmModal {...propsConfirm} onClose={handleResolve} />, el);
    });
  };

  const result = await ConfirmDialog({});
  if (result && props.onLeave) {
    props.onLeave();
  } else if (!result && props.onStay) {
    props.onStay();
  }
};

export default DialogDirtyCheck;
