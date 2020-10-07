import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { translate } from '../../../../../config/i18n';
import { Icon } from '../../../../../shared/components/icon';
import { messages } from './list-task-messages';
import { responseMessages } from '../../../../../shared/messages/response-messages';
import { ListTaskStyle } from './list-task-styles';
import { TaskItem, Employee } from './list-task-interface';
import {
  TASK_STATUS,
  LIMIT_EMPLOYEES_AVATAR_DISPLAY,
  LIMIT_TASK_PER_PAGE, MODE_LOAD_DATA,
  TYPE_DELETE_TASK,
  STATUS_UPDATE_FLG,
  STATUS_CALL_API,
  SERVICE_ID_TASK,
} from './list-task-constants';
import { deleteTask, updateTaskStatus, getTasks } from './list-task-repository';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { authorizationSelector } from '../../../../login/authorization/authorization-selector';
import { useSelector } from "react-redux";
import moment from "moment";
import { getChildCustomerListSelector, getCustomerIdSelector } from '../../customer-detail-selector';
import { CommonButton } from '../../../../../shared/components/button-input/button';
import { TypeButton, STATUSBUTTON, LanguageCode, ControlType } from '../../../../../config/constants/enum';
import { DATE_TIME_FORMAT, utcToTz } from '../../../../../shared/util/date-utils';
import { APP_DATE_FORMAT_ES } from '../../../../../config/constants/constants';
import { ServiceFavoriteSelector, ServiceInfoSelector } from '../../../../menu/menu-feature-selector';
import StringUtils from '../../../../../shared/util/string-utils';
import { CommonFilterMessage } from '../../../../../shared/components/message/message';
import { format } from 'react-string-format';
import { ScreenName } from '../../../../../config/constants/screen-name';

/**
 * Component display tab task
 */
