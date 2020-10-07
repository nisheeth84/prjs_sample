import React from 'react';
import _ from 'lodash';
import { valueMilestone, taskNameInfo, fixTooltipOverflowStyle, renderEmployee, renderEmployeeName, getClassCheckDateTask } from './helper';

export interface IResultMultiTaskProps {
  tags: any;
  onRemoveTag: any,
}

const ResultMultiTask = (props: IResultMultiTaskProps) => {

  return (
    <div className="chose-many">
      {props.tags && props.tags.map((task, idx) =>
        <div className="w48 position-relative" key={idx}>
          <div className="drop-down w100 background-color-86 overflow-initial h-auto position-relative">
            <ul className="dropdown-item">
              <li className="item smooth">
                <div className="text text1 font-size-12 text-ellipsis">{valueMilestone(task)}</div>
                <div className={`${getClassCheckDateTask(task.finishDate, task.status)}text text2 text-ellipsis`}>{taskNameInfo(task)}</div>
                <div className="text text3 font-size-12">
                  {renderEmployeeName(task.operators)}
                </div>
                <button type="button" className="close"><a onClick={() => props.onRemoveTag(idx)}>×</a></button>
              </li>
            </ul>
          </div>
          <div className="drop-down child mt-0 overflow-initial h-auto">
            <ul className="dropdown-item mb-0">
              <li className="item smooth">
                <div className="text text1 font-size-12" style={fixTooltipOverflowStyle}>{task['productName']}{valueMilestone(task)}</div>
                <div className={`${getClassCheckDateTask(task.finishDate, task.status)}text text2`}
                  style={fixTooltipOverflowStyle}>{taskNameInfo(task)}</div>
                {renderEmployee(task.operators)}
              </li>
            </ul>
          </div>
        </div>
      )
      }
    </div >
  )
}

export default ResultMultiTask;
