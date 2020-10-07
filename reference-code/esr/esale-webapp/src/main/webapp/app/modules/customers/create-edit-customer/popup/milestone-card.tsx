import React, { useState, useEffect, useRef } from 'react';
import { translate, Storage } from 'react-jhipster';
import { connect } from 'react-redux';
import { handleGetScenario } from '../create-edit-customer.reducer';
import _ from 'lodash';
import { useId } from "react-id-generator";
import { MILESTONE_STATUS, TYPE_CHILD_SCENARIO } from '../../constants';
import TaskCard from './task-card';
import EditableCell from './editable-cell';
import dateFnsFormat from 'date-fns/format';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import CreateEditMilestoneModal from 'app/modules/tasks/milestone/create-edit/create-edit-milestone-modal';
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import DatePicker from 'app/shared/layout/common/date-picker';
import * as R from 'ramda';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, APP_DATE_FORMAT_ES } from 'app/config/constants';
import GetListUser from './handleGetCard';
import { convertDateTimeToTz } from 'app/shared/util/date-utils';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import DetailMilestoneModal from "app/modules/tasks/milestone/detail/detail-milestone-modal";
import DetailTaskModal from "app/modules/tasks/detail/detail-task-modal";

export interface IMilestoneCardProps extends StateProps, DispatchProps {
  status: any;
  milestone: any;
  onClickOpenModalCreateEditTask?: (actionType, taskId?) => void;
  deleteMilestone: (milestoneId) => void;
  createTask?: any;
  milestoneIndex?: any;
  onDeleteItem?: any
  onUpdate?: any
  onEditTask?: any
  customerId?: number
  viewOnly?: boolean
  errorItems?: any
  fromActivity?: boolean
}

/**
 * A milestone card is inside milestone list on screen
 * @param props
 */