export const ListTasks = () => {
  const customerId = useSelector(getCustomerIdSelector);
  const childCustomerId = useSelector(getChildCustomerListSelector);
  const [dataTask, setDataTask] = useState<TaskItem[]>([]);// data for display task
  const [visiblePopupConfirmUpdateStatus, setVisiblePopupConfirmUpdateStatus] = useState(false);// flag open popup confirm update status
  const [taskIdSelected, setTaskIdSelected] = useState(-1); // taskId is used
  const [visiblePopupConfirmDeleteTask, setVisiblePopupConfirmDeleteTask] = useState(false);// flag open popup confirm delete task
  const [visiblePopupConfirmDeleteSubTask, setVisiblePopupConfirmDeleteSubTask] = useState(false);// flag open popup confirm delete sub task
  const [visibleInfoEmployees, setVisibleInfoEmployees] = useState(false);//flag open popup list detail
  const [listEmployee, setListEmployee] = useState<Employee[]>([]);// list employee selected
  const [typeDelete, setTypeDelete] = useState(TYPE_DELETE_TASK.DELETE_ONE);// type delete of selected task
  const navigation = useNavigation();
  const [errorMessageCallAPI, setErrorMessageCallAPI] = useState('');
  const authorization = useSelector(authorizationSelector);
  const [isLoading, setIsLoading] = useState(false);
  const serviceFavorite = useSelector(ServiceFavoriteSelector);
  const serviceOther = useSelector(ServiceInfoSelector);
  /**
   * load data display
   */
  useEffect(() => {
    setErrorMessageCallAPI('');
    reloadData();
  }, [])

  /**
   * load data from API and set data
   * @param offset offset data load from API
   * @param limit Limit data load from API
   * @param searchConditions condition search data API
   * @param modeLoad reload or loadMore
   */
  const loadData = async (offset: number, limit: number, modeLoad: number) => {
    let response = await getTasks(
      {
        offset,
        limit,
        searchConditions: [],
        filterByUserLoginFlg: 0,
        filterConditions: [],
        localNavigationConditons: {
          customerIds: [customerId, ...childCustomerId],
          employeeIds: []
        },
        orderBy: [],
        statusTaskIds: [],
        searchLocal: "",
      }
    )
    if (response?.status === STATUS_CALL_API.SUCCESS) {
      if (modeLoad === MODE_LOAD_DATA.Reload) {
        setDataTask(response.data.dataInfo.tasks);
      } else {
        let newDataTask = [...dataTask, ...response.data.dataInfo.tasks];
        setDataTask(newDataTask);
      }
      setIsLoading(false);
    } else {
      // TODO call API fail
      setDataTask([]);
      setErrorMessageCallAPI(translate(responseMessages.ERR_LOG_0001));
      setIsLoading(false);
    }
  }
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
  const handleEditTask = (task: TaskItem) => {
    navigation.navigate(ScreenName.CREATE_TASK, { 
           taskId: task.taskId,
       type: ControlType.EDIT
    });
  }

  /**
   * remove task
   * @param taskSelected selectedTask to remove
   */
  const handleRemoveTask = (taskSelected: TaskItem) => {
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
          let indexNotCompleteSubTask = taskSelected.subtasks.find((item) => item.statusTaskId !== TASK_STATUS.COMPLETE);
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
    setErrorMessageCallAPI('');
    // call API success: delete data local
    if (response?.status === STATUS_CALL_API.SUCCESS) {
      reloadData();
    } else {
      // TODO handle update API fail
      setErrorMessageCallAPI(translate(responseMessages.ERR_LOG_0001));
    }
  }
  /**
   * reload data event
   */
  const reloadData = () => {
    loadData(0, LIMIT_TASK_PER_PAGE, MODE_LOAD_DATA.Reload);
  }
  /**
   * display list employee
   * @param taskId task view
   */
  const displayListEmployees = (task: TaskItem) => {
    setVisibleInfoEmployees(true);
    setListEmployee(task.employees);
  }

  /**
   * update status
   * @param task task update
   * @param status status update
   */
  const handleUpdateStatus = (task: TaskItem, status: number) => {
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
          let indexNotCompleteSubTask = task.subtasks.find((item) => item.statusTaskId !== TASK_STATUS.COMPLETE);
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
    // TODO update database
    let response = await updateTaskStatus(
      {
        taskId,
        statusTaskId,
        updateFlg
      }
    )
    setErrorMessageCallAPI('');
    if (response?.status === STATUS_CALL_API.SUCCESS) {
      reloadData();
    } else {
      // TODO update local when update database fail
      setErrorMessageCallAPI(translate(responseMessages.ERR_LOG_0001));
    }
  }

  /**
   * load more data when scroll
   */
  const loadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    loadData(dataTask?.length, LIMIT_TASK_PER_PAGE, MODE_LOAD_DATA.LoadMore);
  }

