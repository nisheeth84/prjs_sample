import React, { useState, useEffect } from 'react';

export interface IRadioBoxSwichModeProps {
  // items: list option (permission, ...)
  items: { value, text }[],
  // selectedValue: list object selected
  selectedValue?: any,
  // handle choose an object
  handleChooseComponent?: (val) => void,
}

/**
 * Component to render list employee participals 
 * @param props 
 */
const SelectButtonBox = (props: IRadioBoxSwichModeProps) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [text, setText] = useState(() => {
    let txt1 = "";
    const search = props.items.filter(obj => {
      return obj.value === props.selectedValue;
    })[0]
    if (search) {
      txt1 = search.text;
    }
    return txt1;
  });

  useEffect(() => {
    if (props.selectedValue) {
      setText(() => {
        let txt = "";
        const search = props.items.filter(obj => {
          return obj.value === props.selectedValue;
        })[0]
        if (search) {
          txt = search.text;
        }
        return txt;
      }
      )
    }
  }, [props.selectedValue])

  /**
   * 
   * @param val render options
   * @param txt 
   */
  const selectOption = (val, txt) => {
    setText(txt);
    setOpenDropDown(false);
    if (props.handleChooseComponent) {
      props.handleChooseComponent(val);
    }
  }

  return (
    <>
      <div className="position-relative">
        <a title="" className={"button-pull-down-small"} onClick={() => setOpenDropDown(!openDropDown)}>{text}</a>
        {openDropDown &&
          <div className="box-select-option ">
            <ul>
              {props.items && props.items.map((e, idx) => {
                return <li key={idx} onClick={() => selectOption(e.value, e.text)}><a>{e.text}</a></li>
              }
              )}
            </ul>
          </div>}
      </div>
    </>
  );
}

export default SelectButtonBox
