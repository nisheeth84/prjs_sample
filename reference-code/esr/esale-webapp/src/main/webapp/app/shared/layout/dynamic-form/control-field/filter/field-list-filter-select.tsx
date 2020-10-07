import React, { useImperativeHandle, useState, useEffect, forwardRef, useRef } from 'react';
import { useId } from 'react-id-generator';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { getValueProp } from 'app/shared/util/entity-utils';
import { DEFINE_FIELD_TYPE, SPECIAL_HIDE_SEARCH_OPTION } from '../../constants';
import { SEARCH_TYPE, SEARCH_OPTION } from 'app/config/constants'
import { getFieldLabel } from 'app/shared/util/string-utils';

type IFieldListFilterSelectProps = IDynamicFieldProps

const FieldListFilterSelect = forwardRef((props: IFieldListFilterSelectProps, ref) => {
  const [valueFilter, setValueFilter] = useState([]);
  const [searchBlank, setSearchBlank] = useState(false);

  const idRadio = useId(9, "filter_list_radio_");
  const nameRadio = useId(2, "filter_list_radio_name_");

  const searchOptionButtonRef = useRef(null);
  const [openSearchOption, setOpenSearchOption] = useState(false);
  const searchOptionRef = useRef(null);
  const [searchOption, setSearchOption] = useState(SEARCH_OPTION.OR);
  const [searchType, setSearchType] = useState(false);
  const prefix = 'dynamic-control.fieldFilterAndSearch.layoutSelect.';

  useImperativeHandle(ref, () => ({
    resetValueFilter() {
      setValueFilter([]);
    },
  }));

  const isCheckBoxOrMultiPulldown = props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CHECKBOX ||
    props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.MULTI_SELECTBOX;

  const initialize = () => {
    if (props.elementStatus) {
      if (props.elementStatus.valueFilter && props.elementStatus.valueFilter.length > 0) {
        if (_.isString(props.elementStatus.valueFilter)) {
          setValueFilter(JSON.parse(props.elementStatus.valueFilter));
        } else {
          setValueFilter(props.elementStatus.valueFilter);
        }
      }
      if (props.elementStatus.isSearchBlank) {
        setSearchBlank(props.elementStatus.isSearchBlank);
      }
      if(!Object.prototype.hasOwnProperty.call(props.elementStatus, 'isSearchBlank') && (props.elementStatus.valueFilter === '[]' || props.elementStatus.valueFilter === '')){
        setSearchBlank(true);
      }
      if (props.elementStatus.searchOption) {
        setSearchOption(props.elementStatus.searchOption.toString());
        setSearchType(props.elementStatus.searchOption.toString() === SEARCH_OPTION.NOT_AND || props.elementStatus.searchOption.toString() === SEARCH_OPTION.NOT_OR);
      }
    }
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (props.updateStateElement) {
      const objValue = isCheckBoxOrMultiPulldown ? { valueFilter, searchOption, searchBlank } : { valueFilter, searchBlank };
      // if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.SINGER_SELECTBOX) {
      //   objValue['subFieldName']   = 'value';
      // }
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, objValue)
    }
  }, [valueFilter, searchOption, searchBlank, searchType]);

  const onChooseStatusChange = (event) => {
    const isShow = event.target.value === "1";
    setSearchBlank(!isShow);
  }

  const handleStatusCheck = (status: number) => {
    if (!props.fieldInfo.fieldItems) {
      return;
    }
    const fieldItems = props.fieldInfo.fieldItems.filter(e => !_.isNil(e.itemId))
    if (fieldItems.length < 1) {
      return
    }
    if (status === 1) {
      setValueFilter(fieldItems.map(o => o.itemId))
    } else if (status === 0) {
      setValueFilter([])
    } else {
      const tmp = []
      fieldItems.forEach(e => {
        if (valueFilter.findIndex(o => o.toString() === e.itemId.toString()) < 0) {
          tmp.push(e.itemId)
        }
      });
      setValueFilter(tmp)
    }
  };

  const handleChooseFieldItem = (ev) => {
    const { checked, value } = ev.target;
    if (checked) {
      if (valueFilter.findIndex(o => o.toString() === value.toString()) < 0) {
        valueFilter.push(value);
        setValueFilter(_.cloneDeep(valueFilter))
      }
    } else {
      const idx = valueFilter.findIndex(o => o.toString() === value.toString())
      if (idx >= 0) {
        valueFilter.splice(idx, 1);
        setValueFilter(_.cloneDeep(valueFilter))
      }
    }
  };

  /**
   * Check condition filter
   * @param ev
   */
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
          <div className="wrap-check-radio mb-4">
            {translate(prefix + 'label.not')}
            <label className="icon-check">
              <input type="checkbox" value={SEARCH_TYPE.NOT} checked={searchType} onChange={(e) => setSearchOptionNot(e)} />
              <i></i>
              {translate(prefix + 'item.not')}
            </label>
          </div>
          <div className="wrap-check-radio">
            {translate(prefix + 'label.condition')}
            <p className="radio-item">
              <input type="radio" id={idRadio[4]} name={nameRadio[2]} checked={searchOption === SEARCH_OPTION.OR || searchOption === SEARCH_OPTION.NOT_OR} value={searchType ? SEARCH_OPTION.NOT_OR : SEARCH_OPTION.OR} onChange={(e) => setSearchOption(searchType ? SEARCH_OPTION.NOT_OR : SEARCH_OPTION.OR)} />
              <label htmlFor={idRadio[4]}>{translate(prefix + 'label.or')}</label>
            </p>
            <p className="radio-item">
              <input type="radio" id={idRadio[5]} name={nameRadio[2]} checked={searchOption === SEARCH_OPTION.AND || searchOption === SEARCH_OPTION.NOT_AND} value={searchType ? SEARCH_OPTION.NOT_AND : SEARCH_OPTION.AND} onChange={(e) => setSearchOption(searchType ? SEARCH_OPTION.NOT_AND : SEARCH_OPTION.AND)} />
              <label htmlFor={idRadio[5]}>{translate(prefix + 'label.and')}</label>
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="wrap-check-radio">
        <div className="font-weight-500 relative w-100">{translate('dynamic-control.fieldFilterAndSearch.layoutSelect.filter.title')}
          {isCheckBoxOrMultiPulldown &&
            <> { _.isNil(SPECIAL_HIDE_SEARCH_OPTION.find(item => item === props.fieldInfo.fieldName)) &&
              <button ref={searchOptionButtonRef} disabled={props.isDisabled} type="button" className="icon-fil float-right" onClick={() => setOpenSearchOption(!openSearchOption)}>
              </button>}
              {openSearchOption && renderSearchOption()}
            </>
          }
        </div>
        <p className="radio-item">
          <input type="radio" id={idRadio[0]} name={nameRadio[0]} checked={!searchBlank} value='1' onChange={onChooseStatusChange} />
          <label htmlFor={idRadio[0]}>{translate('dynamic-control.fieldFilterAndSearch.layoutSelect.radio.option')}</label><br />
        </p>
        <p className="radio-item">
          <input type="radio" id={idRadio[1]} name={nameRadio[0]} checked={searchBlank} value='0' onChange={onChooseStatusChange} />
          <label htmlFor={idRadio[1]}>{translate('dynamic-control.fieldFilterAndSearch.layoutSelect.radio.noOption')}</label><br />
        </p>
      </div>
      {!searchBlank && <>
        <div className="d-flex justify-content-between my-2">
          <button type="button" className="button-primary button-activity-registration px-3" onClick={() => handleStatusCheck(1)}>{translate('dynamic-control.fieldFilterAndSearch.layoutSelect.checkBox.checkAll')}</button>{' '}
          <button type="button" className="button-primary button-activity-registration px-3" onClick={() => handleStatusCheck(0)}>{translate('dynamic-control.fieldFilterAndSearch.layoutSelect.checkBox.unCheckAll')}</button>{' '}
          <button type="button" className="button-primary button-activity-registration px-3" onClick={() => handleStatusCheck(-1)}>{translate('dynamic-control.fieldFilterAndSearch.layoutSelect.checkBox.reverseCheck')}</button><br />
        </div>
        <div className="wrap-check-box overflow-auto style-3">
          {props.fieldInfo.fieldItems && props.fieldInfo.fieldItems.filter(o => !_.isNil(o.itemId)).map((e, idx) =>
            <p className="check-box-item mb-1" key={idx}>
              <label key={idx} className="icon-check">
                <input
                  type="checkbox"
                  value={e.itemId}
                  checked={valueFilter.findIndex(o => o.toString() === e.itemId.toString()) >= 0}
                  onChange={handleChooseFieldItem} />
                <i></i>
                {getFieldLabel(e, 'itemLabel')}
              </label>
            </p>
          )}
        </div>
      </>}
    </>
  );
})

export default FieldListFilterSelect
