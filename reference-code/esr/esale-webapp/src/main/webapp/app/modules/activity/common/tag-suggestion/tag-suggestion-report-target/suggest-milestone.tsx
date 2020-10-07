import React from 'react'
import { connect } from 'react-redux'
import { formatDate } from 'app/shared/util/date-utils';
import { IndexSaveSuggestionChoice } from '../tag-suggestion';

type ISuggestMilestoneProp = StateProps & DispatchProps & {
  milestoneInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestMilestone = (props: ISuggestMilestoneProp) => {
  const isActive = props.tags.filter( e => e.milestoneId === props.milestoneInfo.milestoneId).length > 0;
  return (
    <li className={`item ${isActive ? "active" : ""} font-size-14 pt-2 pb-2 font-weight-400`} onClick={() => { if (!isActive) { props.selectElementSuggest(props.milestoneInfo, IndexSaveSuggestionChoice.Milestones) } }}>
      <div className="font-size-12 pl-3 color-999 text-ellipsis">{props.milestoneInfo.parentCustomerName}－{props.milestoneInfo.customerName}</div>
      <div className="pl-3 color-333 text-ellipsis">{props.milestoneInfo.milestoneName} ({formatDate(props.milestoneInfo.endDate)})</div>
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
)(SuggestMilestone);
