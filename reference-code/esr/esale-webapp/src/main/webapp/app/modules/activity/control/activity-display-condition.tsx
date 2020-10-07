import React, { useState, useRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { SEARCH_MODE } from '../constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import _ from 'lodash';

export interface IActivityDisplayConditionProps {
  conditions: any[],
  filters?: any[],
  sidebarCurrentId?: any,
  searchMode?: number,
}

const ActivityDisplayCondition = (props: IActivityDisplayConditionProps) => {
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

  if (props.conditions && props.conditions.length > 0) {
    for (let i = 0; i < props.conditions.length; i++) {
      if (!props.conditions[i].fieldId) {
        continue;
      }
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

  const isShowButtonCondition = (conditions.length > 0 );

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
            </ul>
            <button className="close" onClick={() => { setShowCondition(false) }} type="button" data-dismiss="modal">×</button>
              {conditions && conditions.length > 1 &&
                  <a title="" onClick={() => { setShowScrollbar(!showScrollbar); wrapperRef.current.scrollTop = 0 }}
                  className="link-business-card active">{translate('products.displayCondition.buttonShowScroll')}
                </a>
              }
          </div>
        </div>
      }
    </>
  );
};

export default ActivityDisplayCondition
