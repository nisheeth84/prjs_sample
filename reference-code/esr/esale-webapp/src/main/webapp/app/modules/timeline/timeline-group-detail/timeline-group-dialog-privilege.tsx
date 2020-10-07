import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';

type ITimelineGroupDialogPrivilegeProp =  StateProps & DispatchProps & {
  onClose : ()=>void
}

const TimelineGroupDialogPrivilege = (props: ITimelineGroupDialogPrivilegeProp) => {
return (
  <Modal isOpen={true} fade={true} toggle={() => {}} backdrop={true} autoFocus={true} className="modal-dialog-timeline-esr2" zIndex="auto">
    <div className="popup-esr2 popup-activity-es3 width-400 z-index-1112" id="popup-esr2">
      <div className="popup-esr2-content">
        <div className="popup-esr2-body">
          <form>
            <p className="mt-3">{translate('timeline.popup-privilege.content')}</p>
          </form>
        </div>
        <div className="popup-esr2-footer text-right pr-3">
          <button tabIndex={0} className="button-blue text-center" onClick={props.onClose} >{translate('timeline.popup-privilege.button-ok')}</button>
        </div>
      </div>
    </div>
    <div className="modal-backdrop show z-index-1111"></div>
  </Modal>
);}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
mapStateToProps,
mapDispatchToProps
)(TimelineGroupDialogPrivilege);
