import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { useId } from 'react-id-generator';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import { DEFINE_FIELD_TYPE, SPECIAL_HIDE_SEARCH_OPTION, SPECIAL_HIDE_SEARCH_OPTION_CHECKBOX } from '../../constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { SEARCH_TYPE, SEARCH_OPTION } from 'app/config/constants'
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';

type IFieldSearchCheckProps = IDynamicFieldProps

const FieldSearchSelect = forwardRef((props: IFieldSearchCheckProps, ref) => {
  const [isSearchBlank, setIsSearchBlank] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const idRadioList = useId(2, "checkbox_radio_");
  const nameRadio = useId(1, "checkbox_radioGroup_");

  const searchOptionButtonRef = useRef(null);
  const [openSearchOption, setOpenSearchOption] = useState(false);
  const searchOptionRef = useRef(null);
  const [searchOption, setSearchOption] = useState(SEARCH_OPTION.OR);
  const [searchType, setSearchType] = useState(false);
  const idRadioOfNot = useId(9, "filter_list_radio_");

  const { fieldInfo } = props;
  const prefix = 'dynamic-control.fieldFilterAndSearch.layoutSelect.';
  const isCheckBoxOrMultiPulldown = props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CHECKBOX ||
    props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.MULTI_SELECTBOX;

  const initialize = () => {
    if (props.elementStatus && props.elementStatus.isSearchBlank !== null) {
      setIsSearchBlank(props.elementStatus.isSearchBlank)
      if (props.elementStatus.searchOption) {
        setSearchOption(props.elementStatus.searchOption.toString());
        setSearchType(props.elementStatus.searchOption.toString() === SEARCH_OPTION.NOT_AND || props.elementStatus.searchOption.toString() === SEARCH_OPTION.NOT_OR);
      }
    }

    const itemCheckList = [];
    if (fieldInfo.fieldItems && fieldInfo.fieldItems.length > 0) {
      const _fieldItems = _.cloneDeep(fieldInfo.fieldItems);
      _fieldItems.sort((a,b)=> a.itemOrder - b.itemOrder);
      _fieldItems.map((item, idx) => {
        let isCheck = false;
        if (props.elementStatus && props.elementStatus.fieldValue) {
          const itemCheck = props.elementStatus.fieldValue.filter(e => e.toString() === item.itemId.toString());
          isCheck = itemCheck.length > 0;
        }
        itemCheckList.push({ check: isCheck, itemId: item.itemId, itemLabel: item.itemLabel });
      });
    }

    setCheckList(itemCheckList);
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (props.updateStateElement && !props.isDisabled && fieldInfo.fieldItems && fieldInfo.fieldItems.length > 0) {
      const fieldValue = [];
      checkList.forEach(item => {
        if (item.check) {
          fieldValue.push(item.itemId.toString());
        }
      });
      const conditions = {};
      conditions['fieldId'] = fieldInfo.fieldId;
      conditions['fieldType'] = fieldInfo.fieldType;
      conditions['isDefault'] = fieldInfo.isDefault;
      conditions['fieldName'] = fieldInfo.fieldName;
      conditions['isSearchBlank'] = isSearchBlank;
      conditions['searchOption'] = searchOption;
      conditions['fieldValue'] = fieldValue;
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, conditions)
    }
  }, [isSearchBlank, checkList, searchOption, searchType])

  const reverseCheck = () => {
    const tmp = [...checkList];
    tmp.forEach((item, idx) => {
      item.check = !item.check;
    });
    setCheckList(tmp);
  };

  const checkAll = (checkValue: boolean) => {
    const tmp = [...checkList];
    tmp.forEach((item, idx) => {
      item.check = checkValue;
    });
    setCheckList(tmp);
  };

  const toggleChange = itemId => {
    const tmp = [...checkList];
    tmp.forEach((item, idx) => {
      if (item.itemId === itemId) item.check = !item.check;
    });
    setCheckList(tmp);
  };

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `checkBox.search.${attr}`)
  }

  const setSearchOptionNot = (ev) => {
    const checked = ev.target.checked;
    if (checked) {
      setSearchType(true);
      setSearchOption((searchOption === SEARCH_OPTION.AND || searchOption === SEARCH_OPTION.NOT_AND) ? SEARCH_OPTION.NOT_AND :
        ((searchOption === SEARCH_OPTION.OR || searchOption === SEARCH_OPTION.NOT_OR) ? SEARCH_OPTION.NOT_OR : null));
    } else {
      setSearchType(false);
      setSearchOption((searchOption === SEARCH_OPTION.AND || searchOption === SEARCH_OPTION.NOT_AND) ? SEARCH_OPTION.AND :
        ((searchOption === SEARCH_OPTION.OR || searchOption === SEARCH_OPTION.NOT_OR) ? SEARCH_OPTION.OR : null));
    }
  }

  const handleUserMouseDown = (event) => {
    if (searchOptionRef.current && !searchOptionRef.current.contains(event.target) &&
      searchOptionButtonRef.current && !searchOptionButtonRef.current.contains(event.target)) {
      setOpenSearchOption(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

  const renderSearchOption = () => {
    return (
      <>
        <div className="select-box" ref={searchOptionRef}>
          <div className="wrap-check-radio">
            <b>{translate(prefix + 'label.not')}</b>
            <label className="icon-check">
              <input type="checkbox" value={SEARCH_TYPE.NOT} checked={searchType} onChange={(e) => setSearchOptionNot(e)} />
              <i></i>
              {translate(prefix + 'item.not')}
            </label>
          </div>
          <div className="wrap-check-radio">
            <b>{translate(prefix + 'label.condition')}</b>
            <p className="radio-item">
              <input type="radio" id={idRadioOfNot[4]} name={nameRadio[2]} checked={searchOption === SEARCH_OPTION.OR || searchOption === SEARCH_OPTION.NOT_OR} value={searchType ? SEARCH_OPTION.NOT_OR : SEARCH_OPTION.OR} onChange={(e) => setSearchOption(searchType ? SEARCH_OPTION.NOT_OR : SEARCH_OPTION.OR)} />
              <label htmlFor={idRadioOfNot[4]}>{translate(prefix + 'label.or')}</label>
            </p>
            <p className="radio-item">
              <input type="radio" id={idRadioOfNot[5]} name={nameRadio[2]} checked={searchOption === SEARCH_OPTION.AND || searchOption === SEARCH_OPTION.NOT_AND} value={searchType ? SEARCH_OPTION.NOT_AND : SEARCH_OPTION.AND} onChange={(e) => setSearchOption(searchType ? SEARCH_OPTION.NOT_AND : SEARCH_OPTION.AND)} />
              <label htmlFor={idRadioOfNot[5]}>{translate(prefix + 'label.and')}</label>
            </p>
          </div>
        </div>
      </>
    )
  }

  const renderComponent = () => {
    return (
      <>
        <div className="wrap-check">
          {isCheckBoxOrMultiPulldown && _.isNil(SPECIAL_HIDE_SEARCH_OPTION.find(item => item === props.fieldInfo.fieldName)) &&
            <div className="box-radio-wrap">
              <button disabled={props.isDisabled} ref={searchOptionButtonRef} type="button" className="icon-fil" onClick={() => setOpenSearchOption(!openSearchOption)} />
              {openSearchOption && renderSearchOption()}
            </div>
          }
          {
            _.isNil(SPECIAL_HIDE_SEARCH_OPTION_CHECKBOX.find(item => item === props.fieldInfo.fieldName)) &&
            <div className="wrap-check-radio">
              <p className="radio-item w15 no-margin">
                <input disabled={props.isDisabled} type="radio" id={idRadioList[0]} name={nameRadio[0]} checked={!isSearchBlank} value='1' onChange={() => setIsSearchBlank(false)} />
                <label htmlFor={idRadioList[0]}>{translate(prefix + 'radio.option')}</label>
              </p>
              <p className="radio-item">
                <input disabled={props.isDisabled} type="radio" id={idRadioList[1]} name={nameRadio[0]} checked={isSearchBlank} value='0' onChange={() => setIsSearchBlank(true)} />
                <label htmlFor={idRadioList[1]}>{translate('dynamic-control.fieldFilterAndSearch.common.radio.notShowItem')}</label>
              </p>
            </div>
          }

          {!isSearchBlank && (
            <div>
              {_.isNil(SPECIAL_HIDE_SEARCH_OPTION_CHECKBOX.find(item => item === props.fieldInfo.fieldName)) &&
                <div className={`wrap-select ${props.isDisabled ? ' pointer-none': ''}`}>
                  <button type="button" disabled={props.isDisabled} className="button-primary button-activity-registration mr-3" onClick={() => checkAll(true)}>{translate(prefix + 'checkBox.checkAll')}</button>
                  <button type="button" disabled={props.isDisabled} className="button-primary button-activity-registration mr-3" onClick={() => checkAll(false)}>{translate(prefix + 'checkBox.unCheckAll')}</button>
                  <button type="button" disabled={props.isDisabled} className="button-primary button-activity-registration" onClick={reverseCheck}>{translate(prefix + 'checkBox.reverseCheck')}</button>
                </div>
              }
              <div className={`${getStyleClass('wrapCheckbox')}`}>
                {checkList.map((e, idx) => (
                  <p className={`${getStyleClass('inputCheckbox')} mr-0`} key={idx}>
                    <label className="icon-check">
                      <input disabled={props.isDisabled} value={e.itemId} type="checkbox" checked={e.check} onChange={() => toggleChange(e.itemId)} />
                      <i></i>
                      {StringUtils.escapeSpaceHtml(getFieldLabel(e, 'itemLabel'))}
                    </label>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <>{renderComponent()}</>
  );
});

export default FieldSearchSelect
