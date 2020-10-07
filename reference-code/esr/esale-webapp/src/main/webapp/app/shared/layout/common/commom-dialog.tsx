import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { translate } from 'react-jhipster';
import { Modal } from 'reactstrap';

export interface ICommonDialogProps {
  title?: string,
  message: string,
  cancelText?: string,
  submitText?: string,
  onLeave?: () => void,
  onStay?: () => void,
}

const CommonDialog = async (props: ICommonDialogProps) => {
  const {
    title,
    message,
    cancelText,
    submitText
  } = props;

  const ConfirmModal = ({ onClose }) => {
    return (
      <Modal
        isOpen
        style={{ overlay: { zIndex: 10 } }}
        zIndex="9999"
      >
        <div className="popup-esr2 popup-esr5" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body border-bottom mb-4">
              <div className="popup-esr2-title">{title}</div>
              <form className="form-group">
                {message}
              </form>
            </div>
            <div className="align-center mb-4">
              {props.onStay && <a title="" className="button-cancel" onClick={() => onClose(false)}>{cancelText ? cancelText : translate("global.button.cancel")}</a>}
              <a title="" className="button-blue" onClick={() => onClose(true)}>{submitText ? submitText : translate("global.button.confirm")}</a>
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

export default CommonDialog;
