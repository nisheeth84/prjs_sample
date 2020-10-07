import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { connect, Options } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import Popover from 'app/shared/layout/common/Popover';
import { BUSINESS_CARD_LIST_ID } from '../constants';
import { getJsonStringName, isNullAllPropertyObject } from '../util';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import _ from 'lodash';
import { ControlType, FIELD_BELONG } from 'app/config/constants';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { translate } from 'react-jhipster';
import StringUtils, { getFieldLabel, forceArray, jsonParse, tryParseJson, getPlaceHolder, getErrorMessage, toKatakana } from 'app/shared/util/string-utils';
import SlideShow from '../common/slide-show';
import {
  handleSuggestBusinessCardDepartment,
} from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card.reducer';
import TagAutoComplete from '../../../shared/layout/common/suggestion/tag-auto-complete';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import { MODIFY_FLAG } from 'app/config/constants';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';

interface IRowValueProps extends StateProps, DispatchProps {
  fieldDataValue,
  fieldName,
  fieldLabel,
  valueReturn,
  valueCustomInput,
  isDefault,
  field,
  idCheck,
  errorMessage,
  errorItems,
  setUploadFile,
  resetCheckall,
  initValueForm,
  isShowFormCustom
}

type IRowValue = IRowValueProps;

const MAXLENGTH = 100;

