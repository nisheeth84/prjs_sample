import React, { useState, useEffect, useCallback, useRef } from 'react';
import { translate } from 'react-jhipster';
import { AvForm } from 'availity-reactstrap-validation';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  handleGetBusinessCardList,
  handleEventAddCardsToList,
  getListSuggestions,
  BusinessCardsAction,
  ACTION_TYPES
} from './../business-card-list.reducer';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { isEmpty } from 'lodash';
import "./style.scss";
import SuggestionList from './suggestion-list';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';

export interface IPopupAddCardsToList extends StateProps, DispatchProps {
  setOpenPopupAddCardsToList?,
  onClosePopupAddCardToList?,
  errorMessageInpopup,
  listIdChecked
}

const PopupAddCardsToList = (props: IPopupAddCardsToList) => {

  const [idOfList, setIdOfList] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [isChangedForm, setIsChangedForm] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isSubmited, setIsSubmited] = useState(false);

  const searchBusinessCard = useCallback((searchText) => {
    searchText && props.getListSuggestions(searchText);
    setIsChangedForm(searchText);
    setIsError(false);
  }, [props.getListSuggestions]);

  const onSelect = (target) => {
    setSelectedList(target);
    setIsError(false);
    setIdOfList(target.listId)
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isChangedForm) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  useEffect(() => {
    setIsSubmited(true);
  }, [props.addBusinessCardToListId]);

  useEffect(() => {
    if (isSubmited && props.action === BusinessCardsAction.Success) {
      props.setOpenPopupAddCardsToList(false);
      setIsSubmited(false);
      event && event.preventDefault();
    }
  }, [props.action]);

  const addCardsToList = () => {
    if (selectedList) {
      startExecuting(REQUEST(ACTION_TYPES.ADD_BUSINESS_CARDS_TO_LIST));
      props.handleEventAddCardsToList(props.listIdChecked, idOfList);
    } else {
      setIsError(true);
    }
  }

  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      props.onClosePopupAddCardToList();
    });
  }

  return (
    <div className="wrap-popup-add-card-to-list popup-esr2 popup-esr3" id="popup-esr2">
      <div className="popup-esr2-content">
        <div className="modal-header">
          <div className="left">
            <div className="popup-button-back"><span ><img title="" src="../../../content/images/ic-sidebar-business-card.svg" alt="" />{translate('businesscards.popup.add-card-to-list.title')}</span></div>
          </div>
          <div className="right">
            <button className="icon-small-primary icon-close-up-small " onClick={handleClosePopup} />
          </div>
        </div>
        <AvForm id="add-card-to-list-form">
          <div className="popup-esr2-body">
            {props.errorMessageInpopup &&
              <BoxMessage messageType={MessageType.Error} className="msgError mb-2"
                message={translate("messages." + props.errorMessageInpopup)} />
            }
            <div className="block-feedback block-feedback-blue">
              {translate("messages.WAR_COM_0008", { n: props.listIdChecked.length })}
            </div>
            <div className=" break-line form-group common mt-3">
              <label>{translate('businesscards.popup.add-card-to-list.list-card')}<a className="label-red ml-4">{translate('businesscards.mylist.required')}</a></label>
              <SuggestionList selectedList={selectedList} onSelect={onSelect} searchBusinessCard={searchBusinessCard} listSuggestions={props.listSuggestions} ></SuggestionList>
              {isError && <div className="message text-red">{translate('businesscards.popup.add-card-to-list.err-not-select')}</div>}
            </div>
          </div>
          <div className="popup-esr2-footer d-flex justify-content-center" >
            <button title="" className="button-blue" onClick={addCardsToList}>{translate('businesscards.popup.add-card-to-list.btn-submit')}</button>
          </div>
        </AvForm>
      </div>
    </div >
  )
}

const mapStateToProps = ({ businessCardList }) => ({
  errorMessageInpopup: businessCardList.errorMessageInpopup,
  listBusinessCardList: businessCardList.listBusinessCardList,
  listSuggestions: businessCardList?.listSuggestions ?? {},
  addBusinessCardToListId: businessCardList.addBusinessCardToListId,
  action: businessCardList.action
});

const mapDispatchToProps = {
  handleGetBusinessCardList,
  handleEventAddCardsToList,
  getListSuggestions
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PopupAddCardsToList);