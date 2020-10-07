
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
// import { EMPLOYEE_SPECIAL_FIELD_NAMES as specialFName } from '../constants';
import BeautyPullDown from './beauty-pull-down';
import { translate } from 'react-jhipster';
import {SCREEN_TYPES} from '../constants';

export const defaultCustomerBusiness = {
  businessMainId: null,
  businessSubId: null
};

export enum FieldChange {
  businessMain,
  businessSub
}

export interface IFieldBusinessProps {
  fieldLabel: string
  businessMain: any
  errorBusinessMain?: { rowId, item, errorCode, errorMsg, params: {} }
  businessSub: any
  errorBusinessSub?: { rowId, item, errorCode, errorMsg, params: {} }
  businessData?: any
  isDisabled?: boolean
  updateStateField: (itemData, type, itemEditValue) => void
  isRequired?: boolean
  classBusiness?: string
  screen?: string,

}

/**
 * Using for business_main_id and business_sub_id field
 * @param props
 */
const FieldBusiness = (props: IFieldBusinessProps) => {

  const { fieldLabel, businessMain, businessSub } = props;
  const [customerBusinessData, setCustomerBusinessData] = useState(props.businessData ? props.businessData : defaultCustomerBusiness);
  const [fieldChange, setFieldChange] = useState(null);
  const [dataBusinessSub, setDataBusinessSub] = useState({fieldItems: []});

  useEffect(() => {
    props.updateStateField(businessMain, null, customerBusinessData.businessMainId);
    setDataBusinessSub(Object.assign(businessSub, {fieldItems: businessSub && businessSub.listFieldsItem || []}));
  }, []);

  useEffect(() => {
    // employee_positions is inside employee_departments
    if (fieldChange === FieldChange.businessMain) {
      props.updateStateField(businessMain, businessMain.fieldType.toString(), customerBusinessData.businessMainId);
    } else if (fieldChange === FieldChange.businessSub) {
      props.updateStateField(businessSub, businessSub.fieldType.toString(), customerBusinessData.businessSubId);
    }
  }, [customerBusinessData, fieldChange]);

  const onBusinessMainChange = (value) => {
    if (!props.isDisabled) {
      if (customerBusinessData !== undefined) {
        const newData = customerBusinessData;
        newData.businessMainId = value;
        setCustomerBusinessData(_.cloneDeep(newData));
        setFieldChange(FieldChange.businessMain);
        const filedItemSub = businessSub && businessSub.listFieldsItem.filter(e => e.itemParentId === value);
        const newDataBS = Object.assign(dataBusinessSub, {fieldItems: filedItemSub})
        setDataBusinessSub(newDataBS);
        // props.updateStateField(businessMain, businessMain.fieldType.toString(), value);
      }
    } else {
      return null
    }
  }

  const onBusinessSubChange = (value) => {
    if (!props.isDisabled) {
      if (customerBusinessData !== undefined) {
        const newData = customerBusinessData;
        newData.businessSubId = value;
        setCustomerBusinessData(_.cloneDeep(newData));
        setFieldChange(FieldChange.businessSub);
        // props.updateStateField(businessSub, businessSub.fieldType.toString(), value);
      }
    } else {
      return null;
    }
  }

  const getClassName = () => {
    if (customerBusinessData.businessMainId !== null && !props.isDisabled) {
      return "";
    }
    return "disable";
  }


  return (
    <div className={props.classBusiness}>
      <label>{fieldLabel} {props.isRequired ? <label className="label-red">{translate('dynamic-control.fieldFilterAndSearch.common.required')}</label> : null}</label>
        <div className={`row ${props.screen === SCREEN_TYPES.CUSTOMER_INTEGRATION ? 'w100' : ''}`}>
          <BeautyPullDown
            // showLabel={index === 0}
            data={businessMain ? Object.assign(businessMain, {fieldItems: businessMain && businessMain.listFieldsItem || []}) : {} }
            // data={businessMain}
            value={customerBusinessData.businessMainId}
            errorInfo={props.errorBusinessMain}
            updateStateField={(value) => onBusinessMainChange(value)}
            className={props.isDisabled ? "disable" : ""}
            hiddenLabel={true}
            isDisabled={props.isDisabled}
          />
          <BeautyPullDown
            // showLabel={index === 0}
            data={dataBusinessSub}
            value={customerBusinessData.businessSubId}
            errorInfo={props.errorBusinessSub}
            updateStateField={(value) => onBusinessSubChange(value)}
            className={getClassName()}
            hiddenLabel={true}
            isDisabled={props.isDisabled}
          />
        </div>
    </div>
  );
}

export default FieldBusiness;
