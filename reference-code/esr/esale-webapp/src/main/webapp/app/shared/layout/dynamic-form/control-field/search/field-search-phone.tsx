import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { SEARCH_TYPE, SEARCH_OPTION } from 'app/config/constants'
import { useId } from 'react-id-generator';
import _ from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { translate } from 'react-jhipster';
import { toKatakana } from 'app/shared/util/string-utils';

type IFieldSearchTextProps = IDynamicFieldProps

const FieldSearchPhone = forwardRef((props: IFieldSearchTextProps, ref) => {
  const [value, setValue] = useState('');
  const [isSearchBlank, setIsSearchBlank] = useState(false);
  const [openSearchOption, setOpenSearchOption] = useState(false);
  const [searchOption, setSearchOption] = useState(SEARCH_OPTION.OR);
  const [searchType, setSearchType] = useState(SEARCH_TYPE.LIKE);

  const textboxRef = useRef(null);
  const searchOptionRef = useRef(null);
  const searchOptionButtonRef = useRef(null);

  const nameRadio = useId(3, "field_textbox_radioGroupName_");
  const idRadio = useId(7, "field_textbox_radioGroupId_");

  const {fieldInfo} = props;

  const initialize = () => {
    const defaultVal = props.elementStatus ? props.elementStatus.fieldValue : fieldInfo.defaultValue;
    const searchBlank = props.elementStatus ? props.elementStatus.isSearchBlank : false;
    const sType = props.elementStatus && props.elementStatus.searchType ? props.elementStatus.searchType : SEARCH_TYPE.LIKE;
    const sOption = props.elementStatus && props.elementStatus.searchOption ? props.elementStatus.searchOption : SEARCH_OPTION.OR;

    setValue(defaultVal)
    setIsSearchBlank(searchBlank);
    setSearchType(sType+'');
    setSearchOption(sOption+'')

    if (props.updateStateElement && !props.isDisabled) {
      const conditions = {};
      conditions['fieldId'] = fieldInfo.fieldId;
      conditions['fieldType'] = DEFINE_FIELD_TYPE.TEXT;
      conditions['isDefault'] = fieldInfo.isDefault ? fieldInfo.isDefault : false;
      conditions['fieldName'] = fieldInfo.fieldName;
      conditions['fieldValue'] = defaultVal;
      conditions['isSearchBlank'] = searchBlank;
      conditions['searchType'] = sType;
      conditions['searchOption'] = sOption;
      props.updateStateElement(fieldInfo, DEFINE_FIELD_TYPE.TEXT, conditions);
    }
  };

  const handleUserMouseDown = (event) => {
    if (searchOptionRef.current && !searchOptionRef.current.contains(event.target) &&
        searchOptionButtonRef.current && !searchOptionButtonRef.current.contains(event.target)) {
      setOpenSearchOption(false);
    }
  };

  useEffect(() => {
    if (props.isFocus && textboxRef) {
      textboxRef.current.focus();
    }
    initialize();
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

  useEffect(() => {
    if (searchType === SEARCH_TYPE.LIKE_FIRST && searchOption === SEARCH_OPTION.AND) {
      setSearchOption(SEARCH_OPTION.OR)
    }
    if(!props.updateStateElement && props.isDisabled) {
      return;
    }
    const conditions = {};
    conditions['fieldId'] = fieldInfo.fieldId;
    conditions['fieldType'] = fieldInfo.fieldType;
    conditions['isDefault'] = fieldInfo.isDefault ? fieldInfo.isDefault : false;
    conditions['fieldName'] = fieldInfo.fieldName;
    conditions['fieldValue'] = value;
    conditions['isSearchBlank'] = isSearchBlank;
    conditions['searchType'] = searchType;
    conditions['searchOption'] = searchOption;
    props.updateStateElement(fieldInfo, DEFINE_FIELD_TYPE.TEXT, conditions);
  }, [value, isSearchBlank, searchType, searchOption]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && props.enterInputControl) {
      props.enterInputControl(e);
      event.preventDefault();
    }
  }

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `textBox.search.${attr}`)
  }

  const prefix = 'dynamic-control.fieldFilterAndSearch.layoutPhone.';

  const renderComponent = () => {
    return (
      <>
        <div className="wrap-check">
          <div className="wrap-check-radio">
            <p className="radio-item w50 no-margin">
              <input disabled={props.isDisabled} type="radio" id={idRadio[0]} name={nameRadio[0]} value="1" checked={!isSearchBlank} onChange={() => setIsSearchBlank(false)} />
              <label htmlFor={idRadio[0]}>{translate(prefix + 'radio.searchText')}</label>
            </p>
            <p className="radio-item">
              <input disabled={props.isDisabled} type="radio" id={idRadio[1]} name={nameRadio[0]} value="0" checked={isSearchBlank} onChange={() => setIsSearchBlank(true)} />
              <label htmlFor={idRadio[1]}>
                {translate(prefix + 'radio.searchNone')}
              </label>
            </p>
          </div>
          {!isSearchBlank && (
            <div className={`${getStyleClass('wrapInput')} ${props.isDisabled ? ' pointer-none': ''}`}>
              <input
                disabled={props.isDisabled}
                ref={textboxRef}
                type="text"
                className={`${getStyleClass('input')}`}
                value={value}
                placeholder={translate(prefix + 'placeholder')}
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => setValue(toKatakana(e.target.value))}
                onKeyDown={handleKeyDown}
              />
              <button ref={searchOptionButtonRef} disabled={props.isDisabled} type="button" className="icon-fil" onClick={() => setOpenSearchOption(!openSearchOption)}></button>
              {openSearchOption && (
                <div className="select-box" ref={searchOptionRef}>
                  <div className="wrap-check-radio mb-4 unset-height">
                    {translate(prefix + 'label.optionSearch')}
                    <p className="radio-item">
                      <input type="radio" id={idRadio[2]} name={nameRadio[1]} checked={searchType === SEARCH_TYPE.LIKE} value={SEARCH_TYPE.LIKE} onChange={(e) => setSearchType(SEARCH_TYPE.LIKE)}/>
                      <label htmlFor={idRadio[2]}>{translate(prefix + 'radio.partialMatch')}</label>
                    </p>
                    <p className="radio-item">
                      <input type="radio" id={idRadio[3]} name={nameRadio[1]} checked={searchType === SEARCH_TYPE.LIKE_FIRST} value={SEARCH_TYPE.LIKE_FIRST} onChange={(e) => setSearchType(SEARCH_TYPE.LIKE_FIRST)}/>
                      <label htmlFor={idRadio[3]}>{translate(prefix + 'radio.prefixSearch')}</label>
                    </p>
                  </div>
                  <div className="wrap-check-radio unset-height">
                    {translate(prefix + 'label.optionSeparator')}
                    <p className="radio-item">
                      <input type="radio" id={idRadio[4]} name={nameRadio[2]} checked={searchOption === SEARCH_OPTION.OR} value={SEARCH_OPTION.OR} onChange={(e) => setSearchOption(SEARCH_OPTION.OR)}/>
                      <label htmlFor={idRadio[4]}>{translate(prefix + 'label.or')}</label>
                    </p>
                    <p className="radio-item">
                      <input type="radio" id={idRadio[5]} name={nameRadio[2]} checked={searchOption === SEARCH_OPTION.AND} value={SEARCH_OPTION.AND} onChange={(e) => setSearchOption(SEARCH_OPTION.AND)} disabled={searchType === SEARCH_TYPE.LIKE_FIRST}/>
                      <label htmlFor={idRadio[5]} className = {searchType === SEARCH_TYPE.LIKE_FIRST ? "disable" : ""}>{translate(prefix + 'label.and')}</label>
                    </p>
                    <p className="radio-item">
                      <input type="radio" id={idRadio[6]} name={nameRadio[3]} checked={searchOption === SEARCH_OPTION.WORD} value={SEARCH_OPTION.WORD} onChange={(e) => setSearchOption(SEARCH_OPTION.WORD)}/>
                      <label htmlFor={idRadio[6]}>{translate(prefix + 'radio.oneStringSearch')}</label>
                    </p>
                  </div>
                </div>
              )}
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

export default FieldSearchPhone
