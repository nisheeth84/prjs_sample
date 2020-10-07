import React, { useRef, useState, useEffect } from 'react'
import useEventListener from 'app/shared/util/use-event-listener';
import { translate } from 'react-jhipster';

type IDropdowlistBasicControlProp = {
  listItem: [],
  label: string,
  value: string,
  defaultLabel?: string,
  isDisabled?: boolean,
  isErrors?: boolean,
  defaultValue?: any,
  errorInfo?: { rowId, item, errorCode, errorMsg, params: {} },
  onSelectedChange: (itemValue, objectValue?) => void
  isReset?: boolean;
}

const DropdowlistBasicControl = (props: IDropdowlistBasicControlProp) => {

  const [showItems, setShowItems] = useState(false);
  const [textValue, setTextValue] = useState(null);
  const registerRef = useRef(null);

  const handleItemClick = (item) => {
    setTextValue(item[props.label]);
    setShowItems(false);
    props.onSelectedChange(item[props.value], item);
  }

  const handleClickOutsideRegistration = (e) => {
    if (registerRef.current && !registerRef.current.contains(e.target)) {
      setShowItems(false)
    }
  }

  useEventListener('mousedown', handleClickOutsideRegistration);

  const getDisplayItem = (key) => {
    if (key) {
      for (let index = 0; index < props.listItem.length; index++) {
        if (props.listItem[index][props.value] === key) {
          return props.listItem[index][props.label];
        }
      }

    }

    return props.defaultLabel;
  }

  useEffect(() => {
    setTextValue(getDisplayItem(props.defaultValue));
  }, []);

  useEffect(() => {
    if (props.isReset) {
      setTextValue(getDisplayItem(props.defaultValue));
    }
  }, [props.isReset]);


  useEffect(() => {
    setTextValue(getDisplayItem(props.defaultValue));
  }, [props.defaultValue]);


  return (
    <>
      <div className="select-option position-relative" ref={registerRef}>
        <span className="select-text bg-white" onClick={() => { setShowItems(!showItems) }} >
          {textValue ? translate(textValue) : ''}
        </span>
        {showItems &&
          <div className="drop-down drop-down2 d-block bg-white pl-1 position-absolute">
            <ul>
              {
                props.listItem && props.listItem.length > 0 && props.listItem.map((item, index) => {
                  return <li className="item  smooth" key={index}
                    onClick={() => { handleItemClick(item); }} >
                    <div className="text text2"> {translate(item[props.label])}</div>
                  </li>
                })
              }
            </ul>
          </div>
        }
      </div>
    </>
  );
}

export default DropdowlistBasicControl;
