import React, { useState, useRef, useEffect } from 'react';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import _ from 'lodash';
import { TAB_ID_LIST } from '../../constants';
import { FieldInfoType, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { FIELD_BELONG } from 'app/config/constants';
import * as R from 'ramda';
import Popover from 'app/shared/layout/common/Popover';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';
import { translate } from 'react-jhipster';
import { getPhotoFilePath } from 'app/shared/util/entity-utils';
import PaginationList from 'app/shared/layout/paging/pagination-list';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';
import { customFieldsInfo, customHeaderField, renderItemNotEdit, getExtensionsCustomer } from 'app/modules/customers/list/special-render/special-render';
import { rejectFieldConstants } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field-tab';

export interface IPopupEmployeeDetailTabCustomerProps {
  customers: any;
  conditionSearch?: any[],
  handleReorderField?: (dragIndex, dropIndex) => void;
  screenMode?: any,
  onChangeFields?: (value) => void;
  customerFields?: any;
  showAnyDetail?: (objectId, type) => void;
  tenant?: any;
  customerLayout?: any[];
  employeeId: any;
}

export const TabCustomer = (props: IPopupEmployeeDetailTabCustomerProps) => {
  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [offset, setOffset] = useState(0);

  const onOpenPopupDetail = (paramId, fieldId, popupType) => {
    if (popupType === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_USER || popupType === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_USER) {
      if (paramId && paramId !== props.employeeId) {
        props.showAnyDetail(paramId, TYPE_DETAIL_MODAL.EMPLOYEE);
      }
    } else if (popupType === CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT) {
      document.body.className = 'wrap-calendar';
      props.showAnyDetail(paramId, TYPE_DETAIL_MODAL.SCHEDULE);
    } else if (popupType === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT) {
      props.showAnyDetail(paramId, TYPE_DETAIL_MODAL.TASK);
    }
  }

  const customContentField = (fieldColumn, rowData, mode, nameKey) => {
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_USER ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_USER ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_DATE ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_DATE) {
      return renderItemNotEdit(fieldColumn, rowData, props.tenant, onOpenPopupDetail, props.employeeId);
    }
    if (_.isArray(fieldColumn)) {
      const businessMainName = fieldColumn.find(item => item.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID);
      if (businessMainName && businessMainName.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
        return <div className="text-ellipsis text-over">
          <Popover x={-20} y={50}>
            {
              R.path(['business', 'businessMainName'], rowData) + translate("customers.list.dot") + R.path(['business', 'businessSubname'], rowData)
            }
          </Popover>
        </div>;
      }
    } else if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
      return <div className="text-ellipsis text-over">
        <Popover x={-20} y={50}>
          {R.path(['business', 'businessMainName'], rowData) + translate("customers.list.dot") + R.path(['business', 'businessSubname'], rowData)}
        </Popover>
      </div>
    }
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_PARENT) {
      return <div className="text-ellipsis text-over">
        <Popover x={-20} y={25}>
          {
            R.path(['customer_parent', 'pathTreeId'], rowData) && R.path(['customer_parent', 'pathTreeId'], rowData).map((item, idx) => {
              const length = R.path(['customer_parent', 'pathTreeId'], rowData).length;
              return <a onClick={() => props.showAnyDetail(R.path(['customer_parent', 'pathTreeId', idx], rowData), TYPE_DETAIL_MODAL.CUSTOMER)} key={idx}>
                {(idx === 1 && idx !== length) ? translate('commonCharacter.left-parenthesis') : ''}
                {R.path(['customer_parent', 'pathTreeName', idx], rowData)}
                {(idx > 0 && idx < length - 1) ? translate('commonCharacter.minus') : ''}
                {(idx === length - 1 && idx !== 0) ? translate('commonCharacter.right-parenthesis') : ''}
              </a>;
            })
          }
        </Popover>
      </div>;
    }
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_NAME) {
      return (
        <Popover x={-20} y={25}>
          <a onClick={() => props.showAnyDetail(R.path(['customer_id'], rowData), TYPE_DETAIL_MODAL.CUSTOMER)}>
            {R.path(['customer_name'], rowData) || ''}
          </a>
        </Popover>
      );
    }
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO) {
      const photoFilePath = getPhotoFilePath(fieldColumn.fieldName)
      const imgSrc = R.path([fieldColumn.fieldName, photoFilePath], rowData);
      return (
        <div className="text-over">
          {imgSrc ? <a className="image_table d-inline-block" title="" ><img className="no-image" src={imgSrc} alt="" title="" /></a> :
            <a className="image_table no_image_table d-inline-block" title="" ><img className="no-image" src="../../content/images/noimage.png" alt="" title="" /></a>}
        </div>
      )
    }
  }

  const customFieldsInfoData = (field, type) => {
    return customFieldsInfo(field, type, props.customerLayout);
  }

  /**
   * Reject fields which do not present on the tab
   * @param fields fieldInfo
   */
  const rejectFields = (fields) => {
    return _.reject(fields, (e) => rejectFieldConstants['tabCustomer'].fieldNameReject.includes(e.fieldName) ||
      rejectFieldConstants['tabCustomer'].fieldTypeReject.includes(e.fieldType.toString())
    )
  }

  const renderMsgEmpty = (serviceStr) => {
    const msg = translate('messages.INF_COM_0020', { 0: serviceStr })
    return (
      <div>{msg}</div>
    )
  };

  const onPageChange = (offsetRecord, limitRecord) => {
    setOffset(offsetRecord);
    setLimit(limitRecord);
  }

  const renderComponent = () => {
    if (props.customers?.customers?.length > 0) {
      return (
        <div className="overflow-hidden">
          <div className="pagination-top max-width-220 d-flex">
            <div className="esr-pagination">
              <PaginationList
                offset={offset}
                limit={limit}
                totalRecords={R.path(['totalRecords'], props.customers)}
                onPageChange={onPageChange} />
            </div>
          </div>
          <DynamicList
            id="EmployeeDetailTabCustomer"
            tableClass="table-list table-customer table-drop-down"
            keyRecordId="customerId"
            records={props.customers.customers}
            belong={FIELD_BELONG.CUSTOMER}
            extBelong={+TAB_ID_LIST.customer}
            fieldInfoType={FieldInfoType.Tab}
            forceUpdateHeader={false}
            fields={rejectFields(props.customerFields)}
            customContentField={customContentField}
            getCustomFieldInfo={customFieldsInfoData}
            customHeaderField={customHeaderField}
            extensionsData={getExtensionsCustomer(props.customerLayout)}
            fieldLinkHolver={[{ fieldName: 'customerName', link: '#', hover: '', action: [] }, { fieldName: 'address', link: '#', hover: '', action: [] }]}
            deactiveId={props.employeeId}
          />
        </div>
      )
    } else {
      return (
        <>
          <div className="h-100">
            <div className="align-center images-group-content" >
              <img className="images-group-16" src="content/images/ic-sidebar-customer.svg" alt="" />
              {renderMsgEmpty(translate('employees.detail.label.tab.customer'))}
            </div>
          </div>
        </>
      )
    }
  }

  return renderComponent();
}

export default TabCustomer;
