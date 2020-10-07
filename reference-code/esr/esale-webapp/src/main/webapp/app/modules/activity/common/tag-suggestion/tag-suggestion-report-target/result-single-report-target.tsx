import React from 'react'
import { connect } from 'react-redux'
import { CommonUtil } from '../../common-util';
import _ from 'lodash';
import { checkOverdueComplete, renderEmployee, valueMilestone } from 'app/shared/layout/common/suggestion/tag-auto-complete-task/helper';

type IResultSingleReportTargetProp = StateProps & DispatchProps & {
  tags: any;
  hovered: boolean;
  headerHoverOn: any;
  headerHoverOff: any;
  onRemoveTag: any;
}


/**
 * component for show result single report target
 * @param props
 */
const ResultSingleReportTarget = (props: IResultSingleReportTargetProp) => {

  /**
   * getProductTradingName
   * @param productTradings 
   */
  // const getProductTradingName = (productTradings?: []) => {
  //   let res = "";
  //   if(productTradings && productTradings.length > 0){
  //     const arrName = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(productTradings,'productTradingName');
  //     res = _.join(arrName, ',');
  //   }
  //   return res;
  // }

  return (
    <>
      {props.tags?.length > 0 && props.tags.map((e: {}, idx) => {
        if (Object.prototype.hasOwnProperty.call(e, "scheduleId")) {
          return <div key={`schedule_${idx}`} className="wrap-tag text-ellipsis">
            <div className="tag text-ellipsis" onMouseEnter={props.headerHoverOn} onMouseLeave={props.headerHoverOff}>
              {e['scheduleName']}{e['finishDate'] ? `(${CommonUtil.convertToDate(e['finishDate'])})` : ''}
              <button className="close" onClick={() => props.onRemoveTag(idx)}>×</button>
            </div>
            {props.hovered &&
              <div className="drop-down h-auto w100">
                <ul className="dropdown-item">
                  <li className="item smooth">
                    <div className="item2">
                      <div className="content">
                        <div className="text text1 font-size-12  text-blue text-ellipsis">{e['parentCustomerName']}－{e['customerName']}／{e['productTradingName']}</div>
                        <div className="text text2 text-ellipsis">{e['scheduleName']} </div>
                        <div className="text text3 text-ellipsis">{CommonUtil.convertToDate(e['finishDate'])} </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            }
          </div>
        } else if (Object.prototype.hasOwnProperty.call(e, "taskId")) {
          return <div key={`task_${idx}`} className="wrap-tag text-ellipsis">
            <div className="tag text-ellipsis" onMouseEnter={props.headerHoverOn} onMouseLeave={props.headerHoverOff}>
              {e['taskName']} {e['finishDate'] ? `(${CommonUtil.convertToDate(e['finishDate'])})` : ''}
              <button className="close" onClick={() => props.onRemoveTag(idx)}>×</button>
            </div>
            {/* {props.hovered && */}
              <div className="drop-down h-auto w100 mt-0">
                <ul className="dropdown-item">
                  <li className="item smooth">
                    {/* <div className="item2">
                      <div className="content"> */}
                        <div className="font-size-12 pl-3 color-999 text-ellipsis">{valueMilestone(e)}</div>
                        <div className={`pl-3 text-ellipsis ${checkOverdueComplete(e['finishDate'], e['status']) ? "text-red" : ""}
                              ${e['status'] === 3 ? "line-through" : ""}`} >{e['taskName']} ({CommonUtil.convertToDate(e['finishDate'])})</div>
                        {/* <div className="font-size-12 pl-3 color-999 text-ellipsis">{e['employeeName']}</div> */}
                        <div className="text text3 font-size-12 overflow-initial">
                          {renderEmployee(props.tags[0].operators)}
                        </div>
                      {/* </div>
                    </div> */}
                  </li>
                </ul>
              </div>
            {/* }  */}
          </div>
        } else if (Object.prototype.hasOwnProperty.call(e, "milestoneId")) {
          const text = e['parentCustomerName'] && e['customerName'] ? `${e['parentCustomerName']}-${e['customerName']}` : `${e['parentCustomerName'] || ""}${e['customerName'] || ""}`;
          return <div key={`milestone_${idx}`} className="wrap-tag text-ellipsis">
            <div className="tag text-ellipsis" onMouseEnter={props.headerHoverOn} onMouseLeave={props.headerHoverOff}>
              {e['milestoneName']} {CommonUtil.convertToDate(e['endDate']) ? `(${CommonUtil.convertToDate(e['endDate'])})` : ''} 
              <button className="close" onClick={() => props.onRemoveTag(idx)}>×</button>
            </div>
            {props.hovered &&
              <div className="drop-down h-auto w100">
                <ul className="dropdown-item">
                  <li className="item smooth">
                    <div className="item2">
                      <div className="content">
                        <div className="text text1 font-size-12  text-ellipsis">{text}</div>
                        <div className="text text2  text-ellipsis">{e['milestoneName']} {CommonUtil.convertToDate(e['endDate']) ? `(${CommonUtil.convertToDate(e['endDate'])})` : ''} </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            }
          </div>
        }
      })}
    </>
  );
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultSingleReportTarget);
