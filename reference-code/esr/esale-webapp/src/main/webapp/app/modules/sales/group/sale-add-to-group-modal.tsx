import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from 'reactstrap';
import { translate, Storage } from 'react-jhipster';
import { connect } from 'react-redux';
import { handleInitializeGroupModal, handleGetListSuggetions, handleAddToGroup, GroupSaleModalAction, reset } from './sales-group-modal.reducer';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { ACTION_TYPES } from './sales-group-modal.reducer'
import { IRootState } from 'app/shared/reducers';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import useEventListener from 'app/shared/util/use-event-listener';
import PulldownSuggestList from './pulldown-suggest-list';
import { SALES_LIST_ID } from '../constants';
import { REQUEST } from 'app/shared/reducers/action-type.util';
export const EMPLOYEE_LIST_ID = 'EMPLOYEE_LIST_ID';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

export interface ISaleAddToGroupModal extends StateProps, DispatchProps {
  toggleCloseAddToGroupModal: (isMoveSuccess: boolean) => void;
  sideBarCurrentId: number;
  popout?: boolean;
  reloadScreen?: (sidebarCurrentId) => void,
  modalAction: any,
  listCardChecked: any;
  view: any;
}

/**
 * Render AddToGroupModal Component
 */
const SaleAddToGroupModal = (props: ISaleAddToGroupModal) => {
  const [idOfList, setidOfList] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [listOfProductTradingId, setlistOfProductTradingId] = useState([]);
  const [listOfProductTradingIdLength, setlistOfProductTradingIdLength] = useState(props.view === 1 ? props.recordCheckList.length : props.listCardChecked.length);
  const [groupList, setGroupList] = useState([]);
  const [error, setError] = useState('');
  const [style, setStyle] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [textLocal, setTextLocal] = useState('');
  const [forceCloseWindow, setForceCloseWindow] = useState(false);

  /**
   * Execute dirtycheck when click button [X]
   * @param action 
   * @param cancel 
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (idOfList) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  // /**
  //  * Set idOfList when choosing option in dropdown
  //  * @param event 
  //  */
  const handleChooseGroup = (group) => {
    setIsSubmitted(false);
    if (group && group.listId) {
      setidOfList(group.listId);
    } else {
      setidOfList(null);
    }
  }
  /**
   * Handle when click button [X]
   */
  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      props.toggleCloseAddToGroupModal(false);
    });
  };

  /**
   * Handling state in local storage
   * @param mode 
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(SaleAddToGroupModal.name, {
        idOfList,
        groupList,
        listOfProductTradingId,
        listOfProductTradingIdLength,
        error,
        style
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(SaleAddToGroupModal.name);
      if (saveObj) {
        setidOfList(saveObj.idOfList);
        setlistOfProductTradingId(saveObj.listOfProductTradingId);
        setlistOfProductTradingIdLength(saveObj.listOfProductTradingIdLength);
        setGroupList(saveObj.groupList);
        setError(saveObj.error);
        setStyle(saveObj.style);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(SaleAddToGroupModal.name);
    }
  };

  /**
   * Call reducer when clicking submit
   */
  const handleEventAddToGroup = useCallback(() => {
    setIsSubmitted(true);
    if (textLocal.length === 0) {
      return;
    }
    props.startExecuting(REQUEST(ACTION_TYPES.ADD_TO_SALES_GROUP));
    props.handleAddToGroup(idOfList, listOfProductTradingId);
  }, [textLocal, idOfList, listOfProductTradingId, isSubmitted]);

  /**
   * Add listener. Close modal when receiving message
   */

  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
  };

  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.forceCloseWindow) {
        props.toggleCloseAddToGroupModal(true);
      } else {
        props.toggleCloseAddToGroupModal(false);
      }
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    // useEventListener('message', onReceiveMessage);
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
        props.toggleCloseAddToGroupModal(true);
      }
      props.reloadScreen(props.sideBarCurrentId);
      event && event.preventDefault();
    }
  }, [props.modalAction]);

  /**
   * Set listOfProductTradingId state
   */
  useEffect(() => {
    if (props.recordCheckList || props.listCardChecked) {
      let tmp = props.view === 1 ? props.recordCheckList : props.listCardChecked;

      if (props.view === 1) {
        tmp = tmp.filter(el => el.isChecked === true);
      }

      setlistOfProductTradingId(tmp.map(item => item.productTradingId));
    }
  }, [props.recordCheckList, props.view, props.listCardChecked]);

  /**
   * Set groupList state
   */
  useEffect(() => {
    if (props.listInfo) {
      setGroupList(props.listInfo);
    }
  }, [props.listInfo]);
  /**
   * Set errorCode state
   */
  useEffect(() => {
    if (props.errorCode) {
      setError(props.errorCode);
    }
  }, [props.errorCode]);
  /**
   * Handling style and error
   */
  useEffect(() => {
    if (!idOfList && props.errorCode && isSubmitted) {
      setStyle({ borderColor: '#ff5c5c', background: '#ffdede' });
      setError(props.errorCode);
    } else if (idOfList) {
      setStyle({});
      setError('');
      setIsSubmitted(false);
    }
  }, [props.errorCode, idOfList, isSubmitted]);

  /**
   * Handling when open AddToGroupModal component
   */
  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    }
    props.handleGetListSuggetions('');
    // else {
    //   props.handleInitializeGroupModal(idOfList);
    // }
    return () => {
      props.toggleCloseAddToGroupModal(false);
      setidOfList(null);
      props.reset();
      updateStateSession(FSActionTypeScreen.RemoveSession);
    };
  }, []);

  /**
   * Send message when opening modal in new window
   */
  if (props.popout) {
    window.opener.postMessage({ type: GroupSaleModalAction.None }, window.location.origin);
  }

  /**
   * Render Modal
   */

  const renderAddTogroupModal = () => {
    return (
      <>
        <div className="popup-esr2 popup-esr3" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <span className="text no-border no-padding">
                    <img src="../../content/images/ic-sidebar-sales.svg" />
                    {translate('sales.group.group-modal-add-to-group.title')}
                  </span>
                </div>
              </div>
              <div className="right">
                {showModal && <a className="icon-small-primary icon-close-up-small" onClick={handleClosePopup} />}
              </div>
            </div>
            <div className="popup-esr2-body border-bottom mb-4">
              <form>
                <div className="block-feedback block-feedback-blue mb-4">
                  {translate('sales.INF_COM_0015', {0: listOfProductTradingIdLength})}
                </div>
                <div className="form-group no-margin">
                  <label>
                    {translate('sales.group.group-modal-add-to-group.group-title')}
                    <a className="label-red">{translate('sales.group.group-modal-add-to-group.required')}</a>
                  </label>
                  <PulldownSuggestList
                    listInfo={props.listInfo}
                    list={groupList}
                    placeholder={translate('sales.group.group-modal-add-to-group.group-default-option')}
                    onSelectedSuggest={handleChooseGroup}
                    errorMessage={error && !idOfList && isSubmitted ? translate('messages.' + error) : null}
                    errorEmptyinput={translate('setting.sales.productTrade.messageFile')}
                    autoFocus={true}
                    isSubmitted={props.isSubmit}
                    checkSubmit={isSubmitted}
                    setTextLocal={setTextLocal}
                    textLocal={textLocal}
                    setSubmit={setIsSubmitted}
                  />
                </div>
              </form>
            </div>
            <div className="align-center mb-4">
              <button title="add" className="button-blue" onClick={handleEventAddToGroup}>
                {translate('sales.group.group-modal-add-to-group.button-add')}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (showModal) {
    return (
      <>
        <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus={false} zIndex="auto">
          {renderAddTogroupModal()}
        </Modal>
      </>
    )
  } else {
    if (props.popout) {
      return renderAddTogroupModal();
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = ({ salesGroupModal, dynamicList, applicationProfile }: IRootState) => ({
  tenant: applicationProfile.tenant,
  errorCode: salesGroupModal.errorCode,
  modalAction: salesGroupModal.modalAction,
  isSubmit: salesGroupModal.isSubmit,
  listInfo: salesGroupModal.listInfo,
  recordCheckList: dynamicList.data.has(SALES_LIST_ID) ? dynamicList.data.get(SALES_LIST_ID).recordCheckList : [],
});

const mapDispatchToProps = {
  handleInitializeGroupModal,
  handleGetListSuggetions,
  handleAddToGroup,
  reset,
  startExecuting
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaleAddToGroupModal);
