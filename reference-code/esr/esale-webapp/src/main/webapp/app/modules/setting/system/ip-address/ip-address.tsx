import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { isNullOrUndefined } from 'util';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import _ from 'lodash';
import { reset, getIpAddresses } from './ip-address.reducer';
import { SHOW_MESSAGE } from '../../constant';
import StringUtils from 'app/shared/util/string-utils';

export interface IpAddressProps extends StateProps, DispatchProps {
  changeIpAddresses;
  initIpAddrData;
  dirtyReload;
  showMsgIpAddress?; // send success message to System component to display at the form's bottom
  resetAll?,
  setIsDirty?,
  setDirtyAdd
}
export const IpAddresses = (props: IpAddressProps) => {
  const [addIpAddresses, setAddIpAddresses] = useState([]);
  const [showMessage, setShowMessage] = useState(SHOW_MESSAGE.NONE);
  const [showIcon, setShowIcon] = useState(0);
  const [isHover, setIsHover] = useState(false);
  const [listIpsDel, setListIpsDel] = useState([]);
  const [flgErrItems, setFlgErrItems] = useState(false);
  const [addCssBtn, setAddCssBtn] = useState(true);

  useEffect(() => {
    return () => props.reset();
  }, []);

  useEffect(() => {
    props.reset();
    props.getIpAddresses();
    setAddIpAddresses([]);
    setListIpsDel([]);
    props.changeIpAddresses([], []);

    props.resetAll();
    props.setIsDirty(false);
  }, [props.dirtyReload]);

  useEffect(() => {
    // Get ip address list again, reset addIpAddresses and listIpsDel after successfully update the data
    if (props.ipAddressUpdateRes && !props.ipAddressUpdateRes.errorCodeList && showMessage === SHOW_MESSAGE.SUCCESS) {
      props.getIpAddresses();
      setAddIpAddresses([]);
      setListIpsDel([]);
      props.reset();

      props.resetAll();
      props.setIsDirty(false);
    }
  }, [props.ipAddressUpdateRes, showMessage]);

  const createRecord = () => {
    return { ipAddressId: 0, ipAddress: "", updatedDate: Date.now };
  }

  useEffect(() => {
    let records = props.ipAddresses.length === 0 ? [] : props.ipAddresses;
    records = _.cloneDeep(records);
    if (props.ipAddresses.length === 0) {
      document.getElementById('btnAddInput').click();
      records.push(createRecord());
      props.changeIpAddresses([], []);
    }
    setListIpsDel([]);
    setAddIpAddresses(records);
    for (let index = 0; index < records.length; index++) {
      if (index === records.length - 1 && records[index].ipAddress !== "") {
        props.initIpAddrData(records);
      }
    }
  }, [props.ipAddresses]);

  const addInput = () => {
    const newRecord = createRecord();
    const items = [...addIpAddresses, newRecord];
    setAddIpAddresses(items);
    props.setDirtyAdd(true);
  }

  const changeValueIpAddress = (index, value) => {
    if (showMessage !== SHOW_MESSAGE.NONE) {
      setShowMessage(SHOW_MESSAGE.NONE);
      props.showMsgIpAddress(SHOW_MESSAGE.NONE);
    }
    let items = _.cloneDeep(addIpAddresses);
    items[index].ipAddress = value;
    items = [...items];

    setAddIpAddresses(items);
    props.changeIpAddresses(items, listIpsDel);
  }

  useEffect(() => {
    if (!props.ipAddressUpdateRes) {
      setShowMessage(SHOW_MESSAGE.NONE);
      return;
    }
    const errorType = props.ipAddressUpdateRes.errorCodeList ? SHOW_MESSAGE.ERROR : SHOW_MESSAGE.SUCCESS;
    setShowMessage(errorType);
    props.showMsgIpAddress(errorType);
  }, [props.ipAddressUpdateRes]);

  useEffect(() => {
    // Set flag to show validation error messages
    if (props.errorItems && props.errorItems.length > 0) {
      setFlgErrItems(true);
    } else {
      setFlgErrItems(false);
    }
  }, [props.errorItems]);

  const getErrorMessage = (errorCode, errorParam) => {
    if (isNullOrUndefined(errorCode)) {
      return '';
    }
    const messageCode = `messages.${errorCode}`;
    return errorCode === "ERR_COM_0034" ?
      translate(messageCode, { values: 20 }) :
      translate(messageCode, errorParam);
  }

  const renderErrorMessage = () => {
    if (showMessage !== SHOW_MESSAGE.ERROR) {
      return <></>;
    }

    return (
      <>
        {props.ipAddressUpdateRes &&
          props.ipAddressUpdateRes.errorCodeList &&
          props.ipAddressUpdateRes.errorCodeList.map((error, index) => {
            return (
              <div key={index}>
                <BoxMessage messageType={MessageType.Error} message={getErrorMessage(error.errorCode, error.errorParams)} />
              </div>
            );
          })}
      </>
    );
  };

  /**
   * Get error messages in case api returns validation error
   */
  const renderErrorItems = () => {
    return (
      <>
        {props.errorItems &&
          props.errorItems.length > 0 &&
          props.errorItems.map((err, idx) => {
            return (
              <div key={idx}>
                <BoxMessage messageType={MessageType.Error} message={getErrorMessage(err.errorCode, err.errorParams)} />
              </div>
            );
          })}
      </>
    );
  };

  const hoverIn = index => {
    setIsHover(true);
    setShowIcon(index + 1);
  };

  const delIpAddress = async (item, index) => {
    const result = await ConfirmDialog({
      title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
      message: StringUtils.translateSpecial("messages.WAR_COM_0001", { itemName: item.ipAddress }),
      confirmText: translate('employees.top.dialog.confirm-delete-group'),
      confirmClass: "button-red",
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: "button-cancel"
    });
    if (result === true) {
      const items = _.clone(addIpAddresses).filter((e, idx) => idx !== index);
      setAddIpAddresses(items);
      setIsHover(false);
      props.changeIpAddresses(items, listIpsDel);

      if (item.ipAddressId) {
        const tmpIpsDel = _.cloneDeep(listIpsDel);
        tmpIpsDel.push(item.ipAddressId);
        setListIpsDel(tmpIpsDel);
        props.changeIpAddresses(addIpAddresses, tmpIpsDel);
      }

      if (addIpAddresses.length === 0) {
        setShowMessage(SHOW_MESSAGE.NO_RECORD);
        props.showMsgIpAddress(SHOW_MESSAGE.NO_RECORD);
      }

    }


  };

  return (
    <>
      <label>{translate('setting.system.ipAddress.title')}</label>
      <div className="block-feedback background-feedback border-radius-12 font-size-12 magin-top-5 pl-5 pr-5">
        {translate('setting.system.ipAddress.notificaation')}
      </div>
      <div className="magin-top-5">
        {renderErrorMessage()}
        {flgErrItems && renderErrorItems()}
      </div>
      <div className="form-group magin-top-10">
        <div className="show-search wrap-check">
          {addIpAddresses.length > 0 &&
            addIpAddresses.map((item, index) => (
              <div
                className="w60 input-common-wrap delete magin-top-10"
                key={index}
                onMouseEnter={() => hoverIn(index)}
                onMouseLeave={() => setShowIcon(0)}
              >
                <input
                  type="text"
                  className="input-normal"
                  placeholder={translate('setting.system.ipAddress.placeholder')}
                  onChange={event => changeValueIpAddress(index, event.target.value)}
                  value={item.ipAddress}
                />
                {showIcon === index + 1 && isHover && <span className="icon-delete" onClick={() => delIpAddress(item, index)} />}
              </div>
            ))}
          <div className="wrap-select setting-mt10">
            <a 
            onMouseDown={()=> setAddCssBtn(false)} 
            onMouseUp={()=> setAddCssBtn(true)} 
                 tabIndex={addCssBtn && 0} className="button-primary button-activity-registration pr-3 pl-3" id="btnAddInput" onClick={addInput}>
              {translate('setting.system.ipAddress.btnAdd')}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
const mapStateToProps = ({ ipAddress }: IRootState) => ({
  errorMessage: ipAddress.errorMessage,
  ipAddresses: ipAddress.ipAddresses,
  ipAddressUpdateRes: ipAddress.ipAddressUpdateRes,
  action: ipAddress.action,
  errorItems: ipAddress.errorItems,
});

const mapDispatchToProps = {
  reset,
  getIpAddresses
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IpAddresses);