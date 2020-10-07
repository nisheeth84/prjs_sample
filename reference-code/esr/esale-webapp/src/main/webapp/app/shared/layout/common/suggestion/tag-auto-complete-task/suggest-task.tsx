import React from 'react';
import { taskNameInfo, valueMilestone, renderEmployeeName, getClassCheckDateTask } from './helper';

export interface ISuggestTaskProps {
  taskInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestTask = (props: ISuggestTaskProps) => {
  const { taskInfo } = props;
  const isActive = props.tags.filter(e => e.taskId === taskInfo.taskId).length > 0;

  return (
    <li className={`item ${isActive ? "active" : ""} smooth`} onClick={(e) => { if (!isActive) { props.selectElementSuggest(props.taskInfo) } }}>
      <div className="text text1 font-size-12 text-ellipsis">{valueMilestone(taskInfo)}</div>
      <div className={`${getClassCheckDateTask(taskInfo.finishDate, taskInfo.status)} text text2  text-ellipsis`}>{taskNameInfo(taskInfo)}</div>
      <div className="text text3 font-size-12 text-ellipsis">{renderEmployeeName(taskInfo.operators)}</div>
    </li>
  );
}

export default SuggestTask;