import React from 'react';
import * as R from 'ramda';
import { getFirstCharacter } from 'app/shared/util/utils';
export interface IResultSingleProductTraddingProps {
  tags: any;
  onRemoveTag: any,
}

const ResultSingleProductTradding = (props: IResultSingleProductTraddingProps) => {
  return (
    <>
      {props.tags &&
        <div className="wrap-tag">
          <div className="tag">{R.path('productName', props.tags)} {`${R.path('progressName', props.tags) ? (R.path('progressName', props.tags)) : ''}`}<button className="close" onClick={() => props.onRemoveTag(0)}>×</button></div>
          <div className="drop-down h-auto w100">
            <ul className="dropdown-item">
              <li className="item smooth">
                <div className="text text1">{props.tags.customerName}</div>
                <div className="text text2">{R.path('productName', props.tags)} {`${R.path('progressName', props.tags) ? (R.path('progressName', props.tags)) : ''}`} </div>
                <div className="item d-inline-flex align-items-center p-0 mr-2">
                  {props.tags.employeeIcon ?
                    <img src={props.tags.employeeIcon} alt="" style={{ border: 'none' }} />
                    :
                    <div className={"no-avatar green"}>
                      {getFirstCharacter(props.tags.employeeName)}
                    </div>
                  }
                  <span className="text-blue font-size-12">{props.tags.employeeName}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      }
    </>
  )
}

export default ResultSingleProductTradding;
