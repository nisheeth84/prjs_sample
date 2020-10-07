import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Switch, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { handleInitData, getNextSchedule, getPreviousSchedule, onChangeDateShow, handleReloadData } from '../grid/calendar-grid.reducer'
import {
  showModalDetail,
  resetItemId,
  resetItemIdCopyOrEdit,
  FLAG_DELETE,
  hideModalConfirmDelete,
  deleteSchedule,
  resetItemDelete,
  resetMessageTip,
  hideModalSubDetail
} from '../../calendar/modal/calendar-modal.reducer'

import { resetMessageTaskDelete } from '../../tasks/detail/detail-task.reducer'
import { IRootState } from 'app/shared/reducers';
import GridCalendar from './calendar-grid';
import CalendarControlRight from '../control/calendar-control-right';
import CalendarControlTop from '../control/calendar-control-top';
import CalendarControlSiteBar from '../control/calendar-control-sidebar';
import CalendarDetail from '../modal/calendar-detail';
import CalendarDelete from '../modal/calendar-delete';
import { ItemTypeSchedule, ModeAction } from '../constants';
import ModalSubDetailsSchedule from "../modal/subDetailsSchedule/modal-details-schedule"
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';
import { resetMessage, resetDataForm } from '../popups/create-edit-schedule.reducer'

import '../../../../content/css/calendar.css';
import '../style/custom.scss';
import DetailTaskModal from "app/modules/tasks/detail/detail-task-modal";
import DetailMilestoneModal from "app/modules/tasks/milestone/detail/detail-milestone-modal";
import { MILES_ACTION_TYPES } from "app/modules/tasks/milestone/constants";
import ModalCreateEditTask from "app/modules/tasks/create-edit-task/modal-create-edit-task";
import { STATUS_TASK, TASK_DELETE_FLG, TASK_VIEW_MODES } from "app/modules/tasks/constants";
import CreateEditMilestoneModal from "app/modules/tasks/milestone/create-edit/create-edit-milestone-modal";
import ModalConfirmDelete from "app/modules/calendar/common/confirm-popup";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { REQUEST } from "app/shared/reducers/action-type.util";
import { ACTION_TYPES, handleDeleteTask } from "app/modules/tasks/detail/detail-task.reducer";
import { startExecuting } from "app/shared/reducers/action-executing";
import { translate } from "react-jhipster";
import { deleteMilestone } from "app/modules/tasks/milestone/detail/detail-milestone.reducer";
import HelpPopup from 'app/modules/help/help';
import GlobalControlRight from 'app/modules/global/global-tool';
import {reset} from '../../tasks/milestone/detail/detail-milestone.reducer';
import {TaskAction} from '../../tasks/create-edit-task/create-edit-task.reducer';
import {MilestoneAction} from '../../tasks/milestone/create-edit/create-edit-milestone.reducer';
import {TASK_ACTION_TYPES} from '../../tasks/constants';
// import { getTimezone } from 'app/shared/util/date-utils'
import {CATEGORIES_ID} from 'app/modules/help/constant';

type CalendarProps = StateProps & DispatchProps & RouteComponentProps & {
  popout?: boolean
}

/**
 * Component render all components are used in module calendar
 * @param props
 */


