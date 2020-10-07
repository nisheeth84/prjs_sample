import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { translate } from 'react-jhipster';

export interface IPullDownItem {
  itemId: number | string,
  itemLabel: string | ReactElement
}

type ComponentProps = {
  items: IPullDownItem[],
  extraItems?: IPullDownItem[],
  defaultLabel?: string,
  isErrors?: boolean
  isDisabled?: boolean
  value?: any
  errorInfo?: { rowId, item, errorCode, errorMsg, params: {} }
  updateStateField: (itemEditValue) => void
}

const BeautyPullDown = (props: ComponentProps) => {

  const [showItems, setShowItems] = useState(false);
  const [valueSelect, setValueSelect] = useState(null);
  const { items } = props;

  const wrapperRef = useRef(null);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowItems(false);
    }
  }

  useEffect(() => {
    setValueSelect(props.value);
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, [props.value]);

  // useEffect(() => {
  //   if (props.updateStateField && !props.isDisabled) {
  //     props.updateStateField(valueSelect);
  //   }
  // }, [valueSelect]);

  const handleItemClick = (val) => {
    setShowItems(false);
    setValueSelect(val);
    if (props.updateStateField && !props.isDisabled)
      props.updateStateField(val);
  }

  const getDisplayItem = (key) => {
    if (key || key === 0) {
      const indexOfValue = items.map(function (e) {
        return e.itemId;
      }).indexOf(key);
      if (indexOfValue >= 0) {
        return items[indexOfValue].itemLabel;
      }
    }

    return props.defaultLabel;
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

  const renderExtraItem = () => {
    return (
      <>
        <div className="setting-button">
          {props.extraItems.map((e) =>
            <div className="text text2" key={e.itemId} onClick={() => setShowItems(false)}>
              {e.itemLabel}
            </div>
          )}
        </div>
      </>
    )
  }

  const renderPulldown = () => {
    return (
      <>
        <div className="drop-down drop-down2">
          <ul>
            {items.map((e, idx) =>
              <li className={`item ${e.itemId === valueSelect ? 'active' : ''} smooth text-ellipsis`} key={e.itemId} onClick={() => handleItemClick(e.itemId)}>
                <div className="text text2">{e.itemLabel}</div>
              </li>
            )}
          </ul>
          {props.extraItems && props.extraItems.length !== 0 && renderExtraItem()}
        </div>
        {msg && <span className="color-red font-size-8-pt">{msg}</span>}
      </>
    );
  }

  // final return
  return (
    <div className="select-option" ref={wrapperRef}>
      <span className={`select-text text-left ${showItems ? 'active-click' : ''}`} onClick={() => setShowItems(!showItems)} style={style}>
        {getDisplayItem(valueSelect)}
      </span>
      {showItems && items && items.length > 0 && renderPulldown()}
    </div>
  );
}

export default BeautyPullDown;
