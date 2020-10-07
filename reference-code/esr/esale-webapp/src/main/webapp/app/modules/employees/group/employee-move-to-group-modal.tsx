import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import { translate, Storage } from 'react-jhipster';
import { connect } from 'react-redux';
import { handleInitializeGroupModal, handleMoveToGroup, GroupModalAction, reset, handleGetGroupSuggestions } from './employee-group-modal.reducer';
import { IRootState } from 'app/shared/reducers';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { MENU_TYPE } from '../constants';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import useEventListener from 'app/shared/util/use-event-listener';
import PulldownSuggestList from './pulldown-suggest-list';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

export interface IEmployeeMoveToGroupModal extends StateProps, DispatchProps {
  empCheckList: any;
  sideBarCurrentId: number;
  toggleCloseMoveToGroupModal: (isMoveSuccess: boolean) => void;
  reloadScreen?: (sidebarCurrentId) => void
  popout?: boolean;
}

const EmployeeMoveToGroupModal = (props: IEmployeeMoveToGroupModal) => {
  const [chosenGroup, setChosenGroup] = useState(null);
  const [sideBarCurrentId, setSideBarCurrentId] = useState(null);
  const [checkSubmit, setcheckSubmit] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [empCheckList, setEmpCheckList] = useState([]);
  const [empCheckListLength, setEmpCheckListLength] = useState(null);
  const [groups, setGroups] = useState([]);
  const [errorCode, setErrorCode] = useState(null);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(EmployeeMoveToGroupModal.name, {
        chosenGroup,
        empCheckList,
        empCheckListLength,
        groups,
        sideBarCurrentId
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(EmployeeMoveToGroupModal.name);
      if (saveObj) {
        setChosenGroup(saveObj.chosenGroup);
        setEmpCheckList(saveObj.empCheckList);
        setEmpCheckListLength(saveObj.empCheckListLength);
        setGroups(saveObj.groups);
        setSideBarCurrentId(saveObj.sideBarCurrentId);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(EmployeeMoveToGroupModal.name);
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
    if (group && group.groupId) {
      setChosenGroup(group.groupId);
    } else {
      setChosenGroup(null);
    }
  };

  const handleEventMoveToGroup = () => {
    setcheckSubmit(true);
    props.handleMoveToGroup(sideBarCurrentId, chosenGroup, empCheckList);
  };

  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      props.toggleCloseMoveToGroupModal(false);
    });
  };

  useEffect(() => {
    props.handleInitializeGroupModal();
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
    if (props.modalAction === GroupModalAction.Success) {
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
    if (props.groupSuggestions) {
      setGroups(props.groupSuggestions);
    }
  }, [props.groupSuggestions]);

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
    if (props.empCheckList) {
      setEmpCheckList(props.empCheckList.map(item => item.employeeId));
      setEmpCheckListLength(props.empCheckList.length);
    }
  }, [props.empCheckList]);

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

  useEffect(() => {
    if (searchValue) {
      props.handleGetGroupSuggestions(searchValue);
    }
  }, [searchValue]);

  const handleChangeSearchValue = (text) => {
    setSearchValue(text);
  }

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
                  <img src="../../content/images/ic-popup-ttle-group-user.svg" alt="" />{translate('employees.group.group-modal-move-to-group.title')}
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
                {translate('employees.group.group-modal-move-to-group.employee-checklist-length', { empCheckListLength })}
              </div>
              <div className="form-group no-margin">
                <label>{translate('employees.group.group-modal-move-to-group.group-title')}<a className="label-red">{translate('employees.group.group-modal-move-to-group.required')}</a></label>
                <PulldownSuggestList
                  list={groups}
                  placeholder={translate('employees.group.group-modal-move-to-group.group-default-option')}
                  onSelectedSuggest={handleChooseGroup}
                  errorMessage={errorCode && !chosenGroup && checkSubmit ? translate('messages.' + errorCode) : null}
                  autoFocus={true}
                  onChangeSearchValue={handleChangeSearchValue}
                />
              </div>
            </form>
          </div>
          <div className="align-center mb-4">
            <a title="movetoGroup" className="button-blue" onClick={handleEventMoveToGroup}>
              {translate('employees.group.group-modal-move-to-group.button-move')}
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

const mapStateToProps = ({ groupModal, applicationProfile }: IRootState) => ({
  group: groupModal.group,
  groups: groupModal.groups,
  errorCode: groupModal.errorCode,
  modalAction: groupModal.modalAction,
  tenant: applicationProfile.tenant,
  groupSuggestions: groupModal.groupSuggestions,
});

const mapDispatchToProps = {
  handleInitializeGroupModal,
  handleMoveToGroup,
  handleGetGroupSuggestions,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeMoveToGroupModal);
