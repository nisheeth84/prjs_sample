import React, { useState, useEffect } from 'react';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import { FieldInfoType } from 'app/shared/layout/dynamic-form/constants';
import _ from 'lodash';
import { useId } from "react-id-generator";
import {
  TAB_ID_LIST,
  ConditionScope,
  ConditionRange,
  PRODUCT_TRADING_CUSTOM_CONTENT_FIELD,
  PRODUCT_TRADING_CUSTOM_FIELD_VALUE
} from 'app/shared/layout/popup-detail-service-tabs/constants';
import { FIELD_BELONG } from 'app/config/constants';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import PaginationList from '../paging/pagination-list';
import { IRootState } from 'app/shared/reducers';
import { handleInitProductTradingTab } from './popup-detail-tab.reducer';
import { connect } from 'react-redux';
import * as R from 'ramda'
import StringUtils, { decodeUserLogin, getFieldLabel, getEmployeeImageUrl, firstChar } from 'app/shared/util/string-utils';
import { translate } from 'react-jhipster';
import { CURRENCY } from 'app/modules/products/constants';
import Popover from '../common/Popover';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';

interface IDetailTabProductTrading extends StateProps, DispatchProps {
  fieldInfo?: any;
  customer: any; // currentCustomerId
  customerChild?: any[];
  searchScope?: number;
  searchRange?: number;
  productId?: number,
  employeeId?: number;
  showCustomerDetail?: (nextId, prevId) => void;
  showAnyDetail?: (id, type) => void;
}
/**
 * Render component tab ProductTradings
 * @param props
 */
