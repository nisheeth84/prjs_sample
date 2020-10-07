import React from 'react'
import { connect } from 'react-redux'

type ISuggestReportTargetProp = StateProps & DispatchProps & {
  reportTargetInfo: any;
  tags: any;
  selectElementSuggest: any;
}

const SuggestReportTarget = (props: ISuggestReportTargetProp) => {
  const isActive = props.tags.filter( e => e.reportTargetId === props.reportTargetInfo.reportTargetId).length > 0;
  return (
    <div className={`item ${isActive ? "active" : ""} smooth`} onClick={() => {if(!isActive){ props.selectElementSuggest(props.reportTargetInfo)}}}>
      <div className="text text1 font-size-12 text-ellipsis">{props.reportTargetInfo.customerName}</div>
      <div className="text text2 text-ellipsis">{props.reportTargetInfo.reportTargetName} </div>
      {/* <div className="text text3">{props.tradingProductInfo.employeeName} </div> */}
    </div>
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
)(SuggestReportTarget);
