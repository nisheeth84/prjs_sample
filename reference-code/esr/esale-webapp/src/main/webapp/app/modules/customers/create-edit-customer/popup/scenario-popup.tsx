import React, { useState, useEffect, useRef } from 'react';
import { translate, Storage } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { SCENARIO_SEARCH_MODES, TYPE_CHILD_SCENARIO, TYPE_ADD_SCENARIO } from '../../constants';
import {
  handleGetScenario,
  handleGetMasterScenarios,
  handleGetMasterScenario,
  handleSaveScenario,
  CustomerAction,
  reset
} from '../create-edit-customer.reducer';
import _ from 'lodash';
import MilestoneList from './milestone-list';
import { Modal } from 'reactstrap';
import useEventListener from 'app/shared/util/use-event-listener';
import moment from 'moment';
import dateFnsFormat from 'date-fns/format';

import CreateEditMilestoneModal from 'app/modules/tasks/milestone/create-edit/create-edit-milestone-modal';
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import { getMilestone, MilestoneAction } from 'app/modules/tasks/milestone/create-edit/create-edit-milestone.reducer';
import { handleGetDataTask, TaskAction, reset as resetTask } from 'app/modules/tasks/create-edit-task/create-edit-task.reducer';
import { deleteMilestone } from 'app/modules/tasks/milestone/detail/detail-milestone.reducer';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DatePicker from 'app/shared/layout/common/date-picker';
import { TASK_ACTION_TYPES } from 'app/modules/tasks/constants';
import * as R from 'ramda'
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, APP_DATE_FORMAT_ES } from 'app/config/constants';
import {jsonParse} from "app/shared/util/string-utils";
import EditableCell from './editable-cell';
import { getFieldLabel } from 'app/shared/util/string-utils';

export interface IScenarioPopupProps extends StateProps, DispatchProps {
  id: string;
  closeScenarioPopup: any;
  initTabData?: any;
  popout?: boolean;
  initData?: any;
  fromActivity?: boolean;
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow
}

/**
 * Scenario popup area
 * @param props
 */
