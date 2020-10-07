import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { translate } from 'react-jhipster';
import { Modal } from 'reactstrap';

export interface IPopupConfirmProps {
  onConfirm?: () => void,
  onCancel?: () => void,
}

/**
 * component for show confirm restore draft
 * @param props 
 */
const PopupConfirmRestoreDraft = async (props: IPopupConfirmProps) => {

  const ConfirmModal = ({ onClose }) => {
    return (
      <Modal
        isOpen
        className="z-index-99"
        zIndex="auto"
      >
        <div className="popup-esr2 popup-activity-es3" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form className="form-group">
                <div className="popup-esr2-title">{translate('global.title.confirm')}</div>
                <p>{translate('activity.message.confirm.restoreDraft')}</p>
              </form>
            </div>
            <div className="popup-esr2-footer d-flex justify-content-center">
              <a className="button-cancel mr-4" onClick={() => onClose(false)}>{translate('global.button.cancel')}</a>
              <a className="button-blue ml-4" onClick={() => onClose(true)}>{translate('global.button.confirm')}</a>
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

export default PopupConfirmRestoreDraft;
