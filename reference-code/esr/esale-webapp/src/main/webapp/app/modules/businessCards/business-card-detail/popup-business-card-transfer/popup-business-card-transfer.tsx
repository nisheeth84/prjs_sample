import React, { useState, useRef, useEffect } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { Modal } from 'reactstrap';
import { updateBusinessCards, reset } from './popup-business-card-transfer.reducer';
import useEventListener from 'app/shared/util/use-event-listener';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import _ from 'lodash';
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { TagAutoCompleteMode, TagAutoCompleteType } from 'app/shared/layout/common/suggestion/constants';
import { BusinessCardTranferAction } from './popup-business-card-transfer.reducer';
import styled from 'styled-components';
import FocusTrap from 'focus-trap-react';

let Wrapper = styled.div`
  /* #modal-body-transfer {
    max-height: 120px;
  } */
  /* .modal-dialog {
    height: auto;
    top: 50% !important;
    transform: translateY(-25%) !important;
    box-shadow: none;
    .modal-content {
      .popup-content {
        height: auto !important;
      }
    }
  } */
  .user-popup-form-bottom{
    border-radius: 0 0 10px 10px;
  }
`;

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

interface IPopupBusinessCardTransferProps {
  closePopupTransfer?: () => void;
  action?: any;
  errorMessage?: any;
  updateBusinessCards?: any;
  tenant?: any;
  listOfBusinessCardId?: any;
  cardDetail?: any;
  reset?: any;
  popout?: boolean;
  match?: any;
  businessCardCurrentDetail?: any
}

