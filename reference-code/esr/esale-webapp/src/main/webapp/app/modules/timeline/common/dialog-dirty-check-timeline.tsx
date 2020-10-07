import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Modal } from 'reactstrap';

export interface IDialogDirtyCheckTimelineProps {
  onLeave?: () => void;
  onStay?: () => void;
  title: string;
  content: string;
  ok: string;
  cancel: string;
  partternType?: any;
}

const DialogDirtyCheckTimeline = async (props: IDialogDirtyCheckTimelineProps) => {
  const ConfirmModal = ({ onClose }) => {
    return (
      <Modal isOpen zIndex="9999">
        <div className="popup-esr2 width-500 max-width-none" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <div className="popup-esr2-title font-weight-bold">
                {props.title}
              </div>
              <form className="form-group">
                {props.content}
              </form>
            </div>
            <div className="popup-esr2-footer">
              <a title="" className="button-cancel" onClick={() => onClose(false)}>
                {props.cancel}
              </a>
              <a title="" className="button-blue" onClick={() => onClose(true)}>
                {props.ok}
              </a>
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

export default DialogDirtyCheckTimeline;
