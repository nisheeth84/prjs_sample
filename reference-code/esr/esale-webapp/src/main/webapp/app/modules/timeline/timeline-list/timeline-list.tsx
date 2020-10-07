import React, { useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import LocalTool from './local-tool'
import LocalNavigation from '../local-navigation/local-navigation'
import {
  handleInitTimelines,
  handleInitTimelinesScroll,
  handleGetLocalNavigation,
  handleGetTimelineFilter,
  handleUpdateTimelineFormSearch,
  handleToggleDetailModalOther,
  handleClearDataTimelineGroups,
  handleClearListTimeline
} from '../timeline-reducer'
import GlobalControlRight from 'app/modules/global/global-tool';
import TimelineListContent from './timeline-list-content'
import ConfirmPopup from '../control/timeline-content/confirm-popup';
import {LIMIT } from '../common/constants';
import TimelineMessageInfo from '../control/message-info/timeline-message-info';
import HelpPopup from 'app/modules/help/help';
import { CATEGORIES_ID } from 'app/modules/help/constant';
import BrowserDirtyCheck from 'app/shared/layout/common/browser-dirty-check';
import { ScreenMode } from 'app/config/constants';

type ITimelineListProp = StateProps & DispatchProps & {
  screenMode: any;
}

/**
 * Component for show list of employees
 * @param props
 */

const TimelineList = (props: ITimelineListProp) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);


  // call api getLocalNavigation and getTimelineFilter
  useEffect(() => {
    props.handleGetLocalNavigation();
    props.handleClearDataTimelineGroups();
    return () => props.handleClearListTimeline()
  }, [])

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
          setCurrentPage(nextPage)
          props.handleInitTimelinesScroll({ ...props.timelineFormSearch, limit: LIMIT, offset: nextPage * LIMIT });
        }
      }
    }
  }
  /**
* handle close popup Help
*/
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  /**
     * handle action open popup help
     */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  return <>
    <div className="control-esr resize-content">
      <LocalTool toggleOpenHelpPopup={handleOpenPopupHelp} openHelpPopup={onOpenPopupHelp}/>
      <div className="wrap-control-esr style-3">
        <div className="esr-content wrap-timeline">
          <LocalNavigation />
          <div className="esr-content-body style-3" onScroll={handleScroll} >
            <TimelineMessageInfo isModal={false} />
            <TimelineListContent />
          </div>
        </div>
      </div>
      <GlobalControlRight />
    </div>
    {props.openConfirmPopup && <ConfirmPopup infoObj={props.confirmPopupItem} />}
    {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.timeline} dismissDialog={dismissDialogHelp} />}
    {<BrowserDirtyCheck isDirty={ props.screenMode === ScreenMode.EDIT} />}
  </>
}

const mapStateToProps = ({ timelineReducerState, timelineCommonReducerState }: IRootState) => ({
  listTimelines: timelineReducerState.listTimelines,
  timelineFormSearch: timelineReducerState.getTimelineFormSearch,
  openConfirmPopup: timelineReducerState.openConfirmPopup,
  confirmPopupItem: timelineReducerState.confirmPopupItem,
  timelineFilters: timelineReducerState.timelineFilters,
  detailObjectId: timelineReducerState.detailObjectId,
  detailType: timelineReducerState.detailType,
  showDetailModalOther: timelineReducerState.showDetailModalOther,
  canScrollTimeline: timelineReducerState.canScrollTimeline,
  resetPageNumberTimeline: timelineReducerState.resetPageNumberTimeline,
  activeNavigation: timelineReducerState.activeNavigation,
  shareTimelineId: timelineReducerState.shareTimelineId,
  screenMode: timelineCommonReducerState.screenMode
});

const mapDispatchToProps = {
  handleInitTimelines
  , handleInitTimelinesScroll
  , handleGetLocalNavigation
  , handleGetTimelineFilter
  , handleUpdateTimelineFormSearch
  , handleToggleDetailModalOther
  , handleClearDataTimelineGroups
  , handleClearListTimeline
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineList);
