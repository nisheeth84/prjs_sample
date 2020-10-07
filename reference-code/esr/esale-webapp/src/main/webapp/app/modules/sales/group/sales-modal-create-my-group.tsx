import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { handleCreateMyGroup, GroupSaleModalAction, reset } from './sales-group-modal.reducer';
import { SALES_LIST_ID, LIST_TYPE, LIST_MODE, IS_OVER_WRITE } from '../constants';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
// import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';

export interface ISaleCreateGroupModal extends StateProps, DispatchProps {
  closeCreateMyGroupModal: () => void;
  fullScreen?: boolean;
  listViewChecked?: any;
}

// const [errorValidates, setErrorValidates] = useState(props.errorValidates);
const SaleCreateGroupModal = (props: ISaleCreateGroupModal) => {
  const [groupName, setGroupName] = useState('');
  const [showValidateName, setShowValidateName] = useState("");
  const [disableChange, setDisableChange] = useState(null);
  const [errorValidates, setErrorValidates] = useState(props.errorItems);

  const onChangeGroupName = event => {
    setGroupName(event.target.value);
    if (event.target.value.length > 50) {
      setShowValidateName(translate("messages.ERR_COM_0025", { 0: 50 }))
      return;
    }
    setShowValidateName("");
    setDisableChange(false);
  };

  useEffect(() => {
    if (props.errorItems && props.errorItems.length > 0) {
      setErrorValidates(props.errorItems);
    }
  }, [props.errorItems]);

  /**
   * Handling if [props.modalAction] is changed : Close modal if success
   */
  useEffect(() => {
    if (props.modalAction === GroupSaleModalAction.Success) {
      if (props.fullScreen) {
        window.close();
      } else {
        props.reset();
        props.closeCreateMyGroupModal();
      }
      event && event.preventDefault();
    } else {
      setDisableChange(false);
    }
  }, [props.modalAction]);

  const { recordCheckList } = props;

  // listViewChecked is card checked in view === 2
  const salesCheckList = props.listViewChecked.length > 0 ? props.listViewChecked : recordCheckList.filter(sales => sales.isChecked === true);
  const salesCheckListLength = salesCheckList.length;
  /**
   * Create my group
   */
  const handleEventCreateGroup = () => {
    const maxLength = 50;
    if (groupName.length > 50) {
      setShowValidateName(translate("messages.ERR_COM_0025", { 0: maxLength }))
    } else if (groupName.trim().length < 1) {
      setShowValidateName(translate("messages.ERR_COM_0013"))
    } else {
      const param = {
        productTradingList: {
          productTradingListName: groupName,
          listType: LIST_TYPE.MY_LIST,
          listMode: LIST_MODE.HANDED,
          ownerList: [],
          viewerList: [],
          isOverWrite: IS_OVER_WRITE.FALSE
        },
        searchConditions: [],
        listOfproductTradingId: salesCheckList.map(elm => elm.productTradingId) || []
      };
      props.handleCreateMyGroup(param);
    }
  };

  const isChangeInputEdit = () => {
    return groupName.trim().length > 0;
  };

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: 1 });
    } else {
      action();
    }
  };

  const handleCloseModal = () => {
    executeDirtyCheck(props.closeCreateMyGroupModal);
  };




  let styleError = '';
  const [isSuccess] = useState(false);

  if (!isSuccess) {
    styleError = 'input-common-wrap error';
  }

  const parseValidateError = () => {
    const errorMsg = [];
    if (props.errorItems) {
      const errorMessage = props.errorItems.filter((v, i) => props.errorItems.indexOf(v) === i);
      errorMessage.forEach(element => {
        errorMsg.push(translate('messages.' + element));
      });
    }
    return errorMsg;
  };


  const validateItem = item => {
    const index = errorValidates.indexOf(item);
    console.log("SaleCreateGroupModal -> errorValidates", errorValidates)
    if (index >= 0 && errorValidates && errorValidates.length > 0) {
      return translate('messages.' + errorValidates[index]);
    }
    return null;
  };

  return (
    <>
      <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus={false} zIndex="auto">
        <div className="popup-esr2 popup-esr3" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a title="" className="icon-small-primary icon-return-small"></a>
                  <span className="text">
                    <img title="" src="../../../content/images/ic-sidebar-sales.svg" alt="" />
                    {translate('sales.modal.header.create-my-list')}
                  </span>
                </div>
              </div>
              <div className="right">
                <button onClick={handleCloseModal} title="" className="icon-small-primary icon-close-up-small line" type="button"></button>
              </div>
            </div>
            <div className="popup-esr2-body">
              {/* {props.errorItems && props.errorItems.length > 0 && parseValidateError().length > 0 && (
                <BoxMessage messageType={MessageType.Error} messages={parseValidateError()} />
              )} */}
              <form>
                <div className="form-group">
                  {salesCheckListLength > 0 && (
                    <div className="block-feedback block-feedback-blue">
                      {translate("messages.WAR_COM_0003", { n: salesCheckListLength })}
                    </div>
                  )}
                  <div className="form-group mt-3">
                    <label>
                      {translate('sales.modal.body.list-name')}
                      <a title="" className="label-red ml-4">
                        {translate('sales.modal.body.require')}
                      </a>
                    </label>
                    <div className={errorValidates.includes('productTradingListName') ? styleError : null}>
                      <input
                        onChange={onChangeGroupName}
                        className={showValidateName ? "input-normal error" : "input-normal"}
                        type="text"
                        placeholder={translate('sales.modal.body.enter-list')}
                        autoFocus={true}
                        value={groupName}
                      // disabled={disableChange}
                      // onKeyDown={e => {
                      //   if (disableChange) {
                      //     e.preventDefault();
                      //   }
                      // }}
                      />
                    </div>
                    <div className="messenger error-validate-msg">{errorValidates.includes('productTradingListName') && validateItem('productTradingListName')}</div>
                    {/* <div className={errorValidates.includes('productTradingListName') ? styleError : null}>
                        <input
                          className={disableChange ? 'input-normal disable' : 'input-normal'}
                          disabled={disableChange}
                          type="text"
                          placeholder={translate('sales.group.group-modal-add-edit-my-group.group-name-placeholder')}
                          value={groupName}
                          onChange={handleChangeGroupName}
                          ref={txtInputFocus}
                          onKeyDown={e => {
                            if (disableChange) {
                              e.preventDefault();
                            }
                          }}
                        ></input>
                        {errorValidates.includes('productTradingListName') && (
                          <div className="messenger">{validateItem('productTradingListName')}</div>
                        )}
                      </div> */}
                  </div>
                  <div className="messenger height-30" ><span className="color-error" >{showValidateName}</span></div>
                </div>
              </form>
            </div>
            <div className="popup-esr2-footer">
              {disableChange && <button title="" className="button-blue" type="button">
                {translate('sales.modal.footer.create')}
              </button>}
              {!disableChange && (
                <button
                  onClick={() => {
                    setDisableChange(true);
                    handleEventCreateGroup();
                  }}
                  className="button-blue button-form-register "
                  type="button"
                >
                  {translate('sales.modal.footer.create')}
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = ({ salesGroupModal, dynamicList }: IRootState) => ({
  group: salesGroupModal.group,
  groups: salesGroupModal.groups,
  errorCode: salesGroupModal.errorCode,
  errorItems: salesGroupModal.errorItems,
  modalAction: salesGroupModal.modalAction,
  recordCheckList: dynamicList.data.has(SALES_LIST_ID) ? dynamicList.data.get(SALES_LIST_ID).recordCheckList : []
});

const mapDispatchToProps = {
  handleCreateMyGroup,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaleCreateGroupModal);