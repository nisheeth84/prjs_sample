import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'reactstrap';
import { Storage } from 'react-jhipster';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { SEARCH_MODE } from '../constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { translate } from 'react-jhipster';
import _, { filter } from 'lodash';
import { isNullOrUndefined } from 'util';

export interface IEmployeeDisplayConditionProps {
  conditions: any[],
  filters: any[],
  listMenuType?: any,
  sidebarCurrentId?: any,
  searchMode: number,
}

const EmployeeDisplayCondition = (props: IEmployeeDisplayConditionProps) => {
  const [showCondition, setShowCondition] = useState(false);
  const conditions = [];
  const filters = [];
  const popupSearchDetailRef = useRef(null);
  const wrapperRef = useRef(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [locale, setLocale] = useState(Storage.session.get('locale'));

  useEffect(() => {
    setLocale(Storage.session.get('locale'))
  },[Storage.session.get('locale')])

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

  const lang = Storage.session.get('locale', 'ja_jp');
  const getFieldLabel = (item, fieldLabel) => {
    if (!item) {
      return '';
    }
    if (Object.prototype.hasOwnProperty.call(item, fieldLabel)) {
      try {
        const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
        if (labels && Object.prototype.hasOwnProperty.call(labels, lang)) {
          return getValueProp(labels, lang);
        }
      } catch (e) {
        return item[fieldLabel];
      }
    }
    return '';
  }

  if (props.conditions && props.conditions.length > 0 && props.searchMode === SEARCH_MODE.CONDITION) {
    for (let i = 0; i < props.conditions.length; i++) {
      if (
        isNullOrUndefined(props.conditions[i].fieldValue) ||
        (props.conditions[i].fieldValue.length === 0 && !props.conditions[i].isSearchBlank)
      ) {
        continue;
      }
      const isArray = Array.isArray(props.conditions[i].fieldValue);
      if (isArray) {
        if (props.conditions[i].fieldValue.length <= 0) {
          continue;
        }
        if (props.conditions[i].isSearchBlank) {
          continue;
        }
      }
      const type = props.conditions[i].fieldType.toString();
      let text = "";
      const fieldsHasItem = [
        DEFINE_FIELD_TYPE.RADIOBOX,
        DEFINE_FIELD_TYPE.SINGER_SELECTBOX,
        DEFINE_FIELD_TYPE.MULTI_SELECTBOX,
        DEFINE_FIELD_TYPE.CHECKBOX
      ];
      if (fieldsHasItem.includes(type)) {
        if (props.conditions[i].fieldItems && props.conditions[i].fieldItems.length > 0) {
          const fieldItem = props.conditions[i].fieldItems.filter(e => !e.itemId ? false : props.conditions[i].fieldValue.toString().includes(e.itemId.toString()));
          text = fieldItem.map(function (elem) { return getFieldLabel(elem, 'itemLabel');}).join(" ");
        } else {
          text = props.conditions[i].fieldValue.toString();
        }
      } else if (isArray) {
        text = `[${props.conditions[i].fieldValue.map(function (elem) {
          return joinString(elem);
        }).join(" ")}]`;
      } else {
        text = props.conditions[i].fieldValue;
      }
      conditions.push({ "label": props.conditions[i].fieldLabel, text });
    }
  }

  if (props.filters && props.filters.length > 0) {
    for (let i = 0; i < props.filters.length; i++) {
      if (!props.filters[i].fieldValue && !props.filters[i].isSearchBlank) {
        continue;
      }
      const isArray = Array.isArray(props.filters[i].fieldValue);
      if (isArray) {
        if (props.filters[i].fieldValue.length <= 0) {
          continue;
        }
        if (props.filters[i].isSearchBlank) {
          continue;
        }
      }
      const type = props.filters[i].fieldType.toString();
      let text = "";
      if (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || type === DEFINE_FIELD_TYPE.RADIOBOX) {
        if (props.filters[i].fieldItems && props.filters[i].fieldItems.length > 0) {
          const fieldItem = props.filters[i].fieldItems.filter(e => !e.itemId ? false : props.filters[i].fieldValue.toString().includes(e.itemId.toString()));
          text = fieldItem.map(function (elem) { return getFieldLabel(elem, 'itemLabel');}).join(" ");
        } else {
          text = props.filters[i].fieldValue.toString();
        }
      } else if (isArray) {
        text = `[${JSON.parse(props.filters[i].fieldValue).map(function (elem) {
          return joinString(elem);
        }).join(" ")}]`;
      } else {
        text = props.filters[i].fieldValue;
      }
      filters.push({ "label": props.filters[i].fieldLabel, text });
    }
  }
  const isShowButtonCondition = (conditions.length > 0 && props.searchMode === SEARCH_MODE.CONDITION) || filters.length > 0 || (props.listMenuType && props.listMenuType.isAutoGroup);

  if (!isShowButtonCondition) {
    return <></>
  }

  const onCloseModalAndResetShowScroll = () => {
    setShowCondition(false);
    setShowScrollbar(false);
  }

  const MAX_DISPLAY_RECORD = 6;
  return (
    <>
      <a title="" onClick={() => { setShowCondition(true) }} className="button-primary button-activity-registration button-condition active mr-3">{translate('employees.displayCondition.buttonShowCondition')}</a>
      {showCondition &&
        <div className="button-activity-registration-wrap form-group z-index-999" ref={popupSearchDetailRef}>
          <div className="drop-down margin-top-32">
            <ul className={"dropdown-item height-calc-30 " + (showScrollbar ? "style-3" : "overflow-hidden")} ref={wrapperRef}>
              {conditions.length > 0 &&
                <>
                  <li className="item smooth btn-bg-none">
                    <div className="text-nowrap text1">{translate('employees.displayCondition.form.conditionSearch')}</div>
                    {conditions.map((item, index) =>
                      <div className="text-nowrap text2" key={index}><span>{` ${JSON.parse(item.label)[locale]}: `}</span>{item.text}
                      </div>
                    )}
                  </li>
                </>
              }
              {filters.length > 0 &&
                <li className="item smooth btn-bg-none">
                  <div className="text-nowrap text1">{translate('employees.displayCondition.form.filter')}</div>
                  {filters.map((item, index) =>
                    <div className="text-nowrap text2" key={index}><span>{` ${JSON.parse(item.label)[locale]}: `}{item.text}</span>
                    </div>
                  )}
                </li>
              }
              <button className="close" onClick={() => onCloseModalAndResetShowScroll()} type="button" data-dismiss="modal">×</button>
              {(filters.length + conditions.length) > MAX_DISPLAY_RECORD && (
                <a
                  title=""
                  onClick={() => {
                    setShowScrollbar(!showScrollbar);
                    wrapperRef.current.scrollTop = 0;
                    wrapperRef.current.scrollLeft = 0;
                  }}
                  className="link-business-card active"
                >
                  {translate('employees.displayCondition.buttonShowScroll')}
                </a>
              )}
            </ul>
          </div>
        </div>
      }
    </>
  );
};

export default EmployeeDisplayCondition
