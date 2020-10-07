import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import { translate, Storage } from 'react-jhipster';
import { connect } from 'react-redux';
import { handleInitializeGroupModal, handleAddToGroup, GroupModalAction, reset, handleGetGroupSuggestions } from './employee-group-modal.reducer';
import { IRootState } from 'app/shared/reducers';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import useEventListener from 'app/shared/util/use-event-listener';
import PulldownSuggestList from './pulldown-suggest-list';
export const EMPLOYEE_LIST_ID = 'EMPLOYEE_LIST_ID';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession
}

export interface IEmployeeAddToGroupModal extends StateProps, DispatchProps {
  toggleCloseAddToGroupModal: (isMoveSuccess: boolean) => void;
  sideBarCurrentId: number;
  popout?: boolean;
  reloadScreen?: (sidebarCurrentId) => void
}

/**
 * Render AddToGroupModal Component
 */
const EmployeeAddToGroupModal = (props: IEmployeeAddToGroupModal) => {
  const [chosenGroup, setChosenGroup] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [empCheckList, setEmpCheckList] = useState([]);
  const [empCheckListLength, setEmpCheckListLength] = useState(props.recordCheckList.length);
  const [groupList, setGroupList] = useState([]);
  const [error, setError] = useState('');
  const [style, setStyle] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  /**
   * Execute dirtycheck when click button [X]
   * @param action 
   * @param cancel 
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (chosenGroup) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  // /**
  //  * Set chosenGroup when choosing option in dropdown
  //  * @param event 
  //  */
  // const handleChooseGroup = event => {
  //   setChosenGroup(event.target.value || null);
  // };

  const handleChooseGroup = (group) => {
    if (group && group.groupId) {
      setChosenGroup(group.groupId);
    } else {
      setChosenGroup(null);
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
      Storage.local.set(EmployeeAddToGroupModal.name, {
        chosenGroup,
        groupList,
        empCheckList,
        empCheckListLength,
        error,
        style
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(EmployeeAddToGroupModal.name);
      if (saveObj) {
        setChosenGroup(saveObj.chosenGroup);
        setEmpCheckList(saveObj.empCheckList);
        setEmpCheckListLength(saveObj.empCheckListLength);
        setGroupList(saveObj.groupList);
        setError(saveObj.error);
        setStyle(saveObj.style);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(EmployeeAddToGroupModal.name);
    }
  };

  /**
   * Open modal in new window
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const styleWindow = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/add-to-group`, '', styleWindow.toString());
  };

  /**
   * Call reducer when clicking submit
   */
  const handleEventAddToGroup = () => {
    setIsSubmitted(true);
    props.handleAddToGroup(chosenGroup, empCheckList);
  };

  /**
   * Add listener. Close modal when receiving message
   */
  if (!props.popout) {
    useEventListener('message', () => props.toggleCloseAddToGroupModal(true));
  }

  /**
   * Handling if [props.modalAction] is changed : Close modal if success
   */
  useEffect(() => {
    if (props.modalAction === GroupModalAction.Success) {
      if (props.popout) {
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
   * Set EmpCheckList state
   */
  useEffect(() => {
    if (props.recordCheckList) {
      const tmp = props.recordCheckList.filter(employee => employee.isChecked === true);
      setEmpCheckList(tmp.map(item => item.employeeId));
    }
  }, [props.recordCheckList]);

  /**
   * Set groupList state
   */
  useEffect(() => {
    if (props.groupSuggestions) {
      setGroupList(props.groupSuggestions);
    }
  }, [props.groupSuggestions]);

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
    if (!chosenGroup && props.errorCode && isSubmitted) {
      setStyle({ borderColor: '#ff5c5c', background: '#ffdede' });
      setError(props.errorCode);
    } else if (chosenGroup) {
      setStyle({});
      setError('');
      setIsSubmitted(false);
    }
  }, [props.errorCode, chosenGroup, isSubmitted]);

  /**
   * Handling when open AddToGroupModal component
   */
  useEffect(() => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
    } else {
      props.handleInitializeGroupModal(chosenGroup, true, false);
    }
    return () => {
      setChosenGroup(null);
      props.reset();
      updateStateSession(FSActionTypeScreen.RemoveSession);
    };
  }, []);

  useEffect(() => {
    if (searchValue) {
      props.handleGetGroupSuggestions(searchValue);
    }
  }, [searchValue]);

  const handleChangeSearchValue = (text) => {
    setSearchValue(text);
  }

  /**
   * Send message when opening modal in new window
   */
  if (props.popout) {
    window.opener.postMessage({ type: GroupModalAction.None }, window.location.origin);
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
                    <img src="../../content/images/ic-popup-ttle-group-user.svg" />
                    {translate('employees.group.group-modal-add-to-group.title')}
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
                  {translate('employees.group.group-modal-add-to-group.employee-checklist-length', { empCheckListLength })}
                </div>
                <div className="form-group no-margin">
                  <label>
                    {translate('employees.group.group-modal-add-to-group.group-title')}
                    <a className="label-red">{translate('employees.group.group-modal-add-to-group.required')}</a>
                  </label>
                  <PulldownSuggestList
                    list={groupList}
                    placeholder={translate('employees.group.group-modal-add-to-group.group-default-option')}
                    onSelectedSuggest={handleChooseGroup}
                    errorMessage={error && !chosenGroup ? translate('messages.' + error) : null}
                    autoFocus={true}
                    onChangeSearchValue={handleChangeSearchValue}
                  />
                </div>
              </form>
            </div>
            <div className="align-center mb-4">
              <button title="add" className="button-blue" onClick={handleEventAddToGroup}>
                {translate('employees.group.group-modal-add-to-group.button-add')}
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

const mapStateToProps = ({ groupModal, dynamicList, applicationProfile }: IRootState) => ({
  tenant: applicationProfile.tenant,
  group: groupModal.group,
  groups: groupModal.groups,
  errorCode: groupModal.errorCode,
  modalAction: groupModal.modalAction,
  groupSuggestions: groupModal.groupSuggestions,
  recordCheckList: dynamicList.data.has(EMPLOYEE_LIST_ID) ? dynamicList.data.get(EMPLOYEE_LIST_ID).recordCheckList : [],
});

const mapDispatchToProps = {
  handleInitializeGroupModal,
  handleAddToGroup,
  handleGetGroupSuggestions,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeAddToGroupModal);