const PopupBusinessCardTransfer = (props: IPopupBusinessCardTransferProps) => {
  const ref = useRef(null);
  const [tags, setTags] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  // tag state will be used when submit
  const [tagSubmit, setTagSubmit] = useState(null);
  // text value will be use in case alternativeCustomerName
  const [textValue, setTextValue] = useState('');
  const [hoverTab, setHoverTab] = useState(false);
  // flag use for show suggestion when search
  const [showModal, setShowModal] = useState(true);
  // use for disable submit and cancel buttons
  const [disableForm, setDisableForm] = useState(false);
  const [errorFromBackend, setErrorFromBackend] = useState(null);
  const [errorValidateFrontend, setErrorValidateFrontend] = useState(null);

  const onDeleteTag = (idx) => {
    ref.current.deleteTag(idx);
    setHoverTab(false);
    setTextValue('');
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void, modalType?: number) => {
    if (textValue || tagSubmit) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: modalType });
    } else {
      action();
    }
  }

  const renderToastMessage = () => {
    if (toastMessage === null) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={toastMessage.type}
        message={toastMessage.message}
        className="message-area-bottom position-absolute"
      />
    )
  }

  const displayToastMessage = (message, type, callback) => {
    if (message) {
      const objParams = { message, type };
      setToastMessage(objParams);
      setTimeout(() => {
        setToastMessage(null);
        setDisableForm(false);
        callback && callback();
      }, TIMEOUT_TOAST_MESSAGE);
    }
  };

  const renderPaticipantList = () => {
    return tags && tags.map((member, index) => {
      let tagName1 = "";
      let tagName2 = "";
      let tagName3 = "";
      let tagName4 = "";
      if (member.parentCustomerName) {
        tagName4 = member["parentCustomerName"] + " - ";
        tagName1 = member["parentCustomerName"];
      }
      if (member.customerName) tagName2 = member["customerName"];
      if (member.address) tagName3 = member["address"];
      return <div className={"input-common-wrap delete"} key={index}>
        <input onMouseEnter={() => setHoverTab(true)} type="text" className="input-normal" value={`${tagName4} ${tagName2}`}></input>
        <span className="icon-delete" onClick={() => onDeleteTag(index)}></span>
        {hoverTab && <div className="drop-down h-auto w100">
          <div className="dropdown-item">
            <div className="item smooth">
              <div className="text text1">{tagName1}</div>
              <div className="text text2">{tagName2}</div>
              <div className="text text3">{tagName3}</div>
            </div>
          </div>
        </div>}
      </div>
    })
  }

  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag.length > 0) {
      setTagSubmit(listTag[0]);
    } else {
      setTagSubmit(null);
    }
  }

  /**
  * get data for tag suggestion
  * @param item
  */
  const getDataTagStatusControl = () => {
    let fieldValue = null;
    if (tagSubmit) {
      let _tags = [];
      _tags = [{
        customerId: tagSubmit?.customerId,
        customerName: tagSubmit?.customerName,
      }];
      fieldValue = _tags;
    } else if (props.businessCardCurrentDetail?.businessCardDetail?.customerId) {
      fieldValue = [{
        customerId: props.businessCardCurrentDetail.businessCardDetail.customerId,
        customerName: props.businessCardCurrentDetail.businessCardDetail.customerName
      }];
      setTagSubmit(fieldValue[0])
    }
    return fieldValue;
  }

  const renderErrorFromBackend = () => {
    return errorFromBackend && <div className="message-area">
      {errorFromBackend.map((e, index) => <BoxMessage className="mb-2" key={index} messageType={MessageType.Error} message={translate(`messages.${e.errorCode}`, e?.interpolate)} />)}
    </div>
  }

  const handleSubmit = () => {
    let cardDetailPayload;
    if (props.popout) {
      cardDetailPayload = { businessCardId: props?.match?.params?.businessCardId };
    } else {
      cardDetailPayload = { businessCardId: props.cardDetail?.businessCardId, firstName: props.cardDetail?.firstName };
    }
    const maxLength = 100;
    setErrorValidateFrontend([]);
    setErrorFromBackend(null);
    if (!_.isEmpty(tagSubmit)) {
      const payload = Object.assign(
        cardDetailPayload,
        { customerId: tagSubmit?.customerId, customerName: tagSubmit?.customerName }
      );
      props.updateBusinessCards({ businessCards: [payload] });
    } else {
      if (textValue) {
        if (textValue.length > maxLength) {
          setErrorValidateFrontend([{ errorCode: "ERR_COM_0025", interpolate: { 0: maxLength } }])
        } else {
          const payload = Object.assign(
            cardDetailPayload,
            { alternativeCustomerName: _.toString(textValue).trim() }
          )

          props.updateBusinessCards({ businessCards: [payload] });
        }
      } else {
        const payload = Object.assign(
          cardDetailPayload,
          { customerId: null }
        );
        props.updateBusinessCards({ businessCards: [payload] });
      }
    }
  }

  /**
    * updateStateSession when open new popup
    */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(PopupBusinessCardTransfer.name, {
        tags,
        toastMessage,
        tagSubmit,
        textValue,
        hoverTab,
        showModal,
        disableForm,
        errorValidateFrontend
      });

    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(PopupBusinessCardTransfer.name);
      if (saveObj) {
        setTags(saveObj.tags);
        setToastMessage(saveObj.toastMessage);
        setTagSubmit(saveObj.tagSubmit);
        setTextValue(saveObj.textValue);
        setHoverTab(saveObj.hoverTab);
        setShowModal(saveObj.showModal);
        setDisableForm(saveObj.disableForm);
        setErrorValidateFrontend(saveObj.errorValidateFrontend);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(PopupBusinessCardTransfer.name);
    }
  };

  const openNewWindow = () => {
    props.closePopupTransfer();
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.5;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    const newWindow = window.open(`${props.tenant}/business-card-transfer/${props.cardDetail?.businessCardId}`, '', style.toString());
    newWindow.onbeforeunload = () => {
      props.closePopupTransfer();
    }
  };

  const onBeforeUnload = (ev) => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': false }, window.location.origin);
    }
  };

  const onReceiveMessage = (ev) => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          setShowModal(true);
        }
      }
    }
  }

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  const handleClosePopup = (typeModal = 2) => {
    executeDirtyCheck(() => {
      props.closePopupTransfer();
    }, null, typeModal);
  }


  useEffect(() => {
    if (props.listOfBusinessCardId && props.listOfBusinessCardId.length > 0) {
      setDisableForm(true);
      displayToastMessage(translate('messages.INF_COM_0004'), MessageType.Success, props.closePopupTransfer);
      props.reset();
    }
  }, [props.listOfBusinessCardId]);

  useEffect(() => {
    setErrorFromBackend(props.errorMessage);
  }, [props.errorMessage]);

  useEffect(() => {
    if (props.action === BusinessCardTranferAction.Success) {
      if (props.popout) {
        window.close();
      }
    }
  }, [props.action])

  useEffect(() => {
    if (props.popout) {
      setShowModal(false);
      updateStateSession(FSActionTypeScreen.GetSession);
      document.body.className = "body-full-width";
    } else {
      setShowModal(true);
    }
    return (() => {
      if (props.popout) {
        updateStateSession(FSActionTypeScreen.RemoveSession);
      }
      props.reset();
    })
  }, []);

  if (window.location.href.includes("business-card-transfer")) {
    Wrapper = styled.div`
  #modal-body-transfer {
    max-height: unset;
  }
  .modal-dialog {
    top: 0% !important;
    transform: translateY(0%) !important;
    box-shadow: none;
    .modal-content {
      .popup-content {
        height: auto !important;
      }
    }
  }
  `;
  }

  const onchangeText = (value) => {
    setTextValue(value);
  }

  const renderPopupTransfer = () => {
    return <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <Wrapper className="modal popup-esr popup-esr4 center popup-align-right show" id="popup-business-card-transfer" aria-hidden="true">
        <div className="modal-dialog overflow-visible" >

          <div className="modal-content overflow-visible" >
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <button className="icon-small-primary icon-return-small" onClick={(event: any) => { event.target.blur(); handleClosePopup(1) }} />
                  <span className="text">
                    <img className="icon-popup-big icon-transfer" src="../../../content/images/ic-popup-title-card.svg" />
                    {translate('businesscards.transfer.tilte')}
                  </span>
                </div>
              </div>
              <div className="right">
                {!props.popout && <button className="icon-small-primary icon-link-small" onClick={(event: any) => { event.target.blur(); openNewWindow() }} />}
                {!props.popout && <button className="icon-small-primary icon-close-up-small line" onClick={(event: any) => { event.target.blur(); handleClosePopup() }} />}
              </div>
            </div>
            <div className={`modal-body style-3 ${errorValidateFrontend ? 'mh-100' : null}`} id="modal-body-transfer">
              <div className="popup-content max-height-auto h-100 style-3 css-transfer overflow-visible" >
                <div className="user-popup-form label-regular">
                  <form>
                    <div className="row break-row">
                      <div className="col-lg-6 break-line form-group common">
                        {renderErrorFromBackend()}
                        <TagAutoComplete
                          id={'customerId'}
                          key={'customerId'}
                          isHideResult={false}
                          placeholder={translate('businesscards.transfer.placeholder')}
                          type={TagAutoCompleteType.Customer}
                          modeSelect={TagAutoCompleteMode.Single}
                          elementTags={getDataTagStatusControl()}
                          onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
                            onActionSelectTag(id, type, mode, listTag);
                          }}
                          title={translate('businesscards.transfer.lbInput')}
                          isHoldTextInput={true}
                          onChangeText={onchangeText}
                          textInputValue={textValue}
                        // validMsg={errorFromBackend ? translate(`messages.${errorFromBackend[0].errorCode}`, errorFromBackend[0]?.interpolate) : null}
                        />
                        <>
                          {renderPaticipantList()}
                        </>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="user-popup-form-bottom">
              <button className="button-cancel mr-5" onClick={e => { !disableForm && handleClosePopup(2) }}>{translate('businesscards.transfer.buttomCancel')}</button>
              <button className="button-blue" onClick={!disableForm && handleSubmit} >{translate('businesscards.transfer.buttomSubmit')}</button>
            </div>
            {renderToastMessage()}
          </div>
        </div>
      </Wrapper>
    </FocusTrap>
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => { }} id="business-card-transfer" autoFocus={true} zIndex="auto">
          {renderPopupTransfer()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return (
        <>
          {renderPopupTransfer()}
        </>
      );
    } else {
      return <></>;
    }
  }

}

const mapStateToProps = ({ businessCardTranfer, applicationProfile }: IRootState) => ({
  errorMessage: businessCardTranfer.errorMessage,
  successMessage: businessCardTranfer.successMessage,
  action: businessCardTranfer.action,
  listOfBusinessCardId: businessCardTranfer.listOfBusinessCardId,
  tenant: applicationProfile.tenant
});

const mapDispatchToProps = {
  updateBusinessCards,
  reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupBusinessCardTransfer);