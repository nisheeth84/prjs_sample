// import React, { useState, forwardRef, useImperativeHandle } from 'react';
import React, { useState, useRef, useEffect } from 'react';
import { Modal } from 'reactstrap';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { SEARCH_MODE } from "../constants";
import { translate } from 'react-jhipster';
import useEventListener from 'app/shared/util/use-event-listener';
import { getFieldLabel } from 'app/shared/util/string-utils';

export interface IProductDisplayConditionProps {
  // conditions search details
  conditions: any[],
  // filters condition
  filters?: any[],
  // search mode
  searchMode: number,
}

/**
 * component of display condition
 * @param props 
 */
const ProductTradingsDisplayCondition = (props: IProductDisplayConditionProps) => {
  const [showCondition, setShowCondition] = useState(false);
  const [showBtn, setShowBtn] = useState(false);
  const conditions = [];
  const filters = [];
  const popupSearchDetailRef = useRef(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const wrapperRef = useRef(null);
  const checkHeight = useRef(null);

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

  /**
   * join array string
   * @param elem 
   */
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

  if (props.conditions && props.conditions.length > 0 && props.searchMode === SEARCH_MODE.CONDITION) {
    for (let i = 0; i < props.conditions.length; i++) {
      if (!props.conditions[i].fieldValue || !props.conditions[i].fieldLabel) {
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
          text = fieldItem.map(function (elem) { return elem.itemLabel; }).join(" ");
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
          text = fieldItem.map(function (elem) { return elem.itemLabel; }).join(" ");
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
  const isShowButtonCondition = (conditions.length > 0 && props.searchMode === SEARCH_MODE.CONDITION) || filters.length > 0;

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
      <a title="" onClick={() => { setShowCondition(!showCondition) }} className="button-primary button-activity-registration active mr-3">{translate('products.displayCondition.buttonShowCondition')}</a>
      {showCondition &&
        <div className="button-activity-registration-wrap form-group z-index-999" ref={popupSearchDetailRef}>
          <div className="drop-down margin-top-32 height-auto padding-bottom-40">
            <ul className={"dropdown-item " + (showScrollbar ? "style-3" : "overflow-hidden")} ref={wrapperRef}>
              <div className="d-inline-block" ref={checkHeight}>

                {conditions.length > 0 &&
                  <>
                    <label>
                      <strong>{translate('products.displayCondition.form.conditionSearch')}</strong>
                    </label>
                    {conditions.map((item, index) =>
                      <li className="item smooth btn-bg-none" key={index}>
                        <span><strong>{getFieldLabel(item, "label")}</strong></span>:  {item.text}
                      </li>
                    )}
                  </>
                }
                {filters.length > 0 &&
                  <>
                    <label>
                      <strong>{translate('products.displayCondition.form.filter')}</strong>
                    </label>

                    {
                      filters.map((item, index) =>
                        <li className="item smooth btn-bg-none" key={index}>
                          <span><strong>{getFieldLabel(item, "label")}</strong></span>:  {item.text}
                        </li>
                      )
                    }
                  </>

                }
              </div>
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

export default ProductTradingsDisplayCondition
