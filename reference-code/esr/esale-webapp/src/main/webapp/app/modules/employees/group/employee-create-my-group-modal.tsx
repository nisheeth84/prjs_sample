import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { handleInitializeGroupModal, handleCreateGroup, GroupModalAction, reset } from './employee-group-modal.reducer';
import { IRootState } from 'app/shared/reducers';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
export const EMPLOYEE_LIST_ID = 'EMPLOYEE_LIST_ID';

export interface IEmployeeCreateGroupModal extends StateProps, DispatchProps {
  toggleCloseCreateMyGroupModal: (isCreateSuccess: boolean) => void;
}

const EmployeeCreateGroupModal = (props: IEmployeeCreateGroupModal) => {
  const [groupName, setGroupName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  // const [style, setStyle] = useState({});
  const [errorCode, setErrorCode] = useState('');
  const [errorItems, setErrorItems] = useState([]);

  const { recordCheckList } = props;

  const empCheckList = recordCheckList.filter(employee => employee.isChecked === true);
  const empCheckListLength = empCheckList.length;

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (groupName) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  const handleEventCreateGroup = () => {
    setIsSubmitted(true);
    props.handleCreateGroup(
      groupName,
      1,
      false,
      false,
      empCheckList.map(item => {
        return {
          employeeId: item.employeeId
        };
      })
    );
  };

  const handleClosePopup = event => {
    executeDirtyCheck(() => {
      props.toggleCloseCreateMyGroupModal(false);
    });
    event.preventDefault();
  };

  useEffect(() => {
    if (props.modalAction === GroupModalAction.Success) {
      props.toggleCloseCreateMyGroupModal(true);
    }
  }, [props.modalAction]);

  /**
   * Handling style and error
   */
  useEffect(() => {
    if (props.errorCode) {
      // setStyle({ backgroundColor: 'pink' });
      setErrorCode(props.errorCode);
    }
  }, [props.errorCode]);

  useEffect(() => {
    if (props.errorItems && props.errorItems.length > 0) {
      setErrorItems(props.errorItems);
    }
  }, [props.errorItems]);

  useEffect(() => {
      setIsSubmitted(false);
      setErrorCode('');
  }, [groupName]);

  useEffect(() => {
    return () => {
      props.reset();
    };
  }, [isSubmitted]);

  const getError = () =>{
  const errorParams = errorItems && errorItems[0] && errorItems[0].errorParams ? errorItems[0].errorParams : null;
  return translate('messages.' + errorCode, errorParams);
  }

  return (
    <>
      <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus={false} zIndex="auto">
        <div className="popup-esr2 popup-esr3" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <span className="text no-line">
                    <img src="../../content/images/ic-popup-ttle-group-user.svg" alt="" />
                    {translate('employees.group.group-modal-create-my-group.title')}
                  </span>
                </div>
              </div>
              <div className="right">
                <a className="icon-small-primary icon-close-up-small" onClick={handleClosePopup} />
              </div>
            </div>
            <div className="popup-esr2-body border-bottom mb-4">
              <form>
                <div className="block-feedback block-feedback-blue mb-4">
                  {translate('employees.group.group-modal-create-my-group.employee-checklist-length', { empCheckListLength })}
                </div>
                <div className="form-group no-margin">
                  <label>
                    {translate('employees.group.group-modal-create-my-group.group-title')}
                    <a className="label-red">{translate('employees.group.group-modal-create-my-group.required')}</a>
                  </label>
                  <div className={`input-common-wrap ${errorCode && isSubmitted ? 'error' : ''}`}>
                    <input
                      className="input-normal"
                      type="text"
                      placeholder={translate('employees.group.group-modal-add-edit-my-group.group-name-placeholder')}
                      onChange={event => setGroupName(event.target.value)}
                      autoFocus={true}
                      autoComplete="false"
                    // style={style}
                    />
                  </div>
                  {errorCode && isSubmitted && <span className="messenger-error">{getError()}</span>}
                </div>
              </form>
            </div>
            <div className="align-center mb-4">
              <a className="button-blue" onClick={handleEventCreateGroup}>
                {translate('employees.group.group-modal-create-my-group.button-create')}
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ groupModal, dynamicList }: IRootState) => ({
  group: groupModal.group,
  groups: groupModal.groups,
  errorCode: groupModal.errorCode,
  errorItems: groupModal.errorItems,
  modalAction: groupModal.modalAction,
  recordCheckList: dynamicList.data.has(EMPLOYEE_LIST_ID) ? dynamicList.data.get(EMPLOYEE_LIST_ID).recordCheckList : []
});

const mapDispatchToProps = {
  handleInitializeGroupModal,
  handleCreateGroup,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeCreateGroupModal);
