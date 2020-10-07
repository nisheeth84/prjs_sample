import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { translate } from 'react-jhipster';
import { Modal } from 'reactstrap';

export interface IDialogDirtyCheckPopupProps {
  onLeave?: () => void,
  onStay?: () => void,
}

const DialogDirtyCheckPopup = async (props: IDialogDirtyCheckPopupProps) => {

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
              <div className="popup-esr2-title">{translate("global.title-popup.confirm")}</div>
              <form className="form-group">
                {translate("messages.WAR_COM_0007")}
              </form>
            </div>
            <div className="align-center mb-3">
              <button title="" className="button-cancel w45 mr-2" onClick={() => onClose(false)}>{translate("global.title-popup.btn-cancel")}</button>
              <button title="" className="button-blue w45 p-2" onClick={() => onClose(true)}>{translate("global.title-popup.btn-confirm")}</button>
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

export default DialogDirtyCheckPopup;
