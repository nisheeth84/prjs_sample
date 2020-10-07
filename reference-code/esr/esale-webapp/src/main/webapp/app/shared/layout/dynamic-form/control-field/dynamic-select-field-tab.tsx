import React, { useMemo, useEffect, useState } from 'react';
import { TAB_ID_LIST, CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';
import { translate, Storage } from 'react-jhipster';
import {
  getFieldsInfo,
  reset,
} from 'app/shared/reducers/dynamic-field.reducer';
import { connect } from 'react-redux';
import { FIELD_BELONG } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { DEFINE_FIELD_TYPE } from '../constants';

interface IDynamicSelectFieldTabStateProps {
  action?,
  errorMessage?,
  fieldInfoSelect?
}
interface IDynamicSelectFieldTabDispatchProps {
  getFieldsInfo,
  reset
}

interface IDynamicFieldTabOwnProps {
  tabType: number;
  listFieldInfo;
  selectFieldTab: (listFieldInfo, tabType) => void;
  deleteFieldTab: (fieldInfoId, tabType) => void;
}

export const rejectFieldConstants = {
  tabCustomer: {
    fieldNameReject: [
      CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_SUB_ID,
      CUSTOMER_SPECIAL_LIST_FIELD.DISPLAY_CHILD_CUSTOMERS,
      CUSTOMER_SPECIAL_LIST_FIELD.LAST_CONTACT_DATE,
      CUSTOMER_SPECIAL_LIST_FIELD.SCENARIO
    ],
    fieldTypeReject: [
      DEFINE_FIELD_TYPE.TAB,
      DEFINE_FIELD_TYPE.TITLE,
      DEFINE_FIELD_TYPE.LOOKUP
    ]
  },
  tabTask: {
    fieldNameReject: [],
    fieldTypeReject: []
  },
  tabProductTrading: {
    fieldNameReject: [],
    fieldTypeReject: []
  }
}

type IDynamicSelectFieldTabProps = IDynamicSelectFieldTabStateProps & IDynamicSelectFieldTabDispatchProps & IDynamicFieldTabOwnProps;

const DynamicSelectFieldTab = ((props: IDynamicSelectFieldTabProps, ref) => {
  const [fieldInfoOrigins, setFieldInfoOrigins] = useState([]);
  const [fieldInfos, setFieldInfos] = useState([]);
  const [fieldInfoCheckedList, setFieldInfoCheckedList] = useState([]);
  const [textValue, setTextValue] = useState('');

  const icon = useMemo(() => {
    switch (props.tabType) {
      case TAB_ID_LIST.task:
        props.getFieldsInfo('namespace', FIELD_BELONG.TASK, null, null);
        return '/content/images/task/ic-menu-task.svg';
      case TAB_ID_LIST.tradingProduct:
        props.getFieldsInfo('namespace', FIELD_BELONG.PRODUCT_TRADING, null, null);
        return 'content/images/ic-sidebar-sales.svg';
      case TAB_ID_LIST.customer:
        props.getFieldsInfo('namespace', FIELD_BELONG.CUSTOMER, null, null);
        return 'content/images/ic-sidebar-customer.svg';
      case TAB_ID_LIST.businessCard:
        props.getFieldsInfo('namespace', FIELD_BELONG.BUSINESS_CARD, null, null);
        return '/content/images/ic-sidebar-business-card.svg';
      default:
        return '';
    }
  }, [props.tabType]);

  const fieldInfoCheckedListOri = useMemo(() => {
    return props.listFieldInfo;
  }, []);

  useEffect(() => {
    if (props.listFieldInfo) {
      setFieldInfoCheckedList(props.listFieldInfo);
    }
  }, [])

  const rejectFields = (fields) => {
    let tabType = '';
    if (props.tabType === TAB_ID_LIST.task) {
      tabType = 'tabTask';
    } else if (props.tabType === TAB_ID_LIST.tradingProduct) {
      tabType = 'tabProductTrading';
    } else if (props.tabType === TAB_ID_LIST.customer) {
      tabType = 'tabCustomer';
    }
    if (tabType) {
      return _.reject(fields, (e) => rejectFieldConstants[tabType].fieldNameReject.includes(e.fieldName) ||
        rejectFieldConstants[tabType].fieldTypeReject.includes(e.fieldType.toString())
      )
    }
    return fields;
  }

  useEffect(() => {
    if (props.fieldInfoSelect) {
      const fieldInfoSelect = rejectFields(props.fieldInfoSelect);
      setFieldInfoOrigins(fieldInfoSelect);
      setFieldInfos(fieldInfoSelect);
    }
  }, [props.fieldInfoSelect])

  useEffect(() => {
    if (!textValue || _.isEmpty(textValue)) {
      setFieldInfos(fieldInfoOrigins);
      return;
    }
    const containText = new RegExp(`.*${textValue}.*`, 'i');
    const dataFilter = fieldInfoOrigins.filter(field =>
      containText.test(getFieldLabel(field, 'fieldLabel'))
    );
    setFieldInfos(dataFilter ? dataFilter : []);
  }, [textValue])

  const onTextChange = (e) => {
    const { value } = e.target;
    setTextValue(value);
  };

  const onSelectedFile = (fieldInfo, e) => {
    if (e.target.checked) {
      const fieldFind = fieldInfoCheckedListOri.find(f => f.fieldId === fieldInfo.fieldId);
      setFieldInfoCheckedList([...fieldInfoCheckedList, fieldFind ?? fieldInfo]);
    } else {
      props.deleteFieldTab(fieldInfo.fieldId, props.tabType);
      setFieldInfoCheckedList(fieldInfoCheckedList.filter(field => field.fieldId !== fieldInfo.fieldId));
    }
  }

  useEffect(() => {
    if (fieldInfoCheckedList) {
      props.selectFieldTab(fieldInfoCheckedList, props.tabType);
    }
  }, [fieldInfoCheckedList])

  return <div className="popup-content-task-right popup-content-common-right pt-2 v2 scroll-table-right overflow-y-hover v3">
    <div className="form-group w-100">
      <label>{translate('dynamic-select-field-tab.switch-display')}</label>
      <div className={`${fieldInfoOrigins && fieldInfoOrigins.length > 0 ? '' : 'disable'} search-box-button-style`}>
        <button className="icon-search"><i className="far fa-search"></i></button>
        <input type="text"
          disabled={!fieldInfoOrigins || fieldInfoOrigins.length < 1}
          placeholder={translate('dynamic-select-field-tab.find-an-item')}
          onChange={onTextChange}
        />
      </div>
    </div>
    <div className="product-tab-custom">
      {fieldInfos && fieldInfos.length > 0 && fieldInfos.map((fieldInfo, idx) => {
        if (fieldInfo.fieldType.toString() !== DEFINE_FIELD_TYPE.LOOKUP &&
          fieldInfo.fieldType.toString() !== DEFINE_FIELD_TYPE.TITLE &&
          fieldInfo.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB) {
          return (
            <div className="check-box-item mb-2" key={idx}>
              <label className="icon-check font-size-14">
                <input type="checkbox" name=""
                  checked={fieldInfoCheckedList.findIndex(field => field.fieldId === fieldInfo.fieldId) > -1}
                  onClick={e => onSelectedFile(fieldInfo, e)} /><i></i><a className="icon-tool mr-2">
                  <img src={icon} alt="" />
                </a> {getFieldLabel(fieldInfo, 'fieldLabel')}
              </label>
            </div>
          );
        }

      })}
    </div>
  </div>
});

const mapStateToProps = ({ dynamicField }: IRootState, ownProps: IDynamicFieldTabOwnProps) => {
  const id = `namespace`;
  if (!dynamicField || !dynamicField.data.has(id)) {
    return {
      action: null,
      errorMessage: null,
      fieldInfoSelect: null
    };
  }
  return {
    action: dynamicField.data.get(id).action,
    errorMessage: dynamicField.data.get(id).errorMessage,
    fieldInfoSelect: dynamicField.data.get(id).fieldInfo
  }
};

const mapDispatchToProps = {
  getFieldsInfo,
  reset
};


export default connect<IDynamicSelectFieldTabStateProps, IDynamicSelectFieldTabDispatchProps, IDynamicFieldTabOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(DynamicSelectFieldTab);

