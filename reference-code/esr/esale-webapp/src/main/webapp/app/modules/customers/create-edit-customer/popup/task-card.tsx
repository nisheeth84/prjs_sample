import React, { useState, useEffect, useRef } from 'react';
import { translate, Storage } from 'react-jhipster';
import { TASK_STATUS } from '../../constants';
import EditableCell from './editable-cell';
import { MILESTONE_MODE } from '../../constants';
import dateFnsFormat from 'date-fns/format';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import { TASK_ACTION_TYPES } from 'app/modules/tasks/constants';
import DatePicker from 'app/shared/layout/common/date-picker';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import { TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, APP_DATE_FORMAT_ES } from 'app/config/constants';
import _ from 'lodash';
import * as R from 'ramda';
import GetListUser from './handleGetCard';
import { start } from 'repl';

export interface ITaskCardProps {
  sourceTask?: any;
  key?: number;
  taskIndex?: number;
  deleteTask?: any
  onUpdate?: any;
  onEditTask?: any
  viewOnly?: boolean
  errorTasks?: any
  customerId?: any
  milestoneId?: any
  openDetailTask?: any
  onOpenModalEmployeeDetail?: any
}

/**
 * A task card is inside a milestone on screen
 * @param props
 */
const TaskCard: React.FC<ITaskCardProps> = props => {
  const { sourceTask } = props;
  const [taskName, setTaskName] = useState(sourceTask.taskName);
  const [statusTaskId, setStatusTaskId] = useState(sourceTask.statusTaskId);
  const [startDate, setStartDate] = useState(sourceTask.startDate ? new Date(sourceTask.startDate) : null);
  const [finishDate, setFinishDate] = useState(sourceTask.finishDate ? new Date(sourceTask.finishDate) : null);
  const [taskStatusMenu, setShowTaskStatusMenu] = useState(false);
  const [showMemo, setShowMemo] = useState(false);
  const [memo, setMemo] = useState(null);
  const [showModalCreateEditTask, setShowModalCreateEditTask] = useState(false);
  const [closeInput, setCloseInput] = useState(false);
  const [closeInputEnd, setCloseInputEnd] = useState(false);
  const [dataModalTask,] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.UPDATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE });
  const [textStatus, setTextStatus] = useState('');
  const [showEdit, setShowEdit] = useState(true);
  const [msgError, setMsgError] = useState({msgTasksName: '', msgStatus: '', msgDate: ''});
  const userFormatDate = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);

  const finishDateRef = useRef(null);
  const startDateRef = useRef(null);

  useEffect(() => {
    if (props.sourceTask) {
      setTaskName(sourceTask.taskName);
      setMemo(sourceTask.memo);
      setStatusTaskId(sourceTask.statusTaskId);
      setStartDate(sourceTask.startDate ? new Date(sourceTask.startDate) : null);
      setFinishDate(sourceTask.finishDate ? new Date(sourceTask.finishDate) : null);
      const numberTmp = (sourceTask && sourceTask.statusTaskId && (sourceTask.statusTaskId-1)) || 0;
      setTextStatus(translate(`activity.modal.task-status-${numberTmp+1}`))
    }
  }, [props.sourceTask]);

  useEffect(() => {
    const errorTasks = props.errorTasks;
    let msgTasksName = '';
    let msgStatus = '';
    let msgDate = '';
    errorTasks && errorTasks.map(item => {
      if(item.taskId === sourceTask.taskId.toString()){
        if(item.itemName === 'taskName'){msgTasksName = translate(`messages.${item.errorCode}`)}
        if(item.itemName === 'finishDate'){msgDate = translate(`messages.${item.errorCode}`)}
        if(item.itemName === 'statusTaskId'){msgStatus = translate(`messages.${item.errorCode}`)}
      }
    })
    setMsgError({msgTasksName, msgStatus, msgDate});
  },[props.errorTasks])

  const lang = Storage.session.get('locale', 'ja_jp');

  /**
   * method format date
   */
  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };

  const onCloseModalTask = () => {
    setShowModalCreateEditTask(false);
  }

  const getDateTZ = (date) => {
    if(date){
      const dateF = `${formatDate(date, APP_DATE_FORMAT_ES, lang)}`;
      const dateFormat = new Date(dateF);
      dateFormat.setUTCHours(0,0,0,0);
      const myDate = dateFormat.toISOString();
      return myDate;
    }
    return null
  }

  const handleChangeInputMilestone = (date?: any, checkFinish?: boolean) => {
    let startDateData = startDate;
    let finishDateData = finishDate;
    if(checkFinish){
      finishDateData = date;
    }else if(!checkFinish){
      startDateData = date;
    }
    const valueData = {taskName, startDate: getDateTZ(startDateData), finishDate: getDateTZ(finishDateData), statusTaskId, memo}
    setShowEdit(false);
    props && props.onUpdate(valueData, props.taskIndex)
  }

  const renderTaskName = () => {
    if (props.viewOnly) {
      return <a className="d-inline-block align-middle" onClick={() => props.openDetailTask(true, sourceTask.taskId)}>
        <span className="w-100 text-ellipsis text-blue">{taskName}</span>
      </a>
    }
    return (
      <EditableCell classNameTxt={msgError.msgTasksName ? 'error' : null} text={taskName} placeholder={translate('customers.scenario-popup.place-holder-create-tasks')} type="input" closeEditInput={handleChangeInputMilestone}>
        <input
          className="input-normal height-25 w-100"
          type="text"
          name="task"
          maxLength={255}
          placeholder={translate('customers.scenario-popup.place-holder-create-tasks')}
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
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
        viewOnly={props.viewOnly}
        text={memo}
        memo={true}
        placeholder={translate('customers.scenario-popup.place-holder-create-memo')}
        type="input"
        typeClass="d-inline-block w-100 pl-5"
        closeEditInput={handleChangeInputMilestone}
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

  const handleCloseInput = (value) => {
    setCloseInput(value);
  }

  const handleCloseInputEnd = (value) => {
    setCloseInputEnd(value);
  }

  const handleSetStateDate = (value, checkStart?: boolean) => {
    let checkDateF = '';
    if(checkStart){
      checkDateF = startDateRef && startDateRef.current.getElementsByTagName('input')[0].defaultValue;
    }else{
      checkDateF = finishDateRef  && finishDateRef.current.getElementsByTagName('input')[0].defaultValue;
    }
    if(checkDateF !== '' && value === null){
      return
    }
    if(checkStart){
      setStartDate(value)
    }else{
      setFinishDate(value);
    }
  }

  const renderStartDate = () => {
    const date = startDate ? `${formatDate(startDate, userFormatDate, lang)}` : userFormatDate;
    const dateDisable = finishDate ? [{after: new Date(`${formatDate(finishDate, APP_DATE_FORMAT_ES, lang)}`)}] : [];
    if(props.viewOnly){
      return <section className="d-inline-block align-middle"><span>{date}</span></section>
    }
    return (
      <EditableCell viewOnly={props.viewOnly} text={date} type="date" closeInput={closeInput} onCloseInput={handleCloseInput}>
        <div className="form-group mb-0 height-input-25 width-input-113" ref={startDateRef}>
          <DatePicker
            date={startDate}
            onDateChanged={e => {handleSetStateDate(e ? e : null, true);handleCloseInput(false);handleChangeInputMilestone(e)}}
            tabIndex={2}
            placeholder={userFormatDate}
            disabledDays={dateDisable}
          />
        </div>
      </EditableCell>
    );
  };

  const renderFinishDate = () => {
    const date = finishDate ? `${formatDate(finishDate, userFormatDate, lang)}` : userFormatDate;
    const dateDisable = startDate ? [{before: new Date(`${formatDate(startDate, APP_DATE_FORMAT_ES, lang)}`)}] : [];
    if(props.viewOnly){
      return <section className="d-inline-block align-middle"><span>{date}</span></section>
    }
    return (
      <EditableCell classNameTxt={msgError.msgDate ? 'error' : null} viewOnly={props.viewOnly} text={date} type="date" closeInput={closeInputEnd} onCloseInput={handleCloseInputEnd}>
        <div className="form-group mb-0 height-input-25 width-input-113" ref={finishDateRef}>
          <DatePicker
            date={finishDate}
            onDateChanged={e => {handleSetStateDate(e ? e : null);handleCloseInputEnd(false);handleChangeInputMilestone(e, true)}}
            tabIndex={2}
            placeholder={userFormatDate}
            disabledDays={dateDisable}
          />
        </div>
      </EditableCell>
    );
  };

  const getListParticipants = () => {
    const rs = [];
    const operators = R.path(['operators'], sourceTask);
    if(operators){
      if(R.path(['employees'], operators[0]) && R.path(['employees'], operators[0]).length > 0){
        R.path(['employees'], operators[0]).map(it => {
          rs.push(it);
        })
      }
      if(R.path(['groups'], operators[0]) && R.path(['groups'], operators[0]).length > 0){
        R.path(['groups'], operators[0]).map(it => {
          rs.push(it);
        })
      }
      if(R.path(['departments'], operators[0]) && R.path(['departments'], operators[0]).length > 0){
        R.path(['departments'], operators[0]).map(it => {
          rs.push(it);
        })
      }
    }
    return rs;
  }

  const renderParticipantsIcons = () => {
    const listParticipants = getListParticipants();
    if (listParticipants.length === 0 ) {
      return <></>;
    } else if (listParticipants.length > 3) {
      return (
        <>
          {listParticipants && listParticipants.slice(0, 3).map((employee, idx) =>
            <GetListUser key={idx} infoItem={employee} txt={false} onOpenModalEmployeeDetail={props.onOpenModalEmployeeDetail} />
          )}
          <span className="more-user"><span>{`+ ${listParticipants.length - 3}`}</span>
            <div className="box-list-user text-left box-list-scenario width-200 pr-1 location-r0 pl-2 pr-1">
              <ul className="height-135 overflow-auto">
                {listParticipants &&
                  listParticipants.slice(3, listParticipants.length).map((employee, index) => (
                    <li className="mb-2" key={employee.employeeId}>{<GetListUser key={index} infoItem={employee} txt={true} onOpenModalEmployeeDetail={props.onOpenModalEmployeeDetail} />}</li>
                  ))}
              </ul>
            </div>
          </span>
        </>
      );
    } else {
      return (
        <>
          {listParticipants.map((e, idx) => (
            <GetListUser key={idx} infoItem={e} txt={false} onOpenModalEmployeeDetail={props.onOpenModalEmployeeDetail} />
          ))}
        </>
      );
    }
  };

  const handleChangeStatus = (value) => {
    setShowTaskStatusMenu(false);
    const valueData = {taskName, startDate: getDateTZ(startDate), finishDate: getDateTZ(finishDate), statusTaskId: value}
    props && props.onUpdate(valueData, props.taskIndex);
    setTextStatus(translate(`activity.modal.task-status-${value}`))
    setStatusTaskId(value);
  }

  return (
    <>
      <div className="head content customer-relation-task d-flex">
        <div className="title w40 scenario-tasks-name form-group mb-0">
          {
            statusTaskId !== 3 ? <img src="../../../content/images/customer/ic-check-list.svg" /> : <img src="../../../content/images/customer/ic-checked-list.svg" />
          }
          <span className={`ml-2 ${props.viewOnly ? 'pointer-none font-size-12' : 'button-pull-down-small'} ${msgError.msgStatus ? 'error' : ''}`} onClick={() => setShowTaskStatusMenu(!taskStatusMenu)}>{textStatus}</span>
          {taskStatusMenu &&
              <ul className="drop-down drop-down2 w-30">
                <li className="item smooth pl-2" onClick={() => handleChangeStatus(1)}>
                <div className="text2">{translate('milestone.create-edit.menu.menu-status-not-started')}</div>
                </li>
                <li className="item smooth pl-2" onClick={() => handleChangeStatus(2)}>
                  <div className="text2">{translate('milestone.create-edit.menu.menu-status-at-work')}</div>
                </li>
                <li className="item smooth pl-2" onClick={() => handleChangeStatus(3)}>
                  <div className="text2">{translate('milestone.create-edit.menu.menu-status-over')}</div>
                </li>
              </ul>}
          <a className="p-2">
            <i className={`fas ${showMemo ? 'fa-chevron-up' : 'fa-chevron-down'} color-999`} onClick={() => setShowMemo(!showMemo)} />
          </a>
          {renderTaskName()}
        </div>
        <span className="date w35">
          {renderStartDate()} ~ {renderFinishDate()}
        </span>
        <div className="action-wrap w20">
          <div className="image">{renderParticipantsIcons()}</div>
          {
            !props.viewOnly ?
            <div className="action d-none">
              {
                showEdit ? <a className="icon-small-primary icon-edit-small" onClick={() => {setShowModalCreateEditTask(true);props.onEditTask()}} /> : null
              }
              <a className="icon-small-primary icon-erase-small" onClick={() => props.deleteTask(props.taskIndex)} />
            </div>
            : null
          }
        </div>
      </div>
      {msgError && msgError.msgStatus && <p className="messenger-error">{msgError.msgStatus}</p>}
      {msgError && msgError.msgTasksName && <p className="messenger-error">{msgError.msgTasksName}</p>}
      {msgError && msgError.msgDate && <p className="messenger-error">{msgError.msgDate}</p>}
      {showMemo && renderMemoName()}
      {showModalCreateEditTask &&
        <ModalCreateEditTask
          taskActionType={TASK_ACTION_TYPES.UPDATE}
          {...dataModalTask}
          toggleCloseModalTask={() => onCloseModalTask()}
          milestoneId={props.milestoneId}
          taskId={sourceTask.taskId}
          customerId={props.customerId}
          iconFunction="ic-time1.svg"
        />
        }
    </>
  );
};

export default TaskCard;
