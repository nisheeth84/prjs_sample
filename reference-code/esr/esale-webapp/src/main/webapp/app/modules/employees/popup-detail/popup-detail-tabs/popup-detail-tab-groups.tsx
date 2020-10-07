import React from 'react';
import TimeLineGroupListChannel from 'app/modules/timeline/timeline-group-list/timeline-group-list-channel';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

export interface IPopupTabGroups extends StateProps {
  data: any[];
  isFromModal?: boolean;
}

const TabGroups: React.FC<IPopupTabGroups> = props => {
  return (
    <div className="wrap-timeline style-3 pt-0  h-100 background-col-F9">
      <div className="list-group-v2">
        <div className="list-group-contents">
          <div className="row">
            <TimeLineGroupListChannel data={props.data} isFromModal={props.isFromModal} isFromEmployeeDetail={true}/>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  toggleViewGroupDetailOwners: timelineReducerState.toggleViewGroupDetailOwners,
  toggleViewGroupDetail: timelineReducerState.toggleViewGroupDetail,
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(TabGroups);
