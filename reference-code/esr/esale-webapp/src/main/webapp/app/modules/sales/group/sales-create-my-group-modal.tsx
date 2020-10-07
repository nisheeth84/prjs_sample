import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
// import { handleInitializeGroupModal, handleCreateGroup, GroupSaleModalAction, reset } from './sales-group-modal.reducer';
// import { handleInitializeGroupModal, handleCreateGroup, GroupSaleModalAction, reset } from './sales-group-modal.reducer';
import { handleInitializeGroupModal, handleCreateGroup, reset } from './sales-group-modal.reducer';
import { IRootState } from 'app/shared/reducers';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
export const EMPLOYEE_LIST_ID = 'EMPLOYEE_LIST_ID';

export interface ISalesCreateGroupModal extends StateProps, DispatchProps {
  toggleCloseCreateMyGroupModal: (isCreateSuccess: boolean) => void;
}

const SalesCreateGroupModal = (props: ISalesCreateGroupModal) => {
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
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 1 });
    } else {
      action();
    }
  };

  const handleEventCreateGroup = () => {
    setIsSubmitted(true);
    props.handleCreateGroup(
      groupName,
      1,
      1,
      [],
      [],
      empCheckList.map(item => {
        return {
          employeeId: item.employeeId
        };
      }),
      [1]
    );
  };

  const handleClosePopup = event => {
    executeDirtyCheck(() => {
      props.toggleCloseCreateMyGroupModal(false);
    });
    event.preventDefault();
  };

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

  const getError = () => {
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
                    {translate('sales.group.group-modal-create-my-group.title')}
                  </span>
                </div>
              </div>
              <div className="right">
                <button className="icon-small-primary icon-close-up-small" onClick={handleClosePopup} type="button" />
              </div>
            </div>
            <div className="popup-esr2-body border-bottom mb-4">
              <form>
                <div className="block-feedback block-feedback-blue mb-4">
                  {translate('sales.group.group-modal-create-my-group.sale-checklist-length', { empCheckListLength })}
                </div>
                <div className="form-group no-margin">
                  <label>
                    {translate('sales.group.group-modal-create-my-group.group-title')}
                    <a className="label-red">{translate('sales.group.group-modal-create-my-group.required')}</a>
                  </label>
                  <div className={`input-common-wrap ${errorCode && isSubmitted ? 'error' : ''}`}>
                    <input
                      className="input-normal"
                      type="text"
                      placeholder={translate('sales.group.group-modal-create-my-group.group-name-placeholder')}
                      onChange={event => setGroupName(event.target.value)}
                      autoFocus={true}
                      autoComplete="false"
                    // style={style}
                    />
                  </div>
                  {errorCode && isSubmitted && <span className="color-error font-size-8">{getError()}</span>}
                </div>
              </form>
            </div>
            <div className="align-center mb-4">
              <button className="button-blue" onClick={handleEventCreateGroup} type="button">
                {translate('sales.group.group-modal-create-my-group.button-create')}
              </button>
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
)(SalesCreateGroupModal);
