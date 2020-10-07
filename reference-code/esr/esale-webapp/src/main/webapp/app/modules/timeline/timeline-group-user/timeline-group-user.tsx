import React, { useEffect, useState } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import LocalNavigation from '../local-navigation/local-navigation'
import ConfirmPopup from '../control/timeline-content/confirm-popup'
import TimelineGroupUserHeader from './timeline-group-user-header'
import {
  handleInfoGroupUser,
  handleSetGroupTimelineDetailId,
  handleInitTimelines,
  handleGetFavoriteTimelineGroups,
  handleGetLocalNavigation,
  handleGetTimelineFilterGroupDetail,
  handleUpdateTimelineFormSearch,
  handleClearCacheGroupDetail,
  handleInitTimelinesScroll,
  handleToggleDetailModalOther,
  handleSetActiveNavigation,
} from '../timeline-reducer'
import GlobalControlRight from 'app/modules/global/global-tool';
import TimelineFormControl from '../control/timeline-content/timeline-form-control'
import TimelineItemControl from '../control/timeline-content/timeline-item-control';
import { TimelinesType } from '../models/get-user-timelines-type'
import LocalTool from '../timeline-list/local-tool'
import TimelineListAttachedFile from '../timeline-list-attached-file/timeline-list-attached-file'
import { GROUP_TIMELINE_MODE, TIMELINE_TYPE, INVITE_TYPE, CREATE_POSITION, LIMIT } from '../common/constants'
import { CommonUtil } from '../common/CommonUtil'
import TimelineGroupParticipantOwner from '../timeline-group-detail/timeline-group-participant-owner'
import TimelineGroupParticipants from '../timeline-group-detail/timeline-group-participants';
import TimelineMessageInfo from '../control/message-info/timeline-message-info'
import { translate } from 'react-jhipster'
import { useHistory } from 'react-router'
import TimelineDetailOthers  from '../timeline-list/timeline-detail-orthers'
import TimelineDetailEmployee from '../timeline-list/timeline-detail-employee'
import { ObjectDetail } from '../models/get-followeds-model'
import HelpPopup from 'app/modules/help/help';
import { CATEGORIES_ID } from 'app/modules/help/constant';
import { handleGetFullListReaction} from '../control/reaction/timeline-reaction-reducer'
import BrowserDirtyCheck from 'app/shared/layout/common/browser-dirty-check'
import { ScreenMode } from 'app/config/constants'
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';
import { handleSetIsDeleteMemberSuccess } from '../timeline-common-reducer'

type ITimelineGroupUserProp = StateProps & DispatchProps & {
  // to get param timlineGroupId on link
  screenMode:any
  popoutParams?: any
}

