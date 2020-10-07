
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
// import { EMPLOYEE_SPECIAL_FIELD_NAMES as specialFName } from '../constants';
import BeautyPullDown from './beauty-pull-down';
import { translate } from 'react-jhipster';

export interface IFieldCompanyDescriptionProps {
  fieldLabel: string
  companyDescription: any
  errorCompanyDescription?: { rowId, item, errorCode, errorMsg, params: {} }
  companyDescriptionData?: any
  isDisabled?: boolean
  updateStateField: (itemData, type, itemEditValue) => void
  isRequired?: boolean;
  className?: string;
}

/**
 * Using for company_description field
 * @param props
 */
const FieldCompanyDescription = (props: IFieldCompanyDescriptionProps) => {

  const { fieldLabel, companyDescription, companyDescriptionData } = props;
  const [description, setCompanyDescriptionData] = useState(props.companyDescriptionData ? props.companyDescriptionData : null);

  useEffect(() => {
    props.updateStateField(companyDescription, null, description);
  }, []);

  useEffect(() => {
    props.updateStateField(companyDescription, companyDescription.fieldType.toString(), description);
  }, [description]);

  const onCompanyDescriptionChange = (value) => {
    if (description !== undefined) {
      const newData = description;
      setCompanyDescriptionData(_.cloneDeep(newData));
    }
  }

  return (
    <div className={props.className}>
      <label>{fieldLabel}{props.isRequired ? <label className="label-red">{translate('dynamic-control.fieldFilterAndSearch.common.required')}</label> : null}</label>
      <div className="row">
        <BeautyPullDown
          data={companyDescription}
          value={companyDescriptionData}
          errorInfo={props.errorCompanyDescription}
          updateStateField={(value) => onCompanyDescriptionChange(value)}
        />
      </div>
    </div>
  );
}

export default FieldCompanyDescription