/**
 * convert position from API to array and get first by langue user
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
      //alert(error)
    }
  
    return "";
  }
  function taskListEmpty() {
    let service = serviceFavorite.find(item => item.serviceId === SERVICE_ID_TASK);
    !service && (service = serviceOther.find(item => item.serviceId === SERVICE_ID_TASK));
    return service && <CommonFilterMessage
      iconName={service.iconPath}
      content={format(translate(responseMessages.INF_COM_0020), StringUtils.getFieldLabel(service, "serviceName", authorization.languageCode))}></CommonFilterMessage>
  }
  return (
    <View>
      {dataTask.length === 0 ? taskListEmpty() :
      <FlatList
        data={dataTask}
        onEndReached={() => {
          if (dataTask.length >= LIMIT_TASK_PER_PAGE) loadMore(); 
          }}
        ListHeaderComponent={
          (errorMessageCallAPI !== '' ?
            <View style={ListTaskStyle.errorContainer}>
              <View style={ListTaskStyle.iconWarningContainer}><Icon name={'ERR'} /></View>
              <View style={ListTaskStyle.errorMessageContainer}><Text style={ListTaskStyle.errorMessage}>{errorMessageCallAPI}</Text></View>
            </View> : <></>)}
        keyExtractor={(item) => item.taskId.toString()}
        renderItem={({ item }) => (
          <View
            style={[ListTaskStyle.itemContainer, item.statusTaskId !== TASK_STATUS.COMPLETE && utcToTz(
              item.finishDate,
              authorization.timezoneName,
              authorization.formatDate || APP_DATE_FORMAT_ES,
              DATE_TIME_FORMAT.User
            ).substring(0, 10) < moment().format(authorization.formatDate?.toUpperCase() || APP_DATE_FORMAT_ES) ? ListTaskStyle.itemHover : ListTaskStyle.itemNormal]}
          >
            <View style={ListTaskStyle.statusAndCustomerContainer} >
              <View style={ListTaskStyle.customerNameContainer}>
                <Text style={ListTaskStyle?.customerName} numberOfLines={1} >
                  {`${item.customers[0]?.customerName} ${item.productTradings.length === 0?"":"/"} ${item.productTradings.map((product) => product.productTradingName).join(',')}`}
                </Text>
              </View>
              <View style={ListTaskStyle.statusContainer}>
                <Text style={ListTaskStyle.status}>
                  {item.statusTaskId === TASK_STATUS.TODO ?
                    translate(messages.notStartedTask) :
                    item.statusTaskId === TASK_STATUS.DOING ?
                      translate(messages.doingTask) :
                      translate(messages.doneTask)
                  }
                </Text>
              </View>
            </View>
            <Text><Text style={ListTaskStyle.taskName} onPress={() => {
              displayDetailTask(item.taskId);
            }}> {item.taskName}</Text></Text>
            <Text style={utcToTz(
              item.finishDate,
              authorization.timezoneName,
              authorization.formatDate || APP_DATE_FORMAT_ES,
              DATE_TIME_FORMAT.User
            ).substring(0, 10) < moment().format(authorization.formatDate || APP_DATE_FORMAT_ES) && item.statusTaskId !== TASK_STATUS.COMPLETE ?
              ListTaskStyle.finishDateExpire : ListTaskStyle.finishDate}>
              {`${translate(messages.finishDateLabel)}: ${utcToTz(
                item.finishDate,
                authorization.timezoneName,
                authorization.formatDate || APP_DATE_FORMAT_ES,
                DATE_TIME_FORMAT.User
              ).substring(0, 10)}`}
            </Text>

            <View style={ListTaskStyle.infoContainer}>
              <View style={ListTaskStyle.iconContainer}>
                {item.milestoneId &&
                  <Icon name={'milestone'} style={ListTaskStyle.iconItem} />
                }
                {item?.subtasks?.length > 0 &&
                  <Icon name={'memo'} style={[ListTaskStyle.iconItem, ListTaskStyle.iconMemo]} /> 
                }
                <TouchableOpacity
                  onPress={() => { handleEditTask(item) }
                  }
                >
                  <Icon name={'edit'} style={ListTaskStyle.iconItem} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { handleRemoveTask(item) }
                  }
                >
                  <Icon name={'erase'} style={ListTaskStyle.iconItem} />
                </TouchableOpacity>
              </View>
              <View style={ListTaskStyle.avatarContainer}>
                {item?.employees?.length > 0 && (
                  item.employees.slice(0, LIMIT_EMPLOYEES_AVATAR_DISPLAY).map((employee: Employee) => (
                    employee.photoFilePath !== '' ?
                    <TouchableOpacity  onPress={() => { displayListEmployees(item)}}>
                      <Image style={ListTaskStyle.avatar} source={{ uri: employee.photoFilePath }} key={employee.employeeId} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity  onPress={() => { displayListEmployees(item)}}>
                      <View style={[ListTaskStyle.avatar, ListTaskStyle.backgroundAvatar]} key={employee.employeeId}>
                        <Text style={ListTaskStyle.avatarName}>{employee?.employeeName?.charAt(0)}</Text>
                      </View>
                    </TouchableOpacity>
                  )))}
                {item?.employees?.length > LIMIT_EMPLOYEES_AVATAR_DISPLAY && (
                  <TouchableOpacity
                    onPress={() => { displayListEmployees(item); }
                    }
                    style={[ListTaskStyle.avatar, ListTaskStyle.backgroundMoreDetail]}
                  >
                    <Text style={ListTaskStyle.numberMoreEmployees}>{`+${item?.employees?.length - LIMIT_EMPLOYEES_AVATAR_DISPLAY}`}</Text>
                  </TouchableOpacity>)
                }
              </View>
            </View>
            <View style={ListTaskStyle.buttonContainer}>
              <TouchableOpacity
                onPress={
                  () => { handleUpdateStatus(item, TASK_STATUS.TODO) }
                }
                activeOpacity={item.statusTaskId === TASK_STATUS.TODO ? 1 : 0.3}
                style={[ListTaskStyle.button, item.statusTaskId !== TASK_STATUS.TODO ? ListTaskStyle.enableButton : ListTaskStyle.disableButton]}
              >
                <Text style={item.statusTaskId !== TASK_STATUS.TODO ? ListTaskStyle.enableTextButton : ListTaskStyle.disableTextButton}>
                  {translate(messages.notStartedTask)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  () => { handleUpdateStatus(item, TASK_STATUS.DOING) }
                }
                activeOpacity={item.statusTaskId === TASK_STATUS.DOING ? 1 : 0.3}
                style={[ListTaskStyle.button, item.statusTaskId !== TASK_STATUS.DOING ? ListTaskStyle.enableButton : ListTaskStyle.disableButton]}
              >
                <Text style={item.statusTaskId !== TASK_STATUS.DOING ? ListTaskStyle.enableTextButton : ListTaskStyle.disableTextButton}>
                  {translate(messages.doingTask)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  () => { handleUpdateStatus(item, TASK_STATUS.COMPLETE) }
                }
                activeOpacity={item.statusTaskId === TASK_STATUS.COMPLETE ? 1 : 0.3}
                style={[ListTaskStyle.button, item.statusTaskId !== TASK_STATUS.COMPLETE ? ListTaskStyle.enableButton : ListTaskStyle.disableButton]}
              >
                <Text style={item.statusTaskId !== TASK_STATUS.COMPLETE ? ListTaskStyle.enableTextButton : ListTaskStyle.disableTextButton}>
                  {translate(messages.doneTask)}
                </Text>

              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={(isLoading ?
          <View style={ListTaskStyle.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View> : <></>)}
      />
      }
      <Modal
        isVisible={visiblePopupConfirmUpdateStatus}
        backdropColor={"rgba(0, 0, 0, 0.8)"}
        onBackdropPress={() => setVisiblePopupConfirmUpdateStatus(false)}
        onBackButtonPress={() => setVisiblePopupConfirmUpdateStatus(false)}
        style={ListTaskStyle.popupConfirmContainer}
      >
        <TouchableOpacity activeOpacity={1} style={ListTaskStyle.popupConfirmContent}>
          <Text style={ListTaskStyle.confirmTaskTitle}>{translate(messages.confirmTask)}</Text>
          <Text style={ListTaskStyle.confirmTaskMessage}>{translate(messages.askSubtaskFinished)}</Text>
          <TouchableOpacity onPress={() => {
            updateStatus(taskIdSelected, TASK_STATUS.COMPLETE, STATUS_UPDATE_FLG.COMPLETE_TASK_AND_SUBTASKS);
            setVisiblePopupConfirmUpdateStatus(false);
          }
          }
            style={ListTaskStyle.confirmButtonContainer}
          >
            <Text style={ListTaskStyle.confirmButtonText}>{translate(messages.subTaskComplete)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            updateStatus(taskIdSelected, TASK_STATUS.COMPLETE, STATUS_UPDATE_FLG.COMPLETE_TASK_AND_CONVERT_SUBTASKS);
            setVisiblePopupConfirmUpdateStatus(false);
          }
          }
            style={ListTaskStyle.confirmButtonContainer}
          >
            <Text style={ListTaskStyle.confirmButtonText}>{translate(messages.convertToTask)}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <Modal
        isVisible={visiblePopupConfirmDeleteTask}
        backdropColor={"rgba(0, 0, 0, 0.8)"}
        onBackdropPress={() => setVisiblePopupConfirmDeleteTask(false)}
        onBackButtonPress={() => setVisiblePopupConfirmDeleteTask(false)}
        style={ListTaskStyle.popupConfirmContainer}
      >
        <TouchableOpacity activeOpacity={1} style={ListTaskStyle.deleteTaskConfirmContent}>
          <Text style={ListTaskStyle.deleteTaskTitle}>{translate(messages.confirmTask)}</Text>
          <Text style={ListTaskStyle.deleteTaskMessage}>{translate(messages.askSubtaskRemove)}</Text>
          <TouchableOpacity onPress={() => {
            removeTask(TYPE_DELETE_TASK.DELETE_ALL);
            setVisiblePopupConfirmDeleteTask(false);
          }
          }
            style={ListTaskStyle.confirmButtonContainer}
          >
            <Text style={ListTaskStyle.confirmButtonText}>{translate(messages.subTaskComplete)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            removeTask(TYPE_DELETE_TASK.DELETE_AND_CONVERT);
            setVisiblePopupConfirmDeleteTask(false);
          }
          }
            style={ListTaskStyle.confirmButtonContainer}
          >
            <Text style={ListTaskStyle.confirmButtonText}>{translate(messages.convertToTask)}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setVisiblePopupConfirmDeleteTask(false);
          }
          }
            style={ListTaskStyle.cancelTaskButtonContainer}
          >
            <Text style={ListTaskStyle.cancelButtonText}>{translate(messages.cancelUpdate)}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <Modal
        isVisible={visiblePopupConfirmDeleteSubTask}
        backdropColor={"rgba(0, 0, 0, 0.8)"}
        onBackdropPress={() => setVisiblePopupConfirmDeleteSubTask(false)}
        onBackButtonPress={() => setVisiblePopupConfirmDeleteSubTask(false)}
        style={ListTaskStyle.popupConfirmContainer}
      >
        <TouchableOpacity activeOpacity={1} style={ListTaskStyle.deleteConfirmContent}>
          <Text style={ListTaskStyle.deleteTaskTitle}>{translate(messages.removeTitle)}</Text>
          <Text style={ListTaskStyle.deleteTaskMessage}>{translate(messages.removeTaskSimple)}</Text>
          <View style={ListTaskStyle.deleteTaskButtonContainer}>
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
        style={ListTaskStyle.popupConfirmContainer}
      >
        <TouchableOpacity activeOpacity={1} style={ListTaskStyle.listEmployeesContent}>
          <ScrollView>
            {listEmployee.map((employee: Employee) =>
              <View style={ListTaskStyle.infoEmployeeContainer}>
                <View style={ListTaskStyle.imageEmployeeContainer}>
                  {employee.photoFilePath !== '' ?
                    <Image style={ListTaskStyle.imageEmployee} source={{ uri: employee.photoFilePath }} /> :
                    <View style={[ListTaskStyle.imageEmployee, ListTaskStyle.backgroundAvatar]}>
                      <Text style={ListTaskStyle.imageName}>{employee?.employeeName?.charAt(0)}</Text>
                    </View>}
                </View>
                <View style={ListTaskStyle.infoEmployeeTextContainer}>
                  <Text style={ListTaskStyle.positionNameText} numberOfLines={1}>{`${getPositionName(employee.positionName,authorization.languageCode || LanguageCode.JA_JP)}${getPositionName(employee.positionName,authorization.languageCode || LanguageCode.JA_JP)?'-':''}${employee.departmentName}`}</Text>
                  <Text style={ListTaskStyle.employeeNameText}
                    onPress={() => {
                    }}>
                    {`${employee.employeeSurname}${employee.employeeName?' '+ employee.employeeName : ""}`}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
          <View style={ListTaskStyle.closeButtonContainer}>
            <TouchableOpacity onPress={() => {
              setVisibleInfoEmployees(false);
            }}
              style={ListTaskStyle.closeButton}
            >
              <Text style={ListTaskStyle.closeButtonText}>
                {translate(messages.closeListEmployee)}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