const RowValue = (props: IRowValue) => {
  const [returnValue, setReturnValue] = useState(props.fieldDataValue ? { key: 0, value: props.fieldDataValue[0] } : { key: null, value: "" });
  const [valueInput, setValueInput] = useState(null);
  const [showSlideImage, setShowSlideImage] = useState(false);
  const [lstImage, setLstImage] = useState([]);

  const [department, setDepartment] = useState("");
  const [iShowDelete, setIsShowDelete] = useState(false);
  const [dataSelected, setDataSelected] = useState([]);
  const [isSelectedDropdown, setIsOpenDropdownList] = useState(false);
  const [, setSuggestList] = useState([]);
  const [fileUploads, setFileUploads] = useState({});
  const refCompany = useRef(null);
  const [tagsCompany, setTagsCompany] = useState([]);
  const [validateError, setValidateError] = useState([]);

  const node = useRef(null);

  const [fieldValue, setFieldValue] = useState([]);
  useEffect(() => {
    setFieldValue(props.fieldDataValue? props.fieldDataValue : []);
  }, [props.fieldDataValue]);

  useEffect(() => {
    setValidateError(props.errorItems);
  }, [props.errorItems]);

  const onChange = (e, idx) => {
    const dataValidateError = validateError ? validateError.filter(element => element.item !== StringUtils.snakeCaseToCamelCase(props.fieldName)) : null;
    setValidateError(dataValidateError);
    if (idx === null || idx !== null && e !== null && e !== undefined && e !== []) {
      const infoCheck = { key: idx, value: e };
      setReturnValue(infoCheck);
      props.resetCheckall();
      // Save data for Obj of Parent
      const valueReturn = { fieldName: props.fieldName, value: e, isDefault: props.isDefault, idx};
      props.valueReturn(valueReturn);      
      // Save data to init data when open New Window
      props.valueCustomInput(valueInput, props.fieldName);
      if (props.fieldName === "business_card_image_path" || props.fieldName.includes("file")) {
        if (idx === null) {
          props.setUploadFile(fileUploads);
        } else {
          props.setUploadFile({});
        }
      }
    }
  }

  /* _________________Render_________________ */
  const renderSlideShowImage = () => {
    return (
      showSlideImage &&
      <SlideShow
        lstImage={lstImage}
        setShowSlideImage={setShowSlideImage}
      />
    )
  }

  const getListImage = (lstData) => {
    const lstImg = []
    lstData.forEach(item => lstImg.push({ imageName: item['businessCardImageName'], imagePath: item['businessCardImagePath'] }))
    return lstImg;
  }

  const onOpenShowSlideImage = (data) => {
    setLstImage(getListImage([data]));
    setShowSlideImage(true);
  }

  // update checked when click check all of column
  useEffect(() => {
    if (
      (props.fieldName === "business_card_id" && props.idCheck === null && props.fieldDataValue !== undefined) 
      || props.idCheck === undefined
      || props.idCheck === -1
      ) return;

    const check = { key: 0, value: '' };
    let updateSetCheck = props.idCheck;
    if (fieldValue && (fieldValue.length > 0 && (_.isNull(fieldValue[updateSetCheck]) || _.isUndefined(fieldValue[updateSetCheck]) || isNullAllPropertyObject(fieldValue[updateSetCheck]) || fieldValue[updateSetCheck] === "[]" || fieldValue[updateSetCheck] === ""))) {
      updateSetCheck = null;
    }
    check["key"] = updateSetCheck;
    if (updateSetCheck !== null) {
      check["value"] = props.fieldDataValue ? props.fieldDataValue[updateSetCheck] : '';
    } else {
      check["value"] = valueInput;
    }
    setReturnValue(check);
    const valueReturn = { fieldName: props.fieldName, value: check["value"], isDefault: props.isDefault, idx: updateSetCheck }
    props.valueReturn(valueReturn);
  }, [props.idCheck]);

  // update checked when init modal or search add new item to table
  useEffect(() => {
    const idCheckData = (props.idCheck === -1 || (props.fieldName === "business_card_id" && fieldValue.length === 1))? 0 : props.idCheck;
    if (fieldValue !== null && fieldValue !== undefined && fieldValue.length>0) {
      const returnVal: { key: number, value: string } = { key: idCheckData, value: fieldValue[idCheckData] };
      if (fieldValue[idCheckData] !== null && fieldValue[idCheckData] !== undefined && fieldValue[idCheckData] !== []) {
        setReturnValue(returnVal);
        if(props.idCheck === -1) {
          const valueReturn = { fieldName: props.fieldName, value: fieldValue[0], isDefault: props.isDefault, idx: 0};
          props.valueReturn(valueReturn);  
        }
      }
      else {
        setReturnValue({ key: null, value: "" });
      }
    }
  }, [fieldValue]);

  // update data, when have two action: click radio and change value in Input for this td have renderFinalColume. Or auto click radio when change value
  useEffect(() => {
    onChange(valueInput, null);
  }, [valueInput]);

  const updateStateField = (item, type, val) => {
    const valueUpdate = _.cloneDeep(val);
    setValueInput(valueUpdate);
  }

  const getErrorInfo = () => {
    let errorInfo = null;
    if (validateError) {
      Array.isArray(validateError) && validateError.length > 0 && validateError.map((e, idx) => {
        let fieldName = props.fieldName;
        if (props.isDefault) {
          fieldName = StringUtils.snakeCaseToCamelCase(fieldName);
        }
        if (e.item === fieldName) {
          errorInfo = {
            rowId: e.rowId,
            item: e.item,
            errorCode: props.errorMessage,
            params: null
          };
        }
      });
    }
    return errorInfo;
  }

  /**
   * Render of item name
   * @param fieldName Field name in database
   * @param filedType Field type in database
   * @param valueOfItem Value of item
   * @param itemField If filedType is 1, 2, 3, 4 then itemField is field item in database
   */
  const getFieldItem = (fieldName, filedType, valueOfItem, itemField, index) => {
    const errorInfo = !_.isNull(returnValue["key"]) && !_.isUndefined(returnValue["key"]) && returnValue["key"] === index && fieldName !== "company_name" && fieldName !== "business_card_id" ? getErrorInfo() : null;
    const msg = getErrorMessage(errorInfo);

    if (fieldName === "is_working") {
      return (<>
        <label htmlFor="radio1" className="text-ellipsis">
          <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
            {valueOfItem ?
              translate('businesscards.create-edit.isWorking') :
              translate('businesscards.create-edit.notWorking')}
          </Popover>
        </label>
        {msg && <span className="messenger-error word-break-all">{msg}</span>}
      </>)
    }
    if (fieldName === "address") {
      return (<>
        <label htmlFor="radio1" className="text-ellipsis">
          <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
            {translate('dynamic-control.fieldDetail.layoutAddress.lable.postMark')}
            {valueOfItem.zipCode}{valueOfItem.address}{valueOfItem.building}
          </Popover>
        </label>
        {msg && <span className="messenger-error word-break-all">{msg}</span>}
      </>)
    }
    if (fieldName === "company_name") {
      return (<>
        <label htmlFor="radio1" className="text-ellipsis">
          <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
            {valueOfItem.alternativeCustomerName ? valueOfItem.alternativeCustomerName : valueOfItem.customerName}
          </Popover>
        </label>
      </>)
    }
    if (fieldName === "business_card_image_path") {
      return <>
        <label htmlFor="radio1" className="text-ellipsis">
          <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
            {valueOfItem.businessCardImageName}
          </Popover>
        </label>
        <img className="img-table-default w100 d-block mt-2" src={valueOfItem.businessCardImagePath} alt="" title="" onClick={() => { onOpenShowSlideImage(valueOfItem) }} ></img>
        {msg && <span className="messenger-error word-break-all">{msg}</span>}
      </>
    }
    if (_.toString(filedType) === DEFINE_FIELD_TYPE.LINK) {
      const objLink = tryParseJson(valueOfItem);
      const display = _.get(objLink, 'url_text') ? _.get(objLink, 'url_text') :
        _.get(objLink, 'url_target') ? _.get(objLink, 'url_target') : "";
      return (<>
        <label htmlFor="radio1" className="text-ellipsis">
          <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
            {display}
          </Popover>
        </label>
        {msg && <span className="messenger-error word-break-all">{msg}</span>}
      </>)
    }
    if (_.toString(filedType) === DEFINE_FIELD_TYPE.ADDRESS) {
      const objAddress = tryParseJson(valueOfItem);
      return (<>
        <label htmlFor="radio1" className="text-ellipsis">
          <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
            {translate('dynamic-control.fieldDetail.layoutAddress.lable.postMark')}
            {_.get(objAddress, "address")}
          </Popover>
        </label>
        {msg && <span className="messenger-error word-break-all">{msg}</span>}
      </>)
    }
    if (_.toString(filedType) === DEFINE_FIELD_TYPE.RADIOBOX || _.toString(filedType) === DEFINE_FIELD_TYPE.SINGER_SELECTBOX) {
      const fieldLabelOfItem = itemField.find(e => _.toString(e.itemId) === valueOfItem)
      return (<>
        <label htmlFor="radio1" className="text-ellipsis">
          <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
            {getFieldLabel(fieldLabelOfItem, "itemLabel")}
          </Popover>
        </label>
        {msg && <span className="messenger-error word-break-all">{msg}</span>}
      </>)
    }
    if (_.toString(filedType) === DEFINE_FIELD_TYPE.CHECKBOX || _.toString(filedType) === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
      const lstItem = forceArray(valueOfItem);
      const resuleOfItem = [];
      lstItem && lstItem.length > 0 && lstItem.forEach(e => {
        const tmpData = getFieldLabel(itemField.find(ele => _.toString(ele.itemId) === _.toString(e)), "itemLabel");
        tmpData && resuleOfItem.push(tmpData);
      })
      return (<>
        <label htmlFor="radio1" className="text-ellipsis">
          <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
            {_.toString(resuleOfItem)}
          </Popover>
        </label>
        {msg && <span className="messenger-error word-break-all">{msg}</span>}
      </>)
    }
    return (<>
      <label htmlFor="radio1" className="text-ellipsis">
        <Popover x={0} y={20} className={"modal-table-merge-column-popover"}>
          {valueOfItem}
        </Popover>
      </label>
      {msg && <span className="messenger-error word-break-all">{msg}</span>}
    </>)
  }

  /*
   * form custom Data table
   */
  const onchangeText = (valueData) => {
    // const valueReturn = { 'alternativeCustomerName': toKatakana(valueData) }
    setValueInput(toKatakana(valueData));
  }

  const onActionSelectTagCompany = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    const tmpListTags = listTag.map(ele => {
      if (ele.participantType) {
        return ele;
      }
      return { ...ele, participantType: 2 };
    });
    setValueInput(tmpListTags[0]);
    refCompany.current.setTags(tmpListTags);
    setTagsCompany(tmpListTags);
  };
  const renderCompanyName = () => {
    return <div className="sugges-company form-group">
      <TagAutoComplete
        id="paticipant"
        type={TagAutoCompleteType.Customer}
        modeSelect={TagAutoCompleteMode.Single}
        ref={refCompany}
        onActionSelectTag={onActionSelectTagCompany}
        isHoldTextInput={true}
        onChangeText={onchangeText}
        maxLength={MAXLENGTH}
        textInputValue={props.fieldDataValue ? props.fieldDataValue[0]?.alternativeCustomerName : ''}
        placeholder={getPlaceHolder(props.field)}
        inputClass={'input-normal'}
        elementTags={tagsCompany}
      />
    </div>
  }

  /**
  *  suggestion box department 
  */
  const handleClickOutside = event => {
    if (node.current && !node.current.contains(event.target)) {
      setIsOpenDropdownList(false);
    }
  };

  const toASCII = (chars) => {
    return chars.replace(
      /[\uff01-\uff5e]/g,
      function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); }
    );
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);
  useEffect(() => {
    if (props.suggestDepartment) {
      setSuggestList(props.suggestDepartment.department)
    }
  }, [props.suggestDepartment])

  useEffect(() => {
    if (props.fieldName === "department_name") {
      setDepartment(props.initValueForm);
    }
  }, [props.initValueForm]);

  const onChangeValueText = (event) => {
    const changeVal = event.target.value;
    if (changeVal.length > MAXLENGTH) {
      return;
    }
    changeVal && props.handleSuggestBusinessCardDepartment({ departmentName: changeVal.trim() })
    const valueData = changeVal ? changeVal : null;
    setDepartment(valueData);
    setIsOpenDropdownList(true)
  };
  const onBlurValueText = (event) => {
    const changeVal = toASCII(event.target.value);
    changeVal && props.handleSuggestBusinessCardDepartment({ departmentName: toKatakana(changeVal) });
    const valueData = changeVal ? toKatakana(changeVal) : null;
    setDepartment(valueData);
    setIsOpenDropdownList(true);
    setValueInput(valueData);
  };
  const onKeyDownInput = () => {
    const infoCheck = { key: null, value: department }
    setReturnValue(infoCheck);
  }
  const onClearSelect = () => {
    setDataSelected([])
    setDepartment("");
    setValueInput("");
  }
  const handleSelect = (_value) => {
    setIsOpenDropdownList(!isSelectedDropdown)
    setDataSelected(_value);
    const valueReturn = { fieldName: props.fieldLabel, value: _value, isDefault: props.isDefault }
    props.valueReturn(valueReturn)
  }

  const renderDepartment = (label) => {
    return <div className="w100 form-group non-label">
      <div >
        <div className={dataSelected?.length > 0 ? "search-box-button-style-category" : "input-common-wrap delete"} >
          {dataSelected?.length > 0 &&
            <div className={"wrap-tag "}>
              <div className="tag tag-ellipsis " >{dataSelected}<button className="close close-category" onClick={() => onClearSelect()}>×</button></div>
            </div>}
          {(dataSelected?.length < 1) &&
            <input
              ref={node}
              type="text"
              className={`input-normal w100`}
              value={department}
              placeholder={getPlaceHolder(props.field)}
              onMouseEnter={() => setIsShowDelete(true)}
              onMouseLeave={() => setIsShowDelete(false)}
              onChange={event => onChangeValueText(event)}
              onBlur={event => onBlurValueText(event)}
              onKeyDown={onKeyDownInput}
            />}
          {iShowDelete && department?.length > 0 &&
            <span className="icon-delete" onClick={() => onClearSelect()} onMouseEnter={() => setIsShowDelete(true)} onMouseLeave={() => setIsShowDelete(false)} />}
        </div>
        {props.suggestDepartment && isSelectedDropdown &&
          <div className="drop-down height-unset">
            <ul className="dropdown-item style-3 overflow-hover" >
              {props.suggestDepartment.map((data, id) => (
                <li key={id}
                  onClick={() => handleSelect(data.departmentName)}
                  className="item smooth">
                  <div className="text text2 text-ellipsis">{data.departmentName}</div>
                </li>
              ))}
            </ul>
          </div>
        }
      </div>
    </div>
  };

  const updateFiles = fUploads => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };

    const dataImage = _.cloneDeep(newUploads);
    setFileUploads(dataImage);
    setValueInput(dataImage);
  };

  const [isWorkChecked, setIsWorkChecked] = useState(true);

  const renderFinalColume = (filedNameOfItem) => {
    if (filedNameOfItem === "department_name") {
      return renderDepartment(filedNameOfItem);
    }

    if (filedNameOfItem === "is_working") {
      return (
        <>
          <div className="w100 form-group">
            <div className="wrap-check wrap-tag pt-0">
              <div className="">
                <div className="check-box-item mr-0 pt-0">
                  <label className={`icon-check mr-3 `}>
                    <input
                      type="checkbox"
                      defaultChecked={isWorkChecked}
                      onChange={() => {
                        setIsWorkChecked(!isWorkChecked);
                        setValueInput(!isWorkChecked);
                      }} />
                    <i></i>
                    {translate(`businesscards.create-edit.working`)}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    if (filedNameOfItem === "company_name") {
      return renderCompanyName();
    }
    return <DynamicControlField
      key={filedNameOfItem}
      belong={FIELD_BELONG.BUSINESS_CARD}
      isSingleFile={true}
      fieldInfo={props.field}
      updateStateElement={updateStateField}
      isDnDAddField={false} isDnDMoveField={false}
      controlType={ControlType.EDIT}
      updateFiles={updateFiles}
      idUpdate={1}
      isDisabled={false}
      className={'form-group non-label picture_business_card'}
      errorInfo={_.isNull(returnValue["key"]) || _.isUndefined(returnValue["key"]) ? getErrorInfo() : null}
      acceptFileExtension={props.field.fieldName === 'business_card_image_path' ? FILE_FOMATS.IMG : null}
      // Init form data
      {...(props.initValueForm ? { elementStatus: { key: props.field.fieldName, fieldValue: props.initValueForm } } : {})}
    />
  }

  return <tr>
    <td className="title-table width-250">
      {getJsonStringName(props.fieldLabel)}
      {(props.field.modifyFlag === MODIFY_FLAG.REQUIRED || props.field.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED) && (
        <span className="label-red ml-2">
          {translate('customers.customer-integration.required')}
        </span>
      )}
    </td>
    {fieldValue.length > 0 && fieldValue.map((item, idx) => {
      return <td key={idx} className="width-250">
        {props.fieldName === "employee_id" && item ? translate("businesscards.list-view.sort.receiver-info") : null}
        {props.fieldName !== "employee_id" && !_.isNull(item) && !_.isUndefined(item) && !isNullAllPropertyObject(item) && item !== "[]" && item !== "" &&
          <div className="wrap-check-radio d-block height-auto" >
            <div className="radio-item" onClick={() => onChange(item, idx)}>
              <input type="radio" id={props.fieldName + idx}
                name={props.fieldName}
                value={(!_.isNull(item) && !_.isUndefined(item)) ? item : ""}
                checked={(!_.isNull(item) && !_.isUndefined(item)) && returnValue["key"] === idx}
              />
              {getFieldItem(props.fieldName, props.field.fieldType, item, props.field.fieldItems, idx)}
              {
                _.toString(props.field.fieldType) === DEFINE_FIELD_TYPE.FILE && props.fieldName !== "business_card_image_path" &&
                <img className="img-table-default w100 d-block mt-2" src={item} alt="" title="" />
              }
            </div>
          </div>
        }
      </td>
    }
    )}
    {props.fieldName === "business_card_id"
      ? <td className="modal-merger-businesscard__input-custom width-400-px">{translate('businesscards.merge-business-card.cannot-enter')}</td>
      : props.fieldName === "employee_id"
        ? <td className="modal-merger-businesscard__input-custom width-400-px">{translate("businesscards.list-view.sort.receiver-info")}</td>
        : <td className="modal-merger-businesscard__input-custom width-400-px">
          <div className="d-flex">
            <div className="wrap-check-radio d-block height-auto">
              <div className="radio-item" onClick={() => onChange(valueInput, null)}>
                <input type="radio" id="radio-input" value={valueInput} name={props.fieldName}
                  checked={returnValue["key"] === null || (fieldValue.length > 0 && _.isUndefined(fieldValue[returnValue["key"]]))}
                />
                <label htmlFor="radio8">&nbsp;</label>
              </div>
            </div>
            {props.isShowFormCustom ? renderFinalColume(props.fieldName) : null}
          </div>
        </td>
    }
    {renderSlideShowImage()}
  </tr>

}

const mapStateToProps = ({ dynamicList, createEditBusinessCard }: IRootState) => ({
  suggestDepartment: createEditBusinessCard.suggestDepartment,
  recordCheckList: dynamicList.data.has(BUSINESS_CARD_LIST_ID) ? dynamicList.data.get(BUSINESS_CARD_LIST_ID).recordCheckList : []
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
)(RowValue)
