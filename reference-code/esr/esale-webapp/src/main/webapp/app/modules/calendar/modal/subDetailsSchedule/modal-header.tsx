import React, { useState } from 'react';
import { connect } from "react-redux";
import {
  hideModalSubDetail,
  showModalDelete,
  setItemIdCopyOrEdit,
  ACTION_TYPE, showModalConfirmDelete,
} from "app/modules/calendar/modal/calendar-modal.reducer";
import { MODAL_CALENDAR, ItemTypeSchedule, LICENSE_IN_CALENDAR } from "app/modules/calendar/constants";
import { IRootState } from "app/shared/reducers";
import { translate } from "react-jhipster";
import { setPreScheduleData, onSetScheduleIdForEdit, onShowPopupCreate } from "app/modules/calendar/popups/create-edit-schedule.reducer";

import { Link } from "react-router-dom";
import { TASK_ACTION_TYPES, TASK_DELETE_FLG, STATUS_TASK } from "app/modules/tasks/constants";
import { MILES_ACTION_TYPES } from "app/modules/tasks/milestone/constants";
import { setItemDelete } from "app/modules/calendar/modal/calendar-modal.reducer";
import { startExecuting } from 'app/shared/reducers/action-executing';
import { REQUEST } from 'app/shared/reducers/action-type.util';
import {
  handleDeleteTask,
  ACTION_TYPES,
} from 'app/modules/tasks/detail/detail-task.reducer';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import { ACTIVITY_ACTION_TYPES, ACTIVITY_VIEW_MODES } from 'app/modules/activity/constants';

/**
 * interface component minimal calendar modal header
 */
type ICalendarModalHeaderProps = StateProps & DispatchProps & {
  setPreScheduleData?: (dataSchedule) => void;
  service?: {
    businessCards?: boolean,
    activities?: boolean,
    customer?: boolean,
    customerSales?: boolean,
  }
  onCloseModalHeader?: () => void;
}

/**
 * component minimal header
 * @param props
 * @constructor
 */
