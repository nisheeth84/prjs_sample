import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import { handleCreateMyList, ACTION_TYPES, BusinessCardsAction } from './../business-card-list.reducer';
import DialogDirtyCheck from '../../../../shared/layout/common/dialog-dirty-check';
import styled from 'styled-components';

const WrapButtonBack = styled.a`
  pointer-events: none;
  cursor: default;
  color: none;
  &:hover, &:focus{
    pointer-events: none;
    cursor: default;
    color: none;
  }
`;
export interface IPopupCreateMyList extends StateProps, DispatchProps {
  // list id checked of business card
  listIdChecked,
  // handle open
  setOpenPopupCreateMyList,
  // handle close popup
  onClosePopupCreateMyList,
}

/**
 * Component for popup create my list
 * @param props 
 */
const PopupCreateMyList = (props: IPopupCreateMyList) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorValidates,] = useState(props.errorValidates);
  const [errorInModal, setErrorInModal] = useState([]);
  const [validateName, setValidateName] = useState("");
  const [businessCardListName, setBusinessCardListName] = useState('');
  const [isHover, changeIsHover] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [])
  useEffect(() => {
    if (businessCardListName) {
      setIsSubmitted(false);
    }
  }, [props.errorValidates, businessCardListName, isSubmitted]);

  /**
   * get error validate by field name
   * @param fieldName
   */
  const getErrorInfo = fieldName => {
    if (!errorValidates) return null;
    let errorInfo = null;
    errorValidates.forEach(elem => {
      if (elem.item === fieldName) {
        const errorTmp = {};
        errorTmp['rowId'] = elem.rowId;
        errorTmp['item'] = elem.item;
        errorTmp['errorCode'] = elem.errorCode;
        errorTmp['params'] = elem.params ? elem.params : null;
        errorInfo = errorTmp;
      }
    });
    return errorInfo;
  };

  /**
   * handle to call API
   */
  const handleSubmit = () => {
    setIsSubmitted(true);
    if (!businessCardListName) {
      setValidateName(translate("messages.ERR_COM_0013"))
      setErrorInModal([]);
      return;
    }
    const listNameBusiness = businessCardListName;
    startExecuting(REQUEST(ACTION_TYPES.CREATE_MY_LIST));
    props.handleCreateMyList(
      listNameBusiness,
      1,
      1,
      [],
      [],
      null,
      [],
      props.listIdChecked
    );
  }

  const renderErrorModal = () => {
    if (errorInModal && errorInModal.length > 0) {
      return (
        errorInModal.map((item, index) => {
          return (
            <div key={index} className="block-feedback block-feedback-pink mb-2">
              {item.errorCode === "ERR_COM_0060" ?
                <p>{translate(`messages.${item.errorCode}`, { 0: item.params })}</p>
                : <p>{translate(`messages.${item.errorCode}`)}</p>
              }
            </div>
          )
        })
      )
    }
    return null;
  }

  useEffect(() => {
    if (props.createBusinessCardsList) {
      props.setOpenPopupCreateMyList(false);
    }
  }, [props.createBusinessCardsList])

  useEffect(() => {
    if (props.errorModalMyList) {
      const errorModal = [];
      props.errorModalMyList.forEach(item => {
        if (item === "ERR_COM_0060") {
          errorModal.push({ errorCode: item, params: businessCardListName })
        } else {
          errorModal.push({ errorCode: item })
        }
      })
      setErrorInModal(errorModal);
    }
  }, [props.errorModalMyList])

  /**
  * Execute Dirty Check
  */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (businessCardListName || businessCardListName !== '') {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 2 });
    } else {
      action();
    }
  }
  return (
    <>
      <div className="popup-esr2 popup-esr3" id="popup-esr2">
        <div className="popup-esr2-content">
          <div className="modal-header">
            <div className="left">
              <div className="popup-button-back">
                <WrapButtonBack title="" className="icon-small-primary icon-return-small" onClick={() => executeDirtyCheck(() => props.onClosePopupCreateMyList())}></WrapButtonBack>
                <span className="text"><img title="" src="../../../content/images/ic-sidebar-business-card.svg" alt="" />{translate('businesscards.mylist.title')}</span>
              </div>
            </div>
            <div className="right">
              <a title="" className="icon-small-primary icon-close-up-small line" onClick={() => executeDirtyCheck(() => props.onClosePopupCreateMyList())}></a>
            </div>
          </div>
          <div className="popup-esr2-body">
            <form>
              <div className="form-group">
                {renderErrorModal()}
                <div className="block-feedback block-feedback-blue">
                  {translate("messages.WAR_COM_0003", { n: props.listIdChecked.length })}
                </div>
                <div className="form-group mt-3">
                  <label>
                    {translate('businesscards.mylist.my-title')}
                    <a className="label-red ml-4">{translate('businesscards.mylist.required')}</a>
                  </label>
                  <div className={`${isSubmitted && getErrorInfo('businessCardListName') ? "input-common-wrap error" : "input-common-wrap"} language-option remove-after input-common-wrap delete`}
                    onMouseEnter={() => changeIsHover(true)}
                    onMouseLeave={() => changeIsHover(false)}
                  >
                    <input
                      ref={inputRef}
                      className={"input-normal" + (validateName ? " error" : "")}
                      type="text"
                      value={businessCardListName}
                      maxLength={255}
                      placeholder={translate('businesscards.mylist.mylist-name-placeholder')}
                      onChange={(e) => { setBusinessCardListName(e.target.value); setValidateName("") }}
                      autoFocus
                    />
                    {validateName && (
                      <span className="messenger error-validate-msg">{validateName}</span>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="popup-esr2-footer  d-flex justify-content-center">
            <button title="" className="button-blue" onClick={handleSubmit}>{translate('businesscards.mylist.button-create')}</button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </>
  )
}

const mapStateToProps = ({ businessCardList }: IRootState) => ({
  errorValidates: businessCardList.errorItems,
  createBusinessCardsList: businessCardList.createBusinessCardsList,
  errorModalMyList: businessCardList.errorModalMyList
});

const mapDispatchToProps = {
  handleCreateMyList
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps)
  (PopupCreateMyList);