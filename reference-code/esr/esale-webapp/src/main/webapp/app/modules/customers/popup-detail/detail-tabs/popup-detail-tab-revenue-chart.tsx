import React, { useState, useEffect } from 'react';
import 'app/shared/layout/calendar/calendar'
import _ from 'lodash';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';
import { IRootState } from 'app/shared/reducers';
import {
  handleGetUrlQuicksight, CustomerAction,
} from 'app/modules/customers/popup-detail/popup-customer-detail.reducer.ts';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';

export interface IPopupCustomerReveueChart extends StateProps, DispatchProps {
  customerId: any;
}

/**
 * Render component tab Calendar
 * @param props
 */
const CustomerReveueChart = (props: IPopupCustomerReveueChart) => {

  useEffect(() => {
    if (props.customerId) {
      props.handleGetUrlQuicksight(props.customerId);
    }
  }, [props.customerId])

  const renderMsgEmpty = (serviceStr) => {
    const msg = translate('messages.INF_COM_0020', { 0: serviceStr })
    return (
      <div>{msg}</div>
    )
  };

  return (
    <div className="h100">
      { props.action === CustomerAction.GetUrlQuicksightSuccess && props.urlQuicksight && 
        <iframe src={`${props.urlQuicksight}`} height="100%" width="100%" />
      }
      { props.action === CustomerAction.GetUrlQuicksightSuccess && !props.urlQuicksight && 
        <div className="align-center images-group-content" >
          {renderMsgEmpty(translate('customers.detail.label.tab.revenueInfomation'))}
        </div>
      }
    </div>
  )
}

const mapStateToProps = ({ customerDetail }: IRootState) => ({
  urlQuicksight: customerDetail.urlQuicksight,
  action: customerDetail.action,
});

const mapDispatchToProps = {
  handleGetUrlQuicksight,
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerReveueChart)
