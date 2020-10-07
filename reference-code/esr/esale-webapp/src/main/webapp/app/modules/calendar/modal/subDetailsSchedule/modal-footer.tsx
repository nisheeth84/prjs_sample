import React, { useEffect, useState } from 'react';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { ItemTypeSchedule } from "app/modules/calendar/constants";
import { IRootState } from "app/shared/reducers";
import { AttendanceDivisionType } from '../../constants';
import { updateScheduleStatusSubSchedule } from '../calendar-modal.reducer';
import { updateStatusMilestone } from "app/modules/tasks/milestone/detail/detail-milestone.reducer";
import { handleUpdateStatusTask, ACTION_TYPES } from "app/modules/tasks/detail/detail-task.reducer";
import { TASK_UPDATE_FLG, STATUS_TASK } from "app/modules/tasks/constants";
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';


/**
 * interface of modal foot
 */
type ICalendarModalFootProps = StateProps & DispatchProps & {
  handleUpdateStatusTask?: (statusTaskId, taskId, updateFlg) => void;
  updateStatusMilestone?: (milestoneId, isDone, updateFlg, updatedDate) => void
  onCloseModal?: () => void;
}

/**
 * component modal footer
 * @param props
 * @constructor
 */
const ModalFooter = (props: ICalendarModalFootProps) => {
  const [hadShare, setHadShare] = useState(false)
  const [showConfirmUpdateStatus, setShowConfirmUpdateStatus] = useState(false);
  const [isCreatedUser, setIsCreatedUser] = useState(props.milestone ? props.milestone.isCreatedUser : false);
  const [openPopupUpdateTaskStatus, setOpenPopupUpdateTaskStatus] = useState(false);
  const [dataInfo, setDataInfo] = useState(props.task ? props.task.dataInfo.task : null);

  useEffect(() => {
    if (props.task) {
      setDataInfo(props.task.dataInfo.task);
    }
    if (props.milestone) {
      setIsCreatedUser(props.milestone.isCreatedUser);
    }
  })

  useEffect(() => {
    if (props.schedule['attendanceDivision'] && props.schedule['attendanceDivision'] === "1" || props.schedule['attendanceDivision'] === "2") {
      setHadShare(false)
    }
    if (props.schedule['sharers'] && props.schedule['sharers']['employees'] && props.schedule['sharers']['employees'].length > 0) {
      for (let i = 0; i < props.schedule['sharers']['employees'].length; i++) {
        if (props.schedule['employeeLoginId'] && props.schedule['employeeLoginId'] === props.schedule['sharers']['employees'][i]['employeeId']) {
          setHadShare(true)
          break
        }
      }
    }
  }, [props.schedule])


  /**
 * Call function update milestone
 */
  const updateStatusMilestoneToApi = updateFlg => {
    props.updateStatusMilestone(props.milestone.milestoneId, props.milestone.isDone, updateFlg);
    setShowConfirmUpdateStatus(false);
    props.onCloseModal();
  };

  /**
   * Show dialog confirm
   */
  const showDialogConfirmUpdateStatus = () => {
    let isDisplayConfirm = false;
    if (props.milestone && props.milestone.listTask && props.milestone.listTask.length > 0) {
      props.milestone.listTask.forEach(item => {
        if (STATUS_TASK.COMPLETED !== item.status && !props.milestone.isDone) {
          isDisplayConfirm = true;
          return;
        }
      });
    }
    if (!isDisplayConfirm) {
      updateStatusMilestoneToApi(2);
    } else {
      setShowConfirmUpdateStatus(true);
    }
  }


	/**
	 * call api updateTaskStatus
	 * @param updateFlg
	 */
  const onUpdateTaskStatus = (updateFlg) => {
    const { taskId, statusTaskId } = dataInfo;
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_DETAIL_UPDATE_STATUS));
    props.handleUpdateStatusTask(taskId, statusTaskId, updateFlg);
    setOpenPopupUpdateTaskStatus(false);
    props.onCloseModal();
  }



  /**
    * Open popup update status milestone
    */
  const UpdateStatusDialog = () => {
    return (
      <>
        <div className="popup-esr2" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form>
                <div className="popup-esr2-title">{translate('milestone.detail.popup-update-status.title')}</div>
                <div>{translate('milestone.detail.popup-update-status.detail_1')}</div>
                <div>{translate('milestone.detail.popup-update-status.detail_2')}</div>
              </form>
            </div>
            <div className="popup-esr2-footer">
              <a className="button-cancel v2" onClick={() => setShowConfirmUpdateStatus(false)}>
                {translate('milestone.detail.popup-update-status.button-cancel')}
              </a>
              <a className="button-blue v2" onClick={() => updateStatusMilestoneToApi(2)}>
                {translate('milestone.detail.popup-update-status.button-update')}
              </a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show"></div>
      </>
    );
  };

  /**
  *  check update status task/subtask
  * @param taskData
  */
  const onShowUpdateStatusDialog = (taskData) => {
    const { taskId, statusTaskId, parentTaskId, subtasks } = taskData
    if (parentTaskId !== null) {
      props.handleUpdateStatusTask(taskId, statusTaskId, TASK_UPDATE_FLG.MOVE_TO_DONE)
      props.onCloseModal();
    } else {
      if (subtasks === null || subtasks === []) {
        props.handleUpdateStatusTask(taskId, statusTaskId, TASK_UPDATE_FLG.MOVE_TO_DONE)
        props.onCloseModal();
      } else {
        if (subtasks.some(i => (i.statusTaskId === STATUS_TASK.NOT_STARTED || i.statusTaskId === STATUS_TASK.WORKING))) {
          setOpenPopupUpdateTaskStatus(true)
        } else {
          props.handleUpdateStatusTask(taskId, statusTaskId, TASK_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE)
          props.onCloseModal();
        }
      }
    }
  };

  if (props.itemType === ItemTypeSchedule.Schedule) {
    return (
      <div className="popup-esr2-footer">
        <a className={
          props.schedule['isParticipant'] && props.schedule['attendanceDivision'] === "1"
            ? "button-primary button-simple-edit ml-2 mr-2 active"
            : "button-primary button-simple-edit ml-2 mr-2"}
          onClick={() =>
            props.schedule['attendanceDivision'] !== "1"
              ? props.updateScheduleStatusSubSchedule(props.schedule['scheduleId'], AttendanceDivisionType.Available, props.schedule['updatedDate'])
              : null}><i className="far fa-check" /><span className="pl-4">{translate('calendars.modal.attendance')}</span></a>
        <a className={
          props.schedule['isParticipant'] && props.schedule['attendanceDivision'] === "2"
            ? "button-primary button-simple-edit ml-2 mr-2 active"
            : "button-primary button-simple-edit ml-2 mr-2"}
          onClick={() =>
            props.schedule['attendanceDivision'] !== "2"
              ? props.updateScheduleStatusSubSchedule(props.schedule['scheduleId'], AttendanceDivisionType.Absent, props.schedule['updatedDate'])
              : null}><i className="far fa-times" /><span
                className="pl-4">{translate('calendars.modal.absenteeism')}</span></a>
        <a className={
          hadShare
            ? "button-primary button-simple-edit ml-2 mr-2 active"
            : "button-primary button-simple-edit ml-2 mr-2"}
          onClick={() => props.updateScheduleStatusSubSchedule(props.schedule['scheduleId'], AttendanceDivisionType.Share, props.schedule['updatedDate'])}>
          <i className="fas fa-share-alt" /><span
            className="pl-4">{translate('calendars.modal.share')}</span></a>
      </div>

    );
  } else {
    return (
      <div className="popup-esr2-footer">
        {props.itemType === ItemTypeSchedule.Task &&
          dataInfo && dataInfo.isTaskOperator &&
          (dataInfo.statusTaskId === STATUS_TASK.COMPLETED ? (
            <a className="button-blue disable">{translate('tasks.detail.form.button-update')}</a>
          ) : (
              <a onClick={() => onShowUpdateStatusDialog(dataInfo)} className="button-blue">
                {translate('tasks.detail.form.button-update')}
              </a>
            ))}
        {props.itemType === ItemTypeSchedule.Milestone && isCreatedUser &&
          (
            <a onClick={e => (props.milestone && props.milestone.isDone ? e.preventDefault() : showDialogConfirmUpdateStatus())}
              className={props.milestone && props.milestone.isDone ? 'button-blue disable' : 'button-blue'} >
              {translate('milestone.detail.form.button-finish')}
            </a>
          )
        }
        {showConfirmUpdateStatus && <UpdateStatusDialog />}
        {openPopupUpdateTaskStatus &&
          <>
            <div className="popup-esr2 popup-task-body" id="popup-esr2">
              <div className="popup-esr2-content">
                <div className="popup-task-content">
                  <div className="title">{translate("tasks.list.popup.verification")}</div>
                  <div className="text">{translate("tasks.list.popup.youcantsubtasktoincomplete")}</div>
                </div>
                <div className="footer">
                  <a title="" className="button-blue" onClick={() => onUpdateTaskStatus(TASK_UPDATE_FLG.MOVE_TASK_SUBTASK_TO_DONE)}>{translate("global-tool.popup.subtaskalsocomplete")}</a>
                  <a title="" className="button-blue" onClick={() => onUpdateTaskStatus(TASK_UPDATE_FLG.CHANGE_SUBTASK_TO_TASK_MOVE_TASK_TO_DONE)}>{translate("global-tool.popup.convertsubtasktotask")}</a>
                  <a title="" className="button-cancel" onClick={() => setOpenPopupUpdateTaskStatus(false)}>{translate("global-tool.popup.cancel")}</a>
                </div>
              </div>
            </div>
            <div className="modal-backdrop2 show"></div>
          </>
        }
      </div >
    );
  }
}

const mapStateToProps = ({ dataModalSchedule, detailTask, detailMilestone }: IRootState) => ({
  schedule: dataModalSchedule.dataSchedule,
  itemType: dataModalSchedule.itemType,
  task: dataModalSchedule.dataTask,
  milestone: dataModalSchedule.dataMilestone,
  actionTask: detailTask.action,
  actionMilestone: detailMilestone.action
})

const mapDispatchToProps = {
  updateScheduleStatusSubSchedule,
  updateStatusMilestone,
  handleUpdateStatusTask,
  startExecuting,
}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalFooter);


