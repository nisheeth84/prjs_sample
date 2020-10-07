import React from 'react'
import { connect } from 'react-redux'
import { IndexSaveSuggestionChoice } from '../tag-suggestion';
import { formatDate } from 'app/shared/util/date-utils';
import { path } from 'ramda'
import _ from 'lodash';
import { checkOverdueComplete, renderEmployeeName, valueMilestone } from 'app/shared/layout/common/suggestion/tag-auto-complete-task/helper';
import { CommonUtil } from '../../common-util';

type ISuggestTaskProp = StateProps & DispatchProps & {
  taskInfo: any;
  tags: any;
  selectElementSuggest: any;
}

// export const valueMilestone = (task) => {
//   const milestoneName = task?.milestone?.milestoneName || '';
//   const customerParentName = task?.customer?.parentCustomerName || '';
//   const customerName = task?.customer?.customerName || '';
//   const productTradings = task?.productTradings || [];
//   const productTradingNames = _.join( CommonUtil.GET_ARRAY_VALUE_PROPERTIES(productTradings, 'productTradingName'), ',');
//   const isCustomerExists = !_.isEmpty(customerParentName) || !_.isEmpty(customerName) || !_.isEmpty(productTradingNames);
//   return milestoneName + ' ' + (isCustomerExists ? '(' : '') + (customerParentName ? `${customerParentName}－` : '')
//     + (customerName ? `${customerName}／` : '') + (!_.isEmpty(productTradingNames) ? ` ${productTradingNames}` : '') + (isCustomerExists ? ')' : '');
// };

const SuggestTask = (props: ISuggestTaskProp) => {
  const isActive = props.tags.filter(e => e.taskId === props.taskInfo.taskId).length > 0;
  return (
    <li className={`item ${isActive ? "active" : ""} font-size-14 pt-2 pb-2 font-weight-400`} onClick={() => { if (!isActive) { props.selectElementSuggest(props.taskInfo, IndexSaveSuggestionChoice.Task) } }}>
      <div className="font-size-12 pl-3 color-999 text-ellipsis">{valueMilestone(props.taskInfo)}</div>
      <div className={`pl-3 text-ellipsis ${checkOverdueComplete(props.taskInfo.finishDate, props.taskInfo.status) ? "text-red" : ""}
            ${props.taskInfo['status'] === 3 ? "line-through" : ""}`} >{props.taskInfo.taskName} ({CommonUtil.convertToDate(props.taskInfo.finishDate)})</div>
      <div className="font-size-12 pl-3 color-999 text-ellipsis">{renderEmployeeName(props.taskInfo?.operators)}</div>
    </li>
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
)(SuggestTask);
