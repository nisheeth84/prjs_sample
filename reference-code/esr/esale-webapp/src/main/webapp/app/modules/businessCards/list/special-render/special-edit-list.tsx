import React, {
  useState, useRef,
  useEffect
} from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { ControlType, MODIFY_FLAG } from 'app/config/constants';
import { EDIT_SPECIAL_ITEM, BUSINESS_CARD_VIEW_MODES, BUSINESS_SPECIAL_FIELD_NAMES } from 'app/modules/businessCards/constants';
import { translate, Storage } from 'react-jhipster';
import { TagAutoCompleteType, TagAutoCompleteMode, } from "app/shared/layout/common/suggestion/constants";
import TagSuggestion from "app/shared/layout/common/suggestion/tag-auto-complete";
import TagAutoComplete from "app/shared/layout/common/suggestion/tag-auto-complete";
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import {
  handleSuggestBusinessCardDepartment,
} from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card.reducer';
import DatePicker from "app/shared/layout/common/date-picker";
import dateFnsFormat from 'date-fns/format';
import { convertDateTimeToTz } from 'app/shared/util/date-utils';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { USER_FORMAT_DATE_KEY, APP_DATETIME_FORMAT_ES } from 'app/config/constants';

export interface ISpecialEditListProps extends StateProps, DispatchProps {
  valueData: any,
  itemData: any,
  extensionsData?: any,
  nameKey?: any,
  errorInfo?: any,
  errorInfos?: any[],
  typeSpecialEdit?: any,
  updateFiles?: (files) => void; // for field file
  updateStateField: (itemData, type, itemEditValue, index?: any) => void             // callback when user edit value cell
  isFocusFirst?: boolean,
  itemFirstFocus?: null // First item error
  businessCardViewMode?: any,
}

/**
 * Component for manager setting item
 * @param props 
 */
