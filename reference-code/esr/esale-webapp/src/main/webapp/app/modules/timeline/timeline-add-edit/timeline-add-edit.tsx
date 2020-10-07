import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';
import TimelineFormControl from '../control/timeline-content/timeline-form-control';
import { handleSetModalMessageMode } from '../timeline-reducer'
import TimelineMessageInfo from '../control/message-info/timeline-message-info';
import DialogDirtyCheckTimeline from '../common/dialog-dirty-check-timeline';
import { TargetDeliversType } from '../models/get-user-timelines-type';

type ITimelineAddEditProp = StateProps & DispatchProps & {
  closeModal: () => void
  defaultTagetCreateAdEdit?: TargetDeliversType[]
}

const TimelineAddEdit = (props: ITimelineAddEditProp) => {
  const [value, setValue] = useState(null);

  /**
   * dirty check timeline comment
   */
   const executeDirtyCheck = async () => {
    const onCancel = () => { };
    if (value) {
      await DialogDirtyCheckTimeline({ onLeave: props.closeModal, onStay: onCancel, ok: translate('timeline.dirty-check.button-ok'),
                                    cancel: translate('timeline.dirty-check.button-cancel'),
                                    content: translate('timeline.dirty-check.content'),
                                    title: translate('timeline.dirty-check.title') });

    } else {
      props.closeModal()
    }
  };

   /**
   * update channel when open share modal
   */
  useEffect(() => {
    props.handleSetModalMessageMode(true)
    return () => { props.handleSetModalMessageMode(false) }
  }, [])

  return (
    <Modal isOpen fade toggle={() => { }} backdrop id="popup-edit-insert-timeline" className="timeline-popup-center" autoFocus zIndex="auto">
      <div className="timeline-popup-center-cell">
        <div className="popup-esr2 popup-esr3 overflow-visible transform-form" id="popup-esr2" >
          <div className="popup-esr2-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back"><span className="text border-left-none"><img src="../../../content/images/timeline/ic-title-modal.svg" alt="" />{translate('timeline.control.local-tool.add-timeline')}</span></div>
              </div>
              <div className="right">
                <button type="button" className="icon-small-primary icon-close-up-small " onClick={()=>{executeDirtyCheck()}} />
              </div>
            </div>
            <div className="popup-esr2-body popup-timeline-body">
              <TimelineMessageInfo isModal={true} />
              <form className="form-timeline" onSubmit={(e) =>{e.preventDefault(); return false} } >
                <TimelineFormControl defaultTagetCreateAdEdit={props.defaultTagetCreateAdEdit} isModal = {true} createPost={true} callback = {(_value: string)=>{setValue(_value)}}/>
              </form>
            </div>
          </div>
        </div >
      </div>
    </Modal>
  );
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  handleSetModalMessageMode
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineAddEdit);