const DetailTabProductTrading = (props: IDetailTabProductTrading) => {
  const [fields, setFields] = useState([]);
  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [offset, setOffset] = useState(0);

  const paramTmp = {
    customerIds: props.customer ? [props.customer] : [],
    employeeId: props.employeeId,
    loginFlag: false,
    productId: props.productId,
    offset,
    limit,
    filterConditions: [],
    orderBy: [],
    isFinish: null
  }

  const [param, setParam] = useState(null)

  useEffect(() => {
    let customerIds = props.customer ? [props.customer] : [];
    let loginFlag = false;
    if (props.searchRange === ConditionRange.ThisAndChildren) {
      let customerChild = [];
      if (props.customerChild) {
        customerChild = props.customerChild.map(e => Number.isInteger(e) ? e : e.customerId);
      }
      customerIds = [props.customer].concat(customerChild);
    }
    if (props.searchScope === ConditionScope.PersonInCharge) {
      loginFlag = true;
    }

    paramTmp.customerIds = customerIds;
    paramTmp.loginFlag = loginFlag;
    setParam(paramTmp)
  }, [props.searchScope, props.searchRange]);

  useEffect(() => {
    if (props.fieldInfo) {
      setFields(props.fieldInfo);
    }
  }, [props.fieldInfo])

  const onPageChange = (offsetRecord, limitRecord) => {
    setOffset(offsetRecord);
    setLimit(limitRecord);
    param.offset = offsetRecord;
    param.limit = limitRecord;
    setParam(_.cloneDeep(param));
  }

  useEffect(() => {
    props.handleInitProductTradingTab(param);
  }, [])

  useEffect(() => {
    if (param != null) {
      props.handleInitProductTradingTab(param);
    }
  }, [param]);

  const renderMsgEmpty = (serviceStr) => {
    const msg = translate('messages.INF_COM_0020', { 0: serviceStr })
    return (
      <div>{msg}</div>
    )
  };

  const getCustomFieldValue = (rowData, fieldColumn, mode) => {
    const fieldName = StringUtils.snakeCaseToCamelCase(R.path(['fieldName'], fieldColumn))
    switch (fieldName) {
      case PRODUCT_TRADING_CUSTOM_FIELD_VALUE.productTradingId:
        return (
          <Popover x={-20} y={25}>
            {R.path([`${fieldName}`], rowData)}
          </Popover>
        )
      case PRODUCT_TRADING_CUSTOM_FIELD_VALUE.quantity:
        return (
          <Popover x={-20} y={25}>
            {StringUtils.numberFormat(
              R.path([`${fieldName}`], rowData)
                .toString())}
          </Popover>
        )
      case PRODUCT_TRADING_CUSTOM_FIELD_VALUE.price:
      case PRODUCT_TRADING_CUSTOM_FIELD_VALUE.amount:
        return (
          <Popover x={-20} y={25}>
            {StringUtils.numberFormat(
              R.path([`${fieldName}`], rowData)
                .toString())}{CURRENCY}
          </Popover>
        )
      case PRODUCT_TRADING_CUSTOM_FIELD_VALUE.memo: {
        let memo = '';
        if (R.path([`${fieldName}`], rowData)) {
          memo = R.path([`${fieldName}`], rowData);
        } else if (rowData[fieldColumn.productTradingData]) {
          const data = rowData[fieldColumn.productTradingData].find(e => e.key === fieldColumn.fieldName);
          if (data) {
            memo = data.value;
          }
        }
        return (
          <Popover x={-20} y={25}>
            {memo}
          </Popover>
        )
      }
      case PRODUCT_TRADING_CUSTOM_FIELD_VALUE.orderPlanDate:
      case PRODUCT_TRADING_CUSTOM_FIELD_VALUE.endPlanDate:
      case PRODUCT_TRADING_CUSTOM_FIELD_VALUE.createdDate:
      case PRODUCT_TRADING_CUSTOM_FIELD_VALUE.updatedDate: {
        const time = R.path([`${fieldName}`], rowData)
        if (time) {
          return time
        } else {
          return null
        }
      }
      default:
        break;
    }
  }

  const renderProductField = (typeEmployee, rowData) => {
    const productId = R.path([`${typeEmployee}`, 'productId'], rowData)
    const productName = R.path([`${typeEmployee}`, 'productName'], rowData)
    return (
      <div className="item form-inline">
        <a className="d-inline-block text-ellipsis file max-calc45"
          onClick={() => props.showAnyDetail(productId, TYPE_DETAIL_MODAL.PRODUCT)}>
          <Popover x={-20} y={25}>
            {productName}
          </Popover>
        </a>
      </div>
    )
  }

  const renderEmployeeField = (typeEmployee, rowData) => {
    const urlImage = getEmployeeImageUrl(R.path([`${typeEmployee}`], rowData));
    const employeeId = R.path([`${typeEmployee}`, 'employeeId'], rowData);
    const employeeName = R.path([`${typeEmployee}`, 'employeeName'], rowData);
    const employeeSurname = R.path([`${typeEmployee}`, 'employeeSurname'], rowData);
    const employeeFullName = StringUtils.getFullName(employeeSurname, employeeName);
    const char = firstChar(employeeSurname);
    return (
      <div className="item form-inline">
        {urlImage ? <img className="avatar" src={urlImage} /> : <a tabIndex={-1} className="no-avatar green">{char}</a>}
        {props.employeeId === employeeId
          ? (
            <span className="d-inline-block text-ellipsis file max-calc45">
              <Popover x={-20} y={25}>
                {employeeFullName}
              </Popover>
            </span>
          ) : (
            <a className="d-inline-block text-ellipsis file max-calc45"
              onClick={() => props.showAnyDetail(employeeId, TYPE_DETAIL_MODAL.EMPLOYEE)}>
              <Popover x={-20} y={25}>
                {employeeFullName}
              </Popover>
            </a>
          )
        }
      </div>
    )
  }

  const renderCellSpecial = (field, rowData, mode, nameKey) => {
    const fieldName = StringUtils.snakeCaseToCamelCase(R.path(['fieldName'], field))
    switch (fieldName) {
      case PRODUCT_TRADING_CUSTOM_CONTENT_FIELD.customerId:
        if (R.path(['customerId'], rowData) === props.customer) {
          return (
            <Popover x={-20} y={25}>
              {R.path(['customerName'], rowData)}
            </Popover>
          )
        }
        return (
          <a className="color-blue" onClick={() => {
            if (props.customer) {
              props.showCustomerDetail(R.path(['customerId'], rowData), props.customer);
            } else {
              props.showAnyDetail(R.path(['customerId'], rowData), TYPE_DETAIL_MODAL.CUSTOMER);
            }
          }}>
            <Popover x={-20} y={25}>
              {R.path(['customerName'], rowData)}
            </Popover>
          </a>
        )
      case PRODUCT_TRADING_CUSTOM_CONTENT_FIELD.productId: {
        return renderProductField('product', rowData);
      }
      case PRODUCT_TRADING_CUSTOM_CONTENT_FIELD.productTradingProgressId:
        return (
          <Popover x={-20} y={25}>
            <span className="d-inline-block text-ellipsis">{`${getFieldLabel(rowData, 'progressName')}`}</span>
          </Popover>
        )
      case PRODUCT_TRADING_CUSTOM_CONTENT_FIELD.employeeId: {
        return renderEmployeeField('employee', rowData);
      }
      case PRODUCT_TRADING_CUSTOM_CONTENT_FIELD.createdUser: {
        return renderEmployeeField('createdUser', rowData);
      }
      case PRODUCT_TRADING_CUSTOM_CONTENT_FIELD.updatedUser: {
        return renderEmployeeField('updatedUser', rowData);
      }
      default:
        break;
    }
    return null;
  }

  const onActionFilterOrder = (filter: [], order: []) => {
    param.filterConditions = filter;
    param.orderBy = order;
    // TODO: waiting API form sales (QuangDN)
    // props.handleInitProductTradingTab(param);
  }

  const renderComponent = () => {
    if (props.productTradings && props.productTradings.productTradings.length > 0) {
      return (
        <>
          <div className="overflow-hidden">
            <div className="pagination-top max-width-220 d-flex">
              <div className="esr-pagination">
                <PaginationList
                  offset={offset}
                  limit={limit}
                  totalRecords={R.path(['totalRecord'], props.productTradings)}
                  onPageChange={onPageChange} />
              </div>
            </div>
            {fields && fields.length > 0 &&
              <DynamicList
                id="DetailTabProductTrading"
                tableClass="table-list"
                keyRecordId="productTradingId"
                records={props.productTradings.productTradings}
                belong={FIELD_BELONG.PRODUCT_TRADING}
                extBelong={+TAB_ID_LIST.tradingProduct}
                fieldInfoType={FieldInfoType.Tab}
                forceUpdateHeader={false}
                onActionFilterOrder={onActionFilterOrder}
                fields={fields}
                getCustomFieldValue={getCustomFieldValue}
                customContentField={renderCellSpecial}
                fieldLinkHolver={[{ fieldName: 'productName', link: '#', hover: '', action: [] }]}
              />
            }
          </div>
        </>
      )
    } else {
      return (
        <>
          <div className="min-height-200">
            <div className="align-center images-group-content" >
              <img className="images-group-16" src={'content/images/ic-sidebar-sales.svg'} alt="" />
              {renderMsgEmpty(translate('customers.detail.label.tab.tradingProduct'))}
            </div>
          </div>
        </>
      )
    }

  }

  return renderComponent();
}
const mapStateToProps = ({ popupDetailTab }: IRootState) => ({
  productTradings: popupDetailTab.tabProductTradings
});

const mapDispatchToProps = {
  handleInitProductTradingTab
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailTabProductTrading);
