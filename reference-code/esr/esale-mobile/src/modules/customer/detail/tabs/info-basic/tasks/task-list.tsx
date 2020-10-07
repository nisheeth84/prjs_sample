import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { useSelector } from "react-redux";
import moment from "moment";
import { deleteTask, updateTaskStatus } from './task-list-repository';
import { TaskListStyles } from './task-list-styles';
import { taskSelector } from '../../../customer-detail-selector';
import { TYPE_DELETE_TASK, TASK_STATUS, STATUS_CALL_API, STATUS_UPDATE_FLG, LIMIT_EMPLOYEES_AVATAR_DISPLAY } from '../../list-task/list-task-constants';
import { authorizationSelector } from '../../../../../login/authorization/authorization-selector';
import { translate } from '../../../../../../config/i18n';
import { CustomerDetailScreenStyles } from '../../../customer-detail-style';
import { APP_DATE_FORMAT_ES } from '../../../../../../config/constants/constants';
import { DATE_TIME_FORMAT, utcToTz } from '../../../../../../shared/util/date-utils';
import { messages } from '../../../customer-detail-messages';
import { Icon } from '../../../../../../shared/components/icon';
import { CommonButton } from '../../../../../../shared/components/button-input/button';
import { TypeButton, STATUSBUTTON, LanguageCode, ControlType } from '../../../../../../config/constants/enum';
import { ScreenName } from '../../../../../../config/constants/screen-name';

/**
 * Component display tab task
 */
