import React from 'react';
import { connect } from 'react-redux';
import { ActivityInfoType } from '../models/get-activity-type';
import TimelineItemControlBeside from 'app/modules/timeline/control/timeline-content/timeline-item-control-beside';
import ReactionListChoose from 'app/modules/timeline/control/reaction/reaction-list-choose';

type IActivityListContentFooterProp = StateProps & DispatchProps & {
  data: ActivityInfoType;
}

const ActivityListContentFooter = (props: IActivityListContentFooterProp) => {
  return <>
    {props.data && props.data.extTimeline &&
      <div className="wrap-timeline pt-2">
        <div className="wrap-timeline-body border-top">
          <div className="list-share pl-4 ml-2">
            <ReactionListChoose objectId={props.data?.extTimeline?.timelineId} rootId={props.data?.extTimeline?.timelineId} reactionsSelecteds={props.data?.extTimeline?.reactions}/>
            <TimelineItemControlBeside classType="activity-info-bot box-share-bottom pt-1 mt-1" data={props.data.extTimeline} />
          </div>
        </div>
      </div>
    }
  </>
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
)(ActivityListContentFooter);
