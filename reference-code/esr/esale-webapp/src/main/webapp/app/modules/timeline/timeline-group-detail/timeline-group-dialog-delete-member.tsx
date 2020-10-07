import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'reactstrap';
import {InvitesType} from '../models/get-timeline-groups-model'
import { translate } from 'react-jhipster';
import { handleDeleteMemberOfTimelineGroup, handleGetOutTimelineGroup } from '../timeline-reducer';
import { CommonUtil } from '../common/CommonUtil';
import { IRootState } from 'app/shared/reducers';

type ITimelineGroupDialogDeleteMemberProp =  StateProps & DispatchProps & {
  onClose:(isConfirm: boolean)=>void;
  timelineGroupId? : number;
  data?: InvitesType;
}

const TimelineGroupDialogDeleteMember = (props: ITimelineGroupDialogDeleteMemberProp) => {

  const [isPublicChannel, setIsPublicChannel] = useState(false);

  // get userLoginId
  const userLoginId = CommonUtil.getUserLogin().employeeId;

  /**
   * check group public/private
   */
  useEffect(() => {
    if(props.listTimelineGroupsOfEmployee[0]?.isPublic === true){
      setIsPublicChannel(true);
    }
  },[props.listTimelineGroupsOfEmployee])

  /**
   * delete member of group
   * @param props
   */
  const deleteMember = () => {
    if (props.data?.inviteId !== Number(userLoginId) || props.data?.inviteId === Number(userLoginId) && isPublicChannel === true) {
      props.handleDeleteMemberOfTimelineGroup({
        timelineGroupId: props.timelineGroupId
        , inviteId: props.data.inviteId
        , inviteType: props.data.inviteType });
    } else {
      props.handleGetOutTimelineGroup({ timelineGroupId: props?.timelineGroupId, inviteId: userLoginId, inviteType: 2}, true, isPublicChannel);
    }
    props.onClose(true);
  }

  return (
    <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} autoFocus={true} className="modal-dialog-timeline-esr2" zIndex="auto">
      <div className="popup-esr2 popup-activity-es3 width-400 z-index-1112" id="popup-esr2">
        <div className="popup-esr2-content">
          <div className="popup-esr2-body">
            <form>
              <p className="mt-3">{translate('timeline.dialog-group-delete-member.content')}</p>
              <p>{translate('timeline.dialog-group-delete-member.contentBottom')}</p>
            </form>
          </div>
          <div className="popup-esr2-footer d-flex justify-content-center">
            <button tabIndex={0} className="button-cancel" onClick={() => props.onClose(false)} >{translate('timeline.dialog-group-delete-member.button-cancel')}</button>
            <button tabIndex={0} className="button-red" onClick={() => { deleteMember() }}>{translate('timeline.dialog-group-delete-member.button-delete')}</button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show z-index-1111"></div>
    </Modal>
  );
}

const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  listTimelineGroupsOfEmployee: timelineReducerState.listTimelineGroupsOfEmployee
});

const mapDispatchToProps = {
  handleDeleteMemberOfTimelineGroup,
  handleGetOutTimelineGroup
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
mapStateToProps,
mapDispatchToProps
)(TimelineGroupDialogDeleteMember);
