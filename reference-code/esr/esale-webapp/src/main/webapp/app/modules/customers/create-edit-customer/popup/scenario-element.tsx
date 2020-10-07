import React, { useState, useEffect, useRef } from 'react';
import { Storage, translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { TYPE_CHILD_SCENARIO, TYPE_ADD_SCENARIO } from '../../constants';
import {
  handleGetScenario,
  handleGetMasterScenarios,
  handleGetMasterScenario,
  handleSaveScenario  
} from '../create-edit-customer.reducer';
import _ from 'lodash';
import MilestoneList from './milestone-list';
import moment from 'moment';
import dateFnsFormat from 'date-fns/format';

import { getMilestone, MilestoneAction } from 'app/modules/tasks/milestone/create-edit/create-edit-milestone.reducer';
import { handleGetDataTask, TaskAction, reset as resetTask } from 'app/modules/tasks/create-edit-task/create-edit-task.reducer';
import { deleteMilestone } from 'app/modules/tasks/milestone/detail/detail-milestone.reducer';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DatePicker from 'app/shared/layout/common/date-picker';
import { TASK_ACTION_TYPES } from 'app/modules/tasks/constants';
import * as R from 'ramda'
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, APP_DATE_FORMAT_ES } from 'app/config/constants';

export interface IScenarioElementProps extends StateProps, DispatchProps {
  scenarioList?: any
  openModal?: any
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
const ScenarioElement = (props: IScenarioElementProps) => {
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
  const [nameScenarios, setNameScenarios] = useState(translate('customers.scenario-popup.title-no-template-selected'));
  const [nameScenariosTmp, setNameScenariosTmp] = useState(null);
  const [scenarioIdTmp, setScenarioIdTmp] = useState(null);
  const [typeAdd, setTypeAdd] = useState(null);
  const [msgError, setMsgError] = useState(null);
  const userFormatDate = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);

  const sortPublic = (value, name?: string, date?: string) => {
    if (!value) return
    return value.sort((a, b) => {
      let date1 = 0;
      let date2 = 0;
      if (a[`${date}`]) {
        date1 = new Date(a[`${date}`]).getTime();
      }
      if (b[`${date}`]) {
        date2 = new Date(b[`${date}`]).getTime();
      }
      if (date2 === date1) {
        const nameA = a[`${name}`].toUpperCase();
        const nameB = b[`${name}`].toUpperCase();
        if (nameA > nameB) { return 1 }
        if (nameA < nameB) { return -1 }
        return 0;
      }
      return (date2 - date1)
    })
  }

  const sortByDate = (value) => {
    const sortMl = sortPublic(value, 'milestoneName', 'finishDate');
    const sortTask = sortMl.map(item => {
      return Object.assign(item, { tasks: sortPublic(item.tasks, 'taskName', 'startDate') })
    })
    return sortTask
  }

  useEffect(() => {
    const propsScenario = sortByDate(props.scenarioList);
    setMilestoneList(propsScenario);
  }, [props.scenarioList]);

  useEffect(() => {
    if (props.errorMessage) {
      setMsgError(props.errorMessage);
    }
    if (props.errorItems && props.errorItems.length > 0) {
      const errItems = props.errorItems[0];
      errItems && errItems.errorCode && setMsgError(translate(`messages.${errItems.errorCode}`))
    }
  }, [props.errorItems, props.errorMessage])

  useEffect(() => {
    const scenarioIdProps = R.path(['initData', 'scenarioId'], props);
    if (props.masterScenarios && props.masterScenarios.length > 0) {
      props.masterScenarios.forEach(item => {
        if (scenarioIdProps && scenarioIdProps === item.scenarioId) {
          setNameScenarios(item.scenarioName);
        }
      })
      setMasterScenarios(props.masterScenarios);
    }
  }, [props.masterScenarios]);

  const handleAddScenario = (list) => {
    if (list && list.milestones && list.milestones.length > 0) {
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
      setMilestoneList(sortByDate(addList));
    }
  }

  useEffect(() => {
    if (props.masterScenario && !_.isEmpty(props.masterScenario)) {
      setScenarioId(scenarioIdTmp);
      setNameScenarios(nameScenariosTmp);
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
        if (it.milestoneId === props.milestoneId) {
          return Object.assign(it, createdMilestone)
        } else {
          return it;
        }
      });
      if (!cloneMilestones.some(item => item.milestoneId === props.milestoneId)) {
        newMilestones.push(createdMilestone)
      }
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
    if (!start && !end) {
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
      if (isFilterMatch(e, { start: startDateSearch, end: endDateSearch })) {
        flagHiden = false;
      } else {
        flagHiden = true;
      }
      return Object.assign(e, { flagHiden })
    });
    setMilestoneList(sortByDate(listDisplay));
  }, [startDateSearch, endDateSearch]);

  const lang = Storage.session.get('locale', 'ja_jp');

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

  const handleCreateTask = (id, index) => {
    setMilestoneId(id);
    setMilestoneIndex(index);
  }

  const handleUpdateItem = (type, value, mIdx, tIdx) => {
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
    if (type === TYPE_CHILD_SCENARIO.MILESTONE) {
      const newMilestoneList = []
      milestoneList.forEach((it, index) => {
        if (index === mIdx) {
          if (it && it.milestoneId) {
            newMilestoneList.push(Object.assign(it, { flagDelete: true }))
          }
        } else {
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

  const handleEditTask = (value) => {
    setMilestoneIndex(value);
  }
  return (
    <>
      <div className="max-height-auto style-3 pt-3 min-height-auto">
        <div className="mb-1">
          <label className="color-333 font-weight-500 mt-4 mb-2">{translate('customers.scenario-popup.title-scenario')}</label>
        </div>
        {
          milestoneList && milestoneList.length > 0 ? <div className="title-description pl-0 d-flex align-items-center">
            <div className="d-inline-block mr-3 pl-0 text-nowrap">{translate('customers.scenario-popup.title-search')}</div>
            <div className="d-inline-block flex-lg-fill ">
              <div className="date d-flex align-items-center justify-content-between flex-1">
                <div className="d-inline-flex flex-lg-fill align-items-center">
                  <div className="d-inline-flex position-relative has-delete form-group">
                  <DatePicker
                    placeholder={translate('customers.scenario-popup.placeholder-search-start-date')}
                    onDateChanged={(date) => handleStartDate(date ? date : null)}
                    date={startDateSearchFormat ? new Date(startDateSearchFormat) : null}
                  />
                  </div>
                  <span className="font-size-12 mx-3 text-nowrap">{translate('customers.scenario-popup.title-date-from-date')}</span>
                  <div className="d-inline-flex position-relative has-delete form-group">
                  <DatePicker
                    placeholder={translate('customers.scenario-popup.placeholder-search-finish-date')}
                    onDateChanged={(date) => handleStartDate(date ? date : null, true)}
                    date={endDateSearchFormat ? new Date(endDateSearchFormat) : null}
                  />
                  </div>
                </div>
                <div className="d-inline-flex has-delete form-group ml-3">
                  <span className="button-primary button-activity-registration m-0 height-40 d-inline-flex width-200 justify-content-lg-center align-items-lg-center" onClick={props.openModal}>{translate('customers.scenario-popup.field-scenario')}</span>
                </div>
              </div>
            </div>
          </div> : <div className="title-description pl-0 d-flex align-items-center">
            <span className="button-primary button-activity-registration m-0 height-40 d-inline-flex width-200 justify-content-lg-center align-items-lg-center" onClick={props.openModal}>{translate('customers.scenario-popup.field-scenario')}</span>
          </div>
        }
        {milestoneList && <MilestoneList viewOnly={true} milestoneList={milestoneList} deleteMilestone={props.deleteMilestone} createTask={handleCreateTask} onDeleteItem={handleDeleteItem} onUpdate={handleUpdateItem} onEditTask={handleEditTask} customerId={customerId} />}
      </div>
    </>
  );
};

const mapStateToProps = ({ customerInfo, applicationProfile, milestone, taskInfo }: IRootState, ownProps: any) => {
  const stateObject = {
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
    taskData: taskInfo.taskData
  };
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
  // taskData: taskInfo.taskData
  if (customerInfo && customerInfo.data.has(ownProps.id)) {
    stateObject.errorItems = customerInfo.data.get(ownProps.id).errorItems;
    stateObject.errorMessage = customerInfo.data.get(ownProps.id).errorMessage;
    stateObject.masterScenarios = customerInfo.data.get(ownProps.id).masterScenarios;
    stateObject.masterScenario = customerInfo.data.get(ownProps.id).masterScenario;
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
  resetTask
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioElement);
