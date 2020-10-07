import React, { useState, useRef } from 'react';

export interface ITaskItemSubtaskProps {
  task: any,
  onClickDetailTask: any
}

export const TaskItemSubtask = (props: ITaskItemSubtaskProps) => {
  const [styleBox, setStyleBox] = useState({});
  const subTaskRef = useRef(null);

  /**
   * set position of box list file
   */
  const setPosition = () => {
    const top = subTaskRef.current.getBoundingClientRect().bottom;
    const left = subTaskRef.current.getBoundingClientRect().left;
    const space = window.innerHeight - subTaskRef.current.getBoundingClientRect().top;
    const style = {}
    if (space > 350) {
      style['left'] = `${left}px`;
      style['top'] = `${top}px`;
    } else {
      style['left'] = `${left}px`;
      style['bottom'] = `${space}px`;
      style['top'] = 'auto';
    }
    setStyleBox(style)
  }

  return (
    <li className="icon-task" ref={subTaskRef} onMouseEnter={() => setPosition()}>
      <a className="icon-small-primary icon-task" />
      <span className="number">{props.task.subtasks.length < 100 ? props.task.subtasks.length : '99+'}</span>
      <div className="box-select-option position-fixed max-height-350 overflow-y-hover help-zIndex hidden" style={styleBox}>
        <ul>
          {props.task.subtasks.map(sub => (
            <li key={sub.taskId}>
              <a onClick={() => props.onClickDetailTask(sub.taskId)}>
                <img src="/content/images/task/ic-time1.svg" alt="" />
                {sub.taskName}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
};

export default TaskItemSubtask;
