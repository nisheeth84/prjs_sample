import React, { useEffect, useState } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import LocalTool from './local-tool'
import LocalNavigation from '../local-navigation/local-navigation'
import TimelineGroupListContent from './timeline-group-list-content'
import TimelineGroupParticipants from '../timeline-group-detail/timeline-group-participants';
import TimelineGroupParticipantOwner from '../timeline-group-detail/timeline-group-participant-owner'
import ConfirmPopup from '../control/timeline-content/confirm-popup'
import { handleGetLocalNavigation, handleClearDataTimelineGroups } from '../timeline-reducer'
import GlobalControlRight from 'app/modules/global/global-tool';
import HelpPopup from 'app/modules/help/help';
import { CATEGORIES_ID } from 'app/modules/help/constant';

type ITimelineGroupListProp = StateProps & DispatchProps & {
  toggleViewGroupDetail?: any;
  toggleViewGroupDetailOwners?: any;
  screenMode: any;
}

const TimelineGroupList = (props: ITimelineGroupListProp) => {
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);

  useEffect(() => {
    props.handleGetLocalNavigation();
    props.handleClearDataTimelineGroups();
  }, [])

  /**
  * handle action open popup help
  */
  const handleOpenPopupHelp = () => {
    setOnOpenPopupHelp(!onOpenPopupHelp);
  }

  /**
  * handle close popup Help
  */
  const dismissDialogHelp = () => {
    setOnOpenPopupHelp(false);
  }

  return <>
    <div className="control-esr resize-content">
      <LocalTool toggleOpenHelpPopup={handleOpenPopupHelp} openHelpPopup={onOpenPopupHelp}/>
      <div className="wrap-control-esr style-3">
        <div className="esr-content wrap-timeline">
          <LocalNavigation />
          <div className="esr-content-body v2-time-line style-3">
            <div className="esr-content-body-main h-100">
              <TimelineGroupListContent isFromEmployeeDetail={false}/>
            </div>
          </div>
        </div>
      </div>
      <GlobalControlRight />
      {props.toggleViewGroupDetail && <TimelineGroupParticipants />}
      {props.toggleViewGroupDetailOwners && <TimelineGroupParticipantOwner mode={1} timelineChannelId={[]}/>}
    </div>
    {props.openConfirmPopup && <ConfirmPopup infoObj={props.confirmPopupItem} />}
    {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.timeline} dismissDialog={dismissDialogHelp} />}
  </>;
}

const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  toggleTimelineModal: timelineReducerState.toggleTimelineModal,
  toggleViewGroupDetail: timelineReducerState.toggleViewGroupDetail,
  toggleViewGroupDetailOwners: timelineReducerState.toggleViewGroupDetailOwners,
  openConfirmPopup: timelineReducerState.openConfirmPopup,
  confirmPopupItem: timelineReducerState.confirmPopupItem,
});

const mapDispatchToProps = {
  handleGetLocalNavigation,
  handleClearDataTimelineGroups
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupList);
