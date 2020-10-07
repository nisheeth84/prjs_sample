import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { SEARCH_TYPE, SEARCH_OPTION } from 'app/config/constants'
import { useId } from 'react-id-generator';
import _ from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { translate } from 'react-jhipster';
import { getFieldLabel, toKatakana, isValidNumber } from 'app/shared/util/string-utils';
import styled from 'styled-components'

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 12px !important;
  justify-content: space-between;
  div {
    width: 80%
  }

  
`

type IFieldSearchTextProps = IDynamicFieldProps

const FieldSearchContactDate = forwardRef((props: IFieldSearchTextProps, ref) => {
  const [value, setValue] = useState('');
  const [isSearchBlank, setIsSearchBlank] = useState(false);
  const [openSearchOption, setOpenSearchOption] = useState(false);
  const [searchOption, setSearchOption] = useState(SEARCH_OPTION.OR);
  const [searchType, setSearchType] = useState(SEARCH_TYPE.LIKE);

  const onChangeTextFrom = (event) => {
    if (event.target.value === '' || isValidNumber(event.target.value, _.get(props, 'fieldInfo.decimalPlace'))) {
      setValue(event.target.value);
    }
  }


  const textboxRef = useRef(null);
  const searchOptionRef = useRef(null);
  const searchOptionButtonRef = useRef(null);

  const nameRadio = useId(3, "field_textbox_radioGroupName_");

  const { fieldInfo } = props;

  const initialize = () => {
    const defaultVal = props.elementStatus ? props.elementStatus.fieldValue : "";
    const searchBlank = props.elementStatus && props.elementStatus.isSearchBlank ? props.elementStatus.isSearchBlank : false;
    const sType = props.elementStatus && props.elementStatus.searchType ? props.elementStatus.searchType : SEARCH_TYPE.LIKE;
    const sOption = props.elementStatus && props.elementStatus.searchOption ? props.elementStatus.searchOption : SEARCH_OPTION.OR;

    setValue(defaultVal)
    setIsSearchBlank(searchBlank);
    setSearchType(sType?.toString());
    setSearchOption(sOption?.toString())

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
    if (!props.updateStateElement && props.isDisabled) {
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

  return (
    <>
      <InputWrapper className="wrap-check pt-0"  >
        {!isSearchBlank && (
          <div className={` ${getStyleClass('wrapInput')}` + `${openSearchOption ? ' active' : ''}` + `${props.isDisabled ? ' pointer-none' : ''}`}>
            <input
              disabled={props.isDisabled}
              ref={textboxRef}
              type="text"
              className={`${getStyleClass('input')}`} // "form-control input-common"
              value={value}
              onChange={onChangeTextFrom}
              onBlur={(e) => setValue(toKatakana(e.target.value))}
              onKeyDown={handleKeyDown}
            />
          </div>
        )}

        {translate('sales.contact-date2')}

      </InputWrapper>
    </>
  );


});

export default FieldSearchContactDate