export const TaskList: React.FC<any> = ()=> {
  const taskListData = useSelector(taskSelector);
  const [dataTask, setDataTask] = useState(taskListData);// data for display task
  const [visiblePopupConfirmUpdateStatus, setVisiblePopupConfirmUpdateStatus] = useState(false);// flag open popup confirm update status
  const [taskIdSelected, setTaskIdSelected] = useState(-1); // taskId is used
  const [visiblePopupConfirmDeleteTask, setVisiblePopupConfirmDeleteTask] = useState(false);// flag open popup confirm delete task
  const [visiblePopupConfirmDeleteSubTask, setVisiblePopupConfirmDeleteSubTask] = useState(false);// flag open popup confirm delete sub task
  const [visibleInfoEmployees, setVisibleInfoEmployees] = useState(false);//flag open popup list detail
  const [listEmployee, setListEmployee] = useState<any[]>([]);// list employee selected
  const [typeDelete, setTypeDelete] = useState(TYPE_DELETE_TASK.DELETE_ONE);// type delete of selected task
  const navigation = useNavigation();
  const authorization = useSelector(authorizationSelector);

  /** 
   * display detail task
   * @param taskId id task
  */
  const displayDetailTask = (taskId: number) => {
    navigation.navigate(ScreenName.TASK_DETAIL, { 
      taskId: taskId
    });
  }

  /**
   * edit task
   * @param task taskEdit 
   */
  const handleEditTask = (task: any) => {
    navigation.navigate(ScreenName.CREATE_TASK, { 
      taskId: task.taskId,
      type: ControlType.EDIT
    });
  }

  /**
   * remove task
   * @param taskSelected selectedTask to remove
   */
  const handleRemoveTask = (taskSelected: any) => {
    if (taskSelected.parentTaskId) {
      setTypeDelete(TYPE_DELETE_TASK.DELETE_ONE);
      setVisiblePopupConfirmDeleteSubTask(true);
    } else {
      if (taskSelected.statusTaskId === TASK_STATUS.COMPLETE) {
        setTypeDelete(TYPE_DELETE_TASK.DELETE_ALL);
        setVisiblePopupConfirmDeleteSubTask(true);
      } else {
        if (taskSelected?.subtasks?.length === 0) {
          setTypeDelete(TYPE_DELETE_TASK.DELETE_ONE);
          setVisiblePopupConfirmDeleteSubTask(true);
        } else {
          let indexNotCompleteSubTask = taskSelected.subtasks.find((item: any) => item.statusTaskId !== TASK_STATUS.COMPLETE);
          if (indexNotCompleteSubTask === undefined) {
            setTypeDelete(TYPE_DELETE_TASK.DELETE_ALL);
            setVisiblePopupConfirmDeleteSubTask(true);
          } else {
            setVisiblePopupConfirmDeleteTask(true);
          }
        }
      }
    }
    setTaskIdSelected(taskSelected.taskId);
  }

  /**
   * remove task
   * @param taskId taskId to edit
   * @param processFlg flg remove task API
   */
  const removeTask = async (processFlg: number) => {
    if (!taskIdSelected) return;
    let response = await deleteTask(
      {
        taskIdList:[{"taskId":taskIdSelected}],
        processFlg: processFlg
      }
    )
    // call API success: delete data local
    if (response?.status === STATUS_CALL_API.SUCCESS) {
      switch (processFlg) {
        case (TYPE_DELETE_TASK.DELETE_ONE): {
          setDataTask(dataTask.filter((item) => item.taskId !== taskIdSelected));
          break;
        }
        case (TYPE_DELETE_TASK.DELETE_ALL): {
          setDataTask(dataTask.filter((item) => item.taskId !== taskIdSelected && item.parentTaskId !== taskIdSelected));
          break;
        }
        case (TYPE_DELETE_TASK.DELETE_AND_CONVERT): {
          let data: any[] = [];
          dataTask.forEach((item) => {
            if (item.taskId !== taskIdSelected) {
              if (item.parentTaskId === taskIdSelected) {
                item.parentTaskId = null;
              }
              data.push(item);
            }
          })
          setDataTask(data);
        }
      }
    } else {
      // TODO handle update API fail
    }
  }

  /**
   * display list employee
   * @param taskId task view
   */
  const displayListEmployees = (task: any) => {
    setVisibleInfoEmployees(true);
    setListEmployee(task.employees);
  }

  /**
   * update status
   * @param task task update
   * @param status status update
   */
  const handleUpdateStatus = (task: any, status: number) => {
    if (task.statusTaskId === status) {
      return;
    }
    switch (status) {
      case (TASK_STATUS.TODO): {
        updateStatus(task.taskId, status, STATUS_UPDATE_FLG.TODO);
        break;
      }
      case (TASK_STATUS.DOING): {
        updateStatus(task.taskId, status, STATUS_UPDATE_FLG.DOING);
        break;
      }
      case (TASK_STATUS.COMPLETE): {
        if (!task.parentTaskId) {
          let indexNotCompleteSubTask = task.subtasks.find((item: any) => item.statusTaskId !== TASK_STATUS.COMPLETE);
          if (indexNotCompleteSubTask) {
            setTaskIdSelected(task.taskId);
            setVisiblePopupConfirmUpdateStatus(true);
            return;
          }
        }
        updateStatus(task.taskId, status, STATUS_UPDATE_FLG.COMPLETE_ONE_TASK);
        break;
      }
    }
  }

  /**
   * update status Database
   * @param taskId taskId update
   * @param status status update
   * @param updateFlg update flg
   */
  const updateStatus = async (taskId: number, statusTaskId: number, updateFlg: number) => {
    let response = await updateTaskStatus({
        taskId,
        statusTaskId,
        updateFlg
      });

    if (response?.status === STATUS_CALL_API.SUCCESS) {
      let temDataTask: any[] = [...dataTask];
        switch (updateFlg) {
          case (STATUS_UPDATE_FLG.TODO): {
            temDataTask = temDataTask.map(item => {
              let task = Object.assign({}, item);
              if (task.taskId === taskId) {
                task.statusTaskId = TASK_STATUS.TODO;
              }
              return task;
            })
            break;
          }
          case (STATUS_UPDATE_FLG.COMPLETE_ONE_TASK): {
            temDataTask = temDataTask.map(item => {
              let task = Object.assign({}, item);
              if (task.taskId === taskId) {
                task.statusTaskId = TASK_STATUS.COMPLETE;
              }
              return task;
            }) 
            break;
          }
          case (STATUS_UPDATE_FLG.COMPLETE_TASK_AND_SUBTASKS): {
            temDataTask = temDataTask.map(item => {
              let task = Object.assign({}, item);
              if (task.taskId === taskId) {
                task.statusTaskId = TASK_STATUS.COMPLETE;
                task.subTasks = task.subTasks.map(
                  (subtask: any) => {
                    let tempSubtask = Object.assign({}, subtask);
                    tempSubtask.statusTaskId = TASK_STATUS.COMPLETE;
                    return tempSubtask;
                  }
                )
              }

              if (task.parentTaskId === taskId) {
                task.statusTaskId = TASK_STATUS.COMPLETE;
              }

              return task;
            }) 
            
            break;
          }
          case (STATUS_UPDATE_FLG.COMPLETE_TASK_AND_CONVERT_SUBTASKS): {
            temDataTask = temDataTask.map(item => {
              let task = Object.assign({}, item);
              if (task.taskId === taskId) {
                task.statusTaskId = TASK_STATUS.COMPLETE;
              }

              item.subTasks = item.subTasks.map(
                (subtask: any) => {
                  let tempSubtask = Object.assign({}, subtask);
                  tempSubtask.statusTaskId = null;
                  return tempSubtask;
                }
              )

              return task;
            }) 

            break;
          }
          case (STATUS_UPDATE_FLG.DOING): {
            temDataTask = temDataTask.map(item => {
              let task = Object.assign({}, item);
              if (item.taskId === taskId) {
                task.statusTaskId = TASK_STATUS.DOING;
              }
              return task;
            })

            break;
          }
        }

        setDataTask(temDataTask);
    } else {
      // TODO update local when update database fail
    }
  }


  /**
  * convert position from API to array and get first by langue user
  * 
  * @param input position name from API
  * @param language 
  */
  const getPositionName = (input: string, language: string) => {
    let arrInput = "[" + input + "]";
    try {
      const inputObject = JSON.parse(arrInput);
      if (inputObject || inputObject.length === 0) return "";
      return inputObject[0][language];
    } catch (error) {
    }

    return "";
  }
  
  return (
    <View>
      <View style={[CustomerDetailScreenStyles.backgroundWhite]}>
          <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
            <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{translate(messages.taskTab)}</Text>
          </View>
          {dataTask && dataTask.map((item) => {
            return (
              <View
              style={[TaskListStyles.itemContainer, item.statusTaskId !== TASK_STATUS.COMPLETE && utcToTz(
                item.finishDate,
                authorization.timezoneName,
                authorization.formatDate || APP_DATE_FORMAT_ES,
                DATE_TIME_FORMAT.User
              ).substring(0, 10) < moment().format(authorization.formatDate?.toUpperCase() || APP_DATE_FORMAT_ES) ? TaskListStyles.itemHover : TaskListStyles.itemNormal]}
            >
              <View style={TaskListStyles.statusAndCustomerContainer} >
                <View style={TaskListStyles.customerNameContainer}>
                  <Text style={TaskListStyles?.customerName} numberOfLines={1} >
                  {`${item.customers[0].customerName } ${item.productTradings.length === 0?"":"/"} ${item.productTradings.map((product: any) => product.productTradingName).join(',')}`}
                  </Text>
                </View>
                <View style={TaskListStyles.statusContainer}>
                  <Text style={TaskListStyles.status}>
                    {item.statusTaskId === TASK_STATUS.TODO ?
                      translate(messages.notStartedTask) :
                      item.statusTaskId === TASK_STATUS.DOING ?
                        translate(messages.doingTask) :
                        translate(messages.doneTask)
                    }
                  </Text>
                </View>
              </View>
              <Text><Text style={TaskListStyles.taskName} onPress={() => {
                displayDetailTask(item.taskId);
              }}> {item.taskName}</Text></Text>
              <Text style={utcToTz(
                item.finishDate,
                authorization.timezoneName,
                authorization.formatDate || APP_DATE_FORMAT_ES,
                DATE_TIME_FORMAT.User
              ).substring(0, 10) < moment().format(authorization.formatDate || APP_DATE_FORMAT_ES) && item.statusTaskId !== TASK_STATUS.COMPLETE ?
                TaskListStyles.finishDateExpire : TaskListStyles.finishDate}>
                {`${translate(messages.finishDateLabel)}: ${utcToTz(
                  item.finishDate,
                  authorization.timezoneName,
                  authorization.formatDate || APP_DATE_FORMAT_ES,
                  DATE_TIME_FORMAT.User
                ).substring(0, 10)}`}
              </Text>

              <View style={TaskListStyles.infoContainer}>
                <View style={TaskListStyles.iconContainer}>
                  {item.milestoneId &&
                    <Icon name={'milestone'} style={TaskListStyles.iconItem} /> 
                  }
                  {item?.subtasks?.length > 0 &&
                    <Icon name={'memo'} style={[TaskListStyles.iconItem,TaskListStyles.iconMemo]} />
                  }
                  <TouchableOpacity
                    onPress={() => { handleEditTask(item) }
                    }
                  >
                    <Icon name={'edit'} style={TaskListStyles.iconItem} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { handleRemoveTask(item) }
                    }
                  >
                    <Icon name={'erase'} style={TaskListStyles.iconItem} />
                  </TouchableOpacity>
                </View>
                <View style={TaskListStyles.avatarContainer}>
                  {item?.employees?.length > 0 && (
                    item.employees.slice(0, LIMIT_EMPLOYEES_AVATAR_DISPLAY).map((employee: any) => (
                      employee.photoFilePath !== '' ?
                      <TouchableOpacity  onPress={() => { displayListEmployees(item)}}>
                        <Image style={TaskListStyles.avatar} source={{ uri: employee.photoFilePath }} key={employee.employeeId} />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity  onPress={() => { displayListEmployees(item)}}>
                        <View style={[TaskListStyles.avatar, TaskListStyles.backgroundAvatar]} key={employee.employeeId}>
                          <Text style={TaskListStyles.avatarName}>{employee?.employeeName?.charAt(0)}</Text>
                        </View>
                      </TouchableOpacity>
                    )))}
                  {item?.employees?.length > LIMIT_EMPLOYEES_AVATAR_DISPLAY && (
                    <TouchableOpacity
                      onPress={() => { displayListEmployees(item); }
                      }
                      style={[TaskListStyles.avatar, TaskListStyles.backgroundMoreDetail]}
                    >
                      <Text style={TaskListStyles.numberMoreEmployees}>{`+${item?.employees?.length - LIMIT_EMPLOYEES_AVATAR_DISPLAY}`}</Text>
                    </TouchableOpacity>)
                  }
                </View>
              </View>
              <View style={TaskListStyles.buttonContainer}>
                <TouchableOpacity
                  onPress={
                    () => { handleUpdateStatus(item, TASK_STATUS.TODO) }
                  }
                  activeOpacity={item.statusTaskId === TASK_STATUS.TODO ? 1 : 0.3}
                  style={[TaskListStyles.button, item.statusTaskId !== TASK_STATUS.TODO ? TaskListStyles.enableButton : TaskListStyles.disableButton]}
                >
                  <Text style={item.statusTaskId !== TASK_STATUS.TODO ? TaskListStyles.enableTextButton : TaskListStyles.disableTextButton}>
                    {translate(messages.notStartedTask)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    () => { handleUpdateStatus(item, TASK_STATUS.DOING) }
                  }
                  activeOpacity={item.statusTaskId === TASK_STATUS.DOING ? 1 : 0.3}
                  style={[TaskListStyles.button, item.statusTaskId !== TASK_STATUS.DOING ? TaskListStyles.enableButton : TaskListStyles.disableButton]}
                >
                  <Text style={item.statusTaskId !== TASK_STATUS.DOING ? TaskListStyles.enableTextButton : TaskListStyles.disableTextButton}>
                    {translate(messages.doingTask)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={
                    () => { handleUpdateStatus(item, TASK_STATUS.COMPLETE) }
                  }
                  activeOpacity={item.statusTaskId === TASK_STATUS.COMPLETE ? 1 : 0.3}
                  style={[TaskListStyles.button, item.statusTaskId !== TASK_STATUS.COMPLETE ? TaskListStyles.enableButton : TaskListStyles.disableButton]}
                >
                  <Text style={item.statusTaskId !== TASK_STATUS.COMPLETE ? TaskListStyles.enableTextButton : TaskListStyles.disableTextButton}>
                    {translate(messages.doneTask)}
                  </Text>

                </TouchableOpacity>
              </View>
            </View>
            )
          })}
        </View>
        <Modal
          isVisible={visiblePopupConfirmUpdateStatus}
          backdropColor={"rgba(0, 0, 0, 0.8)"}
          onBackdropPress={() => setVisiblePopupConfirmUpdateStatus(false)}
          onBackButtonPress={() => setVisiblePopupConfirmUpdateStatus(false)}
          style={TaskListStyles.popupConfirmContainer}
        >
          <TouchableOpacity activeOpacity={1} style={TaskListStyles.popupConfirmContent}>
            <Text style={TaskListStyles.confirmTaskTitle}>{translate(messages.confirmTask)}</Text>
            <Text style={TaskListStyles.confirmTaskMessage}>{translate(messages.askSubtaskFinished)}</Text>
            <TouchableOpacity onPress={() => {
              updateStatus(taskIdSelected, TASK_STATUS.COMPLETE, STATUS_UPDATE_FLG.COMPLETE_TASK_AND_SUBTASKS);
              setVisiblePopupConfirmUpdateStatus(false);
            }
            }
              style={TaskListStyles.confirmButtonContainer}
            >
              <Text style={TaskListStyles.confirmButtonText}>{translate(messages.subTaskComplete)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              updateStatus(taskIdSelected, TASK_STATUS.COMPLETE, STATUS_UPDATE_FLG.COMPLETE_TASK_AND_CONVERT_SUBTASKS);
              setVisiblePopupConfirmUpdateStatus(false);
            }
            }
              style={TaskListStyles.confirmButtonContainer}
            >
              <Text style={TaskListStyles.confirmButtonText}>{translate(messages.convertToTask)}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <Modal
          isVisible={visiblePopupConfirmDeleteTask}
          backdropColor={"rgba(0, 0, 0, 0.8)"}
          onBackdropPress={() => setVisiblePopupConfirmDeleteTask(false)}
          onBackButtonPress={() => setVisiblePopupConfirmDeleteTask(false)}
          style={TaskListStyles.popupConfirmContainer}
        >
          <TouchableOpacity activeOpacity={1} style={TaskListStyles.deleteTaskConfirmContent}>
            <Text style={TaskListStyles.deleteTaskTitle}>{translate(messages.confirmTask)}</Text>
            <Text style={TaskListStyles.deleteTaskMessage}>{translate(messages.askSubtaskRemove)}</Text>
            <TouchableOpacity onPress={() => {
              removeTask(TYPE_DELETE_TASK.DELETE_ALL);
              setVisiblePopupConfirmDeleteTask(false);
            }
            }
              style={TaskListStyles.confirmButtonContainer}
            >
              <Text style={TaskListStyles.confirmButtonText}>{translate(messages.subTaskComplete)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              removeTask(TYPE_DELETE_TASK.DELETE_AND_CONVERT);
              setVisiblePopupConfirmDeleteTask(false);
            }
            }
              style={TaskListStyles.confirmButtonContainer}
            >
              <Text style={TaskListStyles.confirmButtonText}>{translate(messages.convertToTask)}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setVisiblePopupConfirmDeleteTask(false);
            }
            }
              style={TaskListStyles.cancelTaskButtonContainer}
            >
              <Text style={TaskListStyles.cancelButtonText}>{translate(messages.cancelUpdate)}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
        <Modal
          isVisible={visiblePopupConfirmDeleteSubTask}
          backdropColor={"rgba(0, 0, 0, 0.8)"}
          onBackdropPress={() => setVisiblePopupConfirmDeleteSubTask(false)}
          onBackButtonPress={() => setVisiblePopupConfirmDeleteSubTask(false)}
          style={TaskListStyles.popupConfirmContainer}
        >
          <TouchableOpacity activeOpacity={1} style={TaskListStyles.deleteConfirmContent}>
            <Text style={TaskListStyles.deleteTaskTitle}>{translate(messages.removeTitle)}</Text>
            <Text style={TaskListStyles.deleteTaskMessage}>{translate(messages.removeTaskSimple)}</Text>
            <View style={TaskListStyles.deleteTaskButtonContainer}>
              <CommonButton onPress={() => {
                setVisiblePopupConfirmDeleteSubTask(false);
              }} status={STATUSBUTTON.ENABLE} icon="" textButton={translate(messages.cancelUpdate)} typeButton={TypeButton.BUTTON_DIALOG_NO_SUCCESS}></CommonButton>
              <CommonButton onPress={() => {
                removeTask(typeDelete);
                setVisiblePopupConfirmDeleteSubTask(false);
              }} status={STATUSBUTTON.ENABLE} icon="" textButton={translate(messages.removeTitle)} typeButton={TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
            </View>
          </TouchableOpacity>
        </Modal>
        <Modal
          isVisible={visibleInfoEmployees}
          backdropColor={"rgba(0, 0, 0, 0.8)"}
          onBackdropPress={() => setVisibleInfoEmployees(false)}
          onBackButtonPress={() => setVisibleInfoEmployees(false)}
          style={TaskListStyles.popupConfirmContainer}
        >
          <TouchableOpacity activeOpacity={1} style={TaskListStyles.listEmployeesContent}>
            <ScrollView>
              {listEmployee.map((employee: any) =>
                <View style={TaskListStyles.infoEmployeeContainer}>
                  <View style={TaskListStyles.imageEmployeeContainer}>
                    {employee.photoFilePath !== '' ?
                      <Image style={TaskListStyles.imageEmployee} source={{ uri: employee.photoFilePath }} /> :
                      <View style={[TaskListStyles.imageEmployee, TaskListStyles.backgroundAvatar]}>
                        <Text style={TaskListStyles.imageName}>{employee?.employeeName?.charAt(0)}</Text>
                      </View>}
                  </View>
                  <View style={TaskListStyles.infoEmployeeTextContainer}>
                    <Text style={TaskListStyles.positionNameText} numberOfLines={1}>{`${getPositionName(employee.positionName,authorization.languageCode || LanguageCode.JA_JP)}${getPositionName(employee.positionName,authorization.languageCode || LanguageCode.JA_JP)?'-':''}${employee.departmentName}`}</Text>
                    <Text style={TaskListStyles.employeeNameText}
                      onPress={() => {
                      }}>
                      {`${employee.employeeSurname}${employee.employeeName?' '+ employee.employeeName : ""}`}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
            <View style={TaskListStyles.closeButtonContainer}>
              <TouchableOpacity onPress={() => {
                setVisibleInfoEmployees(false);
              }}
                style={TaskListStyles.closeButton}
              >
                <Text style={TaskListStyles.closeButtonText}>
                  {translate(messages.closeListEmployee)}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
    </View>
  )
}