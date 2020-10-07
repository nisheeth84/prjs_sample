import React, { useState, useRef, useEffect } from 'react';
import { Storage } from 'react-jhipster';
import { getValueProp } from 'app/shared/util/entity-utils';
import _ from 'lodash';
import { SEARCH_MODE } from '../constants';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { translate } from 'react-jhipster';
import useEventListener from 'app/shared/util/use-event-listener';

export interface IBusinessCardDisplayConditionProps {
  conditions: any[],
  filters: any[],
  sidebarCurrentId?: any,
  searchMode: number,
  infoSearchConditionList?: any,
}

const BusinessCardDisplayCondition = (props: IBusinessCardDisplayConditionProps) => {
  const [showCondition, setShowCondition] = useState(false);
  let conditions = [];
  const filters = [];
  const [showBtn, setShowBtn] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const checkHeight = useRef(null);
  const wrapperRef = useRef(null);
  const popupSearchDetailRef = useRef(null);
  let conditionsList = [];

  useEffect(() => {
    if (showCondition) {
      const checkWidthInner = checkHeight.current.scrollWidth;
      const checkHeightInner = checkHeight.current.scrollHeight;
      if (checkWidthInner > 460 || checkHeightInner > 240) {
        setShowBtn(true)
      }
    } else {
      setShowBtn(false)
    }
  }, [showCondition])

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

  const getDataCondition = (conditionsOri) => {
    const conditionsResult = [];
    for (let i = 0; i < conditionsOri.length; i++) {
      if ((_.isNil(conditionsOri[i].fieldValue) || conditionsOri[i].fieldValue.length === 0) && !conditionsOri[i].isSearchBlank) {
        continue;
      }
      const isArray = Array.isArray(conditionsOri[i].fieldValue);
      const type = _.toString(conditionsOri[i].fieldType);
      let text = "";
      if (type === DEFINE_FIELD_TYPE.RADIOBOX || type === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || type === DEFINE_FIELD_TYPE.MULTI_SELECTBOX || type === DEFINE_FIELD_TYPE.CHECKBOX) {
        if (conditionsOri[i].fieldItems && conditionsOri[i].fieldItems.length > 0) {
          const fieldItem = conditionsOri[i].fieldItems.filter(e => !e.itemId ? false : conditionsOri[i].fieldValue.toString().includes(e.itemId.toString()));
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
      } else {
        try {
          const jsonFieldSearch = JSON.parse(conditionsOri[i].fieldValue);
          Object.keys(jsonFieldSearch).forEach(function (key) {
            text += jsonFieldSearch[key] + " ";
          });
        } catch (e) {
          text = conditionsOri[i].fieldValue;
        }
      }
      conditionsResult.push({ "label": getFieldLabel(conditionsOri[i], 'fieldLabel'), text });
    }
    return conditionsResult;
  }

  if (props.conditions && props.conditions.length > 0 && props.searchMode === SEARCH_MODE.CONDITION) {
    conditions = [...getDataCondition(props.conditions)];
  }

  if (props.filters && props.filters.length > 0) {
    for (let i = 0; i < props.filters.length; i++) {
      if (!props.filters[i].isSearchBlank && !props.filters[i].fieldValue ) {
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
        if (!props.filters[i].isSearchBlank && props.filters[i].fieldValue.toString().length <= 0) {
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

  if (props.infoSearchConditionList && props.infoSearchConditionList.length > 0) {
    conditionsList = [...getDataCondition(props.infoSearchConditionList)];
  }
  const isShowButtonCondition = (conditions.length > 0 && props.searchMode === SEARCH_MODE.CONDITION) || filters.length > 0 || conditionsList.length > 0;

  const handleUserKeyDown = (e) => {
    if (popupSearchDetailRef && popupSearchDetailRef.current && !popupSearchDetailRef.current.contains(e.target)) {
      setShowCondition(false)
    }
  }

  useEventListener('mousedown', handleUserKeyDown);

  if (!isShowButtonCondition) {
    return <></>
  }
  return (
    <>
      <a title="" onClick={() => { setShowCondition(true) }} className="button-primary button-activity-registration active mr-3">{translate('businesscards.displayCondition.buttonShowCondition')}</a>
      {showCondition &&
        <div className="button-activity-registration-wrap form-group z-index-999" ref={popupSearchDetailRef}>
          <div className="drop-down margin-top-32 height-auto padding-bottom-40">
            <ul className={"dropdown-item " + (showScrollbar ? "style-3" : "overflow-hidden")} ref={wrapperRef}>
              <div className="d-inline-block" ref={checkHeight}>
                {conditions.length > 0 &&
                  <>
                    <li className="item smooth btn-bg-none">
                      <label className="text-bold">{translate('businesscards.displayCondition.form.conditionSearch')}</label>
                      <div className="text-nowrap text2">
                        {conditions.map((item, index) =>
                          <span key={index} className="mr-10">{`  ${item.label} `} {item.text}</span>
                        )}
                      </div>
                    </li>
                  </>
                }
                {filters.length > 0 &&
                  <>
                    <li className="item smooth btn-bg-none">
                      <label className="text-bold">{translate('businesscards.displayCondition.form.filter')}</label>
                      <div className="text-nowrap text2">
                        {filters.map((item, index) =>
                          <span key={index} className="mr-10">{`  ${item.label} `} {item.text}</span>
                        )}
                      </div>
                    </li>
                  </>
                }
                {conditionsList.length > 0 &&
                  <>
                    <li className="item smooth btn-bg-none">
                      <label className="text-bold">{translate('businesscards.displayCondition.form.conditionSave')}</label>
                      <div className="text-nowrap text2">
                        {conditionsList.map((item, index) =>
                          <span key={index} className="mr-10">{`  ${item.label} `} {item.text}</span>
                        )}
                      </div>
                    </li>
                  </>
                }
              </div>
            </ul>
            <button className="close" onClick={() => { setShowCondition(false) }} type="button" data-dismiss="modal">×</button>
            {
              showBtn ? <a title="" onClick={() => { setShowScrollbar(!showScrollbar); wrapperRef.current.scrollTop = 0; wrapperRef.current.scrollLeft = 0 }}
                className="link-business-card active">{translate('employees.displayCondition.buttonShowScroll')}
              </a> : null
            }
          </div>
        </div>
      }
    </>
  );
}

export default BusinessCardDisplayCondition
