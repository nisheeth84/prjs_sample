import React, { useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import ActivityListContentHeader from './activity-list-content-header';
import ActivityListContentBody from './activity-list-content-body';
import { ActivityInfoType } from '../models/get-activity-type';
import { translate } from 'react-jhipster';
import { handleInitActivities, ActivityAction } from './activity-list-reducer'
import ActivityListContentFooter from './activity-list-content-footer';
import ConfirmPopup from 'app/modules/timeline/control/timeline-content/confirm-popup';
import TimelineDetailEmployee from 'app/modules/timeline/timeline-list/timeline-detail-employee';
import {handleGetFullListReaction} from 'app/modules/timeline/control/reaction/timeline-reaction-reducer';
import { TYPE_SEARCH } from '../constants';

interface IActivityListContentProp extends StateProps, DispatchProps {
  onClickDetailPopup: (objectId, type) => void,
  isDraft?: boolean,
  onClickEdit: (id, actionType, viewMode, isDraft?) => void,
  onClickDetailActivity: (id, idx?) => void,
  activities?: any[];
  searchType?: any;
  titleFromAnotherModule?: string; // title for show when list data null
  deactiveId?: any;
  isTabCustomer?: boolean
  isTabSummary?: boolean
}

/**
 * component for show activity detail content
 * @param props
 */
const ActivityListContent = (props: IActivityListContentProp) => {
  const [activities, setActivities] = useState([]);
  const [msgCode, setMsgCode] = useState('INF_COM_0020');

  const onClickDetailPopup = (objectId, type) => {
    if (props.onClickDetailPopup) {
      props.onClickDetailPopup(objectId, type);
    }
  }

  /**
  * handle get full list emoji for timeline comment
  */
  useEffect(() => {
    props.handleGetFullListReaction();
  }, [])

  useEffect(() => {
    setActivities(props.activities || props.listActivities || []);
    switch (props.searchType) {
      case TYPE_SEARCH.NAVIGATION:
        setMsgCode('INF_COM_0020');
        break;
      case TYPE_SEARCH.DETAIL:
      case TYPE_SEARCH.LOCAL:
      case TYPE_SEARCH.FILTER:
        setMsgCode('INF_COM_0019');
        break;
      default:
        setMsgCode('INF_COM_0020');
        break;
    }
  }, [props.activities, props.listActivities])

  return (
    <div className="esr-content-content" >
      {activities?.length > 0 ? (activities.map((a: ActivityInfoType, index: number) => {
        return (
          <div className={"activity-info " + (index === 0 ? "" : "mt-3")} key={index}>
            <ActivityListContentHeader data={a} index={index}
              onClickDetailPopup={onClickDetailPopup}
              isDraft={props.isDraft}
              onClickEdit={props.onClickEdit}
              onClickDetailActivity={props.onClickDetailActivity}
            />
            <ActivityListContentBody data={a} index={index}
              onClickDetailPopup={onClickDetailPopup}
              deactiveId={props.deactiveId}
              isDraft={props.isDraft}
              isTabCustomer={props.isTabCustomer}
            />
            <ActivityListContentFooter data={a} />
          </div>
        )
      }))
        : (
          (props.isTabSummary || props.action === ActivityAction.Success) ? <div className="absolute-center">
            <div className="align-center">
              <img className="images-group-16" src={"/content/images/ic-sidebar-activity.svg"} alt="" />
              <div>{translate(`messages.${msgCode}`, { 0: translate(props.titleFromAnotherModule || 'activity.title') })}</div>
            </div>
          </div> : <></>
        )
      }
      {props.openConfirmPopup && !props.openModalDetail && <ConfirmPopup infoObj={props.confirmPopupItem} />}
      {!props.openModalDetail && <TimelineDetailEmployee />}
    </div>
  )
}

const mapStateToProps = ({ activityListReducerState, timelineReducerState }: IRootState) => ({
  listActivities: activityListReducerState.listActivities,
  action: activityListReducerState.action,
  timelines: timelineReducerState.listTimelines ? timelineReducerState.listTimelines[0] : null,
  confirmPopupItem: timelineReducerState.confirmPopupItem,
  openConfirmPopup: timelineReducerState.openConfirmPopup,
  openModalDetail: activityListReducerState.openModalDetail
});

const mapDispatchToProps = {
  handleInitActivities,
  handleGetFullListReaction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityListContent);
