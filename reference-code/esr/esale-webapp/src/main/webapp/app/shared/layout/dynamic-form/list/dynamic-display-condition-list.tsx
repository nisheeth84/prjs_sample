import React, { useState, useRef, useEffect } from 'react';
import { DEFINE_FIELD_TYPE, FilterModeDate, SEARCH_MODE } from 'app/shared/layout/dynamic-form/constants';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';
import Popover from 'app/shared/layout/common/Popover';
import { timeUtcToTz, utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import { convertSpecialField } from 'app/shared/util/special-item';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';
import { EMPLOYEE_SPECIAL_FIELD_NAMES, EMPLOYEE_SPECIAL_LIST_FIELD } from 'app/modules/employees/constants';

export interface IDynamicDisplayConditionListProps {
  conditions: any[],
  filters: any[],
  siderbarActiveId?: any,
  infoSearchConditionList?: any,
  searchMode: number,
  layoutData: any,
  fieldBelong
}

const DynamicDisplayConditionList = (props: IDynamicDisplayConditionListProps) => {
  const [showCondition, setShowCondition] = useState(false);
  const conditions = [];
  const filters = [];
  let conditionsCategorySelected = [];
  const [showScrollbar, setShowScrollbar] = useState(false);
  const wrapperRef = useRef(null);
  const popupSearchDetailRef = useRef(null);
  const [showBtn, setShowBtn] = useState(false);
  const [showThreeDot, setShowThreeDot] = useState(false);
  const checkHeight = useRef(null);

  const joinString = (elem) => {
    if (!elem) return "";
    let elString = "";
    for (const el in elem) {
      if (!Object.prototype.hasOwnProperty.call(elem, el)) {
        continue;
      }
      elString += elem[el] + ' ';
    }
    return elString.trim();
  }

  useEffect(() => {
    if (showCondition) {
      const checkWidthInner = checkHeight.current.scrollWidth;
      const checkHeightInner = checkHeight.current.scrollHeight;
      if (checkHeightInner > 240 || checkWidthInner > 460) {
        setShowBtn(true);
      }
      if (checkWidthInner > 460) {
        setShowThreeDot(true);
      } else {
        setShowThreeDot(false);
      }
    } else {
      setShowThreeDot(false);
      setShowBtn(false);
    }
  }, [showCondition])


  const getTextDateTime = (type, fieldValue, fieldInfoDisplay) => {
    let text = '';
    // text = `${fieldValue.from} - ${fieldValue.to}`;
    if (fieldInfoDisplay.searchType.toString() === FilterModeDate.PeriodHm.toString() && _.toString(type) === DEFINE_FIELD_TYPE.DATE_TIME) {
      text = `${fieldValue.from} 〜 ${fieldValue.to}`;
    } else {
      text = `${utcToTz(fieldValue.from, DATE_TIME_FORMAT.User)} 〜 ${utcToTz(fieldValue.to, DATE_TIME_FORMAT.User)}`;
      if (fieldValue.filterModeDate) {
        const textWorking = translate('global.layoutDateTime.label.workDate');
        const textBefore = translate('global.layoutDateTime.label.oneDayBefore');
        const textAfter = translate('global.layoutDateTime.label.oneDayAfter');

        switch (fieldValue.filterModeDate.toString()) {
          case FilterModeDate.DayBeforeAfter.toString():
            text = `${fieldValue.from ? fieldValue.from : 0}${textBefore} 〜  ${fieldValue.to ? fieldValue.to : 0}${textAfter}  ${textWorking}`;
            break;
          case FilterModeDate.TodayBefore.toString():
            text = `${fieldValue.from ? fieldValue.from : 0}${textBefore} 〜  ${fieldValue.to ? fieldValue.to : 0}${textBefore}  ${textWorking}`;
            break;
          case FilterModeDate.TodayAfter.toString():
            text = `${fieldValue.from ? fieldValue.from : 0}${textAfter} 〜  ${fieldValue.to ? fieldValue.to : 0}${textAfter}  ${textWorking}`;
            break;
          default:
            break;
        }
      }
    }
    return text;
  }

  const getDataFromAndTo = (fieldInfoDisplay, type) => {
    let valueFromTo = null;
    let text = "";
    let isArray = false;
    let jsonObj = false;
    try {
      isArray = _.isString(fieldInfoDisplay.fieldValue) ? _.isArray((jsonObj = JSON.parse(fieldInfoDisplay.fieldValue))) : _.isArray(jsonObj = fieldInfoDisplay.fieldValue);
    } catch {
      isArray = false;
    }
    if (isArray) {
      valueFromTo = jsonObj[0];
    } else {
      valueFromTo = JSON.parse(fieldInfoDisplay.fieldValue)
    }
    if (type === DEFINE_FIELD_TYPE.NUMERIC) {
      text = `${valueFromTo.from} 〜 ${valueFromTo.to}`;
    } else {
      if (type === DEFINE_FIELD_TYPE.TIME) {
        text = `${timeUtcToTz(valueFromTo.from)} 〜 ${timeUtcToTz(valueFromTo.to)}`;
      } else {
        text = getTextDateTime(type, valueFromTo, fieldInfoDisplay);
      }
    }
    return text;
  }

  const getTextSearchDetail = (fieldInfoDisplay, type) => {
    let valueFromTo = null;
    let text = null;
    let isArray = false;
    let jsonObj = false;
    try {
      isArray = _.isString(fieldInfoDisplay.fieldValue) ? _.isArray((jsonObj = JSON.parse(fieldInfoDisplay.fieldValue))) : _.isArray(jsonObj = fieldInfoDisplay.fieldValue);
    } catch {
      isArray = false;
    }
    if (isArray) {
      valueFromTo = jsonObj[0];
    } else {
      valueFromTo = JSON.parse(fieldInfoDisplay.fieldValue)
    }

    if (valueFromTo.filterModeDate) {
      const textWorking = translate('global.layoutDateTime.label.workDate');
      const textBefore = translate('global.layoutDateTime.label.oneDayBefore');
      const textAfter = translate('global.layoutDateTime.label.oneDayAfter');

      switch (valueFromTo.filterModeDate.toString()) {
        case FilterModeDate.DayBeforeAfter.toString():
          text = `${valueFromTo.from ? valueFromTo.from : 0}${textBefore} 〜  ${valueFromTo.to ? valueFromTo.to : 0}${textAfter}  ${textWorking}`;
          break;
        case FilterModeDate.TodayBefore.toString():
          text = `${valueFromTo.from ? valueFromTo.from : 0}${textBefore} 〜  ${valueFromTo.to ? valueFromTo.to : 0}${textBefore}  ${textWorking}`;
          break;
        case FilterModeDate.TodayAfter.toString():
          text = `${valueFromTo.from ? valueFromTo.from : 0}${textAfter} 〜  ${valueFromTo.to ? valueFromTo.to : 0}${textAfter}  ${textWorking}`;
          break;
        default:
          break;
      }
    } else {
      text = `${valueFromTo.from} 〜 ${valueFromTo.to}`;
    }
    return text;
  }

  const getDataCondition = (conditionsData) => {
    const conditionsResult = [];
    let conditionsOri = _.cloneDeep(conditionsData);
    conditionsOri = convertSpecialField(conditionsOri, props.layoutData, props.fieldBelong);
    for (let i = 0; i < conditionsOri.length; i++) {
      const dataItems = props.layoutData.find(element => element.fieldId === conditionsOri[i].fieldId);
      if(_.isNil(dataItems)) {
        continue;
      }
      conditionsOri[i]['fieldType'] = dataItems['fieldType'];
      conditionsOri[i]['fieldLabel'] = dataItems['fieldLabel'];
      conditionsOri[i]['fieldItems'] = conditionsOri[i]['fieldItems'] ? conditionsOri[i]['fieldItems'] : dataItems.fieldItems;
      const isArray = Array.isArray(conditionsOri[i].fieldValue);
      const type = conditionsOri[i].fieldType.toString();
      let text = "";
      if (type === DEFINE_FIELD_TYPE.RADIOBOX
        || type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX
        || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX
        || type === DEFINE_FIELD_TYPE.CHECKBOX 
        || conditionsOri[i]['fieldName'] === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS
        || conditionsOri[i]['fieldName'] === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin
        || conditionsOri[i]['fieldName'] === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages
        || conditionsOri[i]['fieldName'] === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions
        || conditionsOri[i]['fieldName'] === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments) {
        if (conditionsOri[i].fieldItems && conditionsOri[i].fieldItems.length > 0) {
          const fieldItem = conditionsOri[i].fieldItems.filter(e => !e.itemId
            ? false
            : conditionsOri[i].fieldValue.toString().includes(e.itemId.toString()));
          text = fieldItem.map(function (elem) { return getFieldLabel(elem, 'itemLabel'); }).join(" ");
        } else {
          try {
            const jsonFieldSearch = JSON.parse(conditionsOri[i].fieldValue.toString());
            Object.keys(jsonFieldSearch).forEach(function (key) {
              text += jsonFieldSearch[key] + " ";
            });
          } catch (e) {
            text = conditionsOri[i].fieldValue.toString();
          }
        }
      } else if (isArray) {
        text = `[${conditionsOri[i].fieldValue.map(function (elem) {
          return joinString(elem);
        }).join(" ")}]`;
      } else if (type === DEFINE_FIELD_TYPE.TIME || type === DEFINE_FIELD_TYPE.DATE ||
        type === DEFINE_FIELD_TYPE.DATE_TIME || type === DEFINE_FIELD_TYPE.NUMERIC) {

        if (!_.isEmpty(conditionsOri[i].fieldValue)) {
          text = getDataFromAndTo(conditionsOri[i], type);
        } else {
          text = '';
        }
      } else {
        text = conditionsOri[i].fieldValue;
      }
      conditionsResult.push({ "label": getFieldLabel(conditionsOri[i], 'fieldLabel'), text });
    }
    return conditionsResult;
  }

  if (props.conditions && props.conditions.length > 0 && props.searchMode === SEARCH_MODE.CONDITION) {
    for (let i = 0; i < props.conditions.length; i++) {
      if ((_.isNil(props.conditions[i].fieldValue) || props.conditions[i].fieldValue.length === 0) && !props.conditions[i].isSearchBlank) {
        continue;
      }

      const type = props.conditions[i].fieldType.toString();
      let text = "";
      if (type === DEFINE_FIELD_TYPE.RADIOBOX || type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX || type === DEFINE_FIELD_TYPE.CHECKBOX) {
        if (props.conditions[i].fieldItems && props.conditions[i].fieldItems.length > 0) {
          const fieldItem = props.conditions[i].fieldItems.filter(e => !e.itemId ? false : props.conditions[i].fieldValue.toString().includes(e.itemId.toString()));
          text = fieldItem.map(function (elem) { return getFieldLabel(elem, 'itemLabel'); }).join(" ");
        } else {
          text = props.conditions[i].fieldValue.toString();
        }
      } else if (type === DEFINE_FIELD_TYPE.TIME || type === DEFINE_FIELD_TYPE.DATE ||
        type === DEFINE_FIELD_TYPE.DATE_TIME || type === DEFINE_FIELD_TYPE.NUMERIC) {
        const fieldValue = props.conditions[i].fieldValue;

        if (!_.isEmpty(fieldValue)) {
          text = getTextSearchDetail(props.conditions[i], type);
        } else {
          text = '';
        }
      } else {
        text = props.conditions[i].fieldValue;
      }
      conditions.push({ "label": getFieldLabel(props.conditions[i], 'fieldLabel'), text });
    }
  }

  if (props.infoSearchConditionList && props.infoSearchConditionList.length > 0) {
    conditionsCategorySelected = [...getDataCondition(props.infoSearchConditionList)];
  }

  const getFilterCondition = () => {
    const filtersData = convertSpecialField(_.cloneDeep(props.filters), props.layoutData, props.fieldBelong);
    for (let i = 0; i < filtersData.length; i++) {
      if (
        !filtersData[i].isSearchBlank &&
        (!filtersData[i].fieldValue || filtersData[i].fieldValue.length <= 0)
      ) {
        continue;
      }
      const dataItems = props.layoutData.find(element => element.fieldId === filtersData[i].fieldId);
      if(_.isNil(dataItems)) {
        continue;
      }
      filtersData[i]['fieldItems'] = filtersData[i]['fieldItems'] ? filtersData[i]['fieldItems'] : dataItems.fieldItems;
      const isArray = Array.isArray(filtersData[i].fieldValue);
      const type = filtersData[i].fieldType.toString();
      let text = "";
      if (type === DEFINE_FIELD_TYPE.RADIOBOX
        || type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX
        || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX
        || type === DEFINE_FIELD_TYPE.CHECKBOX
        || filtersData[i]['fieldName'] === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS
        || filtersData[i]['fieldName'] === EMPLOYEE_SPECIAL_LIST_FIELD.employeeAdmin
        || filtersData[i]['fieldName'] === EMPLOYEE_SPECIAL_LIST_FIELD.employeePackages
        || filtersData[i]['fieldName'] === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions
        || filtersData[i]['fieldName'] === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments
        ) {
        if (filtersData[i].fieldItems && filtersData[i].fieldItems.length > 0) {
          const fieldItem = filtersData[i].fieldItems.filter(e => !e.itemId
            ? false
            : filtersData[i].fieldValue.toString().includes(e.itemId.toString()));
          text = fieldItem.map(function (elem) { return getFieldLabel(elem, 'itemLabel'); }).join(" ");
        } else {
          try {
            const jsonFieldSearch = JSON.parse(filtersData[i].fieldValue.toString());
            Object.keys(jsonFieldSearch).forEach(function (key) {
              text += jsonFieldSearch[key] + " ";
            });
          } catch (e) {
            text = filtersData[i].fieldValue.toString();
          }
        }
      } else if (isArray) {
        text = `[${filtersData[i].fieldValue.map(function (elem) {
          return joinString(elem);
        }).join(" ")}]`;
      } else if (type === DEFINE_FIELD_TYPE.TIME || type === DEFINE_FIELD_TYPE.DATE ||
        type === DEFINE_FIELD_TYPE.DATE_TIME || type === DEFINE_FIELD_TYPE.NUMERIC) {

        if (!_.isEmpty(filtersData[i].fieldValue)) {
          text = getDataFromAndTo(filtersData[i], type);
        } else {
          text = '';
        }
      } else {
        text = filtersData[i].fieldValue;
      }
      filters.push({ "label": getFieldLabel(filtersData[i], 'fieldLabel'), text });
    }
  }

  if (props.filters && props.filters.length > 0) {
    getFilterCondition();
  }
  const isShowButtonCondition = (conditions.length > 0 && props.searchMode === SEARCH_MODE.CONDITION)
    || filters.length > 0
    || (props.siderbarActiveId !== 0 && conditionsCategorySelected.length > 0);

  const handleUserMouseDown = (e) => {
    if (popupSearchDetailRef.current && !popupSearchDetailRef.current.contains(e.target)) {
      setShowCondition(false);
    }
  }
  useEventListener('mousedown', handleUserMouseDown);

  if (!isShowButtonCondition) {
    return <></>
  }

  const getStyleCondition = () => {
    if (!showScrollbar && showThreeDot) {
      return { maxWidth: '450px' }
    }
    return null;
  }

  return (
    <div className="esr-pagination" ref={popupSearchDetailRef}>
      <a title="" onClick={() => { setShowCondition(!showCondition) }} className="button-primary button-activity-registration active mr-3">{translate('customers.displayCondition.buttonShowCondition')}</a>
      {showCondition &&
        <div className="button-activity-registration-wrap form-group z-index-999">
          <div className="drop-down margin-top-32 py-4">
            <ul className={"dropdown-item " + (showScrollbar ? "style-3" : "overflow-hidden")} ref={wrapperRef}>
              <div className="d-inline-block" ref={checkHeight}>
                {conditions.length > 0 &&
                  <>
                    <li className={`item smooth btn-bg-none color-333 ${filters.length > 0 ? 'border-bottom' : ''}`}>
                      <div className="text-nowrap text1">{translate('customers.displayCondition.form.conditionSearch')}</div>
                      {conditions.map((item, index) => (
                        <>
                          <div className="text-nowrap text1" key={index} style={getStyleCondition()}>
                            <Popover y={30}>
                              {`${item.label}: ${item.text}`}
                            </Popover>
                          </div>
                        </>)
                      )}
                    </li>
                  </>
                }
                {filters.length > 0 &&
                  <li className={`item smooth btn-bg-none color-333 ${props.siderbarActiveId !== 0 && conditionsCategorySelected.length > 0 ? 'border-bottom' : ''}`}>
                    <div className="text-nowrap text1">{translate('customers.displayCondition.form.filter')}</div>
                    {filters.map((item, index) =>
                      <div className="text-nowrap text1" key={index} style={getStyleCondition()}>
                        <Popover y={30}>
                          {`${item.label}: ${item.text}`}
                        </Popover>
                      </div>
                    )}
                  </li>
                }
                {props.siderbarActiveId !== 0 && conditionsCategorySelected.length > 0 &&
                  <li className="item smooth btn-bg-none color-333">
                    <div className="text-nowrap text1">{translate('customers.displayCondition.form.conditionSave')}</div>
                    {conditionsCategorySelected.map((item, index) =>
                      <div className="text-nowrap text1" key={index} style={getStyleCondition()}>
                        <Popover y={30}>
                          {`${item.label}: ${item.text}`}
                        </Popover>
                      </div>
                    )}
                  </li>
                }
              </div>
            </ul>
            <button className="close" onClick={() => { setShowCondition(false) }} type="button" data-dismiss="modal">×</button>
            {showBtn && <a title="" onClick={() => { setShowScrollbar(!showScrollbar); wrapperRef.current.scrollTop = 0; wrapperRef.current.scrollLeft = 0 }}
              className="link-business-card mt-2 active">{translate('customers.displayCondition.buttonShowScroll')}
            </a>}
          </div>
        </div>
      }
    </div>
  );
};

export default DynamicDisplayConditionList