const TimelineGroupUser = (props: ITimelineGroupUserProp) => {
  const [timelineGroupId, setTimelineGroupId] = useState(props.popoutParams.timelineGroupId ? props.popoutParams.timelineGroupId : null);
  const history = useHistory();
  const [dataPopupDetail, setDataPopupDetail] = useState<ObjectDetail>(null)
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);
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
   * reset timlineGroupId when change link
   */
  useEffect(() => {
    setTimelineGroupId(props.popoutParams.timelineGroupId);
  }, [props.popoutParams.timelineGroupId])

  const [currentPage, setCurrentPage] = useState(0);

  /**
   * scroll on top when share success
   */
  useEffect(() => {
    if(props.shareTimelineId){
      document.getElementsByClassName('wrap-timeline-body style-3')[0].scrollTop = 0;
    }
  }, [props.shareTimelineId])

  /**
   * reset curent page when search again
   */
  useEffect(() => {
    if(props.listTimelines?.length <= LIMIT){
      setCurrentPage(0);
    }
  }, [props.listTimelines])

  /**
   *  handle scroll list timeline
   * @param e
   */
  const handleScroll = (e) => {
    const element = e.target;
    if (element.className.includes("wrap-timeline-body style-3")) {
      if (props.canScrollTimeline) {
        if (element.scrollTop > 0 && props.listTimelines && (element.scrollTop + element.offsetHeight) >= element.scrollHeight) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          props.handleInitTimelinesScroll({ ...props.timelineFormSearch, limit: LIMIT, offset: nextPage*LIMIT });
        }
      }
    }
  }

  /**
   * to call data when change timlineGroupId
   */
  useEffect(() => {
    // clear cache
    props.handleClearCacheGroupDetail();
    // innit data
    if(timelineGroupId) {
      props.handleInfoGroupUser(timelineGroupId);
      props.handleSetGroupTimelineDetailId(timelineGroupId);
      props.handleGetFavoriteTimelineGroups();
      if(props.timelineFormSearch?.limit) {
        props.handleUpdateTimelineFormSearch({ ...props.timelineFormSearch, listType: TIMELINE_TYPE.GROUP_TIMELINE, listId: Number(timelineGroupId), searchValue: null }, true);
      }
      // reload local navigation and filter when reload page
      else {
        props.handleGetLocalNavigation();
        props.handleGetTimelineFilterGroupDetail(timelineGroupId);
      }
    }
    //
    return (() => props.handleClearCacheGroupDetail())
  }, [timelineGroupId])

  /**
   * check can view group detail info
   */
  useEffect(() => {
    if(props.listTimelineGroupsDetail && props.listTimelineGroupsDetail.length === 1 
      && props.listTimelineGroupsDetail[0].timelineGroupId === Number(props.popoutParams.timelineGroupId)
      && !props.listTimelineGroupsDetail[0].isPublic)
      {
        if (CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee) === GROUP_TIMELINE_MODE.NOT_MEMBER) {
            history.push("/timeline/list")
            props.handleSetActiveNavigation(TIMELINE_TYPE.ALL_TIMELINE+"");
            props.handleUpdateTimelineFormSearch({...props.getTimelineFormSearch, listType: TIMELINE_TYPE.ALL_TIMELINE }, true);
        }
      }
  }, [props.listTimelineGroupsDetail, props.timelineGroupsOfEmployee])

/**
 * Render message no record
 */
  const rederNoDaTaList = (message: string) => {
    return (
      <div className="mt-5 pt-5 text-center">
        <div className="align-center">
          <img className="images-group-16" src={"../../../content/images/setting/ic-check-list-pink.svg"} alt="" />
          <div>{translate(message)}</div>
        </div>
      </div>)
  }

  /**
  * handle action open popup help
  */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  /**
   * handle get full list emoji
   */
  useEffect(() => {
    props.handleGetFullListReaction();
  }, [])

  /**
  * handle close popup Help
  */
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  useEffect(() => {
    if(props.isDeleteSuccess) {
      props.handleInfoGroupUser(timelineGroupId);
      props.handleSetIsDeleteMemberSuccess(false);
    }
  }, [props.isDeleteSuccess])

  return (
    <>
      <div className="control-esr resize-content">
        <LocalTool isGroupTimeline={true} toggleOpenHelpPopup={handleOpenPopupHelp} openHelpPopup={onOpenPopupHelp}/>
        <div className="wrap-control-esr style-3">
          <div className="esr-content wrap-timeline">
            <LocalNavigation />
            <div className="esr-content-body style-3" onScroll={handleScroll}>
            <TimelineMessageInfo isModal = {false}/>
              <div className="esr-content-body-main w-auto">
                <div className={props.isOpenListAttachedFile ? 'wrap-timeline-main' : ''}>
                  <div className="wrap-timeline-body style-3">
                    <TimelineGroupUserHeader
                      userMode={CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee)}
                      data={props.listTimelineGroups ? props.listTimelineGroups[0] : null}
                      comment={props.listTimelineGroups?.length > 0 ? props.listTimelineGroups[0].comment : null}
                    />
                    {CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee) !== GROUP_TIMELINE_MODE.NOT_MEMBER
                      && <TimelineFormControl
                        createPosition = {CREATE_POSITION.GROUP}
                        createPost = {true}
                        isDisableDropdown={true}
                        defaultValueDropdown={props.listTimelineGroups[0]}
                      />}
                    <div className="list-share pb-5">
                      {props.listTimelines && props.listTimelines.length > 0 && props.listTimelines.map((t: TimelinesType, index: number) => {
                        return (
                          <TimelineItemControl
                            isPrivateGroup={!(props.listTimelineGroups && props.listTimelineGroups[0]?.isPublic)}
                            isNotMemberOfGroup={CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee) === GROUP_TIMELINE_MODE.NOT_MEMBER}
                            data={t}
                            isLast={props.listTimelines.length - 1 === index} key={t.timelineId}
                            callBackShowDetail = {(objectData: ObjectDetail) => setDataPopupDetail(objectData)}
                          />
                        )
                      })
                      }
                    </div>
                    { (!props.listTimelines || props.listTimelines?.length === 0 ) && !props?.timelineFormSearch?.searchValue &&
                      rederNoDaTaList("messages.INF_COM_0013")
                    }
                    { (!props.listTimelines || props.listTimelines?.length === 0 ) && props?.timelineFormSearch?.searchValue &&
                      rederNoDaTaList("messages.INF_COM_0007")
                    }

                  </div>
                </div>
                {/* sidebar list file */}
                {props.isOpenListAttachedFile && <TimelineListAttachedFile />}
                {/* sildebar list end */}
              </div>
            </div>
          </div>
        </div>
        <GlobalControlRight />
      </div>
      {props.openConfirmPopup && <ConfirmPopup infoObj={props.confirmPopupItem} />}
      {props.toggleViewGroupDetailOwners && <TimelineGroupParticipantOwner mode={2} timelineChannelId={timelineGroupId}/>}
      {props.toggleViewGroupDetail && <TimelineGroupParticipants />}
      {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.timeline} dismissDialog={dismissDialogHelp} />}

      <TimelineDetailOthers dataPopupDetail={dataPopupDetail}/>
      <TimelineDetailEmployee/>
      {props.isShowPopupCreate && <CreateEditSchedule onClosePopup={()=> {}} openFromModal={true}/>}
      {<BrowserDirtyCheck isDirty={ props.screenMode === ScreenMode.EDIT} />}
    </>
  );
}

