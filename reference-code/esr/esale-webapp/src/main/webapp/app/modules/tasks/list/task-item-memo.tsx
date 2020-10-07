import React, { useState, useRef } from 'react';

export interface ITaskItemMemoProps {
  task: any,
}

export const TaskItemMemo = (props: ITaskItemMemoProps) => {
  const [styleBox, setStyleBox] = useState({});
  const memoTaskRef = useRef(null);

  /**
   * set position of box list file
   */
  const setPosition = () => {
    const top = memoTaskRef.current.getBoundingClientRect().bottom;
    const left = memoTaskRef.current.getBoundingClientRect().left;
    const space = window.innerHeight - memoTaskRef.current.getBoundingClientRect().top;
    const style = {}
    if (space > 350) {
      style['left'] = `${left}px`;
      style['top'] = `${top}px`;
    } else {
      style['left'] = `${left}px`;
      style['bottom'] = `${space}px`;
      style['top'] = 'auto';
    }
    setStyleBox(style);
  }

  return (
    <li className="icon-notebook" ref={memoTaskRef} onMouseEnter={() => setPosition()}>
      <a className="icon-small-primary icon-notebook" />
      <div className="box-select-option max-height-350 overflow-y-hover position-fixed hidden" style={styleBox}>
        <div className="text word-break-all style-3"> {props.task.memo}</div>
      </div>
    </li>
  )
};

export default TaskItemMemo;
