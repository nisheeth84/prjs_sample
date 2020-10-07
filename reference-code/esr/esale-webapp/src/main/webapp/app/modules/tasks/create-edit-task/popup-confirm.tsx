import React from 'react';
import { translate } from 'react-jhipster';
import { Modal } from 'reactstrap';
import { TASK_UPDATE_FLG } from '../constants';

export interface PopupConfirmCreateTaskProps {
  // event click button confirm
  onClickButtonConfirm?: (stateNumber?) => void,
  // event click button cancel
  onClickButtonCancelConfirm?: () => void,
}

/**
 * Component popup confirm status of task
 * @param props
 */
const PopupConfirm = (props: PopupConfirmCreateTaskProps) => {

  /**
   * event click button confirm
   * @param event 
   * @param stateNumber 
   */
  const onClickButton = (event, stateNumber) => {
    props.onClickButtonConfirm(stateNumber);
    event.preventDefault();
  }

  /**
   * event click button cancel
   * @param event 
   */
  const onClickButtonCancel = (event) => {
    props.onClickButtonCancelConfirm();
    event.preventDefault();
  }
  
  return (
    <div className="popup-esr2 popup-task-body">
      <div className="popup-esr2-content">
        <div className="popup-task-content">
          <div className="title">{translate('tasks.create-edit.label.confirm-subtask')}</div>
          <div className="text">{translate('tasks.create-edit.title.confirm-subtask')}</div>
        </div>
        <div className="footer">
          <a title="" href="#" onClick={(event) => { onClickButton(event, TASK_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE) }} className="button-blue">{translate('tasks.create-edit.button.confirm_sub_done')}</a>
          <a title="" href="#" onClick={(event) => { onClickButton(event, TASK_UPDATE_FLG.CHANGE_SUBTASK_TO_TASK_MOVE_TASK_TO_DONE) }} className="button-blue">{translate('tasks.create-edit.button.confirm_sub_to_primary')}</a>
          <a title="" href="#" onClick={(event) => { onClickButtonCancel(event) }} className="button-primary button-cancel">{translate('tasks.create-edit.button.cancel')}</a>
        </div>
      </div>
    </div>
  )
}

export default PopupConfirm;