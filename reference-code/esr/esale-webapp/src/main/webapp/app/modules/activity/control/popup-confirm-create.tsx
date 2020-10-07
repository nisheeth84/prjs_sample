import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { translate } from 'react-jhipster';
import { Modal } from 'reactstrap';

export interface IPopupConfirmProps {
  onSaveDraft?: () => void,
  onConfirm?: () => void,
  onCancel?: () => void,
}

/**
 * component for show confirm create
 * @param props
 */
const PopupConfirmCreate= async (props: IPopupConfirmProps) => {

  const ConfirmModal = ({ onClose }) => {
    return (
      <Modal
        isOpen
        className="z-index-99"
        zIndex="auto"
      >
        <div className="popup-esr2 popup-activity-es3 w-auto" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form className="form-group">
                <div className="popup-esr2-title">{translate('global.title.confirm')}</div>
                <p>{translate('activity.message.confirm.confirmreateactivity1')}</p>
                <p className ="mt-1" >{translate('activity.message.confirm.confirmreateactivity2')}</p>
              </form>
            </div>
            <div className="popup-esr2-footer">
              <a className="button-cancel mr-1" onClick={() => onClose(false)}>{translate('activity.modal.button-cancel')}</a>
              <a className="button-cancel ml-1 mr-1" onClick={() => onClose(false)}>{translate('activity.modal.button-save-draft')}</a>
              <a className="button-red ml-1" onClick={() => onClose(true)}>{translate('activity.modal.button-close')}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop-two show" />
      </Modal>
    );
  };

  const ConfirmDialog = propsConfirm => {
    return new Promise(resolve => {
      let el = document.createElement('div');
      const handleResolve = res => {
        unmountComponentAtNode(el);
        el = null;
        resolve(res);
      };

      render(<ConfirmModal {...propsConfirm} onClose={handleResolve} />, el);
    });
  };

  const result = await ConfirmDialog({});
  if (result && props.onConfirm) {
    props.onConfirm();
  } else if (!result && props.onCancel) {
    props.onCancel();
  }

};

export default PopupConfirmCreate;
