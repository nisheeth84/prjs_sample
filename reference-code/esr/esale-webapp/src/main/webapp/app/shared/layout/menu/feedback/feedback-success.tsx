import React from 'react';
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';
interface IFeedbackSuccessModalProps { togglePopup }

export const FeedbackSuccessModal = (props: IFeedbackSuccessModalProps) => {
  const handleClose = () => {
    props.togglePopup()
  }

  setTimeout(handleClose,3000)

  return (
    <>
      <Modal isOpen={true} className="wrap-feedback modal-open">
        <div className="modal popup-esr user-popup-page popup-align-left show" id="popup-esr" aria-hidden="true">
          <div className="modal-dialog-success">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back" ><span className="text"><img src="../../content/images/ic-feedback.svg" />{translate('feedbacksuccess.popup.text-title')}</span></div>
                </div>
                <div className="right">
                  <a className="icon-small-primary icon-close-up-small" onClick={handleClose} tabIndex={0} />
                </div>
              </div>
              <div className="modal-body style-3">
                <div className="popup-content mb-0 style-3">
                  <div className="user-popup-form text-center pb-4 color-333">
                    <div className="icon-complete">
                      <img src="../../content/images/ic-feather-complete.svg"  />
                    </div>
                    <div className="font-size-18">{translate('feedbacksuccess.popup.content.content1')}</div>
                    <div className="font-size-18 mb-2">{translate('feedbacksuccess.popup.content.content2')}</div>
                    <div className="font-size-17">{translate('feedbacksuccess.popup.content.content3')}</div>
                  </div>
                </div>
                <div className="user-popup-form-bottom">
                  <a className="button-blue opacity-1" onClick={handleClose}>{translate('feedbacksuccess.popup.btn-close')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default FeedbackSuccessModal;