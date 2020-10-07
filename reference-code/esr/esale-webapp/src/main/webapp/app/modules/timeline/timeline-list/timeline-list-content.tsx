import React, { useEffect, useState } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import TimelineFormControl from '../control/timeline-content/timeline-form-control'
import TimelineItemControl from '../control/timeline-content/timeline-item-control';
import { TimelinesType } from '../models/get-user-timelines-type';
import TimelineListAttachedFile from '../timeline-list-attached-file/timeline-list-attached-file'
import { translate } from 'react-jhipster';
import { TimelineAction } from '../timeline-reducer';
import TimelineDetailOthers from './timeline-detail-orthers'
import { ObjectDetail } from '../models/get-followeds-model';
import TimelineDetailEmployee from './timeline-detail-employee';
import { handleGetFullListReaction} from '../control/reaction/timeline-reaction-reducer'
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';

type ITimelineListContentProp = StateProps & DispatchProps

const TimelineListContent = (props: ITimelineListContentProp) => {

  const [dataPopupDetail, setDataPopupDetail] = useState<ObjectDetail>(null)
  const [forceUpdate, setForceUpdate] = useState(0);
    
  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      setForceUpdate(forceUpdate+1);
    }
  }, [props.isChangeId])

  /**
   * handle get full list emoji
   */
  useEffect(() => {
    props.handleGetFullListReaction();
  }, [])

  /**
   * Render message no record
   */
  const rederNoDaTaList = (message: string) => {
    return (
      <div className="absolute-center">
        <div className="align-center">
          <img className="images-group-16" src={"../../../content/images/setting/ic-check-list-pink.svg"} alt="" />
          <div>{translate(message)}</div>
        </div>
      </div>)
  }
  
  return (
    <div className="esr-content-body-main w-auto">
      <div className={props.isOpenListAttachedFile ? "wrap-timeline-main" : ""}>
        <div className="wrap-timeline-body style-3">
          <TimelineFormControl createPost={true}  />
          {props.listTimelines && props.listTimelines.length > 0 && 
            <div className="list-share pb-5">
              {props.listTimelines && props.listTimelines.map((timeline: TimelinesType, index: number) => {
                return (
                  <TimelineItemControl callBackShowDetail = {(objectData: ObjectDetail) => setDataPopupDetail(objectData)} data={timeline} isLast={props.listTimelines.length - 1 === index} key={index + '_' + timeline.timelineId} />
                )
              })
              }
            </div>
          }
          { (!props.listTimelines || props.listTimelines?.length === 0 ) && !props?.getTimelineFormSearch?.searchValue &&
            rederNoDaTaList("messages.INF_COM_0013")
          }
          { (!props.listTimelines || props.listTimelines?.length === 0 ) && props?.getTimelineFormSearch?.searchValue &&
            rederNoDaTaList("messages.INF_COM_0007")
          }
        </div>
      </div>
      {/* sidebar list file */}
      {props.isOpenListAttachedFile && <TimelineListAttachedFile />}
      {/* sildebar list end */}
      <TimelineDetailOthers dataPopupDetail={dataPopupDetail}/>
      <TimelineDetailEmployee/>
      {props.isShowPopupCreate && <CreateEditSchedule onClosePopup={()=> {}} openFromModal={true}/>}
    </div>
  );
}

const mapStateToProps = ({ timelineReducerState, employeeDetailAction, dataCreateEditSchedule }: IRootState) => ({
  listTimelines: timelineReducerState.listTimelines,
  isOpenListAttachedFile: timelineReducerState.isOpenListAttachedFile,
  action: timelineReducerState.action,
  getTimelineFormSearch: timelineReducerState.getTimelineFormSearch,
  showDetailModalOther: timelineReducerState.showDetailModalOther,
  isChangeId: employeeDetailAction.idUpdate,
  isShowPopupCreate: dataCreateEditSchedule.onShowCreate
});

const mapDispatchToProps = {
  handleGetFullListReaction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineListContent);
