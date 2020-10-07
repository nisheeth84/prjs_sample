import React, { useState, useRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { SEARCH_MODE } from '../constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import _ from 'lodash';

export interface IProductDisplayConditionProps {
  conditions: any[],
  filters: any[],
  listMenuType?: any,
  sidebarCurrentId?: any,
  searchMode: number,
}

const ProductDisplayCondition = (props: IProductDisplayConditionProps) => {
  const [showCondition, setShowCondition] = useState(false);

  const conditions = [];
  const filters = [];
  const [showScrollbar, setShowScrollbar] = useState(false);
  const wrapperRef = useRef(null);
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
      if (!props.conditions[i].fieldValue) {
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
      if (props.conditions[i].fieldValue.toString().length <= 0) {
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
      } else if (isArray) {
        text = `[${props.conditions[i].fieldValue.map(function (elem) {
          return joinString(elem);
        }).join(" ")}]`;
      } else {
        text = props.conditions[i].fieldValue;
      }
      conditions.push({ "label": getFieldLabel(props.conditions[i], 'fieldLabel'), text });
    }
  }

  if (props.filters && props.filters.length > 0) {
    for (let i = 0; i < props.filters.length; i++) {
      if (!props.filters[i].fieldValue) {
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
      } else {
        if (props.filters[i].fieldValue.toString().length <= 0) {
          continue;
        }
      }
      const type = props.filters[i].fieldType.toString();
      let text = "";
      if (type === DEFINE_FIELD_TYPE.CHECKBOX || type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || type === DEFINE_FIELD_TYPE.RADIOBOX) {
        if (props.filters[i].fieldItems && props.filters[i].fieldItems.length > 0) {
          const fieldItem = props.filters[i].fieldItems.filter(e => !e.itemId ? false : props.filters[i].fieldValue.toString().includes(e.itemId.toString()));
          text = fieldItem.map(function (elem) { return getFieldLabel(elem, 'itemLabel'); }).join(" ");
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
      filters.push({ "label": getFieldLabel(props.filters[i], 'fieldLabel'), text });
    }
  }
  const isShowButtonCondition = (conditions.length > 0 && props.searchMode === SEARCH_MODE.CONDITION) || filters.length > 0;

  if (!isShowButtonCondition) {
    return <></>
  }

  return (
    <>
      <a title="" onClick={() => { setShowCondition(!showCondition) }} className="button-primary button-activity-registration active mr-3">{translate('products.displayCondition.buttonShowCondition')}</a>
      {showCondition &&
        <div className="button-activity-registration-wrap form-group z-index-999">
          <div className="drop-down mt-5">
            <ul className={"dropdown-item height-calc-30 " + (showScrollbar ? "style-3" : "overflow-hidden")} ref={wrapperRef}>
              {conditions.length > 0 &&
                <>
                  <li className="item smooth">
                    <div className="text text1">{translate('products.displayCondition.form.conditionSearch')}</div>
                    {conditions.map((item, index) =>
                      <div className="text text2" key={index}><span>{` ${item.label}: `}</span>{item.text}
                      </div>
                    )}
                  </li>
                </>
              }
              {filters.length > 0 &&
                <li className="item smooth">
                  <div className="text text1">{translate('products.displayCondition.form.filter')}</div>
                  {filters.map((item, index) =>
                    <div className="text text2" key={index}><span>{` ${item.label}: `}{item.text}</span>
                    </div>
                  )}
                </li>
              }
              {props.sidebarCurrentId &&
                <li className="item smooth">
                  <div className="text text1">{translate('products.displayCondition.form.conditionSave')}</div>
                  <div className="text text2">{props.sidebarCurrentId}</div>
                </li>
              }
            </ul>
            <button className="close" onClick={() => { setShowCondition(false) }} type="button" data-dismiss="modal">×</button>
            <a title="" onClick={() => { setShowScrollbar(!showScrollbar); wrapperRef.current.scrollTop = 0 }}
              className="link-business-card active">{translate('products.displayCondition.buttonShowScroll')}
            </a>
          </div>
        </div>
      }
    </>
  );
};

export default ProductDisplayCondition