const mapStateToProps = ({ timelineReducerState, applicationProfile, employeeDetailAction,timelineCommonReducerState, dataCreateEditSchedule }: IRootState) => ({
  openConfirmPopup: timelineReducerState.openConfirmPopup,
  confirmPopupItem: timelineReducerState.confirmPopupItem,
  listTimelineGroups: timelineReducerState.listTimelineGroups,
  listTimelines: timelineReducerState.listTimelines,
  isOpenListAttachedFile: timelineReducerState.isOpenListAttachedFile,
  timelineGroupsOfEmployee: timelineReducerState.listTimelineGroupsOfEmployee ? timelineReducerState.listTimelineGroupsOfEmployee[0] : null,
  toggleViewGroupDetailOwners: timelineReducerState.toggleViewGroupDetailOwners,
  timelineFormSearch: timelineReducerState.getTimelineFormSearch,
  timelineFilters: timelineReducerState.timelineFilters,
  toggleViewGroupDetail: timelineReducerState.toggleViewGroupDetail,
  tenant: applicationProfile.tenant,
  canScrollTimeline: timelineReducerState.canScrollTimeline,
  action: timelineReducerState.action,
  detailObjectId: timelineReducerState.detailObjectId,
  detailType: timelineReducerState.detailType,
  showDetailModalOther: timelineReducerState.showDetailModalOther,
  shareTimelineId: timelineReducerState.shareTimelineId,
  isChangeId: employeeDetailAction.idUpdate,
  screenMode: timelineCommonReducerState.screenMode,
  listTimelineGroupsDetail: timelineReducerState.listTimelineGroupsDetail,
  isShowPopupCreate: dataCreateEditSchedule.onShowCreate,
  isDeleteSuccess: timelineCommonReducerState.isDeleteSuccess,
  getTimelineFormSearch: timelineReducerState.getTimelineFormSearch
});

const mapDispatchToProps = {
  handleSetGroupTimelineDetailId,
  handleInfoGroupUser,
  handleInitTimelines,
  handleGetFavoriteTimelineGroups,
  handleGetLocalNavigation,
  handleGetTimelineFilterGroupDetail,
  handleUpdateTimelineFormSearch,
  handleClearCacheGroupDetail,
  handleInitTimelinesScroll,
  handleToggleDetailModalOther,
  handleGetFullListReaction,
  handleSetIsDeleteMemberSuccess,
  handleSetActiveNavigation
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupUser);
