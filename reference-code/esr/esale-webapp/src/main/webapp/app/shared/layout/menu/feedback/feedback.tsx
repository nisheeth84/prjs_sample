import React, { useEffect, useState } from 'react';
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { jsonParse, isUrlify } from 'app/shared/util/string-utils';
import { reset, createFeedback, createFeedbackStatus, getCompanyName, getGeneral } from './feedback.reducer';
interface IFeedbackModalProps extends StateProps, DispatchProps {
  togglePopup,
  displayType,
  getGeneral
}
import { AUTH_TOKEN_KEY } from 'app/config/constants';
import { Storage } from 'react-jhipster';
import jwtDecode from 'jwt-decode';

export const FeedbackModal = (props: IFeedbackModalProps) => {
  const handleClose = () => {
    props.togglePopup(null);
  };
  const [toggleFeedbackSuccessModal, setToggleFeedbackSuccessModal] = useState(false);
  const [isBtnSend, setIsBtnSend] = useState(false);
  const [comment, setComment] = useState(null);
  const [favorites, setFavorites] = useState(false);
  const [noFavorites, setNoFavorites] = useState(false);
  const [urlLink, setUrlLink] = useState(null);
  useEffect(() => {
    const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    if (jwt) {
      const jwtData = jwtDecode(jwt);
      props.getCompanyName(jwtData['custom:tenant_id']);
    }
  }, []);

  useEffect(() => {
    props.getGeneral("bug_inquiary_url");
    if(props.value){
      const bugInquiaryUrl = (jsonParse(props.value.settingValue)).bug_inquiary_url;

      if (!isUrlify(bugInquiaryUrl)) {
        setUrlLink('http://' + bugInquiaryUrl);
      } else {
        setUrlLink(bugInquiaryUrl);
      }
    }
  }, [props.loadingData])

  const handleFeedbackSuccessModal = () => {
    const paramCreat = {};
    const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    if (jwt) {
      const jwtData = jwtDecode(jwt);
      paramCreat['tenantName'] = jwtData['custom:tenant_id'];
    }
    paramCreat['companyName'] = props.dataCompanyName.companyName;
    paramCreat['feedbackType'] = favorites ? 1 : 0;
    paramCreat['feedbackContent'] = comment ? comment : '';
    paramCreat['displayType'] = props.displayType ? 1 : 0;
    paramCreat['terminalType'] =1;
    paramCreat['content'] = 'Done !';
    props.createFeedback(paramCreat);
  };

  useEffect(() => {
    if (props.createSuccess) {
      props.reset();
      setToggleFeedbackSuccessModal(!toggleFeedbackSuccessModal);
      props.togglePopup(true);
    }
  }, [props.createSuccess]);

  useEffect(() => {
    if (!props.dataStatusOpenFeedback) {
      props.createFeedbackStatus();
    }
  }, [props.dataStatusOpenFeedback]);

  const handleChangeComment = e => {
    const strValue = e.target.value;
    setComment(strValue);
    if (favorites || (noFavorites && strValue !== null && strValue !== '')) {
      setIsBtnSend(true);
    } else {
      setIsBtnSend(false);
    }
  };

  const like = () => {
    setIsBtnSend(true);
    setFavorites(true);
    setNoFavorites(false);
  };

  const disLike = () => {
    setFavorites(false);
    setNoFavorites(true);
    if (comment !== null && comment !== '') {
      setIsBtnSend(true);
    } else {
      setIsBtnSend(false);
    }
  };

  const openSiteSupport = () => {
      window.open(urlLink);
  }

  return (
    <>
      <Modal isOpen={true} className="wrap-feedback modal-open">
        <div className="modal popup-esr user-popup-page popup-align-left show" id="popup-esr" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <span className="text">
                      <img src="../../content/images/ic-feedback.svg" />
                      {translate('feedbacks.popup.text-title')}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <a className="icon-small-primary icon-close-up-small" onClick={handleClose} tabIndex={0} />
                </div>
              </div>
              <div className="modal-body style-3">
                <div className="popup-content style-3">
                  <div className="user-popup-form color-333">
                    <p className="title mb-2">{translate('feedbacks.popup.comfortable.text-title')}</p>
                    <div className="content-form">
                      <p className="mb-1">{translate('feedbacks.popup.comfortable.text-feedback')}</p>
                      <p className="mb-0">
                        {translate('feedbacks.popup.comfortable.text-contact1')}
                        <a className="link" onClick = {openSiteSupport} tabIndex={0}>
                          {translate('feedbacks.popup.comfortable.text-contact-link')}
                        </a>
                        {translate('feedbacks.popup.comfortable.text-contact2')}
                      </p>
                    </div>
                    <div className="option-rating">
                      <div className={favorites ? 'option-item active' : 'option-item'} tabIndex={0} onClick={like}>
                        <img className="mr-2" src="../../content/images/ic-feather-smile.svg" />
                        {translate('feedbacks.popup.comfortable.btn-favorite')}
                      </div>
                      <div className={noFavorites ? 'option-item active' : 'option-item'} tabIndex={0} onClick={disLike}>
                        <img className="mr-2" src="../../content/images/ic-feather-unsmile.svg" />
                        {translate('feedbacks.popup.comfortable.btn-distlike')}
                      </div>
                    </div>
                    <div className="more-respond">
                      <div className="title mb-2">{translate('feedbacks.popup.Additional-feedback.text-title')}
                      
                      {noFavorites ? <span className="label-red ml-2">{translate('feedbacks.popup.Additional-feedback.text-title-red')}</span> : ''} 

                      </div>
                      <textarea
                        className="more-respond-content"
                        placeholder={translate('feedbacks.popup.Additional-feedback.placehoder')}
                        value={comment}
                        onChange={handleChangeComment}
                      />
                    </div>
                  </div>
                </div>
                <div className="user-popup-form-bottom">
                  <button
                    disabled={!isBtnSend}
                    className={isBtnSend ? 'button-blue button-blue-active' : 'button-blue'}
                    onClick={handleFeedbackSuccessModal}
                  >
                    {translate('feedbacks.popup.btn-send')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ feedback, menuLeft }: IRootState) => ({
  createSuccess: feedback.createSuccess,
  dataCompanyName: feedback.companyName,
  dataStatusOpenFeedback: menuLeft.employeeId,
  employeeId: feedback.createStatusSuccess,
  value: feedback.value,
  loadingData: feedback.loadingData
});

const mapDispatchToProps = {
  getCompanyName,
  createFeedback,
  createFeedbackStatus,
  reset,
  getGeneral
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedbackModal);
