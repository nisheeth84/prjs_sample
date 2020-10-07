import React, { useImperativeHandle, useState, useEffect, forwardRef, useRef } from 'react';
import { SEARCH_TYPE, SEARCH_OPTION } from 'app/config/constants';
import { useId } from 'react-id-generator';
import {  translate } from 'react-jhipster';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { toKatakana } from 'app/shared/util/string-utils';
import _ from 'lodash';

type IFieldListFilterTextProps = IDynamicFieldProps

const FieldListFilterText = forwardRef((props: IFieldListFilterTextProps, ref) => {
  const [valueFilter, setValueFilter] = useState(null);
  const [searchBlank, setSearchBlank] = useState(false);
  const [openSearchOption, setOpenSearchOption] = useState(false);
  const [searchType, setSearchType] = useState(SEARCH_TYPE.LIKE);
  const [searchOption, setSearchOption] = useState(SEARCH_OPTION.OR);
  const [locationR, setLocationR] = useState('');

  const idRadio = useId(9, "filter_list_radio_");
  const nameRadio = useId(2, "filter_list_radio_name_");
  const searchOptionRef = useRef(null);
  const searchOptionButtonRef = useRef(null);
  const prefix = 'dynamic-control.fieldFilterAndSearch.layoutText.';

  useImperativeHandle(ref, () => ({
    resetValueFilter() {
      setValueFilter('');
    },
  }));

  const handleUserMouseDown = (event) => {
    if (searchOptionRef.current && !searchOptionRef.current.contains(event.target) &&
        searchOptionButtonRef.current && !searchOptionButtonRef.current.contains(event.target)) {
      setOpenSearchOption(false);
    }
  };

  useEffect(() => {
    if (props.elementStatus) {
      if(props.elementStatus.valueFilter && props.elementStatus.valueFilter.length > 0) {
        setValueFilter(props.elementStatus.valueFilter);
      }
      if(props.elementStatus.isSearchBlank) {
        setSearchBlank(props.elementStatus.isSearchBlank);
      }
      if(props.elementStatus.searchType) {
        setSearchType(props.elementStatus.searchType.toString());
      }
      if(props.elementStatus.searchOption) {
        setSearchOption(props.elementStatus.searchOption.toString());
      }
      if(!Object.prototype.hasOwnProperty.call(props.elementStatus, 'isSearchBlank') && (props.elementStatus.valueFilter === '[]' || props.elementStatus.valueFilter === '')){
        setSearchBlank(true);
      }
    }
    const fType = _.toString(props.fieldInfo.fieldType);
    if (fType === DEFINE_FIELD_TYPE.PHONE_NUMBER || fType === DEFINE_FIELD_TYPE.ADDRESS) {
      setSearchType(SEARCH_TYPE.LIKE_FIRST);
    }
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

  useEffect(() => {
    if(searchOptionButtonRef.current){
      const position = searchOptionButtonRef.current.getBoundingClientRect();
      const mRight = window.innerWidth - position.left;
      if (mRight < 245) {
        setLocationR('location-r0');
      }
    }
  });

  useEffect(() => {
    if (searchType === SEARCH_TYPE.LIKE_FIRST && searchOption === SEARCH_OPTION.AND) {
      setSearchOption(SEARCH_OPTION.OR)
    }
    if (props.updateStateElement) {
      const objValue = {valueFilter, searchType, searchOption, searchBlank}
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, objValue)
    }
  }, [searchBlank, searchType, searchOption, valueFilter]);

  const onChooseStatusChange = (event) => {
    const isShow = event.target.value === "1";
    setSearchBlank(!isShow);
  }

  const onChangeTextFilter = (event) => {
    setValueFilter(event.target.value);
  }

  const getPlaceHolder = () => {
    return translate((prefix + 'placehoder.textSearch'))
  }

  const getRadioText = () => {
    if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.FILE) {
      return translate(prefix + 'radio.noFile')
    }
    if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.LINK) {
      return translate(prefix + 'radio.searchNoLink')
    }
    return translate(prefix + 'radio.searchNone');
  }

  return (
    <>
      <div className="wrap-check-radio">
        <span className="font-weight-500">{translate('dynamic-control.fieldFilterAndSearch.common.label.filter')}</span>
        <p className="radio-item">
          <input type="radio" id={idRadio[0]} name={nameRadio[0]} checked={!searchBlank} value='1' onChange={onChooseStatusChange} />
          <label htmlFor={idRadio[0]} className="color-666">{translate(prefix + 'radio.searchText')}</label>
        </p>
        <p className="radio-item">
          <input type="radio" id={idRadio[1]} name={nameRadio[0]} checked={searchBlank} value='0' onChange={onChooseStatusChange} />
          <label htmlFor={idRadio[1]} className="color-666">
            {getRadioText()}
          </label>
        </p>
      </div>
      {!searchBlank &&
        <div className={`box-radio-wrap mt-3 mb-3 ${openSearchOption ? 'active' : ''} `}>
          <input type="text" className="input-normal input-common2" placeholder={getPlaceHolder()} value={valueFilter || ''} 
          onChange={onChangeTextFilter} onKeyUp={onChangeTextFilter} onKeyDown={onChangeTextFilter} 
          onBlur={(event) => setValueFilter(toKatakana(event.target.value))}/>
          <button ref={searchOptionButtonRef} className="icon-fil" onClick={() => setOpenSearchOption(!openSearchOption)}></button>
          {openSearchOption &&
            <div className={`select-box text-left ${locationR}`} ref={searchOptionRef}>
              {/* <div className="wrap-check-radio mb-4">
              {translate(prefix + 'label.optionSearch')}
              <p className="radio-item">
                  <input type="radio" id={idRadio[2]} name={nameRadio[1]} checked={searchType === SEARCH_TYPE.LIKE} value={SEARCH_TYPE.LIKE} onChange={(e) => setSearchType(SEARCH_TYPE.LIKE)} />
                  <label htmlFor={idRadio[2]}>{translate(prefix + 'radio.partialMatch')}</label>
                </p>
                <p className="radio-item">
                  <input type="radio" id={idRadio[3]} name={nameRadio[1]} checked={searchType === SEARCH_TYPE.LIKE_FIRST} value={SEARCH_TYPE.LIKE_FIRST} onChange={(e) => setSearchType(SEARCH_TYPE.LIKE_FIRST)} />
                  <label htmlFor={idRadio[3]}>{translate(prefix + 'radio.prefixSearch')}</label>
                </p>
              </div> */}
              <div className="wrap-check-radio">
              {translate(prefix + 'label.optionSeparator')}
              <p className="radio-item">
                  <input type="radio" id={idRadio[4]} name={nameRadio[2]} checked={searchOption === SEARCH_OPTION.OR} value={SEARCH_OPTION.OR} onChange={(e) => setSearchOption(SEARCH_OPTION.OR)} />
                  <label htmlFor={idRadio[4]}>{translate(prefix + 'label.or')}</label>
                </p>
                <p className= "radio-item">
                  <input type="radio" id={idRadio[5]} name={nameRadio[2]} checked={searchOption === SEARCH_OPTION.AND} value={SEARCH_OPTION.AND} onChange={(e) => setSearchOption(SEARCH_OPTION.AND)}
                  disabled={searchType === SEARCH_TYPE.LIKE_FIRST} />
                  <label htmlFor={idRadio[5]} className = {searchType === SEARCH_TYPE.LIKE_FIRST ? "disable" : ""}>{translate(prefix + 'label.and')}</label>
                </p>
                <p className="radio-item">
                  <input type="radio" id={idRadio[6]} name={nameRadio[3]} checked={searchOption === SEARCH_OPTION.WORD} value={SEARCH_OPTION.WORD} onChange={(e) => setSearchOption(SEARCH_OPTION.WORD)} />
                  <label htmlFor={idRadio[6]}>{translate(prefix + 'radio.oneStringSearch')}</label>
                </p>
              </div>
            </div>
          }
          </div>
      }
    </>
  )
})

export default FieldListFilterText
