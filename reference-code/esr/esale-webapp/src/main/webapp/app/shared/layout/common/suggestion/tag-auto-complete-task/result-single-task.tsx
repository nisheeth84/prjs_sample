import React from 'react';
import moment from 'moment';
import { taskNameInfo, checkOverdueComplete, fixTooltipOverflowStyle, valueMilestone, renderEmployee } from './helper';
import { getFirstCharacter } from 'app/shared/util/utils';


export interface IResultSingleTaskProps {
  tags: any;
  onRemoveTag: any,
  isShowOnList
}

const ResultSingleTask = (props: IResultSingleTaskProps) => {
  return (
    <>
      {props.tags &&
        <div className={`wrap-tag ${props.isShowOnList ? "" : "text-ellipsis"} `}>
          <div className="tag">{taskNameInfo(props.tags[0])}<button className="close" onClick={() => props.onRemoveTag(0)}>×</button></div>
          <div className="drop-down h-auto w100">
            <ul className="dropdown-item">
              <li className="item smooth">
                <div className="text text1 font-size-12" style={fixTooltipOverflowStyle}>{props.tags[0]['productName']}{valueMilestone(props.tags[0])}</div>
                <div className={`${checkOverdueComplete(props.tags[0].finishDate, props.tags[0].status) ? 'text-red ' : ''}text text2`}
                  style={fixTooltipOverflowStyle}>{taskNameInfo(props.tags[0])}</div>
                <div className="text text3 font-size-12">
                  {renderEmployee(props.tags[0].operators)}
                </div>
              </li>
            </ul>
          </div>
        </div>
      }
    </>
  );
}

export default ResultSingleTask;