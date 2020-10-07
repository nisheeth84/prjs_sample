import React, { useState, useRef } from 'react';

export interface ITaskItemMilestoneProps {
  task: any,
  onClickDetailMilestone: any
}

export const TaskItemMilestone = (props: ITaskItemMilestoneProps) => {
  const [styleBox, setStyleBox] = useState({});
  const milestoneTaskRef = useRef(null);

  /**
   * set position of box list file
   */
  const setPosition = () => {
    const top = milestoneTaskRef.current.getBoundingClientRect().bottom;
    const left = milestoneTaskRef.current.getBoundingClientRect().left;
    const space = window.innerHeight - milestoneTaskRef.current.getBoundingClientRect().top;
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
    <li className="icon-flag" ref={milestoneTaskRef} onMouseEnter={() => setPosition()}>
      <a className="icon-small-primary icon-flag" />
      <div className="box-select-option max-height-350 overflow-y-hover position-fixed hidden" style={styleBox}>
        <ul>
          <li>
            <a onClick={() => props.onClickDetailMilestone(props.task.milestoneId)}>
              <img className="icon" src="/content/images/task/ic-flag-brown.svg" alt="" />
              {props.task.milestoneName}
            </a>
          </li>
        </ul>
      </div>
    </li>
  )
};

export default TaskItemMilestone;
