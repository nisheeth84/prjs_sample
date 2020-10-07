import React, { useState, useRef, useEffect } from 'react';
import StringUtils from 'app/shared/util/string-utils';
import { Storage, translate } from 'react-jhipster';
import { getValueProp } from 'app/shared/util/entity-utils';
import _ from 'lodash';

export interface IBeautyPullDownProps {
  // showLabel: any
  data: any
  isErrors?: boolean
  isDisabled?: boolean
  value?: any
  errorInfo?: { rowId, item, errorCode, errorMsg, params: {} }
  updateStateField: (itemEditValue) => void
  className?: string
  hiddenLabel?: boolean
  classNameParent?: string
  maxHeight?: string
}

/**
 * Using for special pulldown
 * @param props
 */
const BeautyPullDown = (props: IBeautyPullDownProps) => {

  const [showItems, setShowItems] = useState(false);
  const [valueSelect, setValueSelect] = useState(props.value);
  const [data, setData] = useState(props.data);
  const [active, setActive] = useState(null);
  const [isUseKeyboard, setIsUseKeyboard] = useState(false); // Check use keyboard


  const wrapperRef = useRef(null);

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

  useEffect(() => {
    if((data.fieldItems && data.fieldItems.length > 0) && (active || active === 0)) {
      setValueSelect(data.fieldItems[active].itemId)
      props.updateStateField(data.fieldItems[active].itemId);
    }
  }, [active])

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowItems(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  useEffect(() => {
    setData(props.data);
  }, [props.data])

  const handleItemClick = (val) => {
    setShowItems(false);
    setValueSelect(val);
    props.updateStateField(val);
  }

  const getDisplayItem = (key) => {
    if (key) {
      const indexOfValue = data.fieldItems.map(function (e) { return e.itemId; }).indexOf(key);
      if (indexOfValue >= 0) {
        const label = getFieldLabel(data.fieldItems[indexOfValue], 'itemLabel');
        return label;
      }
    }
    switch (data.fieldName) {
      case "business_main_id":
        return translate('customers.create-edit-modal.business-main');
      case "business_sub_id":
        return translate('customers.create-edit-modal.business-sub');
      case "company_description":
        return translate('customers.create-edit-modal.company-description');
      default:
        break;
    }
  }

  /**
   * Choose item if use to key arrow
   * @param event
   */
  const keyChooseHandler = (event) => {
    const lstValueSelect = _.cloneDeep(valueSelect);
    const fieldItemAfterSort = data.fieldItems.sort((a, b) => { return a.itemOrder - b.itemOrder });
    if (event.keyCode === 32) {
      if (_.findIndex(valueSelect, fieldItemAfterSort[active]) >= 0) {
        lstValueSelect.splice(_.findIndex(valueSelect, fieldItemAfterSort[active]), 1);
      } else {
        lstValueSelect.push(fieldItemAfterSort[active]);
      }
      setValueSelect(lstValueSelect);
    }
  }

  /**
   * Handle key down or key up to choose item in pulldown
   * @param event
   */
  const keyDownHandler = (event) => {
    const fieldItemAfterSortByOrder = data.fieldItems ? data.fieldItems.sort((x, y) => {
      if (x.itemOrder && y.itemOrder) {
        return x.itemOrder - y.itemOrder;
      } else {
        return x.itemId - y.itemId;
      }
    }) : [];
    const lstDropdown = []
    if (fieldItemAfterSortByOrder.length > 0) {
      fieldItemAfterSortByOrder.forEach(element => {
        lstDropdown.push(element.itemId.toString());
      });
    }
    if (event.keyCode === 13 || event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 32) {
        setIsUseKeyboard(showItems);
    }
    // Enter
    if (event.keyCode === 13) {
      setShowItems(!showItems);
    }
    // Down
    if (event.keyCode === 38 && active > 0) {
      setActive(active - 1);
    }

    // Up
    if (event.keyCode === 40 && active < lstDropdown.length - 1) {
      setActive(active + 1);
    }
    keyChooseHandler(event);
    event.view.event.preventDefault();
  }

  const style = {};
  if (props.errorInfo) {
    style['backgroundColor'] = '#ffdedd';
    style['color'] = '#fa5151';
    style['borderColor'] = '#fa5151';
  }
  let msg = null;
  if (props.errorInfo) {
    if (props.errorInfo.errorCode) {
      msg = translate(`messages.${props.errorInfo.errorCode}`, props.errorInfo.params);
    } else if (props.errorInfo.errorMsg) {
      msg = props.errorInfo.errorMsg;
    }
  }
  const selectedIndex = data.fieldItems.findIndex(e => e.itemId === valueSelect);

  const renderPulldown = () => {
    return (
      <>
        <ul className={`drop-down drop-down2 ${props && props.maxHeight ? props.maxHeight : 'max-height-300'}`}>
          {data.fieldItems.map((e, idx) =>
            <li className={`item ${selectedIndex === idx ? 'active' : ''} ${active === idx && isUseKeyboard ? 'active' : ''} smooth`} key={e.itemId} onClick={() => handleItemClick(e.itemId)} onSelect={() => handleItemClick(e.itemId)}>
              <div className="text text2" >{getFieldLabel(e, 'itemLabel')}</div>
            </li>
          )}
        </ul>
      </>
    );
  }

  // final return
  return (
    <div className={props && props.classNameParent ? props.classNameParent :"col-lg-6 form-group"} ref={wrapperRef}>
      {props && !props.hiddenLabel ? <label>{data.fieldLabel}</label> : null }
      <div className={"select-option " + props.className} >
        <button type="button" className="select-text text-left" onClick={() => setShowItems(true)} style={style} onKeyDown={e => { e.keyCode !== 9 && keyDownHandler(e) }}>{getDisplayItem(valueSelect)}</button>
        {msg && <span className="messenger-error">{msg}</span>}
        {showItems && data.fieldItems && data.fieldItems.length > 0 && renderPulldown()}
      </div>
    </div>
  );
}

export default BeautyPullDown;