export const SpecailEditList = (props: ISpecialEditListProps) => {
  const [dataSelected, setDataSelected] = useState([]);
  const [department, setDepartment] = useState("");
  const [iShowDelete, setIsShowDelete] = useState(false);
  const [isSelectedDropdown, setIsOpenDropdownList] = useState(false);
  const [receivePerson, setReceivePerson] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [receiveDate, setReceiveDate] = useState([]);
  const [isWorking, setIsWorking] = useState(false);
  const node = useRef(null);
  const userFormatDate = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATETIME_FORMAT_ES);

  const { nameKey } = props;
  const rowData = { key: '', fieldValue: null };
  rowData.key = getValueProp(props.valueData, nameKey);

  const getErrorInfo = (name) => {
    if (props.errorInfos) {
      const errorInfo = props.errorInfos.find(e => e.item === _.camelCase(name) && e.rowId.toString() === rowData.key.toString());
      if (errorInfo) {
        return errorInfo;
      }
    }
    return null;
  }

  const validateItem = item => {
    const errorInfo = getErrorInfo(item);
    if (errorInfo) {
      return translate('messages.' + errorInfo.errorCode, errorInfo.errorParams);
    }
    return null;
  };

  useEffect(() => {
    if (props.valueData.department_name) {
      setDataSelected([props.valueData.department_name]);
      setDepartment(props.valueData.department_name)
    }
    if (props.valueData.business_cards_receives && props.valueData.business_cards_receives.length > 0) {
      setReceivePerson(props.valueData.business_cards_receives);
      const employeesList = [];
      const receiveDateList = [];
      props.valueData.business_cards_receives.forEach(element => {
        employeesList.push(element.employeeId)
        receiveDateList.push(element.receiveDate)
      });
      setEmployees(employeesList);
      setReceiveDate(receiveDateList);
      if (props.typeSpecialEdit === EDIT_SPECIAL_ITEM.EPLOYEE_ID) {
        const itemData = { itemId: props.valueData.business_card_id, fieldId: props.itemData.fieldId };
        props.updateStateField(itemData, '99', employeesList, null);
      }
      if (props.typeSpecialEdit === EDIT_SPECIAL_ITEM.RECEIVE_DATE) {
        const itemData = { itemId: props.valueData.business_card_id, fieldId: props.itemData.fieldId };
        props.updateStateField(itemData, '99', receiveDateList, null);
      }
    }
    if (props.valueData) {
      setIsWorking(props.valueData.is_working)
    }
    if (props.typeSpecialEdit === EDIT_SPECIAL_ITEM.NAME) {
      const itemDataCompany = props.itemData.find(e => e.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.alternativeCustomerName);
      const itemData = { itemId: props.valueData['business_card_id'], fieldId: itemDataCompany.fieldId };
      const activities = props.valueData;
      const customer = {
        customerId: activities['customer_id'],
        customerName: activities['customer_name'],
      }
      props.updateStateField(itemData, '99', customer, null);
    }
  }, []);

  const getDataTagStatusControl = (data, itemCompany) => {
    let fieldValue = null;
    if (data && data['customer_id']) {
      const activities = data;
      const customer = {
        customerId: activities['customer_id'],
        customerName: activities['customer_name'],
      }
      let _tags = [];
      _tags = [customer];
      fieldValue = _tags;
      // props.updateStateField(itemData, '99', customer, null);
    } else {
      fieldValue = null;
    }
    return fieldValue;
  }

  const onClearSelect = (itemDepartments) => {
    props.updateStateField({ itemId: props.valueData.business_card_id, fieldId: itemDepartments.fieldId }, "9", null, null);
    setDataSelected([])
    setDepartment("");
  }
  const handleSelect = (_value, itemDepartments) => {
    props.updateStateField({ itemId: props.valueData.business_card_id, fieldId: itemDepartments.fieldId }, "9", _value, null);
    setIsOpenDropdownList(!isSelectedDropdown)
    setDataSelected(_value);
  }

  const onChangeValueText = (event) => {
    const changeVal = event.target.value;
    changeVal && props.handleSuggestBusinessCardDepartment({ departmentName: changeVal });
    setDepartment(changeVal ? changeVal : null);
    setIsOpenDropdownList(true)
    const field = props.itemData.find(e => e.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardDepartments)
    props.updateStateField({ itemId: props.valueData.business_card_id, fieldId: field.fieldId }, "9", changeVal, null);
  };

  const getListEmployee = (data) => {
    let arrOperator = [];
    if (data) {
      if (data.employeeId) {
        arrOperator.push({
          employeeId: data.employeeId,
          employeeIcon: {
            fileUrl: data.employeePhoto?.filePath
          },
          employeeSurname: data.employeeSurname,
          employeeName: data.employeeName,
          departments: [
            {
              departmentName: null,
              positionName: null
            }
          ]
        })
      } else {
        arrOperator = null;
      }
    }
    return arrOperator;
  }

  const onchangDate = (index, d) => {
    if (d) receiveDate[index] = dateFnsFormat(convertDateTimeToTz(d), userFormatDate);
    else receiveDate[index] = null;
    props.updateStateField({ itemId: props.valueData.business_card_id, fieldId: props.itemData.fieldId }, '99', receiveDate, null)
  }

  const renderDepartment = (itemDepartments) => {
    return <div className="w100">
      <div className="form-group non-label">
        <div >
          <div className={dataSelected?.length > 0 ? "search-box-button-style-category" : "input-common-wrap delete"} >
            {dataSelected?.length > 0 &&
              <div className={"wrap-tag "}>
                <div className="tag tag-ellipsis " >{dataSelected}<button className="close close-category" onClick={() => onClearSelect(itemDepartments)}>×</button></div>
              </div>}
            {(dataSelected?.length < 1) &&
              <input
                ref={node}
                type="text"
                className={`input-normal w100`}
                placeholder={getFieldLabel(itemDepartments, 'fieldLabel') + translate('businesscards.create-edit.input')}
                value={department}
                onMouseEnter={() => setIsShowDelete(true)}
                onMouseLeave={() => setIsShowDelete(false)}
                onChange={event => onChangeValueText(event)}
              />}
            {iShowDelete && department?.length > 0 &&
              <span className="icon-delete" onClick={() => onClearSelect(itemDepartments)} onMouseEnter={() => setIsShowDelete(true)} onMouseLeave={() => setIsShowDelete(false)} />}
          </div>
          {props.suggestDepartment && isSelectedDropdown &&
            <div className="drop-down min-width-200 height-unset">
              <ul className="dropdown-item style-3 overflow-hover" >
                {props.suggestDepartment.map((data, id) => (
                  <li key={id}
                    onClick={() => handleSelect(data.departmentName, itemDepartments)}
                    className="item smooth">
                    <div className="text text2 text-ellipsis">{data.departmentName}</div>
                  </li>
                ))}
              </ul>
            </div>
          }
        </div>
      </div>
    </div>
  };

  const renderComponentName = () => {
    let itemFirstName = null;
    let itemLastName = null;
    let itemCompany = null;
    const rowDataLastName = _.cloneDeep(rowData);
    const rowDataFirstName = _.cloneDeep(rowData);
    const rowDataCompany = _.cloneDeep(rowData);
    props.itemData.forEach(element => {
      if (element.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardFirstName) {
        itemFirstName = element;
      }
      if (element.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardLastName) {
        itemLastName = element;
      }
      if (element.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.alternativeCustomerName) {
        itemCompany = element;
      }
    });
    itemFirstName && (itemFirstName.fieldType = DEFINE_FIELD_TYPE.TEXT);
    itemLastName && (itemLastName.fieldType = DEFINE_FIELD_TYPE.TEXT);

    rowDataLastName.fieldValue = props.valueData.last_name;
    rowDataFirstName.fieldValue = props.valueData.first_name;
    rowDataCompany.fieldValue = props.valueData.alternative_customer_name;
    return <div className="width-300">
      <div>
        {itemCompany && <>
          <div className=" form-group max-width-300" key={`activityField_${props.itemData.fieldId}`}>
            <TagSuggestion
              id="customerId"
              className="items break-line form-group"
              placeholder={translate('activity.modal.customer-placeholder')}
              inputClass="input-normal"
              validMsg={validateItem(itemCompany.fieldName)}
              modeSelect={TagAutoCompleteMode.Single}
              type={TagAutoCompleteType.Customer}
              elementTags={getDataTagStatusControl(props.valueData, itemCompany)}
              onActionSelectTag={(id: any, type: TagAutoCompleteType, _mode: TagAutoCompleteMode, listTag: any[]) => {
                const value = listTag.length > 0 ? listTag[0] : {
                  customerId: null,
                  customerName: null,
                }
                props.updateStateField({ itemId: props.valueData.business_card_id, fieldId: itemCompany.fieldId }, type, value, null);
              }}
              title={getFieldLabel(props.itemData, 'fieldLabel')}
              isRequired={StringUtils.getValuePropStr(props.itemData, 'modifyFlag') === MODIFY_FLAG.REQUIRED || StringUtils.getValuePropStr(props.valueData, 'modifyFlag') === MODIFY_FLAG.DEFAULT_REQUIRED}
              isDisabled={props.businessCardViewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW}
              isHoldTextInput={true}
              onChangeText={(e) => props.updateStateField({ itemId: props.valueData.business_card_id, fieldId: itemCompany.fieldId }, '99', e, null)}
              textInputValue={props.valueData.alternative_customer_name}
            />

          </div>
        </>
        }
      </div>
      <div className="special-input special-input-company">
        <div className="input-common-wrap-text w50">
          {itemFirstName &&
            <DynamicControlField
              className={' input-common-wrap w100'}
              showFieldLabel={false}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemFirstName}
              elementStatus={rowDataFirstName}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              idUpdate={getValueProp(props.valueData, nameKey)}
              errorInfo={getErrorInfo(itemFirstName.fieldName)}
              isFocus={StringUtils.equalPropertyName(itemFirstName.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
            />
          }
        </div>
        <div className="input-common-wrap-text w50">
          {itemLastName &&
            <DynamicControlField
              showFieldLabel={false}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemLastName}
              elementStatus={rowDataLastName}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              idUpdate={getValueProp(props.valueData, nameKey)}
              errorInfo={getErrorInfo(itemLastName.fieldName)}
              isFocus={StringUtils.equalPropertyName(itemLastName.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
            />
          }
        </div>
      </div>
    </div>;
  }

  const renderComponentContact = () => {
    let itemPhoneNumber = null;
    let itemMobileNumber = null;
    let itemEmailAddress = null;
    const rowDataPhoneNumber = _.cloneDeep(rowData);
    const rowDataMobileNumber = _.cloneDeep(rowData);
    const rowDataEmailAddress = _.cloneDeep(rowData);
    props.itemData.forEach(element => {
      if (element.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.phoneNumber) {
        itemPhoneNumber = element;
      }
      if (element.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.mobileNumber) {
        itemMobileNumber = element;
      }
      if (element.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress) {
        itemEmailAddress = element;
      }
    });
    itemPhoneNumber && (itemPhoneNumber.fieldType = DEFINE_FIELD_TYPE.TEXT);
    itemMobileNumber && (itemMobileNumber.fieldType = DEFINE_FIELD_TYPE.TEXT);
    itemEmailAddress && (itemEmailAddress.fieldType = DEFINE_FIELD_TYPE.TEXT);

    rowDataPhoneNumber.fieldValue = props.valueData.phone_number;
    rowDataMobileNumber.fieldValue = props.valueData.mobile_number;
    rowDataEmailAddress.fieldValue = props.valueData.email_address;

    return <div className="width-300">
      <div className="special-input">
        <div className="input-common-wrap-text w33">
          {itemPhoneNumber &&
            <DynamicControlField
              showFieldLabel={false}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemPhoneNumber}
              elementStatus={rowDataPhoneNumber}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              idUpdate={getValueProp(props.valueData, nameKey)}
              errorInfo={getErrorInfo(itemPhoneNumber.fieldName)}
              isFocus={StringUtils.equalPropertyName(itemPhoneNumber.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
            />
          }
        </div>
      </div>
      <div className="special-input">
        <div className="input-common-wrap-text w33">
          {itemMobileNumber &&
            <DynamicControlField
              showFieldLabel={false}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemMobileNumber}
              elementStatus={rowDataMobileNumber}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              idUpdate={getValueProp(props.valueData, nameKey)}
              errorInfo={getErrorInfo(itemMobileNumber.fieldName)}
              isFocus={StringUtils.equalPropertyName(itemMobileNumber.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
            />
          }
        </div>
      </div>
      <div className="special-input">
        <div className="input-common-wrap-text w33">
          {itemEmailAddress &&
            <DynamicControlField
              showFieldLabel={false}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemEmailAddress}
              elementStatus={rowDataEmailAddress}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              className={' input-common-wrap w100'}
              idUpdate={getValueProp(props.valueData, nameKey)}
              errorInfo={getErrorInfo(itemEmailAddress.fieldName)}
              isFocus={StringUtils.equalPropertyName(itemEmailAddress.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
            />
          }
        </div>
      </div>
    </div>;
  }

  const renderComponentDepartmentName = () => {
    let itemDepartments = null;
    let itemPositions = null;
    const rowDataPositions = _.cloneDeep(rowData);
    props.itemData.forEach(element => {
      if (element.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardPositions) {
        itemPositions = element;
      }
      if (element.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardDepartments) {
        itemDepartments = element;
      }
    });
    itemPositions && (itemPositions.fieldType = DEFINE_FIELD_TYPE.TEXT);

    rowDataPositions.fieldValue = props.valueData.position;
    return <div className="max-width-500" >
      <div className="special-input">
        {itemDepartments &&
          renderDepartment(itemDepartments)
        }
      </div>
      <div className="special-input">
        <div className="input-common-wrap-text w33">
          {itemPositions &&
            <DynamicControlField
              showFieldLabel={false}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemPositions}
              elementStatus={rowDataPositions}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              idUpdate={getValueProp(props.valueData, nameKey)}
              errorInfo={getErrorInfo(itemPositions.fieldName)}
              isFocus={StringUtils.equalPropertyName(itemPositions.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
            />
          }
        </div>
      </div>
    </div>;
  }

  const renderComponentReceiveDate = () => {
    return (
      <div className="width-300">
        {receivePerson.map((item, index) => (
          <div className="row min-width-250" key={index} >
            <div className="col-md-12 form-group mb-3">
              <DatePicker
                date={item.receiveDate ? new Date(item.receiveDate) : null}
                onDateChanged={(d) => onchangDate(index, d)}
                placeholder={translate('businesscards.create-edit.receive-date-placeholder')}
              />
            </div>
          </div>
        ))
        }
      </div>
    )
  }

  const renderComponenImage = () => {
    const itemIcon = props.itemData;
    const rowDataIcon = _.cloneDeep(rowData);
    itemIcon && (itemIcon.fieldType = DEFINE_FIELD_TYPE.FILE);
    const image = {
      fileName: props.valueData.business_card_image_name, filePath: props.valueData.business_card_image_path, fileUrl: props.valueData.business_card_image_path, status: null
    }
    rowDataIcon.fieldValue = [image];
    return <div className="width-300">
      <div className="special-input">
        <div className="input-common-wrap-text w100">
          {itemIcon &&
            <DynamicControlField
              showFieldLabel={false}
              errorInfo={getErrorInfo(itemIcon.fieldName)}
              controlType={ControlType.EDIT_LIST} isDnDAddField={false}
              isDnDMoveField={false} fieldInfo={itemIcon}
              elementStatus={rowDataIcon}
              updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
              updateFiles={props.updateFiles}
              className={' input-common-wrap w100'}
              idUpdate={getValueProp(props.valueData, nameKey)}
              isSingleFile={true}
              acceptFileExtension={FILE_FOMATS.IMG}
              isFocus={StringUtils.equalPropertyName(itemIcon.fieldName, props.itemFirstFocus) ? props.isFocusFirst : false}
            />
          }
        </div>
      </div>
    </div>
  }

  const renderComponentEmployees = () => {
    return <div className="width-300">
      {
        receivePerson.map((item, index) => (
          <div className="form-group max-width-300" key={index} >
            <TagAutoComplete
              id={index}
              className="items break-line form-group"
              type={TagAutoCompleteType.Employee}
              modeSelect={TagAutoCompleteMode.Single}
              isRequired={false}
              onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
                const employeesNew = [...employees];
                employeesNew[index] = listTag[0];
                setEmployees(employeesNew);
                props.updateStateField({ itemId: props.valueData.business_card_id, fieldId: props.itemData.fieldId }, '99', employeesNew, null)
              }}
              elementTags={getListEmployee(item)}
              placeholder={translate('businesscards.create-edit.employee-id-placeholder')}
              isShowOnList={true}
              onlyShowEmployees={true}
            />
          </div>
        ))
      }
    </div>
  }

  const renderComponentIsWorking = () => {
    return (<div className="max-width-150" >
      <div className="form-group mt-22" >
        <div className="check-box-item mr-0 pt-0">
          <label className={`icon-check`}>
            <input
              value={`${isWorking}`}
              type="checkbox"
              checked={isWorking}
              onChange={() => {
                setIsWorking(!isWorking)
                props.updateStateField({ itemId: props.valueData.business_card_id, fieldId: props.itemData.fieldId }, '99', !isWorking, null);
              }} />
            <i></i>
            {translate(`businesscards.create-edit.working`)}
          </label>
        </div>
      </div>
    </div>
    );
  }
  return (
    <>
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.NAME && renderComponentName()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.CONTACT && renderComponentContact()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.DEPARTMENT_NAME && renderComponentDepartmentName()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.RECEIVE_DATE && renderComponentReceiveDate()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.IMAGE && renderComponenImage()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.EPLOYEE_ID && renderComponentEmployees()}
      {props.typeSpecialEdit === EDIT_SPECIAL_ITEM.ISWOKING && renderComponentIsWorking()}
    </>
  )
}

const mapStateToProps = ({ createEditBusinessCard }: IRootState) => ({
  suggestDepartment: createEditBusinessCard.suggestDepartment,
});

const mapDispatchToProps = {
  handleSuggestBusinessCardDepartment,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

const options = { forwardRef: true };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecailEditList)

