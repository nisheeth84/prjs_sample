import React from 'react'
import { connect } from 'react-redux'
import { IndexSaveSuggestionChoice } from '../tag-suggestion';

type ISuggestScheduleProp = StateProps & DispatchProps & {
  scheduleInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestSchedule = (props: ISuggestScheduleProp) => {
  const isActive = props.tags.filter( e => e.scheduleId === props.scheduleInfo.scheduleId).length > 0;
  return (
    <li className={`item font-size-14 pt-2 pb-2 font-weight-400 ${isActive ? "active" : ""}`}
      onClick={() => {
        if(!isActive){
          props.selectElementSuggest(props.scheduleInfo, IndexSaveSuggestionChoice.Schedule)
        }
      }}>
      <div className="font-size-12 pl-3 text-ellipsis">{props.scheduleInfo?.parentCustomerName}－{props.scheduleInfo.customerName}／{props.scheduleInfo.productTradingName}</div>
      <div className="pl-3 text-ellipsis">{props.scheduleInfo.scheduleName} </div>
      <div className="font-size-12 pl-3 text-ellipsis">{props.scheduleInfo.endDate}</div>
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
)(SuggestSchedule);