const ScenarioPopup = (props: IScenarioPopupProps) => {
  const [showModal, setShowModal] = useState(true);
  const [showListTemplates, setShowListTemplates] = useState(false);
  const [milestoneList, setMilestoneList] = useState([]);
  const [startDateSearch, setStartDateSearch] = useState(null);
  const [endDateSearch, setEndDateSearch] = useState(null);
  const [startDateSearchFormat, setStartDateSearchFormat] = useState(null);
  const [endDateSearchFormat, setEndDateSearchFormat] = useState(null);
  const wrapperRef = useRef(null);
  const [customerId, setCustomerId] = useState(null);
  const [scenarioId, setScenarioId] = useState(null);
  const [milestoneId, setMilestoneId] = useState(null);
  const [milestoneIndex, setMilestoneIndex] = useState(null);
  const [masterScenarios, setMasterScenarios] = useState([]);
  const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);
  const [openModalTypeScenario, setOpenModalTypeScenario] = useState(false);
  const [nameScenarios, setNameScenarios] = useState(translate('customers.scenario-popup.title-no-template-selected'));
  const [nameScenariosTmp, setNameScenariosTmp] = useState(null);
  const [scenarioIdTmp, setScenarioIdTmp] = useState(null);
  const [typeAdd, setTypeAdd] = useState(null);
  const [msgError, setMsgError] = useState(null);
  const [showDiablogConfirm, setShowDiablogConfirm] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [errorMilestone, setErrorMilestone] = useState([]);
  const [closeInput, setCloseInput] = useState(false);
  const [classForStatusDelay, setClassForStatusDelay] = useState(null);

  const userFormatDate = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  const lang = Storage.session.get('locale');

  useEffect(() => {
    if (props.initData) {
      const scenarioIdProps = R.path(['initData', 'scenarioId'], props) || 0;
      setCustomerId(R.path(['initData', 'customerId'], props));
      setScenarioId(scenarioIdProps);
      props.handleGetScenario(props.id, R.path(['initData', 'customerId'], props));
      props.handleGetMasterScenarios(props.id);
    }
    setMsgError(null);
  }, []);

  const sortPublic = (value, name?: string, date?: string) => {
    if(!value || _.isEmpty(value)) return [];
    return value.sort((a, b) => {
      let date1 = 0;
      let date2 = 0;
      if(a[`${date}`]){
        date1 = new Date(a[`${date}`]).getTime();
      }
      if(b[`${date}`]){
        date2 = new Date(b[`${date}`]).getTime();
      }
      if(date2 === date1){
        const nameA = a[`${name}`] && a[`${name}`].toUpperCase();
        const nameB = b[`${name}`] && b[`${name}`].toUpperCase();
        if(nameA > nameB){return 1}
        if(nameA < nameB){return -1}
        return 0;
      }
      return (date2 - date1)
    })
  }

  const sortByDate = (value) => {
    if(!value || _.isEmpty(value)) return [];
    const sortMl = sortPublic(value, 'milestoneName', 'finishDate');
    const sortTask = sortMl.map(item => {
      return Object.assign(item, {tasks: sortPublic(item.tasks, 'taskName', 'startDate')})
    })
    return sortTask
  }

  useEffect(() => {
    const propsScenario = sortByDate(props.scenarioList);
    setMilestoneList(propsScenario);
  }, [props.scenarioList]);

  useEffect(() => {
    if(props.actionTypeScenario === CustomerAction.SuccessCreateScenario){
      props.reset(props.id);
      props.closeScenarioPopup(props.id);
    }
  }, [props.actionTypeScenario])

  useEffect(() => {
    if(props.errorItems && props.errorItems.length > 0) {
      setErrorMilestone(props.errorItems);
      setMsgError('');
    }
    if(props.errorMessage && props.errorItems && props.errorItems.length < 1){
      setMsgError(props.errorMessage);
    }
  }, [props.errorMessage ,props.errorItems])

  useEffect(() => {
    const scenarioIdProps = R.path(['initData', 'scenarioId'], props) || 0;
    if (props.masterScenarios && props.masterScenarios.length > 0) {
      props.masterScenarios.forEach(item => {
        if (scenarioIdProps && scenarioIdProps === item.scenarioId) {
          const getNameJson = getFieldLabel(item, 'scenarioName');
          setNameScenarios(getNameJson);
        }
      })
      setMasterScenarios(props.masterScenarios);
    }
  }, [props.masterScenarios]);

  const handleAddScenario = (list) => {
    if (list && list.milestones && list.milestones.length > 0) {
      setIsChange(true);
      const addList = [...milestoneList, ...list.milestones];
      setMilestoneList(sortByDate(addList));
    }
  }

  const handleAddRemoveScenario = (list) => {
    if (list && list.milestones && list.milestones.length > 0) {
      const newListMiles = milestoneList.map(item => {
        if ((item && !item.statusMilestoneId) || (item && item.statusMilestoneId !== 1)) {
          return Object.assign(item, { flagDelete: true })
        }
        return item
      })
      const addList = [...newListMiles, ...list.milestones];
      setIsChange(true);
      setMilestoneList(sortByDate(addList));
    }
  }

  useEffect(() => {
    if (props.masterScenario && !_.isEmpty(props.masterScenario)) {
      setScenarioId(scenarioIdTmp);
      setNameScenarios(nameScenariosTmp);
      setOpenModalTypeScenario(false);
      if (typeAdd === TYPE_ADD_SCENARIO.ADD) {
        handleAddScenario(props.masterScenario)
      } else if (typeAdd === TYPE_ADD_SCENARIO.ADDREMOVE) {
        handleAddRemoveScenario(props.masterScenario)
      }
    }
  }, [props.masterScenario])

  useEffect(() => {
    if (
      props.milestoneId &&
      props.milestoneId > 0 &&
      (props.actionType === MilestoneAction.CreateSucess || props.actionType === MilestoneAction.UpdateSucess)
    ) {
      props.getMilestone(props.milestoneId);
    }
  }, [props.milestoneId, props.actionType]);

  useEffect(() => {
    if (props.taskId && props.taskId > 0 && (props.actionTypeTask === TaskAction.CreateTaskSuccess || props.actionTypeTask === TaskAction.UpdateTaskSuccess)) {
      props.handleGetDataTask({ taskId: props.taskId }, TASK_ACTION_TYPES.UPDATE);
    }
  }, [props.taskId])

  useEffect(() => {
    if (props.milestoneName && MilestoneAction.Success) {
      const createdMilestone = {
        milestoneId: props.milestoneId,
        milestoneName: props.milestoneName,
        memo: props.memo,
        statusMilestoneId: props.isDone,
        finishDate: props.endDate
      };
      const cloneMilestones = _.cloneDeep(milestoneList);
      const newMilestones = cloneMilestones.map(it => {
        if(it.milestoneId === props.milestoneId){
          return Object.assign(it, createdMilestone)
        }else{
          return it;
        }
      });
      if(!cloneMilestones.some(item => item.milestoneId === props.milestoneId)){
        newMilestones.push(createdMilestone)
      }
      setIsChange(true);
      setMilestoneList(sortByDate(newMilestones));
    }
  }, [props.milestoneName, props.memo, props.isDone, props.endDate, props.updatedDate]);

  const getObjMiles = (list, id, obj) => {
    if (list && list.tasks && list.tasks.length > 0) {
      const newTaskL = list.tasks.map(item => {
        if (item.taskId === id) {
          return obj
        }
        return item
      })
      return Object.assign(list, { tasks: newTaskL })
    }
    return list;
  }

  useEffect(() => {
    if (props.taskData && props.taskData['taskName']) {
      const objT = {
        taskId: props.taskData['taskId'],
        taskName: props.taskData['taskName'],
        finishDate: props.taskData['finishDate'],
        startDate: props.taskData && props.taskData['startDate'] || null,
        memo: props.taskData && props.taskData['memo'] || '',
        employees: props.taskData && props.taskData['totalEmployees'] || [],
        isDone: props.taskData && props.taskData['isDone'],
        updatedDate: props.taskData && props.taskData['refixDate'],
        subTasks: props.taskData && props.taskData['subTasks'],
        operators: props.taskData && props.taskData['operators'],
        statusTaskId: props.taskData && props.taskData['statusTaskId']
      };
      const newTaskListCreate = milestoneList && milestoneList.map((milestone, index) => {
        if (index === milestoneIndex) {
          const mTasks = milestone && milestone.tasks || [];
          if (milestone && milestone.tasks && milestone.tasks.some(e => (e && e.taskId === objT.taskId))) {
            return getObjMiles(milestone, objT.taskId, objT)
          }
          return Object.assign(milestone, { tasks: [...mTasks, objT] })
        }
        return milestone
      });
      setIsChange(true);
      setMilestoneList(sortByDate(newTaskListCreate));
      props.resetTask();
    }
  }, [props.taskData])

  /**
   * Check condition for filtering milestone list
   * @param milestone
   * @param param1
   */
  const isFilterMatch = (milestone, { start = null, end = null }) => {
    const date = milestone.finishDate;
    if (start && end) {
      return moment(date).isBetween(start, end);
    }
    if (start && !end) {
      return moment(date).isAfter(start);
    }
    if (end && !start) {
      return moment(date).isBefore(end);
    }
    if(!start && !end){
      return true;
    }
  };

  /**
   * method format date
   */
  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };

  useEffect(() => {
    // Check if startDateSearch or endDateSearch is existed then filter milestone list
    const listDisplay = milestoneList.map(e => {
      let flagHiden = false;
      if (isFilterMatch(e, { start: startDateSearchFormat, end: endDateSearchFormat })) {
        flagHiden = false;
      } else {
        flagHiden = true;
      }
      return Object.assign(e, { flagHiden })
    });
    setMilestoneList(sortByDate(listDisplay));
  }, [startDateSearch, endDateSearch]);

  const handleStartDate = (value, endDate?: boolean) => {
    const valueDate = value ? `${formatDate(value, userFormatDate, lang)}` : null;
    const valueDateB = value ? `${formatDate(value, APP_DATE_FORMAT_ES, lang)}` : null;
    if (endDate) {
      setEndDateSearch(valueDate);
      setEndDateSearchFormat(valueDateB);
    } else {
      setStartDateSearch(valueDate);
      setStartDateSearchFormat(valueDateB);
    }
  }

  const renderTemplatesList = () => {
    return (
      <ul className="drop-down drop-down2 w100">
        {masterScenarios &&
          masterScenarios.map((e) => {
            const getNameJson = getFieldLabel(e, 'scenarioName');
            const initScenarioId = props.initData && props.initData.scenarioId || 0;
            if (initScenarioId === e.scenarioId) {
              return <li className="item smooth disable" key={e.scenarioId}>
                <div className="text2">{getFieldLabel(e, 'scenarioName')}</div>
              </li>
            }
            return <li className="item smooth" key={e.scenarioId} onClick={() => { setNameScenariosTmp(getNameJson); setScenarioIdTmp(e.scenarioId); setOpenModalTypeScenario(true) }}>
              <div className="text2">{getFieldLabel(e, 'scenarioName')}</div>
            </li>
          })}
      </ul>
    );
  };

  /**
   * Handle for clicking the outside of dropdown
   * @param e
   */
  const handleClickOutside = e => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setShowListTemplates(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  /**
   * event create milestone popup close
   * @param milestoneId
   */
  const onModalCreateMilestoneClose = code => {
    setOpenModalCreateMilestone(false);
    document.body.className = `wrap-customer modal-open ${props.fromActivity ? 'wrap-activity' : ''}`;
  };

  const formatOperators = (operatorsValue) => {
    const rs = []
    if(operatorsValue && operatorsValue.length > 0) {
        const item = operatorsValue[0];
        item && item.departments && item.departments.length > 0 && item.departments.map(it => {
          rs.push({departmentId: it.departmentId, employeeId: null, groupId: null})
        })
        item && item.employees && item.employees.length > 0 && item.employees.map(it => {
          rs.push({departmentId: null, employeeId: it.employeeId, groupId: null})
        })
        item && item.groups && item.groups.length > 0 && item.groups.map(it => {
          rs.push({departmentId: null, employeeId: null, groupId: it.groupId})
        })
    }
    return rs;
  }

  const formatTasks = (valueTasks) => {
    let rs = [];
    if(valueTasks && valueTasks.length > 0) {
      rs = valueTasks.map(item => {
        item && item['nestedOperators'] && delete(item['nestedOperators']);
        item && !_.isNil(item['isDone']) && delete(item['isDone']);
        item && (item['isDone'] === null || ['isDone'] === undefined) && delete(item['isDone']);
        return Object.assign(item, {operators: formatOperators(item.operators)})
      })
    }
    return rs;
  }

  const handleSubmitScenario = () => {
    milestoneList.forEach(milestone =>{
      if(milestone && milestone.tasks && milestone.tasks.length > 0){
        milestone.tasks.forEach(task => delete task.employees);
      }
    });
    const cloneMilestones = _.cloneDeep(milestoneList);
    const saveMileston = cloneMilestones.map(it => {
      it.isDone = it.statusMilestoneId;
      if(it && !it.statusMilestoneId){it.isDone = 0}
      delete(it.taskIds);
      delete(it.statusMilestoneId);
      it && delete(it.flagHiden);
      it && delete(it.scenarioDetailId);
      it && delete(it.displayOrder);
      it.tasks = formatTasks(it.tasks);
      return it;
    });
    const paramSaveScenario = {
      scenarioId,
      customerId,
      milestones : saveMileston
    };
    props.handleSaveScenario(props.id, paramSaveScenario);
    event.preventDefault();
  }

  const handleCreateTask = (id, index) => {
    setMilestoneId(id);
    setMilestoneIndex(index);
  }

  const handleUpdateItem = (type, value, mIdx, tIdx) => {
    setIsChange(true);
    if (type === TYPE_CHILD_SCENARIO.MILESTONE) {
      const newMilestoneList = milestoneList.map((it, index) => {
        if (index === mIdx) {
          return Object.assign(it, { milestoneName: value.milestoneName, finishDate: value.finishDate, statusMilestoneId: value.statusMilestoneId, memo: value.memo })
        }
        return it
      })
      setMilestoneList(sortByDate(newMilestoneList))
    } else if (type === TYPE_CHILD_SCENARIO.TASK) {
      const newTaskList = milestoneList.map((it, index) => {
        let newTaskItem = it && it.tasks || [];
        if (index === mIdx && it && it.tasks) {
          newTaskItem = it.tasks.map((itT, idx) => {
            if (idx === tIdx) {
              return Object.assign(itT, { taskName: value.taskName, startDate: value.startDate, finishDate: value.finishDate, statusTaskId: value.statusTaskId, memo: value.memo })
            }
            return itT
          })
        }
        return Object.assign(it, { tasks: newTaskItem })
      })
      setMilestoneList(sortByDate(newTaskList));
    }
  }

  const handleDeleteItem = (type, mIdx, tIdx) => {
    setIsChange(true);
    if (type === TYPE_CHILD_SCENARIO.MILESTONE) {
      const newMilestoneList = []
      milestoneList.forEach((it, index) => {
        if (index === mIdx) {
          if(it && it.milestoneId){
            newMilestoneList.push(Object.assign(it, { flagDelete: true }))
          }
        }else{
          newMilestoneList.push(it)
        }
      })
      setMilestoneList(sortByDate(newMilestoneList))
    } else if (type === TYPE_CHILD_SCENARIO.TASK) {
      const newTaskList = milestoneList.map((it, index) => {
        let newTaskItem = it && it.tasks || [];
        if (index === mIdx && it && it.tasks) {
          newTaskItem = it.tasks.map((itT, idx) => {
            if (idx === tIdx) {
              return Object.assign(itT, { flagDelete: true })
            }
            return itT
          })
        }
        return Object.assign(it, { tasks: newTaskItem })
      })
      setMilestoneList(sortByDate(newTaskList));
    }
  }

  const handleAddList = () => {
    setTypeAdd(TYPE_ADD_SCENARIO.ADD);
    props.handleGetMasterScenario(props.id, scenarioIdTmp);
  }

  const handleAddRemoveList = () => {
    setTypeAdd(TYPE_ADD_SCENARIO.ADDREMOVE);
    props.handleGetMasterScenario(props.id, scenarioIdTmp);
  }

  const handleEditTask = (value) => {
    setMilestoneIndex(value);
  }

  const handleShowDiablogConfirm = () => {
    if(isChange){
      setShowDiablogConfirm(true);
    }else{
      props.reset(props.id);
      props.closeScenarioPopup()
    }
  }

  const DialogConfirmClose = (type?: any) => {
    return (
      <>
        <div className="popup-esr2" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <form>
                <div className="popup-esr2-title">{translate('customers.scenario-popup.title-comfirm-close')}</div>
                <p className="text-center mt-4">{translate('customers.scenario-popup.content-comfirm-close')}</p>
              </form>
            </div>
            <div className="popup-esr2-footer">
                <a title="" className="button-cancel" onClick={() => setShowDiablogConfirm(false)}>{translate('customers.scenario-popup.btn-cancel')}</a>
                <a title="" className="button-red" onClick={() => {props.closeScenarioPopup();props.reset(props.id)}}>{translate('customers.scenario-popup.btn-confirm')}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show"></div>
      </>
    );
  };

  const handleCloseInputDate = (value) => {
    setCloseInput(value);
  }

  const renderStartDateSearch = () => {
    return (
      <EditableCell
        text={translate('customers.scenario-popup.placeholder-search-start-date')}
        type="date"
        closeInput={closeInput}
        onCloseInput={handleCloseInputDate}
        >
        <div className="form-group height-input-25 mt-3 has-delete" ref={wrapperRef}>
          <DatePicker
            date={startDateSearchFormat ? new Date(startDateSearchFormat) : null}
            onDateChanged={(d) => handleStartDate(d ? d : null)}
            placeholder={translate('customers.scenario-popup.placeholder-search-start-date')}
          />
        </div>
      </EditableCell>
    );
  };

  const renderEndDateSearch = () => {
    return (
      <EditableCell
        text={translate('customers.scenario-popup.placeholder-search-finish-date')}
        type="date"
        closeInput={closeInput}
        onCloseInput={handleCloseInputDate}
        >
        <div className="form-group height-input-25 mt-3 has-delete" ref={wrapperRef}>
          <DatePicker
            date={endDateSearchFormat ? new Date(endDateSearchFormat) : null}
            onDateChanged={(d) => handleStartDate(d ? d : null, true)}
            placeholder={translate('customers.scenario-popup.placeholder-search-finish-date')}
          />
        </div>
      </EditableCell>
    );
  };

  const renderModal = () => {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
          <div className="modal-dialog form-popup">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className="icon-small-primary icon-return-small" onClick={handleShowDiablogConfirm} />
                    <span className="text">
                      <img className="icon-group-user" src="../../../content/images/ic-sidebar-customer.svg" />
                      {translate('customers.scenario-popup.title-scenario')}
                    </span>
                  </div>
                </div>
                <div className="right">
                  {/* <a className="icon-small-primary icon-link-small" onClick={openNewWindow} /> */}
                  <a className="icon-small-primary icon-close-up-small line" onClick={handleShowDiablogConfirm} />
                </div>
              </div>
              <div className="modal-body body-box scenario-popup">
                <div className="modal-body-top">
                  <div className="left">
                    <div className="text">{translate('customers.scenario-popup.title-template')}</div>
                    <div className="form-group mb-0">
                      <div className="select-option" onClick={() => setShowListTemplates(!showListTemplates)} ref={wrapperRef}>
                        <span className="select-text">{nameScenarios}</span>
                        {showListTemplates && renderTemplatesList()}
                      </div>
                    </div>
                  </div>
                  <div className="right">
                    <button tabIndex={0} className="button-shadow-add pl-3" onClick={() => setOpenModalCreateMilestone(true)}>
                      {translate('customers.scenario-popup.btn-create-milestone')}
                    </button>
                  </div>
                </div>
                <div className="popup-content max-height-auto style-3 pr-5 pt-3">
                  { msgError && <div className="mb-3"><BoxMessage messageType={MessageType.Error} message={msgError} /></div>}
                  {
                    milestoneList && milestoneList.length > 0 && <div className="title-description pl-0">
                    <div className="d-inline-block mr-3 pl-0">{translate('customers.scenario-popup.title-search')}</div>
                    <div className="d-inline-block">
                      <div className="date w100 d-flex align-items-center has-delete form-group">
                        <div className="d-inline-flex position-relative">
                          {renderStartDateSearch()}
                        </div>
                        <span className="font-size-12 mx-3">{translate('customers.scenario-popup.title-date-from-date')}</span>
                        <div className="d-inline-flex position-relative">
                          {renderEndDateSearch()}
                        </div>
                      </div>
                    </div>
                  </div>
                  }
                  {milestoneList && <MilestoneList fromActivity={props.fromActivity} milestoneList={milestoneList} deleteMilestone={props.deleteMilestone} createTask={handleCreateTask} onDeleteItem={handleDeleteItem} onUpdate={handleUpdateItem} onEditTask={handleEditTask} customerId={customerId} errorItems={errorMilestone} />}
                </div>
              </div>
              <div className="user-popup-form-bottom">
                <a title="button" className="button-blue button-form-register " onClick={handleSubmitScenario}>
                  {translate('customers.scenario-popup.btn-edit-scenario')}
                </a>
              </div>
            </div>
          </div>
          {openModalCreateMilestone && (
            <CreateEditMilestoneModal
              milesActionType={MILES_ACTION_TYPES.CREATE}
              toggleCloseModalMiles={onModalCreateMilestoneClose}
              isOpenFromModal
              customerIdProps={customerId}
              fromActivity={props.fromActivity}
            />
          )}
        </div>
        {/* end popup */}
        {
          openModalTypeScenario ? <>
            <div className="popup-esr2 w-auto demo-form" id="popup-esr2">
              <div className="popup-esr2-content">
                <div className="popup-esr2-body">
                  <div className="popup-esr2-title">{translate('customers.scenario-popup.title-confirm-update-scenario')}</div>
                  <p className="text-left">
                  {translate('customers.scenario-popup.msg-confirm-update-scenario-top')}
                  </p>
                  <p className="text-left">
                  {translate('customers.scenario-popup.msg-confirm-update-scenario-bottom')}
                  </p>
                </div>
                <div className="popup-esr2-footer no-border">
                  <a className="button-cancel mr-1" onClick={() => {setOpenModalTypeScenario(false);props.reset(props.id)}}> {translate('customers.scenario-popup.btn-cancel')}</a>
                  <a className="button-blue mr-1" onClick={handleAddList}> {translate('customers.scenario-popup.btn-add-list')}</a>
                  <a className="button-blue" onClick={handleAddRemoveList}> {translate('customers.scenario-popup.btn-add-remove-list')}</a>
                </div>
              </div>
            </div>
            <div className="modal-backdrop2 show"></div>
          </> : null
        }
        {showDiablogConfirm && <><DialogConfirmClose /><div className="modal-backdrop2 show"></div></>}
      </>
    );
  };

  if (showModal) {
    return (
      <>
        <Modal isOpen toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
          {renderModal()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return renderModal();
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = ({ customerInfo, applicationProfile, milestone, taskInfo }: IRootState, ownProps: any) => {
  const stateObject = {
    scenarioList: {},
    errorItems: [],
    errorMessage: null,
    tenant: applicationProfile.tenant,
    masterScenarios: null,
    masterScenario: null,
    milestoneId: milestone.milestoneId, // DUMMY milestoneId
    milestoneName: milestone.milestoneName,
    isDone: milestone.isDone,
    memo: milestone.memo,
    endDate: milestone.endDate,
    updatedDate: milestone.updatedDate,
    actionType: milestone.action,
    actionTypeTask: taskInfo.action,
    taskId: taskInfo.taskId,
    taskData: taskInfo.taskData,
    actionTypeScenario: null
  };
  // scenarioList: customerInfo.scenarioData,
  // errorItems: customerInfo.errorItems,
  // errorMessage: customerInfo.errorMessage,
  // tenant: applicationProfile.tenant,
  // masterScenarios: customerInfo.masterScenarios,
  // masterScenario: customerInfo.masterScenario,
  // milestoneId: milestone.milestoneId, // DUMMY milestoneId
  // milestoneName: milestone.milestoneName,
  // isDone: milestone.isDone,
  // memo: milestone.memo,
  // endDate: milestone.endDate,
  // updatedDate: milestone.updatedDate,
  // actionType: milestone.action,
  // actionTypeTask: taskInfo.action,
  // taskId: taskInfo.taskId,
  // taskData: taskInfo.taskData,
  // actionTypeScenario: customerInfo.action
  if (customerInfo && customerInfo.data.has(ownProps.id)) {
    stateObject.scenarioList = customerInfo.data.get(ownProps.id).scenarioData;
    stateObject.errorItems = customerInfo.data.get(ownProps.id).errorItems;
    stateObject.errorMessage = customerInfo.data.get(ownProps.id).errorMessage;
    stateObject.masterScenarios = customerInfo.data.get(ownProps.id).masterScenarios;
    stateObject.masterScenario = customerInfo.data.get(ownProps.id).masterScenario;
    stateObject.actionTypeScenario = customerInfo.data.get(ownProps.id).action;
  }
  return stateObject;
};

const mapDispatchToProps = {
  handleGetScenario,
  handleGetMasterScenarios,
  handleGetMasterScenario,
  getMilestone,
  handleGetDataTask,
  handleSaveScenario,
  deleteMilestone,
  resetTask,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioPopup);
