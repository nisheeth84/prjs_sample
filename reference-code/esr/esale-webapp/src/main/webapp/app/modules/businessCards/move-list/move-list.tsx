import { IRootState } from "app/shared/reducers";
import {
  handleGetListSuggestions,
  dragDropBusinessCard,
  reset,
  MoveListAction
} from "./move-list.reducer";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import PulldownSuggestList from './pulldown-suggest-list';
import { translate, Storage } from 'react-jhipster';
// import useEventListener from 'app/shared/util/use-event-listener';
import { Modal } from 'reactstrap';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import _ from 'lodash';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}
export interface IMoveListProps extends StateProps, DispatchProps {
  idOfOldList: any,
  listOfBusinessCardId: any[],
  closePopupMoveList: (msg?) => void,
  mode: any
  popout?: boolean;
  reloadScreen?: (idOfOldList) => void
}

const MoveList = (props: IMoveListProps) => {
  const [listInfo, setlistInfo] = useState([]);
  const [idOfNewList, setIdOfNewList] = useState(null);
  const [checkSubmit, setcheckSubmit] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [empCheckListLength, setEmpCheckListLength] = useState(null);
  const [empCheckList, setEmpCheckList] = useState([]);
  const [sideBarCurrentId, setSideBarCurrentId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorValidate, setErrorValidate] = useState(null);

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(MoveList.name, {
        idOfNewList,
        empCheckList,
        empCheckListLength,
        listInfo,
        sideBarCurrentId
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(MoveList.name);
      if (saveObj) {
        setIdOfNewList(saveObj.idOfNewList);
        setEmpCheckList(saveObj.empCheckList);
        setEmpCheckListLength(saveObj.empCheckListLength);
        setlistInfo(saveObj.listInfo);
        setSideBarCurrentId(saveObj.sideBarCurrentId);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(MoveList.name);
    }
  };

  // if (!props.popout) {
  //   useEventListener('message', () => props.closePopupMoveList(true));
  // }

  useEffect(() => {
    if (props.action === MoveListAction.Success) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.Search, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        props.reset();
        props.closePopupMoveList(translate('messages.INF_COM_0004'));
      }
      props.reloadScreen(props.idOfOldList);
      event && event.preventDefault();
    }
  }, [props.action]);


  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
    }
    return () => {
      // props.closePopupMoveList(false);
      setIdOfNewList(null);
      props.reset();
      updateStateSession(FSActionTypeScreen.RemoveSession);
    };
  }, []);

  useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      props.handleGetListSuggestions(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    if (props.listOfBusinessCardId) {
      setEmpCheckList(props.listOfBusinessCardId);
      setEmpCheckListLength(props.listOfBusinessCardId.length);
    }
  }, [props.listOfBusinessCardId]);

  useEffect(() => {
    if (props.listSuggestions && props.listSuggestions.metaValue && props.listSuggestions.metaValue === searchValue) {
      setlistInfo(props.listSuggestions.listInfo);
    }
  }, [props.listSuggestions]);

  useEffect(() => {
    setErrorMessage(props.errorMessage);
  }, [props.errorMessage]);

  /**
   * Set sideBarCurrentId state
   */
  useEffect(() => {
    if (props.idOfOldList) {
      setSideBarCurrentId(props.idOfOldList);
    }
  }, [props.idOfOldList]);

  const moveList = () => {
    if(!idOfNewList) {
      setErrorValidate('messages.ERR_COM_0013');
      return;
    } else {
      setErrorValidate(null)
    }
    props.dragDropBusinessCard(empCheckList, idOfNewList, sideBarCurrentId);
  }

  /**
  * Execute Dirty Check
  */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if ((idOfNewList || searchValue) && showModal) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  const handleChooseList = (businessCarrd) => {
    setcheckSubmit(false);
    if (businessCarrd && businessCarrd.listId) {
      setIdOfNewList(businessCarrd.listId);
    } else {
      setIdOfNewList(null);
    }
  };

  const handleChangeSearchValue = (text) => {
    setErrorValidate(null);
    setSearchValue(text);
  }

  const renderComponent = () => {
    return (
      <div className="popup-esr2 popup-esr3" id="popup-esr2">
        <div className="popup-esr2-content">
          <div className="modal-header">
            <div className="left">
              <div className="popup-button-back"><span><img title=""
                src="../../../content/images/ic-sidebar-business-card.svg"
                alt="" />{translate('businesscards.popup.move-list.title')}</span>
              </div>
            </div>
            <div className="right">
              <a title="" className="icon-small-primary icon-close-up-small "
                onClick={() => executeDirtyCheck(() => props.closePopupMoveList())}></a>
            </div>
          </div>
          <div className="popup-esr2-body border-bottom mb-4">
            <form>
              {errorMessage &&
                <BoxMessage messageType={MessageType.Error} className="msgError mb-2"
                  message={errorMessage} />
              }
              <div className="block-feedback block-feedback-blue mb-4">
                {translate("messages.WAR_COM_0009", { n: empCheckListLength })}
              </div>
              <div className="form-group no-margin">
                <label>{translate('businesscards.popup.move-list.list-card')}<a className="label-red">{translate('employees.group.group-modal-move-to-group.required')}</a></label>
                <PulldownSuggestList
                  list={listInfo}
                  placeholder={translate('businesscards.popup.move-list.list-card-default')}
                  onSelectedSuggest={handleChooseList}
                  errorMessage={errorValidate ? translate(errorValidate) : null}
                  autoFocus={true}
                  onChangeSearchValue={handleChangeSearchValue}
                />
              </div>
            </form>
          </div>
          <div className="align-center mb-4">
            <button title="" className="button-blue"
              onClick={moveList}>{translate('businesscards.popup.move-list.btn-submit')}</button>
          </div>
        </div>
      </div>
    );
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus={false} zIndex="auto">
          {renderComponent()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return (
        <>
          {renderComponent()}
        </>
      );
    } else {
      return <></>;
    }
  }

}

const mapStateToProps = ({ moveListBusinessCard }: IRootState) => ({
  listSuggestions: moveListBusinessCard.listSuggestions,
  errorMessage: moveListBusinessCard.errorMessage,
  action: moveListBusinessCard.action
});

const mapDispatchToProps = {
  handleGetListSuggestions,
  dragDropBusinessCard,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MoveList);
