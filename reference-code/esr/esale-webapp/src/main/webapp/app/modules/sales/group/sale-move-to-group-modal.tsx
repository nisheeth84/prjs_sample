import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'reactstrap';
import { translate, Storage } from 'react-jhipster';
import { connect } from 'react-redux';
import { handleGetListSuggetions, handleMoveToGroup, GroupSaleModalAction, reset, ACTION_TYPES } from './sales-group-modal.reducer';
import { IRootState } from 'app/shared/reducers';
import { startExecuting } from 'app/shared/reducers/action-executing';
// import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
// import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
// import { MENU_TYPE, SEARCH_LOCAL_SUGGEST } from '../constants';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import useEventListener from 'app/shared/util/use-event-listener';
import PulldownSuggestList from './pulldown-suggest-list';
import { REQUEST } from 'app/shared/reducers/action-type.util';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

export interface ISaleMoveToGroupModal extends StateProps, DispatchProps {
  saleCheckList: any;
  sideBarCurrentId: number;
  toggleCloseMoveToGroupModal: (isMoveSuccess: boolean) => void;
  reloadScreen?: (sidebarCurrentId) => void
  popout?: boolean;
  modalAction: any;
  handleAfterActionCard: any;
  view: any;
  onlyShowShare?: boolean;
}

