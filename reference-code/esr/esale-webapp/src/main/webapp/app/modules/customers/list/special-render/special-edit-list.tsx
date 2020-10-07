import React, { useState, useEffect, useRef, useMemo } from 'react';
import _ from 'lodash';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { ControlType } from 'app/config/constants';
import StringUtils from 'app/shared/util/string-utils';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { translate } from 'react-jhipster';
import { CUSTOMER_SPECIAL_LIST_FIELD } from '../../constants';
import * as R from 'ramda';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete';
import SpecialEditBusiness from './special-edit-business';
import { v4 as uuidV4 } from 'uuid';

export interface ISpecialEditListProps {
  valueData: any,
  itemData: any,
  extensionsData: any,
  nameKey?: any,
  errorInfo?: any,
  errorInfos?: any[],
  typeSpecialEdit?: any,
  updateFiles?: (files) => void; // for field file
  updateStateField: (itemData, type, itemEditValue) => void             // callback when user edit value cell
  isFocusFirst?: boolean,
  itemFirstFocus?: null // First item error
}

/**
 * Component for manager setting item
 * @param props 
 */
const SpecialEditList: React.FC<ISpecialEditListProps> = (props) => {
  const { nameKey } = props;
  const rowData = { key: '', fieldValue: null };
  rowData.key = getValueProp(props.valueData, nameKey);
  const ref = useRef(null);
  const specialId = useMemo(() => { return uuidV4() }, [])
  const getErrorInfo = (name) => {
    if (props.errorInfos) {
      const errorInfo = props.errorInfos.find(e => e.item === _.camelCase(name) && e.rowId.toString() === rowData.key.toString());
      if (errorInfo) {
        return errorInfo;
      }
    }
    return null;
  }

  const getInfoData = (field) => {
    let _infoData = null;
    const fieldInfoData = [];
    _infoData = _.cloneDeep(field);
    props.extensionsData[field.fieldName].forEach((element, idx) => {
      fieldInfoData.push({
        itemId: element.itemId,
        itemLabel: element.itemLabel,
        isDefault: false,
        isAvailable: element.isAvailable,
        itemParentId: element.itemParentId
      })
    });

    _infoData.fieldItems = fieldInfoData;
    _infoData.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
    return _infoData;
  }

  const renderComponentBusiness = () => {
    let infoBusinessMain = null;
    let infoBusinessSub = null;
    const rowDataBusinessMain = _.cloneDeep(rowData);
    const rowDataBusinessSub = _.cloneDeep(rowData);
    props.itemData.forEach(element => {
      if (element.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
        infoBusinessMain = getInfoData(element);
      }
      if (element.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_SUB_ID) {
        infoBusinessSub = getInfoData(element);
      }
    });

    rowDataBusinessMain.fieldValue = R.path(['business', 'businessMainId'], props.valueData);
    rowDataBusinessSub.fieldValue = R.path(['business', 'buisinessSubId'], props.valueData)

    return <>
      <SpecialEditBusiness
        infoBusinessMain={infoBusinessMain}
        rowDataBusinessMain={rowDataBusinessMain}
        updateStateField={props.updateStateField}

        infoBusinessSub={infoBusinessSub}
        rowDataBusinessSub={rowDataBusinessSub}
        valueData={props.valueData}
        nameKey={props.nameKey}
        itemFirstFocus={props.itemFirstFocus}
        isFocusFirst={props.isFocusFirst}
        errorInfos={props.errorInfos}
        rowData={rowData}
      />
    </>;
  }

  const renderComponentName = () => {
    const itemCustomerName = _.cloneDeep(props.itemData);
    const rowDataCustomerName = _.cloneDeep(rowData);
    itemCustomerName && (itemCustomerName.fieldType = DEFINE_FIELD_TYPE.TEXT);
    rowDataCustomerName.fieldValue = R.path(['customer_name'], props.valueData);
    return <>
      <div className="special-input p-0">
        {itemCustomerName &&
          <DynamicControlField
            showFieldLabel={false}
            errorInfo={getErrorInfo(itemCustomerName.fieldName)}
            controlType={ControlType.EDIT_LIST} isDnDAddField={false}
            isDnDMoveField={false} fieldInfo={itemCustomerName}
            elementStatus={rowDataCustomerName}
            className={'width-200'}
            updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
            idUpdate={getValueProp(props.valueData, nameKey)}
          />
        }
      </div>
    </>
  }

  const renderComponentLogo = () => {
    const itemCustomerLogo = _.cloneDeep(props.itemData);
    const rowDataCustomerLogo = _.cloneDeep(rowData);
    rowDataCustomerLogo.fieldValue = [{
      fileName: R.path(['customer_logo', 'photoFileName'], props.valueData),
      filePath: R.path(['customer_logo', 'photoFilePath'], props.valueData),
      fileUrl: R.path(['customer_logo', 'fileUrl'], props.valueData),
    }]
    return <>
      <div className="special-input p-0">
        <div className="input-common-wrap-text">
          {itemCustomerLogo &&
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(itemCustomerLogo.fieldName)}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemCustomerLogo}
              elementStatus={rowDataCustomerLogo}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              updateFiles={props.updateFiles}
              className={'input-common-wrap w100 width-200'}
              idUpdate={getValueProp(props.valueData, nameKey)}
              isSingleFile={true}
              acceptFileExtension={FILE_FOMATS.IMG}
            />
          }
        </div>
      </div>
    </>
  }

  const updateStateParentId = (id, type, modeSelect, tags) => {
    if (tags.length === 0) {
      props.updateStateField({ itemId: rowData.key, fieldId: props.itemData.fieldId }, DEFINE_FIELD_TYPE.OTHER, null);
    } else {
      props.updateStateField({ itemId: rowData.key, fieldId: props.itemData.fieldId }, DEFINE_FIELD_TYPE.OTHER, tags[0].customerId);
    }
  }

  useEffect(() => {
    if (props.itemData.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_PARENT) {
      const val = R.path(['customer_parent', 'pathTreeId', 0], props.valueData) ? R.path(['customer_parent', 'pathTreeId', 0], props.valueData) : null;
      props.updateStateField({ itemId: rowData.key, fieldId: props.itemData.fieldId }, DEFINE_FIELD_TYPE.OTHER, val);
    }
  }, []);


  const renderComponentCustomerParent = () => {
    return <div className="break-line form-group common width-250">
      <TagAutoComplete
        type={TagAutoCompleteType.Customer}
        id={specialId}
        modeSelect={TagAutoCompleteMode.Single}
        ref={ref}
        placeholder={translate('customers.create-edit-modal.placeholder-customer-parent')}
        elementTags={
          R.path(['customer_parent', 'pathTreeId', 0], props.valueData)
            ? [{
              customerId: R.path(['customer_parent', 'pathTreeId', 0], props.valueData),
              customerName: R.path(['customer_parent', 'pathTreeName', 0], props.valueData)
            }]
            :
            null
        }
        isShowOnList={true}
        className="tag text-ellipsis w80"
        onActionSelectTag={updateStateParentId}
        inputClass="input-normal"
      />
    </div>
  }

  return (
    <>
      {_.isArray(props.itemData) && renderComponentBusiness()}
      {/* for customer Name */}
      {props.itemData && props.itemData.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_NAME && renderComponentName()}
      {/* for customer Image photo*/}
      {props.itemData && props.itemData.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO && renderComponentLogo()}
      {props.itemData && props.itemData.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_PARENT && renderComponentCustomerParent()}
    </>
  )
}

export default SpecialEditList;