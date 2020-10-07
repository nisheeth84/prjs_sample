import React, { useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import TimelineGroupContentItem from './timeline-group-content-item'
import { TimelineGroupType } from '../models/get-timeline-groups-model';
import { handleGetTimelineGroups, handleGetFavoriteTimelineGroups } from '../timeline-reducer';


type ITimelineGroupListChannelProp = StateProps & DispatchProps & {
  data:TimelineGroupType[];
  isEnableShowDialog?: boolean;
  isFromModal?: boolean;
  isFromEmployeeDetail: boolean;
}
const TimelineGroupListChannel = (props: ITimelineGroupListChannelProp) => {

  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      props.handleGetTimelineGroups({timelineGroupIds: [], sortType: 1 });
    }
  }, [props.isChangeId])

  useEffect(() => {
    props.handleGetFavoriteTimelineGroups();
  }, [])

  const setValueIsFavorite = (itemId) => {
    return props.listFavoriteGroupId && props.listFavoriteGroupId.includes(Number(itemId));
  }

  return <>
    {props.data && props.data.length > 0 && props.data.map((item: TimelineGroupType, idx: number) => {
      return (
        <div className={idx <= props.data?.length - 3 ? "col-6 mb-3" : "col-6"} key={"group_list_"+ item.timelineGroupId + idx}>
          <TimelineGroupContentItem isFromEmployeeDetail={props.isFromEmployeeDetail} isEnableShowDialog={props.isEnableShowDialog} data={item} isFavorite={setValueIsFavorite(item.timelineGroupId)} isFromModal={props.isFromModal}/>
        </div>
      )
    })}
  </>;
}

const mapStateToProps = ({ timelineReducerState, employeeDetailAction }: IRootState) => ({
  listFavoriteGroupId: timelineReducerState.listFavoriteGroupId,
  isChangeId: employeeDetailAction.idUpdate
});

const mapDispatchToProps = {
  handleGetTimelineGroups,
  handleGetFavoriteTimelineGroups
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupListChannel);