const ModalHeader = (props: ICalendarModalHeaderProps) => {
  const [dataInfo,] = useState(props.dataTask ? props.dataTask.dataInfo.task : null);
  const [processFlg, setprocessFlg] = useState(null);
  const [openPopupDeleteTask2, setOpenPopupDeleteTask2] = useState(false);
  const [openPopupDeleteTask3, setOpenPopupDeleteTask3] = useState(false);

  const [showModalActivity, setShowModalActivity] = useState(false);

  /**
   * set data Edit milestone, task, schedule
   */
  const pathEdit = () => {
    switch (props.itemType) {
      case ItemTypeSchedule.Milestone: {
        props.setItemIdCopyOrEdit(props.itemId, ItemTypeSchedule.Milestone, MILES_ACTION_TYPES.UPDATE)
        break;
      }
      case ItemTypeSchedule.Task: {
        props.setItemIdCopyOrEdit(props.itemId, ItemTypeSchedule.Task, TASK_ACTION_TYPES.UPDATE)
        break;
      }
      case ItemTypeSchedule.Schedule: {
        break;
      }
      default:
        return ''
    }
  }

  const onClickOpenModalFormActivity = () => {
    if (!showModalActivity) {
      setShowModalActivity(true);
    }
  }
  /**
   * set data copy milestone, task, schedule
   */
  const opModalCopy = () => {
    switch (props.itemType) {
      case ItemTypeSchedule.Milestone: {
        props.setItemIdCopyOrEdit(props.itemId, ItemTypeSchedule.Milestone, MILES_ACTION_TYPES.CREATE)
        break;
      }
      case ItemTypeSchedule.Task: {
        props.setItemIdCopyOrEdit(props.itemId, ItemTypeSchedule.Task, TASK_ACTION_TYPES.CREATE)
        break;
      }
      case ItemTypeSchedule.Schedule: {
        break;
      }
      default:
        return ''
    }
  }

  /**
	 *  check delete task/subtask
	 * @param taskData
	 */
  // const onShowDeleteDialog = (taskData) => {
  //   const { parentTaskId, subtasks } = taskData
  //   if (parentTaskId !== null) {
  //     setprocessFlg(TASK_DELETE_FLG.DELETE_TASK)
  //     setOpenPopupDeleteTask2(true)
  //   } else {
  //     if (subtasks === null || subtasks === []) {
  //       setprocessFlg(TASK_DELETE_FLG.DELETE_TASK)
  //       setOpenPopupDeleteTask2(true)
  //     } else {
  //       if (subtasks.some(i => (i.statusTaskId === STATUS_TASK.NOT_STARTED || i.statusTaskId === STATUS_TASK.WORKING))) {
  //         setOpenPopupDeleteTask3(true)
  //       } else {
  //         setprocessFlg(TASK_DELETE_FLG.DELETE_TASK_SUBTASK)
  //         setOpenPopupDeleteTask2(true)
  //       }
  //     }
  //   }
  // };

  /**
  * call api deleteTasks
  * @param updateFlg
  */
  const onDeleteTask = (updateFlg) => {
    const { taskId } = dataInfo
    const taskIds = { taskId }
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_DETAIL_DELETE));
    props.handleDeleteTask(taskIds, updateFlg);
    setOpenPopupDeleteTask2(false);
    setOpenPopupDeleteTask3(false);
    props.onCloseModalHeader();
  }

  const onClosePopupActivityDetail = () => {
    setShowModalActivity(false)
    document.body.className = 'wrap-calendar';
  }

  return (
    <>
      <div className="modal-header">
        <div className="popup-esr2-header">
          {props.itemType === ItemTypeSchedule.Schedule &&
            <a title='' className='icon-small-primary icon-copy-small'
              onClick={() => { props.onShowPopupCreate(true); setTimeout(() => props.setPreScheduleData(props.dataSchedule), 1000) }}
            />}
          {props.itemType !== ItemTypeSchedule.Schedule &&
            <a className="icon-small-primary icon-copy-small" onClick={() => opModalCopy()} />}
          {props.itemType !== ItemTypeSchedule.Schedule &&
            <a className="icon-small-primary icon-edit-small" onClick={() => pathEdit()} />
          }
          {
            props.itemType === ItemTypeSchedule.Schedule && props.dataSchedule['canModify'] === MODAL_CALENDAR.CAN_MODIFY &&
            <a title='' className='icon-small-primary icon-edit-small'
              onClick={() => { props.onShowPopupCreate(true); props.onSetScheduleIdForEdit(props.itemId) }}
            />
          }
          {props.itemType === ItemTypeSchedule.Schedule && props.dataSchedule['canModify'] === MODAL_CALENDAR.CAN_MODIFY &&
            <a className="icon-small-primary icon-erase-small"
              // onClick={() => onShowDeleteDialog(dataInfo)} />
              onClick={() => props.dataSchedule['isRepeated'] ? props.showModalDelete() : props.showModalConfirmDelete()} />
          }
          {props.itemType === ItemTypeSchedule.Milestone &&
            <a className="icon-small-primary icon-erase-small"
              onClick={() => props.setItemDelete(props.dataMilestone, ItemTypeSchedule.Milestone)} />
          }
          {props.itemType === ItemTypeSchedule.Task &&
            <a className="icon-small-primary icon-erase-small"
              onClick={() =>
                props.setItemDelete(props.dataTask.dataInfo, ItemTypeSchedule.Task)
              } />
          }
          {Array.isArray(props.listLicense) && props.listLicense.includes(LICENSE_IN_CALENDAR.ACTIVITY_LICENSE) && props.itemType !== ItemTypeSchedule.Milestone &&
            <a
              className="button-primary button-activity-registration"
              onClick={() => onClickOpenModalFormActivity()}>{translate('calendars.modal.activityRegistration')}</a>
          }
          <a className="icon-small-primary icon-close-up-small" onClick={props.hideModalSubDetail} />
          {openPopupDeleteTask2 &&
            <>
              <div className="popup-esr2 popup-task-body" id="popup-esr2">
                <div className="popup-esr2-content">
                  <div className="popup-task-content">
                    <div className="title">{translate("global-tool.popup.delete")}</div>
                    <div className="text">{translate("global-tool.popup.areyousuredelete")}</div>
                  </div>
                  <div className="footer">
                    <a title="" className="button-red" onClick={() => onDeleteTask(processFlg)}>{translate("global-tool.popup.delete")}</a>
                    <a title="" className="button-cancel" onClick={() => setOpenPopupDeleteTask2(false)}>{translate("global-tool.popup.cancel")}</a>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop2 show"></div>
            </>
          }
          {openPopupDeleteTask3 &&
            <>
              <div className="popup-esr2 popup-task-body" id="popup-esr2">
                <div className="popup-esr2-content">
                  <div className="popup-task-content">
                    <div className="title">{translate("global-tool.popup.confirm")}</div>
                    <div className="text">{translate("global-tool.popup.taskdeletecontainsubtask")}</div>
                  </div>
                  <div className="footer">
                    <a title="" className="button-blue" onClick={() => onDeleteTask(TASK_DELETE_FLG.DELETE_TASK_SUBTASK)}>{translate("global-tool.popup.deletesubtask")}</a>
                    <a title="" className="button-blue" onClick={() => onDeleteTask(TASK_DELETE_FLG.DELETE_TASK_CONVERT_SUBTASK)}>{translate("tasks.detail.form.text-delete-3")}</a>
                    <a title="" className="button-cancel" onClick={() => setOpenPopupDeleteTask3(false)}>{translate("global-tool.popup.cancel")}</a>
                  </div>
                </div>
              </div>
              <div className="modal-backdrop2 show"></div>
            </>
          }
        </div>
        {showModalActivity &&
          <ActivityModalForm popout={false}
            activityActionType={ACTIVITY_ACTION_TYPES.CREATE}
            activityViewMode={ACTIVITY_VIEW_MODES.EDITABLE}
            taskId={props.dataTask?.dataInfo?.task?.taskId}
            onCloseModalActivity={onClosePopupActivityDetail}
            isOpenFromAnotherModule={true}
          />
        }
      </div>
    </>
  );
}

const mapStateToProps = ({ dataModalSchedule, authentication }: IRootState) => ({
  service: dataModalSchedule.service,
  dataSchedule: dataModalSchedule.dataSchedule,
  itemType: dataModalSchedule.itemType,
  itemId: dataModalSchedule.itemId,
  dataMilestone: dataModalSchedule.dataMilestone,
  dataTask: dataModalSchedule.dataTask,
  listLicense: authentication.account.licenses
});

const mapDispatchToProps = {
  hideModalSubDetail,
  showModalDelete,
  setPreScheduleData,
  setItemIdCopyOrEdit,
  showModalConfirmDelete,
  setItemDelete,
  startExecuting,
  handleDeleteTask,
  onSetScheduleIdForEdit,
  onShowPopupCreate
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalHeader);
