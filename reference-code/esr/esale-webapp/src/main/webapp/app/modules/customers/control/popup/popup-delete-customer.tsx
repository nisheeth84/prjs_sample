import React, { useState, useEffect } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import StringUtils from 'app/shared/util/string-utils'

export interface IPopupDeleteCustomerProps extends StateProps, DispatchProps {
  customerList
  setShowRelationCustomers?: (boolean) => void
  deleteCustomers?: () => void
  customerName?: string
}
/**
 * Popup display codition customer select => to delete them
 * @param props
 */
const PopupDeleteCustomer = (props: IPopupDeleteCustomerProps) => {

  const [relationData, setRelationData] = useState([]);

  useEffect(() => {
    if (props.relationCustomerData && !props.customerName) {
      setRelationData(props.relationCustomerData);
    }
  }, [props.relationCustomerData]);

  useEffect(() => {
    if(props.customerName){
      setRelationData(props.relationCustomerDataDetail);
    }
  }, [props.relationCustomerDataDetail])

  /**
   * Get employee's name from employee's id
   * @param id
   */
  const getCustomerName = (item) => {
    let result = '';
    props.customerList.forEach((customer) => {
      if (item.customerId === customer.customer_id) {
        result = customer.customer_name;
        return;
      }
    })
    return result;
  }

  /**
   * Get messages from API
   * @param data
   */
  const getDeleteCustomerMsg = (data) => {
    const arrErrMessageDeleteCustomer = [];
    // const serviceName = translate('customers.top.popup.lbl-customer');
    data && data.forEach((item, idx) => {
      const customerMsg = [];
      let name = getCustomerName(item);
      if(props.customerName){
        name = props.customerName;
      }
      if (item.countBusinessCard && item.countBusinessCard > 0) {
        customerMsg.push(StringUtils.translateSpecial('messages.ERR_CUS_0007', { 0: name, 1: item.countBusinessCard }))
      }
      if (item.countActivities && item.countActivities > 0) {
        customerMsg.push(StringUtils.translateSpecial('messages.ERR_CUS_0008', { 0: name, 1: item.countActivities }))
      }
      if (item.countSchedules && item.countSchedules > 0) {
        customerMsg.push(StringUtils.translateSpecial('messages.ERR_CUS_0009', { 0: name, 1: item.countSchedules }))
      }
      if (item.countTasks && item.countTasks > 0) {
        customerMsg.push(StringUtils.translateSpecial('messages.ERR_CUS_0010', { 0: name, 1: item.countTasks }))
      }
      if (item.countTimelines && item.countTimelines > 0) {
        customerMsg.push(StringUtils.translateSpecial('messages.ERR_CUS_0011', { 0: name, 1: item.countTimelines }))
      }
      if (item.countEmail && item.countEmail > 0) {
        customerMsg.push(StringUtils.translateSpecial('messages.ERR_CUS_0012', { 0: name, 1: item.countEmail }))
      }
      if (item.countProductTrading && item.countProductTrading > 0) {
        customerMsg.push(translate('messages.ERR_CUS_0013', { 0: name, 1: item.countProductTrading }))
      }
      arrErrMessageDeleteCustomer[idx] = { name, customerMsg };
    })
    return arrErrMessageDeleteCustomer;
  }

  return (
    <div className="popup-esr2 popup-esr3 popup-product" id="popup-esr2">
      <div className="popup-esr2-content">
        <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close"></i></span></button>
        <div className="popup-esr2-body border-bottom">
          <div className="popup-esr2-title font-weight-bold">{translate('customers.top.popup.title-delete')}</div>
          <p className="font-weight-normal">{translate('customers.top.popup.title-confirm')}</p>
          <div className="warning-content-popup">
            <div className="warning-content max-height-300 background overflow-y-hover">
              <div className="item font-size-12">
                {relationData !== null && getDeleteCustomerMsg(relationData).map((item, idx) =>
                  <>
                    {item.customerMsg && item.customerMsg.length > 0 &&
                      <ul key={idx}>
                        <span className="font-weight-500"> {item.name}</span>
                        {item.customerMsg && item.customerMsg.map((message, index) => (
                          <li className="font-weight-500 ml-4" key={"msg-" + idx + index}>{message}</li>
                        ))}
                      </ul>
                    }
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="popup-esr2-footer">
          <a title="" className="button-cancel" onClick={() => props.setShowRelationCustomers(false)}>{translate('customers.top.popup.btn-cancel')}</a>
          <a title="" className="button-red" onClick={() => props.deleteCustomers()}>{translate('customers.top.popup.btn-delete')}</a>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ customerList, customerDetail }: IRootState) => ({
  relationCustomerData: customerList.relationCustomerData,
  relationCustomerDataDetail: customerDetail.relationCustomerData
});

const mapDispatchToProps = {

};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupDeleteCustomer);

