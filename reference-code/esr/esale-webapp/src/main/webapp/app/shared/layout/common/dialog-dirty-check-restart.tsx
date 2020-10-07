import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { translate } from 'react-jhipster';
import { Modal } from 'reactstrap';

export interface IDialogDirtyCheckRestartProps {
  onLeave?: () => void,
  onStay?: () => void,
}

const DialogDirtyCheckRestart = async (props: IDialogDirtyCheckRestartProps) => {
  const ConfirmModal = ({ onClose }) => {
    return (
      <Modal
        isOpen
        style={{ overlay: { zIndex: 10 } }}
        zIndex="9999"
      >
        <div className="popup-esr2 popup-esr5 width-500" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body border-bottom mb-3">
              <div className="popup-esr2-title">{translate("global.title-restart.confirm")}</div>
              <form className="form-group">
                {translate("messages.WAR_COM_0005")}
              </form>
            </div>
            <div className="align-center mb-3">
              <button className="button-cancel w45 mr-2" onClick={() => onClose(false)}>{translate("global.title-restart.btn-cancel")}</button>
              <button className="button-blue w45" onClick={() => onClose(true)}>{translate("global.title-restart.btn-confirm")}</button>
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

export default DialogDirtyCheckRestart;