const MilestoneCard = (props: IMilestoneCardProps) => {
  const { status, milestone } = props;
  const [showMemo, setShowMemo] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneName, setMilestoneName] = useState(milestone.milestoneName);
  const [memo, setMemo] = useState(null);
  const [statusMilestoneId, setStatusMilestoneId] = useState(status);
  const [finishDate, setFinishDate] = useState(milestone.finishDate ? new Date(milestone.finishDate) : null);
  const [showModalCreateEditTask, setShowModalCreateEditTask] = useState(false);
  const [, setEditing] = useState(false);
  const [showDiablogConfirmDelete, setShowDiablogConfirmDelete] = useState(false); // Open popup confirm delete milestone
  const [openModalEditMilestone, setOpenModalEditMilestone] = useState(false);
  const [dataModalTask,] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE });
  const [closeInput, setCloseInput] = useState(false);
  const [deleteTypeTask, setDeleteType] = useState(TYPE_CHILD_SCENARIO.MILESTONE);
  const [deleteTaskIndex, setDeleteTaskIndex] = useState(null);
  const [numberTask, setNumberTask] = useState(0);
  const [showEdit, setShowEdit] = useState(true);
  const [msgError, setMsgError] = useState(null);
  const [msgErrorName, setMsgErrorName] = useState(null);
  const [errorTasks, setErrorTasks] = useState([]);
  const [classForStatusDelay, setClassForStatusDelay] = useState(null);
  const [showOpenDetailEmployee, setShowOpenDetailEmployee] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [showMilestoneDetails, setShowMilestoneDetails] =  useState(false);
  const [showOpenDetailTask, setShowOpenDetailTask] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState(null)
  const userFormatDate = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  const employeeDetailCtrlId = useId(1, "milestoneEmployeeDetail_")

  const wrapperRef = useRef(null);
  const createTaskRef = useRef(null);

  const getNumberTask = (listTasks) => {
    let numberT = 0;
    listTasks && listTasks.map(item => {
      if (item && !item.flagDelete && item.statusTaskId !== 3) {
        numberT += 1;
      }
    });
    return numberT
  }

  useEffect(() => {
    if(props.viewOnly){
      setShowMilestone(true);
      setShowMemo(true);
    }
  }, []);

  useEffect(() => {
    if(showOpenDetailTask || showMilestoneDetails){
      document.body.className = 'wrap-task modal-open';
    }
    if(!showOpenDetailTask && !showMilestoneDetails){
      document.body.className = props.fromActivity ? 'wrap-activity wrap-customer modal-open': 'wrap-customer modal-open';
    }
  }, [showMilestoneDetails, showOpenDetailTask])

  useEffect(() => {
    setNumberTask(getNumberTask(milestone.tasks))
  }, [milestone.tasks])

  useEffect(() => {
    if (props.milestone) {
      setMilestoneName(milestone.milestoneName);
      setFinishDate(milestone.finishDate ? new Date(milestone.finishDate) : null);
      setMemo(milestone.memo);
    }
  }, [props.milestone]);

  useEffect(() => {
    if (finishDate && milestone.statusMilestoneId !== MILESTONE_STATUS.DONE && convertDateTimeToTz(finishDate) < convertDateTimeToTz(new Date())) {
      setClassForStatusDelay('color-red');
    } else {
      setClassForStatusDelay('');
    }
  }, [finishDate, statusMilestoneId])

  useEffect(() => {
    const errorItems = props.errorItems;
    let msg = '';
    let itemName = '';
    const errorTask = [];
    errorItems && errorItems.map(item => {
      if (item && !_.isNil(item.row_id_remake)) {
        if (item.row_id_remake.toString() === props.milestoneIndex.toString()) {
          msg = translate(`messages.${item.errorCode}`);
          itemName = item.item || item.errorParams
        }
        if (item.row_id_remake.toString().indexOf('_') !== -1) {
          if (item.row_id_remake.toString().split('_')[0] === props.milestoneIndex.toString()) {
            setShowMilestone(true);
            errorTask.push({itemName: item.item, errorCode: item.errorCode, taskId: item.row_id_remake.toString().split('_')[1]})
          }
        }
      }
    })
    setMsgError(msg);
    setMsgErrorName(itemName);
    setErrorTasks(errorTask);
  }, [props.errorItems])

  useEffect(() => { setStatusMilestoneId(status) }, [status])

  /**
   * Get state icon depending on milestone status
   */
  const getMilestoneIcon = () => {
    if (milestone.statusMilestoneId === MILESTONE_STATUS.DONE) {
      return <img src="../../../content/images/customer/ic-checked-flag.svg" />;
    } else if (milestone && milestone.finishDate && convertDateTimeToTz(milestone.finishDate) < convertDateTimeToTz(new Date())) {
      return <img src="../../../content/images/customer/ic-flag-red.svg" />;
    } else {
      return <img src="../../../content/images/customer/ic-flag-green.svg" />;
    }
  };

  const handleUpdateTask = (value, index) => {
    props && props.onUpdate(TYPE_CHILD_SCENARIO.TASK, value, props.milestoneIndex, index)
  }

  const lang = Storage.session.get('locale', 'ja_jp');

  /**
   * method format date
   */
  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };

  const getDateTZ = (date) => {
    if (date) {
      const dateF = `${formatDate(date, APP_DATE_FORMAT_ES, lang)}`;
      const dateFormat = new Date(dateF);
      dateFormat.setUTCHours(0, 0, 0, 0);
      const myDate = dateFormat.toISOString();
      return myDate;
    }
    return null
  }

  const handleChangeInputMilestone = (date?: any) => {
    let dateTZ = getDateTZ(date || finishDate);
    if (date === null) {
      dateTZ = null;
    }
    const dataUpdate = { milestoneName, finishDate: dateTZ, statusMilestoneId, memo }
    setShowEdit(false);
    props && props.onUpdate(TYPE_CHILD_SCENARIO.MILESTONE, dataUpdate, props.milestoneIndex, null)
  }

  const handleChangeStatusMileston = () => {
    let statusMilestoneIdTmp = 0;
    if (statusMilestoneId === 0 || !statusMilestoneId) {
      statusMilestoneIdTmp = 1;
    }
    const dataUpdateStatus = { milestoneName, finishDate: getDateTZ(finishDate), statusMilestoneId: statusMilestoneIdTmp }
    setShowEdit(false);
    props && props.onUpdate(TYPE_CHILD_SCENARIO.MILESTONE, dataUpdateStatus, props.milestoneIndex, null)
  }

  const handleShowDetailMilestone = (value) => {
    setShowMilestoneDetails(value);
  }

  const renderMilestoneName = () => {
    if (props.viewOnly) {
      return <a className="d-inline-block align-middle" onClick={() => handleShowDetailMilestone(true)}>
        <span className="w-100 text-ellipsis text-blue">{milestoneName}</span>
      </a>
    }
    return (
      <EditableCell classNameTxt={msgErrorName === 'milestoneName' ? 'error' : ''} text={milestoneName} placeholder={translate('customers.scenario-popup.place-holder-create-milestone')} type="input" closeEditInput={handleChangeInputMilestone}>
        <input
          className="input-normal height-25 w-100"
          type="text"
          name="editable-cell"
          maxLength={255}
          placeholder={translate('customers.scenario-popup.place-holder-create-milestone')}
          value={milestoneName}
          onChange={e => setMilestoneName(e.target.value)}
          autoFocus
        />
      </EditableCell>
    );
  };

  const renderMemoName = () => {
    if (props.viewOnly) {
      if (!memo) return null;
      return <section className="d-inline-block w-100 pointer-none">
        <span className=" w-100 word-break-all block-feedback my-2 w-100 ">{memo}</span>
      </section>
    }
    return (
      <EditableCell
        memo={true}
        text={memo}
        placeholder={translate('customers.scenario-popup.place-holder-create-memo')}
        type="input"
        typeClass={'d-inline-block w-100'}
        closeEditInput={handleChangeInputMilestone}
        viewOnly={props.viewOnly}
        classNameTxt="color-333"
      >
        <input
          className="input-normal height-25 w-100 d-block my-2 color-333"
          type="text"
          name="editable-cell"
          placeholder={translate('customers.scenario-popup.place-holder-create-memo')}
          value={memo}
          onChange={e => setMemo(e.target.value)}
          autoFocus
        />
      </EditableCell>
    );
  }

  const handleEditTask = () => {
    props.onEditTask(props.milestoneIndex)
  }

  const handleCloseInputDate = (value) => {
    setCloseInput(value);
  }

  const handleSetFinishDate = (value) => {
    const checkDateF = wrapperRef && wrapperRef.current.getElementsByTagName('input')[0].defaultValue;
    if (checkDateF !== '' && value === null) {
      return
    }
    setFinishDate(value);
  }

  // <EditableCell text={date} type="date">
  const renderFinishDate = () => {
    const date = finishDate ? `${formatDate(finishDate, userFormatDate, lang)}` : userFormatDate;
    if(props.viewOnly){
    return <section className="d-inline-block align-middle"><span className={classForStatusDelay}>{date}</span></section>
    }
    return (
      <EditableCell
        text={date}
        type="date"
        closeInput={closeInput}
        onCloseInput={handleCloseInputDate}
        viewOnly={props.viewOnly}
        classNameTxt={classForStatusDelay ? classForStatusDelay : null}>
        <div className="form-group height-input-25 mt-3 has-delete mt-0" ref={wrapperRef}>
          <DatePicker
            date={finishDate ? finishDate : null}
            onDateChanged={(e) => { handleSetFinishDate(e ? e : null); handleCloseInputDate(false); handleChangeInputMilestone(e) }}
            placeholder={userFormatDate}
          />
        </div>
      </EditableCell>
    );
  };

  /**
   * Get list participants of milestone
   */
  const getListParticipants = () => {
    const participants = [];
    if (milestone.tasks) {
      milestone.tasks.map(e => {
        const operators = R.path(['operators'], e);
        if (operators) {
          if (R.path(['employees'], operators[0]) && R.path(['employees'], operators[0]).length > 0) {
            R.path(['employees'], operators[0]).map(it => {
              if (!participants.some(item => (item && item.employeeId === it.employeeId))) {
                participants.push(it);
              }
            })
          }
          if (R.path(['groups'], operators[0]) && R.path(['groups'], operators[0]).length > 0) {
            R.path(['groups'], operators[0]).map(it => {
              if (!participants.some(item => (item && item.groupId === it.groupId))) {
                participants.push(it);
              }
            })
          }
          if (R.path(['departments'], operators[0]) && R.path(['departments'], operators[0]).length > 0) {
            R.path(['departments'], operators[0]).map(it => {
              if (!participants.some(item => (item && item.departmentId === it.departmentId))) {
                participants.push(it);
              }
            })
          }
        }
      });
    }
    return participants;
  };

  const handleOpenDetailEmployee = (id) => {
    if (id) {
      setShowOpenDetailEmployee(true);
      setEmployeeId(id);
    }
  }

  /**
   * Render participants icons
   */
  const renderParticipantsIcons = () => {
    const listParticipants = getListParticipants();
    if (listParticipants.length === 0) {
      return <></>;
    } else if (listParticipants.length > 3) {
      return (
        <>
          {listParticipants &&
            listParticipants.slice(0, 3).map((employee, idx) => (
              <GetListUser key={idx} infoItem={employee} txt={false} onOpenModalEmployeeDetail={handleOpenDetailEmployee} />
            ))}
          <span className="more-user">
            <span>{`+ ${listParticipants.length - 3}`}</span>
            <div className="box-list-user text-left style-3 box-list-scenario width-200 pr-1 pl-2 location-r0">
              <ul className="height-135 overflow-auto">
                {listParticipants &&
                  listParticipants.slice(3, listParticipants.length).map((employee, index) => (
                    <li key={employee.employeeId} className="mb-2">
                      <GetListUser key={index} infoItem={employee} txt={true} onOpenModalEmployeeDetail={handleOpenDetailEmployee} />
                    </li>
                  ))}
              </ul>
            </div>
          </span>
        </>
      );
    } else {
      return (
        <>
          {listParticipants && listParticipants.map((employee, idx) => (
            <GetListUser key={idx} infoItem={employee} txt={false} onOpenModalEmployeeDetail={handleOpenDetailEmployee} />
          ))}
        </>
      );
    }
  };

  const onCloseModalTask = (value) => {
    setShowModalCreateEditTask(value);
  };

  /**
   * Call function delete milestone
   */
  const deleteMilestoneToApi = () => {
    setShowDiablogConfirmDelete(false);
    props && props.onDeleteItem(TYPE_CHILD_SCENARIO.MILESTONE, props.milestoneIndex, null);
  };

  const handleCreateTask = () => {
    setShowModalCreateEditTask(true);
    createTaskRef && createTaskRef.current && createTaskRef.current.blur();
    props.createTask(milestone.milestoneId, props.milestoneIndex)
  }

  const handleDeleteTask = (index) => {
    setDeleteType(TYPE_CHILD_SCENARIO.TASK);
    setShowDiablogConfirmDelete(true);
    setDeleteTaskIndex(index)
  }

  const deleteTaskParent = () => {
    setShowDiablogConfirmDelete(false);
    props && props.onDeleteItem(TYPE_CHILD_SCENARIO.TASK, props.milestoneIndex, deleteTaskIndex);
  }

  const onClosePopupEmployeeDetail = () => {
    setShowOpenDetailEmployee(false);
    setEmployeeId(null);
  }

  const handleShowDetailTask = (showModal, id) => {
    setShowOpenDetailTask(showModal);
    setDetailTaskId(id);
  }

  /**
   * Open popup delete milestone
   */
  const DialogDeleteMilestone = (type?: any) => {
    return (
      <>
        <div className="popup-esr2" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form>
                {
                  deleteTypeTask === TYPE_CHILD_SCENARIO.MILESTONE ? <div className="popup-esr2-title">{translate('customers.scenario-popup.title-delete-milestone')}</div> : <div className="popup-esr2-title">{translate('customers.scenario-popup.title-delete-tasks')}</div>
                }
                <p className="text-center mt-4">{translate('customers.scenario-popup.msg-delete-milestone')}</p>
              </form>
            </div>
            <div className="popup-esr2-footer">
              {deleteTypeTask === TYPE_CHILD_SCENARIO.MILESTONE ?
                <>
                  <a title="" className="button-cancel" onClick={() => setShowDiablogConfirmDelete(false)}>{translate('customers.scenario-popup.btn-cancel')}</a>
                  <a title="" className="button-red" onClick={() => deleteMilestoneToApi()}>{translate('customers.scenario-popup.btn-delete')}</a>
                </> : <>
                  <a title="" className="button-cancel" onClick={() => setShowDiablogConfirmDelete(false)}>{translate('customers.scenario-popup.btn-cancel')}</a>
                  <a title="" className="button-red" onClick={() => deleteTaskParent()}>{translate('customers.scenario-popup.btn-delete')}</a>
                </>}

            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show"></div>
      </>
    );
  };

  return (
    <div className={`item color-333 ${statusMilestoneId === MILESTONE_STATUS.DONE ? 'checked' : ''}`}>
      <div className="status">
        <a className="p-1">
          <i
            className={`fas ${showMilestone ? 'fa-chevron-up' : 'fa-chevron-down'} color-999`}
            onClick={() => setShowMilestone(!showMilestone)}
          />
        </a>
        {getMilestoneIcon()}
        <div className="element-change-status" onClick={() => handleChangeStatusMileston()}></div>
      </div>
      <div className={`head main ${props.viewOnly ? 'hover-background-none' : ''}`}>
        <div className="title w40 scenario-milestone-name">
          <a className="p-3">
            <i className={`fas ${showMemo ? 'fa-chevron-up' : 'fa-chevron-down'} color-999`} onClick={() => setShowMemo(!showMemo)} />
          </a>
          {renderMilestoneName()}
        </div>
        <span className="date w40" onClick={() => setEditing(true)}>{renderFinishDate()}</span>
        <div className="action-wrap w20">
          <div className="image">{renderParticipantsIcons()}</div>
          {!props.viewOnly ?
            <div className="action d-none">
              {
                (showEdit && milestone && milestone.milestoneId) ? <a className="icon-small-primary icon-edit-small" onClick={() => setOpenModalEditMilestone(true)} /> : null
              }
              <a className="icon-small-primary icon-erase-small" onClick={() => { setShowDiablogConfirmDelete(true); setDeleteType(TYPE_CHILD_SCENARIO.MILESTONE) }} />
            </div>
            : null}
        </div>
      </div>
      {msgError && <span className="messenger-error">{msgError}</span>}
      {!showMilestone && <div>{translate('customers.scenario-popup.info-number-task', { 0: numberTask })}</div>}
      {showMemo && showMilestone && <div>{renderMemoName()}</div>}
      {showMilestone && (
        <>
          {milestone.tasks && milestone.tasks.map((task, index) => {
            if (task && task.flagDelete) {
              return <></>;
            }
            return (<TaskCard errorTasks={errorTasks} viewOnly={props.viewOnly} sourceTask={task} key={task.taskId} taskIndex={index} deleteTask={() => handleDeleteTask(index)} onUpdate={handleUpdateTask} onEditTask={handleEditTask} customerId={props.customerId} milestoneId={milestone && milestone.milestoneId || null} onOpenModalEmployeeDetail={handleOpenDetailEmployee} openDetailTask={handleShowDetailTask} />)
          }
          )}
          {!props.viewOnly ?
            <button
              className="button-primary button-add-new w85 my-2 border-dashed opacity-none"
              onClick={handleCreateTask}
              ref={createTaskRef}
            >
              {translate('customers.scenario-popup.btn-create-task')}
            </button>
            : null}
        </>
      )}
      {showDiablogConfirmDelete && <DialogDeleteMilestone />}
      {showMilestoneDetails && milestone && milestone.milestoneId &&
        <DetailMilestoneModal
          milestoneId={milestone.milestoneId}
          popoutParams={{milestoneId: milestone.milestoneId}}
          openFromModal={true}
          toggleCloseModalMilesDetail={handleShowDetailMilestone}
          milesActionType={MILES_ACTION_TYPES.UPDATE}
        />
      }
      {showOpenDetailTask &&
        <DetailTaskModal
        taskId={detailTaskId}
        canBack={true}
        toggleCloseModalTaskDetail={setShowOpenDetailTask}/>
      }
      {showOpenDetailEmployee &&
        <PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          showModal={true}
          employeeId={employeeId}
          listEmployeeId={[employeeId]}
          toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
          resetSuccessMessage={() => { }}
          openFromModal={true} />
      }
      {showModalCreateEditTask && (
        <ModalCreateEditTask
          taskActionType={TASK_ACTION_TYPES.CREATE}
          {...dataModalTask}
          milestoneId={milestone && milestone.milestoneId || null}
          customerId={props.customerId}
          toggleCloseModalTask={() => onCloseModalTask(false)}
          iconFunction="ic-time1.svg"
        />
      )}
      {openModalEditMilestone && (
        <CreateEditMilestoneModal
          milesActionType={MILES_ACTION_TYPES.UPDATE}
          toggleCloseModalMiles={() => setOpenModalEditMilestone(false)}
          milesId={milestone.milestoneId}
          customerIdProps={props.customerId}
          isOpenFromModal
        />
      )}
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  handleGetScenario
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MilestoneCard);
