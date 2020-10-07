// Editable.js
import React, { useState, useEffect, useRef } from "react";
import { MILESTONE_MODE } from '../../../customers/constants';
import { set } from 'lodash';

export interface IEditableCellProps {
  text: string
  type: any
  placeholder?: string
  children: any
  closeInput?: any
  onCloseInput?: any
  closeEditInput?:any
  typeClass?: string
  classWrap?: string
  memo?: boolean
  viewOnly?: boolean
  classNameTxt?: any
}
/**
 * Editable cell using for editing milestone/task
 */
// Component accept text, placeholder values and also pass what type of Input - input, textarea so that we can use it for styling accordingly
const EditableCell = (props: IEditableCellProps) => {
  const {typeClass} = props;
  const [isEditing, setEditing] = useState(false);
  const wrapperRef = useRef(null);

  // Event handler while pressing any key while editing
  const handleKeyDown = (event, type) => {
    const key = event;
    // List keys to check when key is pressed
    const keys = ["Escape", "Tab"];
    const enterKey = "Enter";
    const allKeys = [...keys, enterKey];

    // Check Escape/Tab/Enter key and set the [isEditing] state to false
    if ((type.includes("input") && allKeys.includes(key)) ||
      (type.includes("date") && keys.includes(key))) {
      setEditing(false);
      props && props.closeEditInput()
    }
  };

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      // TODO: click outside close input date
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setEditing(props.closeInput || false);
  }, [props.onCloseInput]);

  const handleBlur = () => {
    if(props.type.includes("input")){
      setEditing(false);
      props && props.closeEditInput()
    }
  }

  /*
  - It will display the children (input or textarea) if `isEditing` is true
  - When input `onBlur`, we will set the default non edit mode
  */
  return (
    <section {...props} className={`${!typeClass ? "d-inline-block align-middle" : typeClass} ${props && props.viewOnly ? 'pointer-none' : ''}`} ref={wrapperRef}>
      {isEditing ? (
        <div className={"d-inline-block w-100"}
          onBlur={handleBlur}
          onKeyDown={e => handleKeyDown(e, props.type)}
        >
          {props.children}
        </div>
      ) : (
          <span className={`${props.type.includes("input") ? ` w-100 ${props && !props.memo ? 'text-ellipsis' : 'word-break-all'}` : ''} bg-gray ${typeClass ? 'block-feedback back-ground-f9 my-2 w-100' : ''} ${props.classNameTxt ? props.classNameTxt : ''}`} onClick={() => {setEditing(true);props && props.onCloseInput(true)}}>
            {props.text || props.placeholder}
          </span>
        )}
    </section>
  );
};

export default EditableCell;