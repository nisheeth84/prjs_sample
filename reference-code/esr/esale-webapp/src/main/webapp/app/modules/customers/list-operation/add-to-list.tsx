import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { handleGetListSuggestions, handleAddCustomersToList, resetPopupAddToList, ACTION_TYPES, ListOperationAction } from './list-operation.reducer';
import { translate, Storage } from 'react-jhipster';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { Modal } from 'reactstrap';
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import PulldownSuggestList from './pulldown-suggest-list';

export interface IAddToListProps extends StateProps, DispatchProps {
  iconFunction: any;
  customerIds: (number)[],
  closeAddToListPopup: () => void,
  reloadCustomerList: () => void
}

const fixStyleBtnBlue: React.CSSProperties = {
  marginRight: 0,
  minWidth: 120
}

/**
 * Add customers to a list
 * @param props 
 */
export const AddToList = (props: IAddToListProps) => {
  // state
  const [selectedList, setSelectedList] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    return () => {
      props.resetPopupAddToList();
    }
  }, []);

  useEffect(() => {
    if (props.listInfo) {
      setCustomerList(props.listInfo);
    } else {
      setCustomerList([]);
    }
  }, [props.listInfo]);

  useEffect(() => {
    if (searchValue) {
      props.handleGetListSuggestions(searchValue);
    } else {
      setCustomerList([]);
    }
  }, [searchValue]);

  const handleChangeSearchValue = (text) => {
    setSearchValue(text);
  }

  /**
   * open popup dirtyCheck
   * @param action action
   * @param cancel cancel
   */
  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (selectedList) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  /**
   * execute dirtyCheck when close popup
   */
  const handleClosePopup = () => {
    executeDirtyCheck(() => {
      props.closeAddToListPopup();
    })
  }

  /**
   * action onChange selectedList
   * @param list selected list
   */
  const changeSelectedList = (list) => {
    if (list && list.customerListId) {
      setSelectedList(list.customerListId);
    } else {
      setSelectedList(null);
    }
  }

  /**
   * call API addCustomersToList
   */
  const addCustomersToList = () => {
    // prevent double click
    props.startExecuting(REQUEST(ACTION_TYPES.ADD_CUSTOMERS_TO_LIST));
    // call API addCustomersToList
    props.handleAddCustomersToList(selectedList, props.customerIds);
  }

  /**
   * close popup without dirtyCheck if API addCustomersToList return
   */
  useEffect(() => {
    if ((props.customerListMemberIds && props.customerListMemberIds.length > 0) || props.action === ListOperationAction.Success) {
      props.closeAddToListPopup();
      props.reloadCustomerList();
    }
  }, [props.customerListMemberIds, props.action]);

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (!props.iconFunction) {
      return <></>
    } else {
      return <img src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />
    }
  }

  return (
    <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="add-to-list" autoFocus={false}>
      <div className="popup-esr2 popup-esr3 popup-unset-position" id="popup-esr2">
        <div className="popup-esr2-content">
          <div className="modal-header">
            <div className="left">
              <div className="popup-button-back">
                <span>{getIconFunction()}{translate('customers.add-to-list.title.header')}</span>
              </div>
            </div>
            <div className="right">
              <a className="icon-small-primary icon-close-up-small" onClick={handleClosePopup} ></a>
            </div>
          </div>
          <div className="popup-esr2-body">
            <BoxMessage messageType={MessageType.Info} message={translate('customers.add-to-list.message.record-number-info', { count: props.customerIds.length })} />
            <div className="form-group m-0 mt-4">
              <label>{translate('customers.add-to-list.form.label')}</label>
              <PulldownSuggestList
                list={customerList}
                placeholder={translate('customers.add-to-list.form.nonselect')}
                onSelectedSuggest={changeSelectedList}
                errorMessage={props.errorItems && props.errorItems[0] && !selectedList ? translate('messages.' + props.errorItems[0].errorCode) : null}
                autoFocus={true}
                onChangeSearchValue={handleChangeSearchValue}
              />
            </div>
          </div>
          <div className="popup-esr2-footer">
            <button className="button-blue" style={fixStyleBtnBlue} onClick={addCustomersToList} >{translate('customers.add-to-list.button.add')}</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const mapStateToProps = ({ listOperation: listOperation }: IRootState) => ({
  listInfo: listOperation.listInfo,
  customerListMemberIds: listOperation.customerListMemberIds,
  action: listOperation.action,
  errorMessage: listOperation.errorMessage,
  errorItems: listOperation.errorItems
})

const mapDispatchToProps = {
  handleGetListSuggestions,
  handleAddCustomersToList,
  resetPopupAddToList,
  startExecuting,
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddToList);