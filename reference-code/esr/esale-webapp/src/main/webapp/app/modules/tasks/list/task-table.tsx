import React, { useEffect, useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux'
import { useId } from "react-id-generator";
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import { ScreenMode, FIELD_BELONG, ControlType, AUTHORITIES } from 'app/config/constants';
import PaginationList from 'app/shared/layout/paging/pagination-list';
import { TASK_TABLE_ID, STATUS_TASK, DEFINE_FIELD_NAME_TASK, IS_PUBLIC, TASK_SPECIAL_FIELD_NAMES, AllFieldInfoDetailTask } from 'app/modules/tasks/constants'
import { OVER_FLOW_MENU_TYPE, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import StringUtils from 'app/shared/util/string-utils';
import TaskDisplayCondition from 'app/modules/tasks/control/task-display-condition';
import { tzToUtc, convertDateToYYYYMMDD } from 'app/shared/util/date-utils';
import { translate } from 'react-jhipster';
import LocalMenu from 'app/modules/tasks/control/local-navigation'
import SwitchFieldPanel from 'app/shared/layout/dynamic-form/switch-display/switch-field-panel';
import DetailTaskModal from 'app/modules/tasks/detail/detail-task-modal';
import DetailMilestoneModal from 'app/modules/tasks/milestone/detail/detail-milestone-modal';
import PopupEmployeeDetail from '../../employees/popup-detail/popup-employee-detail';
import OverFlowMenu from 'app/shared/layout/common/overflow-menu';
import ModalCreateEditSubTask from 'app/modules/tasks/create-edit-subtask/modal-create-edit-subtask';
import CreateEditMilestoneModal from 'app/modules/tasks/milestone/create-edit/create-edit-milestone-modal'
import {
  handleSearchTask,
  TaskAction,
} from 'app/modules/tasks/list/task-list.reducer';
import _ from 'lodash';
import TagAutoComplete from "app/shared/layout/common/suggestion/tag-auto-complete";
import { TagAutoCompleteType, TagAutoCompleteMode, TagAutoCompletePostMessageAction } from "app/shared/layout/common/suggestion/constants";
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import Popover from 'app/shared/layout/common/Popover';
import { getFieldLabel } from 'app/shared/util/string-utils';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import { ACTIVITY_VIEW_MODES, ACTIVITY_ACTION_TYPES } from 'app/modules/activity/constants';


interface ITaskTable extends DispatchProps, StateProps {
  tableRef: any,                // reference dom for table
  records: any,                 // tasks
  checkboxFirstColumn,          // setup for checkbox
  onActionFilterOrder: (filter: any, order: any) => void,
  offset: number,                // paging offset
  limit: number,                 // paging limit
  onPageChange: (offset, limit) => void,
  totalRecord: number,            // count total tasks
  conditionSearch: any[],
  filterConditions: any[],
  searchMode: number,
  screenMode?: number,
  openSwitcher: boolean           // open switch display
  setOpenSwitcher: (show: boolean) => void,
  onUpdateFieldValue?: (itemData, type, itemEditValue, idx) => void; // only edit mode, callback when user update control in cell,
  updateFiles?: (files) => void, // for field file
  typeMsgEmpty: number,
  openCardView?: boolean,
  refreshFieldInfoPersonal?, // event close detail task and refresh fieldInfoPersonal
  orderBy?: any, // sort,
  msgErrorBox?: any
  handleShowModalCreateEditTask: (taskActionType: number, taskId: number, parentTaskId: number) => void
}

/**
 * Component display list task row by row
 * @param props 
 */

const TaskTable = (props: ITaskTable) => {
  const { fieldInfos, customFieldInfos, errorItems } = props;
  const [selectedTask, setSelectedTask] = useState(null);
  const [openModalDetailTask, setOpenModalDetailTask] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [openModalDetailMilestone, setOpenModalDetailMilestone] = useState(false);
  const [selectedSubTasks, setSelectedSubTask] = useState(null);
  const [openModalDetailSubTask, setOpenModalDetailSubTask] = useState(false);
  const [taskListToDetail, setTaskListToDetail] = useState([]);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  const [openOverFlow, setOpenOverFlow] = useState<boolean | string>(false);
  const [activeIcon, setActiveIcon] = useState(false);
  const [heightPosition, setHeightPosition] = useState(1);
  const [openCreateSubTask, setOpenCreateSubTask] = useState(false);
  const [dataModalTask,] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE });
  const [openModalCreateMilestone, setOpenModalCreateMilestone] = useState(false);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]); // check user is admin or not
  const [listOperator, setListOperator] = useState([]);
  const [listProductTradding, setListProductTradding] = useState([]);
  const [listCustomer, setListCustomer] = useState([]);
  const [listMilestone, setListMilestone] = useState([]);
  const [openModalDetailCustomer, setOpenModalDetailCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openModalActivity, setOpenModalActivity] = useState(false);
  const [selectedTaskActivity, setSelectedTaskActivity] = useState(null);
  const [selectedMilestoneActivity, setSelectedMilestoneActivity] = useState(null);
  const employeeDetailCtrlId = useId(1, "taskTableEmployeeDetail_")
  const customerDetailCtrlId = useId(1, "taskTableCustomerDetailCtrlId_");


  let taskList = [];
  if (props.records) {
    taskList = props.records;
  }

  const getEmployeesDefault = (employees) => {
    const arrEmployees = [];
    if (!employees) {
      return arrEmployees;
    }
    employees.map((item) => {
      arrEmployees.push({
        employeeId: item.employeeId,
        fileUrl: item.photoFilePath,
        employeeName: item.employeeName,
        employeeSurname: item.employeeSurname
      })
    })
    return arrEmployees;
  }

  const getListOperator = () => {
    const mapOperator = [];
    taskList.forEach(task => {
      const arrOperator = [];
      if (task.operators && task.operators.employees) {
        task.operators.employees.map((item) => {
          arrOperator.push({
            employeeId: item.employeeId,
            employeeIcon: {
              fileUrl: item.photoEmployeeImg
            },
            employeeSurname: item.employeeSurname,
            employeeName: item.employeeName,
            departments: item.departmentsPositions
          })
        })
      }
      if (task.operators && task.operators.departments) {
        task.operators.departments.map((item) => {
          arrOperator.push({
            departmentId: item.departmentId,
            departmentName: item.departmentName,
            parentDepartment: { departmentName: item.departmentParentName },
            employees: getEmployeesDefault(item.employees)
          })
        })
      }
      if (task.operators && task.operators.groups) {
        task.operators.groups.map((item) => {
          arrOperator.push({
            groupId: item.groupId,
            groupName: item.groupName,
            employees: getEmployeesDefault(item.employees)
          })
        })
      }
      mapOperator.push({
        taskId: task.taskId,
        operators: arrOperator
      })
    });
    return mapOperator;
  }

  const getListProductTradding = () => {
    const mapProductTradings = [];
    taskList.forEach(task => {
      if (task.productTradings) {
        mapProductTradings.push({
          taskId: task.taskId,
          productTradings: task.productTradings
        })
      }
    });
    return mapProductTradings;
  }

  const getListCustomer = () => {
    const mapCustomers = [];
    taskList.forEach(task => {
      if (task.customers) {
        mapCustomers.push({
          taskId: task.taskId,
          customers: task.customers
        })
      }
    });
    return mapCustomers;
  }

  const getListMilestone = () => {
    const mapMilestone = [];
    taskList.forEach(task => {
      if (task.milestoneId) {
        mapMilestone.push({
          taskId: task.taskId,
          milestones: [{ milestoneId: task.milestoneId, milestoneName: task.milestoneName }]
        })
      }
    });
    return mapMilestone;
  }

  useEffect(() => {
    if (props.records) {
      const list = [[], [], []];
      const listToDetail = [...list[STATUS_TASK.NOT_STARTED - 1], ...list[STATUS_TASK.WORKING - 1], ...list[STATUS_TASK.COMPLETED - 1]];
      setTaskListToDetail(listToDetail);

      setListOperator(getListOperator());
      setListProductTradding(getListProductTradding());
      setListCustomer(getListCustomer());
      setListMilestone(getListMilestone());
    }
  }, [props.records])

  const getOperator = (taskId) => {
    const task = listOperator.find(taskTmp => taskTmp['taskId'].toString() === taskId.toString());
    if (task && task.operators) {
      return task.operators;
    }
    return [];
  }

  const getProductTrading = (taskId) => {
    const task = listProductTradding.find(taskTmp => taskTmp['taskId'].toString() === taskId.toString());
    if (task && task.productTradings) {
      return task.productTradings;
    }
    return [];
  }

  const getCustomer = (taskId) => {
    const task = listCustomer.find(taskTmp => taskTmp['taskId'].toString() === taskId.toString());
    if (task && task.customers) {
      return task.customers;
    }
    return [];
  }

  const getMilestone = (taskId) => {
    const task = listMilestone.find(taskTmp => taskTmp['taskId'].toString() === taskId.toString());
    if (task && task.milestones) {
      return task.milestones;
    }
    return [];
  }

  const getPublicItems = () => {
    // isPublic
    const publicItems = [];
    publicItems.push({
      itemId: IS_PUBLIC.NOT_PUBLIC,
      itemLabel: translate("tasks.list.isPublic.notPublic"),
      itemOrder: 1,
      isAvailable: true
    })
    publicItems.push({
      itemId: IS_PUBLIC.PUBLIC,
      itemLabel: translate("tasks.list.isPublic.public"),
      itemOrder: 2,
      isAvailable: true
    })
    return publicItems;
  }

  let fields = [];
  if (fieldInfos && fieldInfos.fieldInfoPersonals) {
    fields = fieldInfos.fieldInfoPersonals;
    fields.forEach(x => {
      if (x.fieldName === DEFINE_FIELD_NAME_TASK.IS_PUBLIC) {
        x.fieldItems = getPublicItems();
        x.fieldType = 1;
      }
    })
  }

  let customFields = [];
  if (customFieldInfos && customFieldInfos.customFieldsInfo) {
    customFields = customFieldInfos.customFieldsInfo;
  }

  /**
   * event table header onDrag
   * @param fieldSrc
   * @param fieldTargetId
   */
  const onDragField = (fieldSrc, fieldTargetId) => {
    props.tableRef.current.handleDragField(fieldSrc, fieldTargetId);
  }

  /**
   * event SwitchDisplay change
   * @param srcField
   * @param isSelected
   */
  const onSelectSwitchDisplayField = (srcField, isSelected) => {
    props.tableRef.current.handleChooseField(srcField, isSelected);
  }

  /**
   * reformat startDate and endDate
   */
  let records = [];
  if (props.records) {
    records = props.records.map(task => {
      const newElement = {}
      for (const prop in task) {
        if (Object.prototype.hasOwnProperty.call(task, prop) && prop !== 'taskData') {
          if (prop === 'statusTaskId') {
            newElement['status'] = task.statusTaskId
          } else if (prop === 'startDate') {
            newElement['start_date'] = task.startDate !== null ? convertDateToYYYYMMDD(task.startDate) : ''
          } else if (prop === 'finishDate') {
            newElement['finish_date'] = task.finishDate !== null ? convertDateToYYYYMMDD(task.finishDate) : ''
          } else if (prop === 'milestoneId') {
            newElement['milestoneId'] = task.milestoneId
          } else if (prop === 'milestoneName') {
            newElement['milestoneName'] = task.milestoneName
          } else if (prop === 'employees') {
            newElement['employees'] = task.employees
          } else if (prop === 'isPublic') {
            if (task[prop]) {
              newElement['isPublic'] = IS_PUBLIC.PUBLIC
            } else {
              newElement['isPublic'] = IS_PUBLIC.NOT_PUBLIC
            }
          } else {
            newElement[StringUtils.camelCaseToSnakeCase(prop)] = task[prop];
          }
        } else if (prop === 'taskData') {
          newElement['taskData'] = task.taskData;
          task.taskData.forEach(e => {
            newElement[e.key] = e.value;
          });
        }
      }
      return newElement;
    })
  }

  /**
   * Open Employee Detail
   * @param employeeIdIn 
   */
  const onClickDetailEmployee = (employeeIdIn) => {
    setEmployeeId(employeeIdIn);
    setOpenPopupEmployeeDetail(true);
  }

  /**
   * Close Popup Employee Detail
   */
  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }

  /**
  * event on click open modal add/edit Activity from Task
  * @param taskId
  */
  const onClickActiviesTask = (taskId) => {
    setSelectedTaskActivity(taskId);
    setSelectedMilestoneActivity(null);
    setOpenModalActivity(true);
  }


  /**
  * event on click open modal add/edit Activity from Milestone
  * @param milestoneId
  */
  const onClickActiviesMilestone = (milestoneId) => {
    setSelectedTaskActivity(null);
    setSelectedMilestoneActivity(milestoneId);
    setOpenModalActivity(true);
  }


  /**
 * event close popup detail milestone
 * @param reloadFlag
 */
  const toggleCloseModalMilesDetail = (reloadFlag = false) => {
    setOpenModalDetailMilestone(false);
    if (reloadFlag) {
      props.handleSearchTask({});
    }
  }

  /**
  * event on click open modal detail milestone
  * @param milestoneId
  */
  const onClickDetailMilestone = (milestoneId) => {
    setSelectedMilestone({ milestoneId });
    setOpenModalDetailMilestone(true);
  }

  /**
  * event on click close modal Activity
  */
  const onCloseModalActivity = () => {
    setOpenModalActivity(false);
    document.body.className = "wrap-task";
  }

  /**
  * event on click open modal detail task
  * @param taskId
  */
  const onClickDetailTask = (taskId) => {
    setSelectedTask(taskId);
    setOpenModalDetailTask(true);
  }

  /**
* event close popup sub task detail
* @param taskId
*/
  const toggleCloseModalSubTaskDetail = () => {
    setOpenModalDetailSubTask(false);
    props.handleSearchTask({});
    if (props.refreshFieldInfoPersonal) {
      props.refreshFieldInfoPersonal();
    }
  }

  /**
   *
   * @param taskId
   */
  const onClickDetailSubTask = (taskId) => {
    setSelectedSubTask({ taskId });
    setOpenModalDetailSubTask(true);
  }

  /**
 * event close popup task detail
 * @param taskId
 */
  const toggleCloseModalTaskDetail = () => {
    setOpenModalDetailTask(false);
    props.handleSearchTask({ orderBy: props.orderBy, filterConditions: props.filterConditions, searchConditions: props.conditionSearch });
    if (props.refreshFieldInfoPersonal) {
      props.refreshFieldInfoPersonal();
    }
  }

  /**
   * add statusTaskId column to table
   */
  const getExtensionsTasks = () => {
    const extensionsData = {};
    if (!props.records) {
      return extensionsData;
    }
    const statusItems = [];
    statusItems.push({
      itemId: STATUS_TASK.NOT_STARTED,
      itemLabel: translate(`tasks.list.statustask[${STATUS_TASK.NOT_STARTED - 1}]`)
    })
    statusItems.push({
      itemId: STATUS_TASK.WORKING,
      itemLabel: translate(`tasks.list.statustask[${STATUS_TASK.WORKING - 1}]`)
    })
    statusItems.push({
      itemId: STATUS_TASK.COMPLETED,
      itemLabel: translate(`tasks.list.statustask[${STATUS_TASK.COMPLETED - 1}]`)
    })
    extensionsData['status'] = statusItems


    extensionsData['is_public'] = getPublicItems();
    return extensionsData;
  }

  /**
   * check image
   * @param fileName fileName check image
   */
  const checkImage = (fileName) => {
    let flagCheckImage = false;
    const fileExtImage = ['img', 'jpeg', 'gif', 'bmp', 'png', 'jpg']
    fileExtImage.forEach(fileExtension => {
      if (fileName && fileName.toLowerCase().includes(fileExtension)) {
        flagCheckImage = true;
      }
    });
    return flagCheckImage;
  }

  /**
   * Render File
   * @param files 
   */
  const getFileFromRes = (files) => {
    const stringFileName = '';
    if (!files) {
      return stringFileName;
    }
    if (files.length > 2) {
      return <div className="list-link-file">
        <a className="first-file">{files[0].fileName} ...
        <div className="box-list-file">
            <ul>
              {files.map((file, idx) =>
                <li key={file.fileId + idx + ""} className="file-hover">
                  <a href={file.filePath}>
                    <img className="icon" src="/content/images/task/ic-clip-red.svg" />
                    {file.fileName}
                  </a>
                  {checkImage(file.fileName) &&
                    <div className="img-preview">
                      <img src={file.filePath} alt="" />
                    </div>}
                </li>)}
            </ul>
          </div>
        </a>
      </div>
    }
    return files.map((item, index) => {
      if (index === 0) {
        return (
          <>
            <li key={index} className="file-hover">
              <a key={index} href={item.filePath}>{item.fileName}</a>
              {checkImage(item.fileName) &&
                <div className="img-preview">
                  <img src={item.filePath} alt="" />
                </div>}
            </li>
          </>
        )
      }
      return (
        <>
          <li key={index} className="file-hover">
            <a key={index} href={item.filePath}>,{' '}{item.fileName}</a>
            {checkImage(item.fileName) &&
              <div className="img-preview">
                <img src={item.filePath} alt="" />
              </div>}
          </li>
        </>
      )
    });
  }

  const getOperatorFromRes = (totalEmployees) => {
    if (!totalEmployees || !totalEmployees.length) {
      return <></>;
    }

    /**
     * if milestone have one task
     */
    if (totalEmployees.length === 1) {
      return totalEmployees.map(item => {
        return (
          <a key={item.employeeId} className="task-of-milestone" onClick={() => onClickDetailEmployee(item.employeeId)}>
            {item.employeeSurname}{' '}{item.employeeName}
          </a>
        );
      });
    }

    /**
     * if milestone have two task
     */
    if (totalEmployees.length === 2) {
      return totalEmployees.map((item, index) => {
        if (index === 0) {
          return (
            <a key={item.employeeId} className="task-of-milestone" onClick={() => onClickDetailEmployee(item.employeeId)}>
              {item.employeeSurname}{' '}{item.employeeName},{' '}
            </a>
          );
        }
        return (
          <a key={item.employeeId} className="task-of-milestone" onClick={() => onClickDetailEmployee(item.employeeId)}>
            {item.employeeSurname}{' '}{item.employeeName}
          </a>
        );
      });
    }

    /**
     * if milestone have more than two task
     */
    const arrItem = totalEmployees.map((item, index) => {
      /**
       * with task first
       */
      if (index === 0) {
        return (
          <a key={item.employeeId} className="task-of-milestone" onClick={() => onClickDetailEmployee(item.employeeId)}>
            {item.employeeSurname}{' '}{item.employeeName},{' '}
          </a>
        );
      }

      /**
       * with task second
       */
      if (index === 1) {
        return (
          <a key={item.employeeId} className="task-of-milestone" onClick={() => onClickDetailEmployee(item.employeeId)}>
            {item.employeeSurname}{' '}{item.employeeName}
          </a>
        );
      }
      return <></>;
    });

    arrItem.push(
      <div className="employee-more-of-taskdetail dropdown">
        <a className="task-of-milestone">
          , ...
      </a>
        <div className="box-select-option hidden">
          <ul>
            {totalEmployees &&
              totalEmployees.map((item, index) => {
                if (index === 0 || index === 1) {
                  return <> </>;
                }
                return (
                  <li key={item.taskId}>
                    <a onClick={() => onClickDetailEmployee(item.employeeId)}>
                      {item.employeeSurname}{' '}{item.employeeName}
                    </a>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    );
    return arrItem;
  }

  /**
   * Handle when select 1 in milestone list
   * @param id 
   * @param type 
   * @param mode 
   * @param listTag 
   */
  const onActionSelectMilestone = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag) {
      const idSplit = id ? id.split('|') : [];
      const itemData = idSplit && idSplit.length > 2 ? { itemId: idSplit[1], fieldId: idSplit[2] } : { itemId: '', fieldId: '' };

      const index = listMilestone.findIndex(cus => cus.taskId.toString() === itemData.itemId.toString());
      if (index < 0) {
        listMilestone.push({ taskId: itemData.itemId, milestones: listTag })
      } else {
        listMilestone[index] = { ...listMilestone[index], milestones: listTag }
      }

      props.onUpdateFieldValue(itemData, '99', listTag, null);
    }
  };

  /**
   * event select customer, update list customer select
   * @param id 
   * @param type 
   * @param mode 
   * @param listTag 
   */
  const onActionSelectCustomer = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag) {
      const idSplit = id ? id.split('|') : [];
      const itemData = idSplit && idSplit.length > 2 ? { itemId: idSplit[1], fieldId: idSplit[2] } : { itemId: '', fieldId: '' };

      // const customer = { customerId: listTag[0].customerId, customerName: listTag[0].customerName };
      const index = listCustomer.findIndex(cus => cus.taskId.toString() === itemData.itemId.toString());
      if (index < 0) {
        listCustomer.push({
          taskId: itemData.itemId,
          customers: listTag
        })
      } else {
        listCustomer[index] = { ...listCustomer[index], customers: listTag }
      }

      const fieldProductTrading = fields.find(field => field.fieldName === DEFINE_FIELD_NAME_TASK.PRODUCT_NAME);
      const idProductTradings = fieldProductTrading.fieldName + '|' + itemData.itemId.toString() + '|' + fieldProductTrading.fieldId;
      if (listTag.length === 0) {
        window.postMessage({ type: TagAutoCompletePostMessageAction.ProductTrading, isDisable: true, id: idProductTradings, customerIds: [] }, window.location.origin);
      } else {
        window.postMessage({ type: TagAutoCompletePostMessageAction.ProductTrading, isDisable: false, id: idProductTradings, customerIds: listTag.map(customer => customer.customerId) }, window.location.origin);
      }

      props.onUpdateFieldValue(itemData, '99', listTag, null);
    }
  }

  /**
   * event select product, update list product select
   * @param id 
   * @param type 
   * @param mode 
   * @param listTag 
   */
  const onActionSelectProductTrading = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag) {
      const idSplit = id ? id.split('|') : [];
      const itemData = idSplit && idSplit.length > 2 ? { itemId: idSplit[1], fieldId: idSplit[2] } : { itemId: '', fieldId: '' };

      const index = listProductTradding.findIndex(ope => ope.taskId.toString() === itemData.itemId.toString());
      if (index < 0) {
        listProductTradding.push({ taskId: itemData.itemId, productTradings: listTag })
      } else {
        listProductTradding[index] = { ...listProductTradding[index], productTradings: listTag }
      }
      props.onUpdateFieldValue(itemData, '99', listTag, null);
    }
  }

  /**
   * Handle when select Operator list
   * @param id 
   * @param type 
   * @param mode 
   * @param listTag 
   */
  const onActionSelectOperator = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag) {
      const idSplit = id ? id.split('|') : [];
      const itemData = idSplit && idSplit.length > 2 ? { itemId: idSplit[1], fieldId: idSplit[2] } : { itemId: '', fieldId: '' };
      const employees = [];
      for (const item of listTag) {
        if (item.employeeId) {
          employees.push({
            employeeId: item.employeeId,
            departmentId: null,
            groupId: null,
          })
        }
        if (item.departmentId) {
          employees.push({
            employeeId: null,
            departmentId: item.departmentId,
            groupId: null,
          })
        }
        if (item.groupId) {
          employees.push({
            employeeId: null,
            departmentId: null,
            groupId: item.groupId,
          })
        }
      }
      const index = listOperator.findIndex(ope => ope.taskId.toString() === itemData.itemId.toString());
      listOperator[index] = { ...listOperator[index], operators: employees }
      props.onUpdateFieldValue(itemData, '99', employees, null);
    }
  };

  const handleClickPosition = (e) => {
    setHeightPosition(document.body.clientHeight - e.clientY);
  }

  const onClickOverFlowMenu = (idAction, param) => {
    setOpenOverFlow(false);
    switch (idAction) {
      case OVER_FLOW_MENU_TYPE.TASK.REGIST_TASK:
        if (param && param.task) {
          dataModalTask['parentTaskId'] = param.task.taskId;
        }
        setOpenCreateSubTask(true);
        break;
      case OVER_FLOW_MENU_TYPE.TASK.REGIST_MILESTOME:
        setOpenModalCreateMilestone(true);
        break;
      case OVER_FLOW_MENU_TYPE.TASK.REGIST_ACTIVITIES:
        onClickActiviesTask(param.task.taskId);
        break;
      case OVER_FLOW_MENU_TYPE.TASK.POST_DATA:
        onClickDetailTask(param.task.taskId);
        break;
      case OVER_FLOW_MENU_TYPE.SUB_TASK.REGIST_ACTIVITIES:
        onClickActiviesTask(param.task.taskId);
        break;
      case OVER_FLOW_MENU_TYPE.SUB_TASK.POST_DATA:
        onClickDetailSubTask(param.task.taskId);
        break;
      case OVER_FLOW_MENU_TYPE.MILE_STONE.REGIST_TASK:
        props.handleShowModalCreateEditTask(TASK_ACTION_TYPES.CREATE, null, null);
        break;
      case OVER_FLOW_MENU_TYPE.MILE_STONE.REGIST_ACTIVITIES:
        onClickActiviesMilestone(param.milestones.milestoneId);
        break;
      case OVER_FLOW_MENU_TYPE.MILE_STONE.POST_DATA:
        onClickDetailMilestone(param.milestones.milestoneId);
        break;
      default:
        break;
    }
  }

  /**
   * event create milestone popup close
   * @param milestoneId
   */
  const onModalCreateMilestoneClose = (code) => {
    setOpenModalCreateMilestone(false)
  }

  const checkActivityService = () => {
    const ACTIVITY_SERVICE_ID = 6;
    return props.servicesInfo && props.servicesInfo.findIndex((service) => service.serviceId === ACTIVITY_SERVICE_ID) !== -1;
  }

  /**
   * Render for special custom field.
   * @param rowDataCustom 
   * @param fieldDataCustom 
   * @param modeDataCustom 
   */
  const customFieldValue = (rowDataCustom, fieldDataCustom, mode) => {
    if (mode === ScreenMode.DISPLAY) {
      switch (fieldDataCustom.fieldName.toString()) {
        case DEFINE_FIELD_NAME_TASK.TASK_ID:
          return <a onClick={() => onClickDetailTask(rowDataCustom.task_id)}>{rowDataCustom.task_id}</a>;
        case DEFINE_FIELD_NAME_TASK.TASK_NAME: {
          const activeClass = (activeIcon || openOverFlow === rowDataCustom.task_id) ? 'active' : '';
          const param = {
            task: {
              taskId: rowDataCustom.task_id,
            }
          };
          let fieldBelong = FIELD_BELONG.TASK;
          let maxHeight = 190;
          const haveActivityService = checkActivityService();
          if (haveActivityService) {
            fieldBelong = rowDataCustom.parent_task_id === null ? FIELD_BELONG.TASK : FIELD_BELONG.SUB_TASK;
            maxHeight = rowDataCustom.parent_task_id === null ? 190 : 128;
          } else {
            fieldBelong = rowDataCustom.parent_task_id === null ? FIELD_BELONG.TASK_WITHOUT_ACTIVITY : FIELD_BELONG.SUB_TASK_WITHOUT_ACTIVITY;
            maxHeight = rowDataCustom.parent_task_id === null ? 128 : 108;
          }

          return (
            <div className='overflow-menu' onMouseOut={(e) => { setActiveIcon(false) }}>
              <a className="d-inline-block text-ellipsis max-calc66" onClick={() => onClickDetailTask(rowDataCustom.task_id)}>
                <Popover x={-20} y={25}>
                  {rowDataCustom.task_name}
                </Popover>
              </a>
              <a title="" className="icon-small-primary icon-link-small overflow-menu-item"
                href={`${window.location.origin}/${props.tenant}/detail-task/${rowDataCustom.task_id}`} target="_blank" rel="noopener noreferrer"></a>
              <div className={`d-inline position-relative overflow-menu-item ${heightPosition < 200 ? 'position-top' : ''}`}>
                <a id={rowDataCustom.task_id} title="" className={`icon-small-primary icon-sort-small ${activeClass}`}
                  onMouseOver={(e) => setActiveIcon(true)}
                  onClick={(e) => { setOpenOverFlow(rowDataCustom.task_id); handleClickPosition(e); e.stopPropagation(); }}
                  onMouseOut={(e) => e.stopPropagation()}>
                </a>
              </div>
              {openOverFlow === rowDataCustom.task_id &&
                <OverFlowMenu
                  setOpenOverFlow={setOpenOverFlow}
                  fieldBelong={fieldBelong}
                  onClickOverFlowMenu={onClickOverFlowMenu}
                  param={param}
                  maxHeight={maxHeight}
                  hidePopup={() => setOpenOverFlow(null)}
                />}
            </div>
          );
        }
        case DEFINE_FIELD_NAME_TASK.MILESTONE_ID:
          return rowDataCustom.milestoneId > 0 ? <a onClick={() => onClickDetailMilestone(rowDataCustom.milestoneId)}>{rowDataCustom.milestoneId}</a> : <></>;
        case DEFINE_FIELD_NAME_TASK.CUSTOMER_ID:
          return rowDataCustom.customerId > 0 ? <a >{rowDataCustom.customerId}</a> : <></>;
        case DEFINE_FIELD_NAME_TASK.PRODUCTS_TRADINGS_ID:
          return rowDataCustom.productsTradingsId > 0 ? <a >{rowDataCustom.productsTradingsId}</a> : <></>;
        case DEFINE_FIELD_NAME_TASK.IS_PUBLIC:
          return rowDataCustom.isPublic ? <>{translate("tasks.list.isPublic.public")}</> : <>{translate("tasks.list.isPublic.notPublic")}</>;
        case DEFINE_FIELD_NAME_TASK.STATUS:
          if (rowDataCustom.status === 1) {
            return <>{translate("tasks.list.status-task.no-start")}</>;
          } else if (rowDataCustom.status === 2) {
            return <>{translate("tasks.list.status-task.start")}</>;
          } else if (rowDataCustom.status === 3) {
            return <>{translate("tasks.list.status-task.complete")}</>;
          } else {
            return <></>;
          }
        case DEFINE_FIELD_NAME_TASK.CREATED_DATE:
          return rowDataCustom.task_created_date;
        case DEFINE_FIELD_NAME_TASK.UPDATED_DATE:
          return rowDataCustom.task_updated_date;
        case DEFINE_FIELD_NAME_TASK.OPERATOR_ID:
          return getOperatorFromRes(rowDataCustom.employees);
        case DEFINE_FIELD_NAME_TASK.CREATED_USER:
          return <a onClick={() => onClickDetailEmployee(rowDataCustom.task_created_user)}>{rowDataCustom.task_created_user_name}</a>;
        case DEFINE_FIELD_NAME_TASK.UPDATED_USER:
          return <a onClick={() => onClickDetailEmployee(rowDataCustom.task_updated_user)}>{rowDataCustom.task_updated_user_name}</a>;
        default:
          break;
      }
    } else {
      if (fieldDataCustom.fieldName.toString() === DEFINE_FIELD_NAME_TASK.MILESTONE_ID) {
        return rowDataCustom.milestoneId > 0 ? <a onClick={() => onClickDetailMilestone(rowDataCustom.milestoneId)}>{rowDataCustom.milestoneId}</a> : <></>;
      } else if (fieldDataCustom.fieldName.toString() === DEFINE_FIELD_NAME_TASK.CREATED_DATE) {
        return rowDataCustom.task_created_date;
      } else if (fieldDataCustom.fieldName.toString() === DEFINE_FIELD_NAME_TASK.UPDATED_DATE) {
        return rowDataCustom.task_updated_date;
      }
    }
  }

  /**
   * Custom FieldInfo when view/edit/filter on list
   * FieldInfo type = 99
   */
  const customFieldsInfo = (field, type) => {
    const fieldCustom = _.cloneDeep(field);
    if (ControlType.VIEW === type) {
      if (field.fieldName === DEFINE_FIELD_NAME_TASK.MILESTONE_NAME || field.fieldName === DEFINE_FIELD_NAME_TASK.MILESTONE_ID
        || field.fieldName === DEFINE_FIELD_NAME_TASK.CUSTOMER_NAME || field.fieldName === DEFINE_FIELD_NAME_TASK.CUSTOMER_ID) {
        fieldCustom.fieldType = 9;
      }
      return fieldCustom;
    } else if (ControlType.EDIT === type) {
      switch (field.fieldName) {
        case DEFINE_FIELD_NAME_TASK.FILE_NAME:
          fieldCustom.columnWidth = fieldCustom.columnWidth ? fieldCustom.columnWidth : 400;
          return fieldCustom;
        case DEFINE_FIELD_NAME_TASK.IS_PUBLIC:
          fieldCustom.fieldItems = getExtensionsTasks()['is_public'];
          fieldCustom.fieldType = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
          return fieldCustom;
        default:
          break;
      }
    } else if (ControlType.FILTER_LIST === type) {
      if (field.fieldName === DEFINE_FIELD_NAME_TASK.PARENT_ID
        || field.fieldName === DEFINE_FIELD_NAME_TASK.CUSTOMER_ID
        || field.fieldName === DEFINE_FIELD_NAME_TASK.PRODUCTS_TRADINGS_ID) {
        fieldCustom.fieldType = 5;
      }
      return fieldCustom;
    }
    return field;
  }

  /**
  * event on click open modal detail customer
  * @param milestoneId
  */
  const onClickDetailCustomer = (customerId) => {
    if (!customerId) {
      return;
    }
    setSelectedCustomer(customerId);
    setOpenModalDetailCustomer(true);
  }

  /**
  * event on click open modal detail customer
  * @param taskId
  */
  const onClosePopupCustomerDetail = () => {
    document.body.className = 'wrap-task';
    setOpenModalDetailCustomer(false);
    props.handleSearchTask({});
  }


  /**
 * get error of field item
 * @param item 
 */
  const getErrorInfo = (item, rowData) => {
    let errorInfo = null;
    if (!errorItems || !errorItems.length) {
      return null;
    }
    errorItems.forEach(elem => {
      if (elem.rowId === rowData.task_id) {
        if (elem.item && elem.item.trim() === item.fieldName) {
          const errorTmp = { ...elem };
          if (item.fieldName === TASK_SPECIAL_FIELD_NAMES.operatorId) {
            errorTmp['params'] = {
              0: translate('tasks.create-edit.label.operators')
            };
          } else {
            errorTmp['params'] = elem.params ? elem.params : null;
          }
          errorInfo = errorTmp;
        }
      }
    });
    return errorInfo;
  }

  const getErrorMsg = (errorInfo) => {
    let msg = null;
    if (errorInfo) {
      if (errorInfo.errorCode) {
        msg = translate(`messages.${errorInfo.errorCode}`, errorInfo.params);
      } else if (errorInfo.errorMsg) {
        msg = errorInfo.errorMsg;
      }
    }
    return msg;
  }

  /**
   * Render for field type is 99 => TO DO, if change REQ
   * @param fieldColumn 
   * @param rowData 
   * @param mode 
   */
  const customContentField = (fieldColumn, rowData, mode) => {
    if (!fieldColumn.fieldName) {
      return;
    }
    if (mode === ScreenMode.DISPLAY) {
      switch (fieldColumn.fieldName.toString()) {
        case DEFINE_FIELD_NAME_TASK.MILESTONE_ID:
          return <a onClick={() => onClickDetailMilestone(rowData.milestoneId)}>{rowData.milestoneId}</a>;
        case DEFINE_FIELD_NAME_TASK.MILESTONE_NAME: {          
          const param = {
            milestones : {
              milestoneId: rowData.milestoneId,
            }
          };
          const fieldBelong = FIELD_BELONG.MILE_STONE;
          const maxHeight = 190;

          return (<div className='overflow-menu' onMouseOut={(e) => { setActiveIcon(false) }}>
            <a className="d-inline-block text-ellipsis max-calc66" onClick={() => onClickDetailMilestone(rowData.milestoneId)}>
              <Popover x={-20} y={25}>
                {rowData.milestoneName}
              </Popover>
            </a>
            {rowData.milestoneName && <> 
              <a title="" className="icon-small-primary icon-link-small overflow-menu-item"
                  href={`${window.location.origin}/${props.tenant}/detail-milestone/${rowData.milestoneId}`} target="_blank" rel="noopener noreferrer"></a>
                <div className={`d-inline position-relative overflow-menu-item ${heightPosition < 200 ? 'position-top' : ''}`}>
                  <a id={rowData.milestoneId} title="" className={`icon-small-primary icon-sort-small`}
                    onMouseOver={(e) => setActiveIcon(true)}
                    onClick={(e) => { setOpenOverFlow(rowData.task_id+"-"+rowData.milestoneId); handleClickPosition(e); e.stopPropagation(); }}
                    onMouseOut={(e) => e.stopPropagation()}>
                  </a>
                </div>
              </>
            }
              {openOverFlow === rowData.task_id+"-"+rowData.milestoneId &&
                <OverFlowMenu
                  setOpenOverFlow={setOpenOverFlow}
                  fieldBelong={fieldBelong}
                  onClickOverFlowMenu={onClickOverFlowMenu}
                  param={param}
                  maxHeight={maxHeight}
                  hidePopup={() => setOpenOverFlow(null)}
                />}
            </div>);
        }
        case DEFINE_FIELD_NAME_TASK.OPERATOR_ID:
          return getOperatorFromRes(rowData.employees);
        case DEFINE_FIELD_NAME_TASK.CREATED_USER:
          return <a onClick={() => onClickDetailEmployee(rowData.task_created_user)}>{rowData.task_created_user_name}</a>;
        case DEFINE_FIELD_NAME_TASK.UPDATED_USER:
          return <a onClick={() => onClickDetailEmployee(rowData.task_updated_user)}>{rowData.task_updated_user_name}</a>;
        case DEFINE_FIELD_NAME_TASK.FILE_NAME:
          return getFileFromRes(rowData.files);
        case DEFINE_FIELD_NAME_TASK.PRODUCTS_TRADINGS_ID:
          return (
            <>
              {rowData.product_tradings && rowData.product_tradings.map((product, idx) => (
                <>
                  {product.productTradingId}
                  {idx < rowData.product_tradings.length - 1 && ', '}
                </>
              ))}
            </>
          );
        case DEFINE_FIELD_NAME_TASK.PRODUCT_NAME:
          return (
            <>
              {rowData.product_tradings && rowData.product_tradings.map((product, idx) => (
                <>
                  {product.productName}
                  {idx < rowData.product_tradings.length - 1 && ', '}
                </>
              ))}
            </>
          );
        case DEFINE_FIELD_NAME_TASK.CUSTOMER_ID: {
          const customerId = rowData.customers && rowData.customers.length > 0 ? rowData.customers[0].customerId : null;
          return (
            <>
              {rowData.customers && rowData.customers.map((cus) => (
                <>
                  <a onClick={() => onClickDetailCustomer(customerId)}>{cus.customerId}</a>
                </>
              ))}
            </>
          );
        }
        case DEFINE_FIELD_NAME_TASK.CUSTOMER_NAME: {
          const customerId2 = rowData.customers && rowData.customers.length > 0 ? rowData.customers[0].customerId : null;
          return (
            <>
              {rowData.customers && rowData.customers.map((cus) => (
                <>
                  <a onClick={() => onClickDetailCustomer(customerId2)}>{cus.customerName}</a>
                </>
              ))}
            </>
          );
        }
        case DEFINE_FIELD_NAME_TASK.PARENT_ID:
          return <>{rowData.parent_task_id}</>;
        default:
          break;
      }
    } else {
      switch (fieldColumn.fieldName.toString()) {
        case DEFINE_FIELD_NAME_TASK.OPERATOR_ID: {
          const itemData = { itemId: rowData.task_id, fieldId: fieldColumn.fieldId };
          const operators = getOperator(rowData.task_id);
          const employees = [];
          if (operators) {
            operators.map(emp => {
              if (emp.employeeId) {
                employees.push({
                  employeeId: emp.employeeId,
                  departmentId: null,
                  groupId: null,
                })
              }
              if (emp.departmentId) {
                employees.push({
                  employeeId: null,
                  departmentId: emp.departmentId,
                  groupId: null,
                })
              }
              if (emp.groupId) {
                employees.push({
                  employeeId: null,
                  departmentId: null,
                  groupId: emp.groupId,
                })
              }
            });
          }
          props.onUpdateFieldValue(itemData, '99', employees, null);
          const errorInfo = getErrorInfo(fieldColumn, rowData);
          const idOperatorId = fieldColumn.fieldName + '|' + rowData.task_id + '|' + fieldColumn.fieldId;
          return <>
            <div className="form-group">
              <TagAutoComplete
                id={idOperatorId}
                inputClass={errorInfo !== null ? "input-normal error" : "input-normal"}
                type={TagAutoCompleteType.Employee}
                modeSelect={TagAutoCompleteMode.Multi}
                isRequired={false}
                onActionSelectTag={onActionSelectOperator}
                elementTags={getOperator(rowData.task_id)}
                placeholder={translate('tasks.create-edit.placeholder.operators')}
                validMsg={getErrorMsg(errorInfo)}
                isShowOnList={true}
              />
            </div>
          </>;
        }
        case DEFINE_FIELD_NAME_TASK.MILESTONE_ID:
          return <>{rowData.milestoneId}</>;
        case DEFINE_FIELD_NAME_TASK.MILESTONE_NAME: {
          const itemData = { itemId: rowData.task_id, fieldId: fieldColumn.fieldId };
          props.onUpdateFieldValue(itemData, '99', getMilestone(rowData.task_id), null);
          const idMileStone = fieldColumn.fieldName + '|' + rowData.task_id + '|' + fieldColumn.fieldId;
          return <>
            <div className="form-group">
              <TagAutoComplete
                id={idMileStone}
                // isFocusInput={isFocusItemError} 
                placeholder={translate('tasks.create-edit.placeholder.milestone')}
                inputClass={"input-normal"}
                type={TagAutoCompleteType.Milestone}
                modeSelect={TagAutoCompleteMode.Single}
                isRequired={fieldColumn.modifyFlag === 3 || fieldColumn.modifyFlag === 2}
                elementTags={getMilestone(rowData.task_id)}
                onActionSelectTag={onActionSelectMilestone}
                isShowOnList={true}
              // validMsg={getMilestoneError()}
              />
            </div></>;
        }
        case DEFINE_FIELD_NAME_TASK.CUSTOMER_ID:
          return (
            <>
              {rowData.customers && rowData.customers.map((cus) => (
                <>
                  {cus.customerId}
                </>
              ))}
            </>
          );
        case DEFINE_FIELD_NAME_TASK.CUSTOMER_NAME: {
          // update value field
          const itemData = { itemId: rowData.task_id, fieldId: fieldColumn.fieldId };
          props.onUpdateFieldValue(itemData, '99', getCustomer(rowData.task_id), null);

          const placeholder = getFieldLabel(fieldColumn, 'fieldLabel');
          const idCustomer = fieldColumn.fieldName + '|' + rowData.task_id + '|' + fieldColumn.fieldId;
          return <>
            <div className="form-group">
              <TagAutoComplete
                id={idCustomer}
                type={TagAutoCompleteType.Customer}
                modeSelect={TagAutoCompleteMode.Single}
                inputClass={"input-normal"}
                elementTags={getCustomer(rowData.task_id)}
                placeholder={translate('tasks.create-edit.placeholder.suggest-multi', { placeholder })}
                onActionSelectTag={onActionSelectCustomer}
                hiddenActionRight={true}
                isShowOnList={true}
              />
            </div>
          </>;
        }
        case DEFINE_FIELD_NAME_TASK.PRODUCTS_TRADINGS_ID:
          return (
            <>
              {rowData.product_tradings && rowData.product_tradings.map((product, idx) => (
                <>
                  {product.productTradingId}
                  {idx < rowData.product_tradings.length - 1 && ', '}
                </>
              ))}
            </>
          );
        case DEFINE_FIELD_NAME_TASK.PRODUCT_NAME: {
          // update value field
          props.onUpdateFieldValue({ itemId: rowData.task_id, fieldId: fieldColumn.fieldId }, '99', getProductTrading(rowData.task_id), null);

          const idProductTradings = fieldColumn.fieldName + '|' + rowData.task_id + '|' + fieldColumn.fieldId;
          const placeholder = getFieldLabel(fieldColumn, 'fieldLabel');

          const record = records.find(rec => rec.task_id === rowData.task_id);
          const customerIds = getCustomer(rowData.task_id);
          const isDisable = !record.customers || record.customers.length === 0;
          return <>
            <div className="form-group">
              <TagAutoComplete
                id={idProductTradings}
                type={TagAutoCompleteType.ProductTrading}
                modeSelect={TagAutoCompleteMode.Multi}
                inputClass="input-normal"
                elementTags={getProductTrading(rowData.task_id)}
                placeholder={translate('tasks.create-edit.placeholder.suggest-multi', { placeholder })}
                onActionSelectTag={onActionSelectProductTrading}
                hiddenActionRight={true}
                isDisabled={isDisable}
                customerIds={customerIds}
              />
            </div>
          </>;
        }
        case (DEFINE_FIELD_NAME_TASK.CREATED_USER):
          return <>{rowData.task_created_user_name}</>;
        case (DEFINE_FIELD_NAME_TASK.UPDATED_USER):
          return <>{rowData.task_updated_user_name}</>;
        default:
          break;
      }
    }
  }

  const showMessage = (message, type) => {
    setMessageDownloadFileError(message);
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, 5000);
  }

  /**
   * event close modal subtask
   * @param subTask 
   */
  const onCloseModalSubTask = (subTask) => {
    setOpenCreateSubTask(false);
    if (subTask) {
      props.handleSearchTask({});
    }
  }

  const parseValidateError = () => {
    let msgError = [];
    let firstErrorRowIndex = null;
    let firstErrorItem = null;
    let firstErrorTasks = null;
    if (!errorItems || !Array.isArray(errorItems) || errorItems.length <= 0 || taskList.length <= 0) {
      msgError = [];
    } else {
      let count = 0;
      const lstError = _.cloneDeep(props.errorItems);
      for (let i = 0; i < errorItems.length; i++) {
        const rowIndex = taskList.findIndex(e => e['taskId'] && errorItems[i].rowId && e['taskId'].toString() === errorItems[i].rowId.toString());
        const field = props.fieldInfos.fieldInfoPersonals.find(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === StringUtils.snakeCaseToCamelCase(errorItems[i].item));
        const fieldOrder = field ? field.fieldOrder : null;
        lstError[i]['rowIndex'] = rowIndex;
        lstError[i]['order'] = fieldOrder;
        const fieldIndex = fields.findIndex(e => StringUtils.snakeCaseToCamelCase(e.fieldName) === errorItems[i].item || e.fieldName === errorItems[i].item);
        if (rowIndex < 0 || fieldIndex < 0) {
          continue;
        }
        count++;
      }
      const msg = translate('messages.ERR_COM_0052', { count });
      msgError.push({ msg });
      if (lstError.length > 0) {
        const lstErrorSortByOrder = lstError.sort(function (a, b) {
          return a.rowIndex - b.rowIndex || a.order - b.order;
        });
        firstErrorRowIndex = lstErrorSortByOrder[0].rowIndex;
        firstErrorItem = lstErrorSortByOrder[0].item;
        firstErrorTasks = lstErrorSortByOrder[0].rowId;
      }
    }
    return { msgError, firstErrorRowIndex, firstErrorItem, firstErrorTasks };
  }

  const validateMsg = parseValidateError().msgError;
  // Find first error item
  const firstErrorItemError = parseValidateError().firstErrorItem;
  // Find first employee error
  const firstTasksError = parseValidateError().firstErrorTasks;

  const renderErrorMessage = () => {
    if (props.errorItems && props.errorItems.length && props.errorItems[0]) {
      if (props.errorItems[0].errorCode === "ERR_COM_0050") {
        return (
          <BoxMessage messageType={MessageType.Error}
            message={translate(`messages.${props.errorItems[0].errorCode}`)}
            className="max-w-80 message-absoluted"
          />
        );
      } else if (validateMsg.length > 0) {
        return <BoxMessage messageType={MessageType.Error} className="w100"
          messages={_.map(validateMsg, 'msg')}
        />
      }
    }
    if (props.msgErrorBox) {
      return (
        <BoxMessage messageType={MessageType.Error}
          message={props.msgErrorBox}
          className="max-w-80 message-absoluted"
        />
      );
    }
  }

  const showDetailScreen = () => {
    return (
      <>
        {
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={selectedCustomer}
            listCustomerId={[]}
            toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
            openFromOtherServices={true}
          />
        }
      </>
    )
  }

  // custom fieldStyleClass of DynamicControlField
  const fieldStyleClass = _.assign({}, DynamicControlField.defaultProps.fieldStyleClass, {
    dateBox: {
      search: {},
      edit: {
        wrapInput: "form-group common has-delete",
        input: "input-normal input-common one-item"
      }
    }
  });

  return (
    <>
      <div>
        <div className="task-four-column resize-content">
          <LocalMenu />
        </div>
      </div>
      <div className={props.openSwitcher ? "esr-content-body esr-content-body2 overflow-x-hidden overflow-y-hidden" : "esr-content-body overflow-x-hidden overflow-y-hidden"}>
        <div className={'esr-content-body-main w-auto'}>
          <div className="pagination-top">
            <div className="esr-pagination">
              <TaskDisplayCondition conditions={props.conditionSearch} filters={props.filterConditions} searchMode={props.searchMode} />
              {fields && props.totalRecord > 0 &&
                <PaginationList offset={props.offset} limit={props.limit} totalRecords={props.totalRecord} onPageChange={props.onPageChange} />
              }
            </div>
          </div>
          {renderErrorMessage()}
          <DynamicList ref={props.tableRef} records={records}
            mode={props.screenMode}
            checkboxFirstColumn={true}
            keyRecordId={"taskId"}
            belong={FIELD_BELONG.TASK}
            id={TASK_TABLE_ID}
            extensionsData={getExtensionsTasks()}
            errorRecords={errorItems}
            onUpdateFieldValue={props.onUpdateFieldValue}
            tableClass={"table-list table-drop-down table-employee "}
            onActionFilterOrder={props.onActionFilterOrder}
            getCustomFieldValue={customFieldValue}
            getCustomFieldInfo={customFieldsInfo}
            customContentField={customContentField}
            updateFiles={props.updateFiles}
            showMessage={showMessage}
            fields={fields}
            fieldNameExtension="task_data"
            totalRecords={props.totalRecord}
            firstFocus={errorItems ? { id: firstTasksError, item: firstErrorItemError, nameId: 'task_id' } : { id: null, item: null, nameId: 'task_id' }}
            typeMsgEmpty={props.typeMsgEmpty}
            disableDragRow={true}
            fieldStyleClass={fieldStyleClass}
          />
        </div>
      </div>
      {props.openSwitcher && <SwitchFieldPanel dataSource={customFields}
        dataTarget={fields}
        onCloseSwitchDisplay={() => props.setOpenSwitcher(!props.openSwitcher)}
        onChooseField={(id, isSelected) => onSelectSwitchDisplayField(id, isSelected)}
        onDragField={onDragField}
        fieldBelong={FIELD_BELONG.TASK}
        isAdmin={isAdmin}
      />}
      {openModalDetailTask &&
        <DetailTaskModal iconFunction="ic-task-brown.svg"
          taskId={selectedTask}
          toggleCloseModalTaskDetail={toggleCloseModalTaskDetail}
          listTask={props.records}
          canBack={false}
          onClickDetailMilestone={onClickDetailMilestone}
          onOpenModalSubTaskDetail={onClickDetailSubTask}
        />}
      {openModalDetailMilestone &&
        <DetailMilestoneModal
          milesActionType={null}
          milestoneId={selectedMilestone.milestoneId}
          toggleCloseModalMilesDetail={toggleCloseModalMilesDetail}
        />}
      {openModalDetailSubTask &&
        <DetailTaskModal iconFunction="ic-task-brown.svg"
          taskId={selectedSubTasks.taskId}
          parentId={selectedTask}
          toggleCloseModalTaskDetail={toggleCloseModalSubTaskDetail}
          listTask={taskListToDetail}
          canBack={false}
          onClickDetailMilestone={onClickDetailMilestone}
          onOpenModalSubTaskDetail={onClickDetailSubTask} />}
      {openPopupEmployeeDetail &&
        <PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          showModal={true}
          employeeId={employeeId}
          listEmployeeId={[employeeId]}
          toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
          resetSuccessMessage={() => { }} />
      }
      {openCreateSubTask &&
        <ModalCreateEditSubTask
          toggleCloseModalTask={onCloseModalSubTask}
          iconFunction="ic-time1.svg"
          {...dataModalTask}
          canBack={false}
          parentExist={true} />
      }
      {openModalCreateMilestone &&
        <CreateEditMilestoneModal milesActionType={MILES_ACTION_TYPES.CREATE}
          toggleCloseModalMiles={onModalCreateMilestoneClose} />}
      {/* Only redicrect Screen */}
      {openModalDetailCustomer && showDetailScreen()}
      {openModalActivity &&
        <ActivityModalForm
          popout={false}
          activityViewMode={ACTIVITY_VIEW_MODES.EDITABLE}
          activityActionType={ACTIVITY_ACTION_TYPES.CREATE}
          onCloseModalActivity={onCloseModalActivity}
          canBack={true}
          milestoneId={selectedMilestoneActivity}
          taskId={selectedTaskActivity}
          isOpenFromAnotherModule={true}
        />
      }
    </>)
}
const mapStateToProps = ({ dynamicList, taskList, applicationProfile, authentication, menuLeft }: IRootState) => ({
  fieldInfos: dynamicList.data.has(TASK_TABLE_ID) ? dynamicList.data.get(TASK_TABLE_ID).fieldInfos : {},
  recordCheckList: dynamicList.data.has(TASK_TABLE_ID) ? dynamicList.data.get(TASK_TABLE_ID).recordCheckList : [],
  customFieldInfos: taskList.customFieldInfos,
  actionType: taskList.action,
  errorMessage: taskList.errorMessage,
  errorItems: taskList.errorItems,
  tenant: applicationProfile.tenant,
  authorities: authentication.account.authorities,
  servicesInfo: menuLeft.servicesInfo
});

const mapDispatchToProps = {
  handleSearchTask
}
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;


export default connect(mapStateToProps, mapDispatchToProps)(TaskTable);