const Calendar = (props: CalendarProps) => {
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showMilestoneDetails, setShowMilestoneDetails] = useState(false);
  // const [reRender, setReRender] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showMessageDelete, setShowMessageDelete] = useState(false);
  const [showEditOrCopyMilestone, setShowEditOrCopyMilestone] = useState(false);
  const [milestoneActionType, setMilestoneActionType] = useState();
  const [showEditOrCopyTask, setShowEditOrCopyTask] = useState(false);
  const [taskActionType, setTaskActionType] = useState();
  const [openPopupDeleteTask2, setOpenPopupDeleteTask2] = useState(false);
  const [openPopupDeleteTask3, setOpenPopupDeleteTask3] = useState(false);
  const [processFlg, setProcessFlg] = useState(0);
  const [showDiablogConfirmDelete, setShowDiablogConfirmDelete] = useState(false);
  const [onOpenPopupHelp, setOnOpenPopupHelp] = useState(false);
  const [openCreateSchedule, setOpenCreateSchedule] = useState(false);
  const [messageNotify, setMessageNotify] = useState('')
  const [showMessageTaskDelete, setShowMessageTaskDelete] = useState(false);
  const [showMessageMilestone, setShowMessageMilestone] = useState(false);

  // moment.tz.setDefault(getTimezone());

  useEffect(() => {
    if (props.showTypeDetails === ItemTypeSchedule.Task) {
      setShowTaskDetails(true);
    } else if (props.showTypeDetails === ItemTypeSchedule.Milestone) {
      setShowMilestoneDetails(true);
    }
  }, [props.itemId]);

  useEffect(() => {
    if (props.typeItemCopyOrEdit === ItemTypeSchedule.Task) {
      setShowEditOrCopyTask(true);
      setTaskActionType(props.actionType)
    } else if (props.typeItemCopyOrEdit === ItemTypeSchedule.Milestone) {
      setShowEditOrCopyMilestone(true);
      setMilestoneActionType(props.actionType)
    }
  }, [props.itemCopyOrEditId]);

  useEffect(() => {
    setOpenCreateSchedule(props.isShowPopupCreate)
  }, [props.isShowPopupCreate])

  useEffect(() => {
    if (props.currentLocale) 
      props.handleReloadData()
  }, [props.currentLocale])

  /**
   * call api deleteTasks
   * @param updateFlg
   */
  const onDeleteTask = (updateFlg) => {
    const { taskId } = props.itemDelete.task
    const taskIds = { taskId }
    props.startExecuting(REQUEST(ACTION_TYPES.TASK_DETAIL_DELETE));
    props.handleDeleteTask(taskIds, updateFlg);
    props.resetItemDelete();
    setOpenPopupDeleteTask2(false);
    setOpenPopupDeleteTask3(false);
    props.hideModalSubDetail()
  }

  /**
   *  check delete task/subtask
   * @param taskData
   */
  useEffect(() => {
    if (props.itemTypeDelete === ItemTypeSchedule.Task) {
      const parentTaskId = props.itemDelete.task.parentTaskId;
      const subtasks = props.itemDelete.task.subtasks
      if (parentTaskId !== null) {
        setProcessFlg(TASK_DELETE_FLG.DELETE_TASK)
        setOpenPopupDeleteTask2(true)
      } else {
        if (subtasks === null || subtasks === []) {
          setProcessFlg(TASK_DELETE_FLG.DELETE_TASK)
          setOpenPopupDeleteTask2(true)
        } else {
          if (subtasks.some(i => (i.statusTaskId === STATUS_TASK.NOT_STARTED || i.statusTaskId === STATUS_TASK.WORKING))) {
            setOpenPopupDeleteTask3(true)
          } else {
            setProcessFlg(TASK_DELETE_FLG.DELETE_TASK_SUBTASK)
            setOpenPopupDeleteTask2(true)
          }
        }
      }
    } else if (props.itemTypeDelete === ItemTypeSchedule.Milestone) {
      setShowDiablogConfirmDelete(true);
    }
  }, [props.itemTypeDelete])


  useEffect(() => {
    if (props.errorMessage || props.successMessage)
      setShowMessage(true)
  }, [props.errorMessage, props.successMessage])

  const displayMessage = () => {
    setTimeout(() => {
      setShowMessage(false)
      props.resetMessage()
    }, 5000)
    if ((!props.errorMessage || props.errorMessage.length <= 0) && (!props.successMessage || props.successMessage.length <= 0)) {
      return (<></>)
    }
    return showMessage && (
      <div className="box-message-in-calendar">
        <BoxMessage
          className="max-width-720 m-auto"
          messageType={props.errorMessage && props.errorMessage.length > 0 ? MessageType.Error : MessageType.Success}
          message={props.errorMessage && props.errorMessage.length > 0 ? props.errorMessage : props.successMessage}
        />
      </div>
    )

  }

  useEffect(() => {
    if (props.actionTaskCreateUpdate === TaskAction.CreateTaskSuccess || props.actionTaskCreateUpdate === TaskAction.UpdateTaskSuccess) {
      props.onChangeDateShow(props.dateShow, 0, props.typeShowGrid);
      props.hideModalSubDetail();
    }
  }, [props.actionTaskCreateUpdate])

  useEffect(() => {
    if (props.actionMilestoneCreateUpdate === MilestoneAction.UpdateSucess || props.actionMilestoneCreateUpdate === MilestoneAction.CreateSucess) {
      props.onChangeDateShow(props.dateShow, 0, props.typeShowGrid);
      props.hideModalSubDetail();
    }
  }, [props.actionMilestoneCreateUpdate])

  useEffect(() => {
    if (props.suscessMessage && props.suscessMessage.length > 0) {
      setShowMessageDelete(true);
      setMessageNotify(props.suscessMessage)
    }
  }, [props.suscessMessage])

  const displayMessageDelete = () => {
    if (!messageNotify || messageNotify.length <= 0) {
      return <></>;
    }
    if (showMessageDelete) {
      setTimeout(() => {
        setShowMessageDelete(false)
        props.resetMessageTip()
      }, 3000)
    }
    return showMessageDelete && (
      <div className="box-message-in-calendar">
        <BoxMessage
          className="max-width-720 m-auto"
          messageType={MessageType.Success}
          message={messageNotify}
        />
      </div>
    )
  }

  useEffect(() => {
    if (props.successMessageDeleteTask && props.successMessageDeleteTask.length > 0) {
      setShowMessageTaskDelete(true);
      setMessageNotify(translate(`messages.${props.successMessageDeleteTask}`))
      setTimeout(() => {
        props.onChangeDateShow(props.dateShow, 0, props.typeShowGrid);
      }, 1000)
    }
  }, [props.successMessageDeleteTask])

  useEffect(() => {
    if (props.successMessageOfMilestone && props.successMessageOfMilestone.length > 0) {
      setShowMessageMilestone(true);
      setMessageNotify(translate(`messages.${props.successMessageOfMilestone}`))
      setTimeout(() => {
        props.onChangeDateShow(props.dateShow, 0, props.typeShowGrid);
      }, 1000)
    }
  }, [props.successMessageOfMilestone])

  const displayMessageDeleteTask = () => {
    if (!messageNotify || messageNotify.length <= 0) {
      return <></>;
    }
    if (showMessageTaskDelete) {
      setTimeout(() => {
        setShowMessageTaskDelete(false)
        props.resetMessageTaskDelete()
      }, 3000)
    }
    return showMessageTaskDelete && (
      <div className="box-message-in-calendar">
        <BoxMessage
          className="max-width-720 m-auto"
          messageType={MessageType.Success}
          message={messageNotify}
        />
      </div>
    )
  }

  /**
   * display Message Milestone
   */
  const displayMessageMilestone = () => {
    if (!messageNotify || messageNotify.length <= 0) {
      return <></>;
    }
    if (showMessageMilestone) {
      setTimeout(() => {
        props.resetActionMilestone();
        setShowMessageMilestone(false)
      }, 3000)
    }
    return showMessageMilestone && (
      <div className="box-message-in-calendar">
        <BoxMessage
          className="max-width-720 m-auto"
          messageType={MessageType.Success}
          message={messageNotify}
        />
      </div>
    )
  }

  /**
   * reset data close modal milestone details
   */
  useEffect(() => {
    if (!showMilestoneDetails) {
      props.resetItemId();
    }
  }, [showMilestoneDetails]);
  /**
   * reset data close modal task details
   */
  useEffect(() => {
    if (!showTaskDetails) {
      props.resetItemId();
    }
  }, [showTaskDetails]);

  /**
   * reset data close modal copy or edit milestone
   */
  useEffect(() => {
    if (!showEditOrCopyMilestone) {
      props.resetItemIdCopyOrEdit();
    }
  }, [showEditOrCopyMilestone]);
  /**
   * reset data close modal copy or edit task
   */
  useEffect(() => {
    if (!showEditOrCopyTask) {
      props.resetItemIdCopyOrEdit();
    }
  }, [showEditOrCopyTask]);


  /**
   * check render modal task detail
   */
  const renderModalTaskDetail = () => {
    if (showTaskDetails) {
      return <DetailTaskModal
        taskId={props.itemId}
        toggleCloseModalTaskDetail={setShowTaskDetails} />
    }
  }

  /**
   * check and render modal milestone detail
   */
  const renderModalMilestoneDetail = () => {
    if (showMilestoneDetails) {
      return <DetailMilestoneModal
        milestoneId={props.itemId}
        toggleCloseModalMilesDetail={setShowMilestoneDetails}
        milesActionType={MILES_ACTION_TYPES.UPDATE}
      />
    }
  }

  /**
   * close modal edit or copy task
   */
  const closeModalEditOrCopyTask = () => {
    setShowEditOrCopyTask(false);
  }

  /**
   * close modal edit or copy milestone
   */
  const closeModalEditOrCopyMilestone = () => {
    document.body.className = '';
    document.body.className = 'wrap-calendar';
    setShowEditOrCopyMilestone(false);
  }



  const nextShowItem = (idCurrent: number, itemType: ItemTypeSchedule, isActive?: boolean) => {
    const item = props.getNextSchedule(idCurrent, itemType)
    if (!isActive) {
      return item;
    } else {
      if (item) {
        switch (item["itemType"]) {
          case ItemTypeSchedule.Milestone:
          case ItemTypeSchedule.Task:
            return item
          case ItemTypeSchedule.Schedule:
            props.showModalDetail(item["itemId"])
            return item
          default:
            return {}
        }
      }
    }
  }
  const prevShowItem = (idCurrent: number, itemType: ItemTypeSchedule, isActive?: boolean) => {
    const item = props.getPreviousSchedule(idCurrent, itemType)
    if (!isActive) {
      return item;
    } else {
      if (item) {
        switch (item["itemType"]) {
          case ItemTypeSchedule.Milestone:
          case ItemTypeSchedule.Task:
            return item
          case ItemTypeSchedule.Schedule:
            props.showModalDetail(item["itemId"])
            return item
          default:
            return
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

  /**
   * Call api to initialize data
   */
  useEffect(() => {
    // if (!props.popout) {
    props.handleInitData();
    // }
  }, []);

  const renderModalDetail = () => {
    if (props.modalDetail) {
      return (
        <CalendarDetail nextSchedule={nextShowItem} prevSchedule={prevShowItem} />
      );
    }
  }

  const renderModalSubDetail = () => {
    if (props.modalSubDetail) {
      return (
        <ModalSubDetailsSchedule />
      );
    }
  }

  const renderModalDelete = () => {
    if (props.modalDelete) {
      return (
        <CalendarDelete />
      );
    }
  }

  /**
   * Call function delete milestone
   */
  const deleteMilestoneToApi = () => {
    props.deleteMilestone(props.itemDelete.milestoneId);
    props.resetItemDelete();
    props.hideModalSubDetail();
    setShowDiablogConfirmDelete(false);
  };

  /**
   * Open popup delete milestone
   */
  const DialogDeleteMilestone = () => {
    return (
      <>
        <Helmet>
          <body className="wrap-calendar" />
        </Helmet>
        <div className="popup-esr2 popup-task-body" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-task-content">
              <div className="title">{translate('milestone.detail.popup-delete.title')}</div>
              <div className="text">{translate('milestone.detail.popup-delete.detail')}</div>
            </div>
            <div className="footer">
              <a title="" className="button-red" onClick={() => deleteMilestoneToApi()}>
                {translate('milestone.detail.popup-delete.button-delete')}
              </a>
              <a title="" className="button-cancel" onClick={() => { setShowDiablogConfirmDelete(false); props.resetItemDelete() }}>{translate('milestone.detail.popup-delete.button-cancel')}
              </a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show"></div>
      </>
    );
  };

  const renderConfirm = () => {
    const obj = {
      name: props.dataSchedule['scheduleName'],
      startDate: props.dataSchedule['startDate'],
      finishDate: props.dataSchedule['finishDate'],
      mode: ModeAction.Delete
    };

    return props.modalConfirmDelete &&
      <ModalConfirmDelete
        infoObj={obj}
        callbackCancel={props.hideModalConfirmDelete}
        callbackOk={() => {
          props.dataSchedule['isRepeated']
            ? props.deleteSchedule(props.dataSchedule['scheduleId'], props.flagDelete)
            : props.deleteSchedule(props.dataSchedule['scheduleId'], FLAG_DELETE.CURRENT);
        }} />
  }

  return <>
    {
      (!props.popout) ? (
        <>
          <div className='control-esr'>
            <CalendarControlTop toggleOpenHelpPopup={handleOpenPopupHelp} toggleOpenCreateSchedulePopup={() => { setOpenCreateSchedule(true) }} />
            <div className="wrap-control-esr style-3">
              <div className="esr-content">
                <CalendarControlSiteBar />
                {displayMessage()}
                <GridCalendar
                  classNameOfMonth = {'calendar-month-grid'}
                />
                {openPopupDeleteTask2 &&
                  <>
                    <Helmet>
                      <body className="wrap-calendar" />
                    </Helmet>
                    <div className="popup-esr2 popup-task-body" id="popup-esr2">
                      <div className="popup-esr2-content">
                        <div className="popup-task-content">
                          <div className="title">{translate("global-tool.popup.delete")}</div>
                          <div className="text">{translate("global-tool.popup.areyousuredelete")}</div>
                        </div>
                        <div className="footer">
                          <a title="" className="button-red" onClick={() => onDeleteTask(processFlg)}>{translate("global-tool.popup.delete")}</a>
                          <a title="" className="button-cancel" onClick={() => { setOpenPopupDeleteTask2(false); props.resetItemDelete() }}>{translate("global-tool.popup.cancel")}</a>
                        </div>
                      </div>
                    </div>
                    <div className="modal-backdrop2 show"></div>
                  </>
                }
                {openPopupDeleteTask3 &&
                  <>
                    <Helmet>
                      <body className="wrap-calendar" />
                    </Helmet>
                    <div className="popup-esr2 popup-task-body" id="popup-esr2">
                      <div className="popup-esr2-content">
                        <div className="popup-task-content">
                          <div className="title">{translate("global-tool.popup.confirm")}</div>
                          <div className="text">{translate("global-tool.popup.taskdeletecontainsubtask")}</div>
                        </div>
                        <div className="footer">
                          <a title="" className="button-blue" onClick={() => onDeleteTask(TASK_DELETE_FLG.DELETE_TASK_SUBTASK)}>{translate("global-tool.popup.deletesubtask")}</a>
                          <a title="" className="button-blue" onClick={() => onDeleteTask(TASK_DELETE_FLG.DELETE_TASK_CONVERT_SUBTASK)}>{translate("tasks.detail.form.text-delete-3")}</a>
                          <a title="" className="button-cancel" onClick={() => { setOpenPopupDeleteTask3(false); props.resetItemDelete() }}>{translate("global-tool.popup.cancel")}</a>
                        </div>
                      </div>
                    </div>
                    <div className="modal-backdrop2 show"></div>
                  </>
                }
                {displayMessageDelete()}
                {displayMessageDeleteTask()}
                {displayMessageMilestone()}
              </div>
            </div>
            <GlobalControlRight />
          </div>
          {renderModalDetail()}
          {renderModalDelete()}
          {renderModalSubDetail()}
          {renderModalTaskDetail()}
          {renderModalMilestoneDetail()}
          {renderConfirm()}
          {showDiablogConfirmDelete && <DialogDeleteMilestone />}
          {showEditOrCopyTask && <ModalCreateEditTask
            taskId={props.itemCopyOrEditId}
            toggleCloseModalTask={closeModalEditOrCopyTask}
            taskActionType={TASK_ACTION_TYPES.UPDATE}
            taskViewMode={TASK_VIEW_MODES.EDITABLE}
            modeCopy={(taskActionType === TASK_ACTION_TYPES.CREATE)}
          />}
          {showEditOrCopyMilestone && <CreateEditMilestoneModal
            milesId={props.itemCopyOrEditId}
            toggleCloseModalMiles={closeModalEditOrCopyMilestone}
            milesActionType={milestoneActionType}
          />}
        </>
      ) : <></>
    }
    {openCreateSchedule && <CreateEditSchedule onClosePopup={() => { setOpenCreateSchedule(false) }} />}
    {onOpenPopupHelp && <HelpPopup currentCategoryId={CATEGORIES_ID.calendar} dismissDialog={dismissDialogHelp} />}
  </>;
}

const mapStateToProps = ({ dataCalendarGrid, dataCreateEditSchedule, dataModalSchedule, applicationProfile, detailTask, detailMilestone, milestone, taskInfo, locale }: IRootState) => ({
  modalDetail: dataModalSchedule.modalDetailCalendar,
  modalDelete: dataModalSchedule.modalDeleteCalendar,
  modalSubDetail: dataModalSchedule.modalSubDetailCalendar,
  itemId: dataModalSchedule.itemShowId,
  showTypeDetails: dataModalSchedule.showDetails,
  itemCopyOrEditId: dataModalSchedule.itemCopyOrEditId,
  typeItemCopyOrEdit: dataModalSchedule.typeItemCopyOrEdit,
  actionType: dataModalSchedule.actionType,
  modalConfirmDelete: dataModalSchedule.modalConfirmDelete,
  flagDelete: dataModalSchedule.flagDelete,
  dataSchedule: dataModalSchedule.dataSchedule,
  errorMessage: dataCreateEditSchedule.errorMessage,
  successMessage: dataCreateEditSchedule.successMessage,
  errorItems: dataCreateEditSchedule.errorItems,
  dataTask: dataModalSchedule.dataTask,
  itemTypeDelete: dataModalSchedule.itemTypeDelete,
  itemDelete: dataModalSchedule.itemDelete,
  tenant: applicationProfile.tenant,
  suscessMessage: dataModalSchedule.suscessMessage,
  successMessageDeleteTask: detailTask.successMessage,
  successMessageOfMilestone: detailMilestone.successMessage,
  isShowPopupCreate: dataCreateEditSchedule.onShowCreate,
  dateShow: dataCalendarGrid.dateShow,
  typeShowGrid: dataCalendarGrid.typeShowGrid,
  actionTaskCreateUpdate: taskInfo.action,
  actionMilestoneCreateUpdate: milestone.action,
  currentLocale: locale.currentLocale
});

const mapDispatchToProps = {
  handleInitData,
  getNextSchedule,
  getPreviousSchedule,
  showModalDetail,
  resetItemId,
  resetItemIdCopyOrEdit,
  hideModalConfirmDelete,
  deleteSchedule,
  resetMessage,
  startExecuting,
  handleDeleteTask,
  deleteMilestone,
  resetItemDelete,
  resetMessageTip,
  resetMessageTaskDelete,
  hideModalSubDetail,
  resetDataForm,
  onChangeDateShow,
  resetActionMilestone: reset,
  handleReloadData
};


type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Calendar);
