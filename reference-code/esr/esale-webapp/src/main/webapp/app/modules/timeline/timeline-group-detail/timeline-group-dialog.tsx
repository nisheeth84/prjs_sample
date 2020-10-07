import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'reactstrap';
import { handleUpdateMemberOfTimelineGroup } from '../timeline-reducer';
import {InvitesType} from '../models/get-timeline-groups-model'
import { translate } from 'react-jhipster';

type ITimelineGroupDialogProp = StateProps & DispatchProps & {
  onClose:(isConfirm: boolean)=>void;
  timelineGroupId? : number;
  data?: InvitesType;
}

const TimelineGroupDialog = (props: ITimelineGroupDialogProp) => {
  // call API updateMemberOfTimelineGroup
  const previewHandle = () =>{
     props.handleUpdateMemberOfTimelineGroup({
       timelineGroupId: props.timelineGroupId,
       inviteType: props.data.inviteType,
       inviteId: props.data.inviteId,
       status: props.data.status,
       authority: 2,
       isOwner: true,
       isDepartment: false
      });
     props.onClose(true);
    }

return (
  <>
    <Modal isOpen={true} fade={true} toggle={() => {}} backdrop={true} autoFocus={true} className="modal-dialog-timeline-esr2" zIndex="auto">
      <div className="popup-esr2 popup-activity-es3 width-400 z-index-1112" id="popup-esr2">
        <div className="popup-esr2-content">
          <div className="popup-esr2-body">
            <form>
              <p className="mt-3">{translate('timeline.popup-ok.content')}</p>
            </form>
          </div>
          <div className="popup-esr2-footer d-flex justify-content-center">
            <button tabIndex={0} className="button-cancel" onClick= {() => props.onClose(false)} >{translate('timeline.popup-ok.button-cancel')}</button>
            <button tabIndex={0} className="button-blue"  onClick={() =>{previewHandle()}}>{translate('timeline.popup-ok.button-ok')}</button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show z-index-1111"></div>
    </Modal>
  </>
);}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  handleUpdateMemberOfTimelineGroup
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
mapStateToProps,
mapDispatchToProps
)(TimelineGroupDialog);
