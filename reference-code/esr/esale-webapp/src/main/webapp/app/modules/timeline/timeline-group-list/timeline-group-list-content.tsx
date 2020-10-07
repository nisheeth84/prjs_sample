import React, { useEffect, useState } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { handleGetTimelineGroups } from '../timeline-reducer';
import { handleSetIsDeleteMemberSuccess } from '../timeline-common-reducer';
import TimelineGroupListChannel from './timeline-group-list-channel'
import { translate } from 'react-jhipster'

type ITimelineGroupListContent = StateProps & DispatchProps & {
  isFromEmployeeDetail: boolean
}

const TimelineGroupListContent = (props: ITimelineGroupListContent) => {
  const [checkMessega, setCheckMessega] = useState(null);
  const [listTimelineChannel, setListTimelineChannel] = useState([]);

  useEffect(() => {
    props.handleGetTimelineGroups({ sortType: 1, timelineGroupIds: [] });
  }, [])

  useEffect(() => {
      if (!props?.listTimelineGroups) {
      setCheckMessega(true)
    }
  }, [props.listTimelineGroups])

  useEffect(() => {
    setListTimelineChannel(props.listTimelineGroups);
  }, [props.listTimelineGroups, props.countRequestListChanel])

  useEffect(() => {
    if(props.isDeleteSuccess) {
      props.handleGetTimelineGroups({ sortType: 1, timelineGroupIds: [] });
      props.handleSetIsDeleteMemberSuccess(false);
    }
  }, [props.isDeleteSuccess])

  return (
    <div className="wrap-timeline style-3 pt-0 h-100">
      <div className="list-group-v2">
        <div className="list-group-contents background-col-F9">
          <div className="row">
           { checkMessega &&
              <div className="absolute-center">
                <div className="align-center">
                  <img className="images-group-16" src={"../../../content/images/setting/ic-check-list-pink.svg"} alt="" />
                  <div>{translate("messages.INF_COM_0013")}</div>
                </div>
              </div>
            }
            <TimelineGroupListChannel isFromEmployeeDetail={props.isFromEmployeeDetail} isEnableShowDialog={true} data={listTimelineChannel} />
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ timelineReducerState, timelineCommonReducerState }: IRootState) => ({
  listTimelineGroups: timelineReducerState.listTimelineGroups,
  countRequestListChanel: timelineReducerState.countRequestListChanel,
  action: timelineReducerState.action,
  isDeleteSuccess: timelineCommonReducerState.isDeleteSuccess
});

const mapDispatchToProps = {
  handleGetTimelineGroups,
  handleSetIsDeleteMemberSuccess
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupListContent);
