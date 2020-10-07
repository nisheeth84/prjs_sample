import React, { useEffect, useState, forwardRef, useRef } from 'react';
import { ActionListHeader, SPECIAL_HIDE_FILTER_LIST, SPECIAL_HIDE_ORDER_BY } from '../../constants';
import _ from 'lodash';
import 'react-day-picker/lib/style.css';
import 'moment/locale/ja';
import 'moment/locale/zh-cn';
import 'moment/locale/ko';

import { DEFINE_FIELD_TYPE } from '../../constants'
import { translate } from 'react-jhipster';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import FieldListFilterText from './field-list-filter-text';
import FieldListFilterDate from './field-list-filter-date';
import FieldListFilterNumber from './field-list-filter-number';
import FieldListFilterSelect from './field-list-filter-select';
import FieldListFilterTime from './field-list-filter-time';
import FieldListFilterDateTime from './field-list-filter-date-time';
import { ORG_FORMATS } from 'app/config/constants'

type IFieldListFilterProps = IDynamicFieldProps

const FieldListFilter = forwardRef((props: IFieldListFilterProps, ref) => {

  const [sortAsc, setSortAsc] = useState(false);
  const [sortDesc, setSortDesc] = useState(false);
  const [valueFilter, setValueFilter] = useState(null);
  const [searchBlank, setSearchBlank] = useState(false);
  const [extensionValue, setExtensionValue] = useState(null);
  const filterRef = useRef(null);
  const { fieldInfo } = props;
  const LINK_FIXED = 2;

  useEffect(() => {
    if (props.elementStatus) {
      if (props.elementStatus.sortAsc) {
        setSortAsc(props.elementStatus.sortAsc);
      }
      if (props.elementStatus.sortDesc) {
        setSortDesc(props.elementStatus.sortDesc);
      }
    }
  }, []);

  const isFilterCheckbox = (fieldType) => {
    if (!fieldType) {
      return false;
    }
    return (
      fieldType.toString() === DEFINE_FIELD_TYPE.CHECKBOX ||
      fieldType.toString() === DEFINE_FIELD_TYPE.RADIOBOX ||
      fieldType.toString() === DEFINE_FIELD_TYPE.SINGER_SELECTBOX ||
      fieldType.toString() === DEFINE_FIELD_TYPE.MULTI_SELECTBOX
    );
  }

  const callUpdateFilter = (asc: boolean, desc: boolean, val: any, filterType: ActionListHeader, clear = false) => {
    if (props.updateStateElement) {
      const obj = { sortAsc: asc, sortDesc: desc, valueFilter: val, isSearchBlank: clear ? false : searchBlank, fieldType: props.fieldInfo.fieldType };
      if (!clear && extensionValue) {
        for (const prop in extensionValue) {
          if (!Object.prototype.hasOwnProperty.call(extensionValue, prop)) {
            continue
          }
          if (_.isEqual('valueFilter', prop) || _.isEqual('searchBlank', prop)) {
            continue;
          }
          obj[prop] = extensionValue[prop]
        }
      }
      props.updateStateElement({ fieldId: fieldInfo.fieldId, filterType }, fieldInfo.fieldType, obj);
    }
  }

  const onSortChange = (isAsc: boolean) => {
    if (isAsc) {
      if (!sortAsc) {
        setSortAsc(true);
        setSortDesc(false);
        callUpdateFilter(true, false, valueFilter, ActionListHeader.SORT_ASC);
      } else {
        setSortAsc(false);
        setSortDesc(false);
        callUpdateFilter(false, false, valueFilter, ActionListHeader.SORT_ASC);
      }
    } else {
      if (!sortDesc) {
        setSortAsc(false);
        setSortDesc(true);
        callUpdateFilter(false, true, valueFilter, ActionListHeader.SORT_DESC);
      } else {
        setSortAsc(false);
        setSortDesc(false);
        callUpdateFilter(false, false, valueFilter, ActionListHeader.SORT_DESC);
      }
    }
  }

  const onFixColumn = () => {
    if (props.updateStateElement) {
      props.updateStateElement({ fieldId: fieldInfo.fieldId, filterType: ActionListHeader.FIX_COLUMN }, fieldInfo.fieldType, !fieldInfo.isColumnFixed);
    }
  }

  const onSetFilter = () => {
    if ((!valueFilter || valueFilter.length === 0) && !searchBlank) {
      return;
    }
    let submitFilter = valueFilter;
    if (searchBlank) {
      submitFilter = ''
    }
    callUpdateFilter(sortAsc, sortDesc, submitFilter, ActionListHeader.FILTER);
  }

  const onClearFilter = () => {
    setValueFilter(null);
    if (filterRef && filterRef.current && filterRef.current.resetValueFilter) {
      filterRef.current.resetValueFilter();
    }
    if (searchBlank) {
      setSearchBlank(false)
    }
    callUpdateFilter(sortAsc, sortDesc, '', ActionListHeader.FILTER, true);
  }

  const updateFilterElement = (keyElement, type, objEditValue) => {
    setValueFilter(objEditValue.valueFilter);
    setSearchBlank(objEditValue.searchBlank);
    setExtensionValue(_.cloneDeep(objEditValue));
  }

  const renderAreaFilter = () => {
    const fieldType = fieldInfo.fieldType.toString();
    if (isFilterCheckbox(fieldInfo.fieldType)) {
      return <FieldListFilterSelect ref={filterRef} {...props} updateStateElement={updateFilterElement} />
    } else if (fieldType === DEFINE_FIELD_TYPE.NUMERIC || fieldType === DEFINE_FIELD_TYPE.CALCULATION) {
      return <FieldListFilterNumber ref={filterRef} {...props} updateStateElement={updateFilterElement} />
    } else if (fieldType === DEFINE_FIELD_TYPE.DATE) {
      return <FieldListFilterDate ref={filterRef} {...props} updateStateElement={updateFilterElement} />
    } else if (fieldType === DEFINE_FIELD_TYPE.TIME) {
      return <FieldListFilterTime ref={filterRef} {...props} updateStateElement={updateFilterElement} />
    } else if (fieldType === DEFINE_FIELD_TYPE.DATE_TIME) {
      return <FieldListFilterDateTime ref={filterRef} {...props} updateStateElement={updateFilterElement} />
    } else {
      return <FieldListFilterText ref={filterRef} {...props} updateStateElement={updateFilterElement} />
    }
  }
  const isDisableSort = () => {
    const fieldType = fieldInfo.fieldType.toString();
    if (fieldType === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
      // select organization just sort with condition bellow
      return !(fieldInfo.selectOrganizationData
        && !_.isNil(fieldInfo.selectOrganizationData.format)
        && fieldInfo.selectOrganizationData.format.toString() === ORG_FORMATS.SINGLE
        && (fieldInfo.selectOrganizationData.target.match(/1/g) || []).length === 1);
    }
    if (fieldType === DEFINE_FIELD_TYPE.RELATION) {
      if (fieldInfo.relationData && fieldInfo.relationData.format === 2) {
        return true;
      } else if (props.relationDisplayField && _.toString(props.relationDisplayField.fieldType) === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
        return !(props.relationDisplayField.selectOrganizationData
          && !_.isNil(props.relationDisplayField.selectOrganizationData.format)
          && props.relationDisplayField.selectOrganizationData.format.toString() === ORG_FORMATS.SINGLE
          && (props.relationDisplayField.selectOrganizationData.target.match(/1/g) || []).length === 1);
      }
    }
    return false;
  }

  const isDisplayFilter = () => {
    const fieldType = fieldInfo.fieldType.toString();
    if (fieldType === DEFINE_FIELD_TYPE.RELATION) {
      return false;
    }
    return true;
  }

  const prefix = 'dynamic-control.fieldFilterAndSearch.common.';
  return (
    <>
      {
        fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.LINK && fieldInfo.urlType === LINK_FIXED &&
        <>
          <div className="box-radio-wrap filter">
            <div className="select-box unset-overflow-body-main unset-min-height">
              <div className="group-filter-az">
                <div className="item-filter">
                  <div className="icon" onClick={() => onFixColumn()}>
                    <a title="" className={fieldInfo.isColumnFixed ? 'icon-small-primary icon-lockup active' : 'icon-small-primary icon-lockup'} />
                  </div>
                  <span className="font-weight-500">{translate(prefix + 'label.fixed')}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      {
        (fieldInfo.fieldType.toString() !== DEFINE_FIELD_TYPE.LINK ||
          (fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.LINK && fieldInfo.urlType !== LINK_FIXED))
        &&
        <>
          <div className="box-radio-wrap filter">
            <div className={!props.isResultsSearch ? "select-box unset-overflow-body-main" : "select-box unset-overflow-body-main unset-min-height"}>
              <div className={!props.isResultsSearch ? 'group-filter-az mb-5 line' : 'group-filter-az'}>
                {!props.isResultsSearch && _.isNil(SPECIAL_HIDE_ORDER_BY.find(item => item === fieldInfo.fieldName)) &&
                  <div className="item-filter">
                    <div className="icon" onClick={() => { if (!isDisableSort()) onSortChange(true) }}>
                      <a title="" className={sortAsc ? 'icon-small-primary icon-downAZ active' : `icon-small-primary icon-downAZ ${isDisableSort() ? 'disable' : ''}`} />
                    </div>
                    <span className="font-weight-500">{translate(prefix + 'label.asc')}</span>
                  </div>
                }
                {!props.isResultsSearch && _.isNil(SPECIAL_HIDE_ORDER_BY.find(item => item === fieldInfo.fieldName)) &&
                  <div className="item-filter">
                    <div className="icon" onClick={() => { if (!isDisableSort()) onSortChange(false) }}>
                      <a title="" className={sortDesc ? 'icon-small-primary icon-upAZ active' : `icon-small-primary icon-upAZ ${isDisableSort() ? 'disable' : ''}`} />
                    </div>
                    <span className="font-weight-500">{translate(prefix + 'label.desc')}</span>
                  </div>
                }
                <div className="item-filter">
                  <div className="icon" onClick={() => onFixColumn()}>
                    <a title="" className={fieldInfo.isColumnFixed ? 'icon-small-primary icon-lockup active' : 'icon-small-primary icon-lockup'} />
                  </div>
                  <span className="font-weight-500">{translate(prefix + 'label.fixed')}</span>
                </div>
              </div>
              {!props.isResultsSearch && isDisplayFilter() && _.isNil(SPECIAL_HIDE_FILTER_LIST.find(item => item === fieldInfo.fieldName)) &&
                <>
                  {renderAreaFilter()}
                  <div className="table-tooltip-box-footer mt-2">
                    <a className={`button-cancel font-weight-500 color-666 ${((props.elementStatus && props.elementStatus.valueFilter && props.elementStatus.valueFilter.length > 0) || (props.elementStatus && props.elementStatus.isSearchBlank) || (props.elementStatus && !Object.prototype.hasOwnProperty.call(props.elementStatus, 'isSearchBlank'))) ? '' : 'disable pointer-none'}`} onClick={() => onClearFilter()}>{translate(prefix + 'button.clear')}</a>
                    <a className={`button-blue ml-2 ${((valueFilter && valueFilter.length > 0) || searchBlank) ? '' : 'disable pointer-none'}`} onClick={() => onSetFilter()}>{translate(prefix + 'button.submit')}</a>
                  </div>
                </>}
            </div>
          </div>
        </>
      }
    </>
  );
})

export default FieldListFilter