const SaleMoveToGroupModal = (props: ISaleMoveToGroupModal) => {
  const [chosenGroup, setChosenGroup] = useState(null);
  const [sideBarCurrentId, setSideBarCurrentId] = useState(null);
  const [checkSubmit, setcheckSubmit] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [saleCheckList, setSaleCheckList] = useState([]);
  const [saleCheckListLength, setSaleCheckListLength] = useState(null);
  const [groups, setGroups] = useState([]);
  const [errorCode, setErrorCode] = useState(null);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [textLocal, setTextLocal] = useState('');

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(SaleMoveToGroupModal.name, {
        chosenGroup,
        saleCheckList,
        saleCheckListLength,
        groups,
        sideBarCurrentId,
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(SaleMoveToGroupModal.name);
      if (saveObj) {
        setChosenGroup(saveObj.chosenGroup);
        setSaleCheckList(saveObj.empCheckList);
        setSaleCheckListLength(saveObj.saleCheckListLength);
        setGroups(saveObj.groups);
        setSideBarCurrentId(saveObj.sideBarCurrentId);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(SaleMoveToGroupModal.name);
    }
  };

  if (!props.popout) {
    useEventListener('message', () => props.toggleCloseMoveToGroupModal(true));
  }

  const styleError = {};
  if (!chosenGroup && errorCode) {
    styleError['borderColor'] = '#ff5c5c';
    styleError['background'] = '#ffdede';
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (chosenGroup && showModal) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  const handleChooseGroup = (group) => {
    setcheckSubmit(false);
    if (group && group.listId) {
      setChosenGroup(group.listId);
    } else {
      setChosenGroup(null);
    }
  };

  const handleEventMoveToGroup = useCallback(() => {
    setcheckSubmit(true);
    if (textLocal.length === 0) {
      return;
    }
    props.startExecuting(REQUEST(ACTION_TYPES.ADD_TO_SALES_GROUP));
    props.handleMoveToGroup(sideBarCurrentId, chosenGroup, saleCheckList).then(() => {
      if (props.view === 2) {
        props.handleAfterActionCard();
      }
    });
  }, [sideBarCurrentId, chosenGroup, saleCheckList, textLocal, checkSubmit]);

  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      props.toggleCloseMoveToGroupModal(false);
    });
  };

  // if(props.onlyShowShare === true){
  //   setOnlyShowShare(true);
  // }

  useEffect(() => {
    props.handleGetListSuggetions('');
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    }
    return () => {
      props.toggleCloseMoveToGroupModal(false);
      setChosenGroup(null);
      props.reset();
      updateStateSession(FSActionTypeScreen.RemoveSession);
    };
  }, []);

  /**
   * Handling if [props.modalAction] is changed : Close modal if success
   */
  useEffect(() => {
    if (props.modalAction === GroupSaleModalAction.Success) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.Search, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        props.reset();
        props.toggleCloseMoveToGroupModal(true);
      }
      props.reloadScreen(props.sideBarCurrentId);
      event && event.preventDefault();
    }
  }, [props.modalAction]);

  /**
   * Set groupList state
   */
  useEffect(() => {
    if (props.listInfo) {
      setGroups(props.listInfo);
    }
  }, [props.listInfo]);

  /**
   * Set sideBarCurrentId state
   */
  useEffect(() => {
    if (props.sideBarCurrentId) {
      setSideBarCurrentId(props.sideBarCurrentId);
    }
  }, [props.sideBarCurrentId]);

  /**
   * Set errorCode state
   */
  useEffect(() => {
    if (props.errorCode) {
      setErrorCode(props.errorCode);
    }
  }, [props.errorCode]);

  /**
   * Set EmpCheckList state
   */
  useEffect(() => {
    if (props.saleCheckList) {
      setSaleCheckList(props.saleCheckList.map(item => item.productTradingId));
      setSaleCheckListLength(props.saleCheckList.length);
    }
  }, [props.saleCheckList]);

  // const openNewWindow = () => {
  //   updateStateSession(FSActionTypeScreen.SetSession);
  //   setShowModal(false);
  //   const height = screen.height * 0.8;
  //   const width = screen.width * 0.8;
  //   const left = screen.width * 0.3;
  //   const top = screen.height * 0.1;
  //   const style = `width=${width},height=${height},left=${left},top=${top}`;
  //   window.open(`${props.tenant}/move-to-group`, '', style.toString());
  //   event.preventDefault();
  // }

  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
  };
  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.forceCloseWindow) {
        props.toggleCloseMoveToGroupModal(true);
      } else {
        props.toggleCloseMoveToGroupModal(false);
      }
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup();
      }
    }
  }, [forceCloseWindow]);
  const renderComponent = () => {
    return (
      // set autoFocus=false to your modal to opt-out of the modal's focus management
      <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-employee-move-to-group" autoFocus={false} zIndex="auto">
        <div className="popup-esr2 popup-esr3" id="popup-esr2">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal">
              <span className="la-icon">
                <i className="la la-close" />
              </span>
            </button>
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <span className="text no-line">
                    <img src="../../content/images/ic-sidebar-sales.svg" alt="" />{translate('sales.group.group-modal-move-to-group.title')}
                  </span>
                </div>
              </div>
              <div className="right">
                {/* {showModal && <a href="#" className="icon-small-primary icon-link-small" onClick={openNewWindow} />} */}
                {showModal && <a className="icon-small-primary icon-close-up-small" onClick={handleClosePopup} />}
              </div>
            </div>
            <div className="popup-esr2-body border-bottom mb-4">
              <form>
                <div className="block-feedback block-feedback-blue mb-4">
                  {translate('sales.INF_COM_0016', {0: saleCheckListLength})}
                </div>
                <div className="form-group no-margin">
                  <label>{translate('sales.group.group-modal-move-to-group.group-title')} <a className="label-red">{translate('sales.group.group-modal-move-to-group.required')}</a></label>
                  <PulldownSuggestList
                    listInfo={props.listInfo}
                    list={groups}
                    placeholder={translate('sales.group.group-modal-move-to-group.group-default-option')}
                    onSelectedSuggest={handleChooseGroup}
                    errorMessage={errorCode && checkSubmit ? translate('messages.' + errorCode) : null}
                    errorEmptyinput={translate('setting.sales.productTrade.messageFile')}
                    autoFocus={true}
                    isSubmitted={props.isSubmit}
                    checkSubmit={checkSubmit}
                    setTextLocal={setTextLocal}
                    textLocal={textLocal}
                    setSubmit={setcheckSubmit}
                    onlyShowShare={props.onlyShowShare}
                    sideBarCurrentId={props.sideBarCurrentId}
                  />
                </div>
              </form>
            </div>
            <div className="align-center mb-4">
              <a title="movetoGroup" className="button-blue" onClick={handleEventMoveToGroup}>
                {translate('sales.group.group-modal-move-to-group.button-move')}
              </a>
            </div>
          </div>
        </div>
      </Modal>
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
};

const mapStateToProps = ({ salesGroupModal, applicationProfile }: IRootState) => ({
  listInfo: salesGroupModal.listInfo,
  errorCode: salesGroupModal.errorCode,
  modalAction: salesGroupModal.modalAction,
  isSubmit: salesGroupModal.isSubmit,
  tenant: applicationProfile.tenant,
});

const mapDispatchToProps = {
  handleGetListSuggetions,
  handleMoveToGroup,
  reset,
  startExecuting,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaleMoveToGroupModal);
