import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import { translate } from '../../../config/i18n';
import { theme } from '../../../config/constants';
import { Icon } from '../../../shared/components/icon';
import { listTaskSelector } from './list-task-selector';
import { taskAction, Task } from './list-task-reducer';
import { updateTaskStatus } from '../task-repository';
import { ModalOption } from '../../../shared/components/modal-option';
import { messages } from './list-task-messages';
import { ListTaskTabStyles } from './list-task-style';
import { TEXT_EMPTY, LEFT_SLASH } from '../../../config/constants/constants';
import { ScreenName } from '../../../config/constants/screen-name';
import { getListTask } from '../task-repository';
import { ListEmptyComponent } from '../../../shared/components/list-empty/list-empty';
import { AppIndicator } from '../../../shared/components/app-indicator/app-indicator';
import { getLocalNavigationSelector } from '../drawer/drawer-task-seletor';
import {
  PlatformOS,
  StatusTaskId,
  UpdateTaskStatusFlag,
  ControlType,
} from '../../../config/constants/enum';
import { EnumFmDate } from '../../../config/constants/enum-fm-date';
import _ from 'lodash';
import { TabHistoryStyles } from '../task-detail/task-detail-style';
// import { ServiceInfoSelector, ServiceFavoriteSelector } from '../../menu/menu-feature-selector';
import { responseMessages } from '../../../shared/messages/response-messages';

const ICON_OBJECT = {
  milestone: 'milestone',
  memo: 'memo',
  edit: 'edit',
  erase: 'erase',
};

/**
 * component show list task tab
 */
export const ListTaskTab = () => {
  const taskSelector = useSelector(listTaskSelector) || [];
  const [dataTask, setDataTask] = useState(taskSelector);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isLoadingBottom, setLoadingBottom] = useState<boolean>(false);
  const [optionVisible, setOptionVisible] = useState<boolean>(false);
  const [itemSaved, setItemSaved] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [totalTask, setTotalTask] = useState(0);
  const drawerSelector = useSelector(getLocalNavigationSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const routes: any = useRoute();
  // const serviceInfo = useSelector(ServiceInfoSelector)
  // const serviceFavorite = useSelector(ServiceFavoriteSelector)

  // const serviceTask = [...serviceInfo, ...serviceFavorite].filter((elm) => elm.serviceId == 15)
  /**
   * create body for query
   * @param offset number
   */
  const createBodyQuery = (offset: number, statusTaskId: number) => {
    let initLocalNavigation = {
      customerIds: [],
      employeeIds: [],
      finishDate: null,
      groupIds: [],
      startDate: null,
    };
    let employeeArray: any = [],
      groupArray: any = [];
    drawerSelector.searchDynamic.departments.forEach((element: any) => {
      element.employees.forEach((el: any) => {
        if (el.isSelected === 1) {
          employeeArray.push(el.employeeId);
        }
      });
    });
    drawerSelector.searchDynamic.groups.forEach((element: any) => {
      if (element.isSelected === 1) {
        groupArray.push(element.groupId);
      }
      element.employees.forEach((el: any) => {
        if (el.isSelected == 1) {
          employeeArray.push(el.employeeId);
        }
      });
    });
    initLocalNavigation.groupIds = groupArray;
    initLocalNavigation.employeeIds = employeeArray;
    return {
      statusTaskIds: [statusTaskId],
      orderBy: [],
      searchLocal: TEXT_EMPTY,
      limit: 30,
      offset,
      filterByUserLoginFlg: 0,
      filterConditions: [],
      searchConditions: [],
      localNavigationConditons: initLocalNavigation,
    };
  };

  let onEndReachedCalledDuringMomentum: boolean;

  /**
   * query list task
   */
  const callApiGetListTaskData = async (statusTaskId: number) => {
    const listTaskResponse = await getListTask(
      createBodyQuery(0, statusTaskId),
      {}
    );
    setTotalTask(listTaskResponse?.data?.dataInfo?.countTotalTask);
    onEndReachedCalledDuringMomentum = true;
    dispatch(taskAction.getListTask(listTaskResponse?.data?.dataInfo?.tasks));
    setDataTask(listTaskResponse?.data?.dataInfo?.tasks);
    setRefreshing(false);
    setLoading(false);
    setLoadingBottom(false);
  };

  const handleLoading = () => {
    setLoading(true);
    const { params } = routes;
    const { statusTaskId = 0 } = params;
    callApiGetListTaskData(statusTaskId);
  }

  useEffect(() => {
    navigation.addListener('focus', handleLoading);
    return () => {
      navigation.removeListener('focus', handleLoading);
    };
  }, [routes.params.statusTaskId, drawerSelector]);

  // useEffect(() => {
  //   setDataTask(taskSelector);
  // }, [taskSelector]);

  /**
   * check if subtask exist
   * @param subTasks
   * @param parrentTaskId
   */
  const isAllSubTaskComplete = (subTasks: any, parrentTaskId: number) => {
    if (parrentTaskId || parrentTaskId === 0) return true;
    if (!subTasks || subTasks.length === 0) return true;
    return subTasks.findIndex((subTask: any) => subTask.statusId !== 3) < 0;
  };

  /**
   * get flg for update status
   * @param newStatusId
   * @param statusId
   * @param isSubTaskComplete
   */
  const getUpdateFlag = (
    newStatusId: number,
    statusId: number,
    isSubTaskComplete: boolean
  ) => {
    if (statusId === StatusTaskId.NOT_DONE) {
      if (newStatusId === StatusTaskId.DOING) {
        return UpdateTaskStatusFlag.TASK_DOING;
      }
      if (newStatusId === StatusTaskId.DONE) {
        if (isSubTaskComplete) {
          return UpdateTaskStatusFlag.ONLY_TASK_COMPLETE;
        }
        return 0; // [4 or 3]
      }
    } else if (statusId === StatusTaskId.DOING) {
      if (newStatusId === StatusTaskId.NOT_DONE) {
        return UpdateTaskStatusFlag.ONLY_TASK_NOT_DONE;
      }
      if (newStatusId === StatusTaskId.DONE) {
        if (isSubTaskComplete) {
          return UpdateTaskStatusFlag.ONLY_TASK_COMPLETE;
        }
        return 0; // [4 or 3]
      }
    } else if (statusId === StatusTaskId.DONE) {
      if (newStatusId === StatusTaskId.NOT_DONE) {
        return UpdateTaskStatusFlag.ONLY_TASK_NOT_DONE;
      }
      return UpdateTaskStatusFlag.TASK_DOING;
    }
    return -2;
  };

  /**
   * click common button to update task status
   * @param buttonIndex
   * @param item
   * @param updateFlgDefault
   */
  const clickButton = async (
    buttonIndex: number,
    item: any,
    updateFlgDefault?: number
  ) => {
    if (buttonIndex + 1 === item.statusTaskId) return;
    let updateFlg = !!updateFlgDefault
      ? updateFlgDefault
      : getUpdateFlag(
        buttonIndex + 1,
        item.statusTaskId,
        isAllSubTaskComplete(item.subtasks, item.parentStatusTaskId)
      );
    if (updateFlg > 0) {
      const params: any = {
        taskId: item.taskId,
        statusTaskId: item.statusTaskId,
        updateFlg,
      };

      const updateResponse = await updateTaskStatus(params, {});

      if (updateResponse.status === 200) {
        const dataTaskId = updateResponse.data.taskIds;

        const newTasks = _.cloneDeep(dataTask).map((elm) => {
          if (dataTaskId.includes(elm.taskId)) {
            elm.statusTaskId = buttonIndex + 1;
          }
          return elm;
        });
        setDataTask(newTasks);

        // const { taskId } = item;

        // const taskIndex = dataTask.findIndex((task) => {
        //   return task.taskId === taskId;
        // });
        // console.log("xxxx", taskIndex);

        // const newTasks = [];
        // const newItem = { ...item };
        // newItem.statusTaskId = buttonIndex + 1;
        // for (let i = 0; i < dataTask.length; i++) {
        //   if (taskIndex === i) {
        //     newTasks.push(newItem);
        //   } else {
        //     newTasks.push(dataTask[i]);
        //   }
        // }
      }
      setOptionVisible(false);
      setItemSaved(null);
    } else {
      setOptionVisible(true);
      setItemSaved(item);
    }
  };

  /**
   * render common button
   * @param title
   * @param disable
   * @param isCenter
   * @param onButtonPress
   */
  const renderCommonButton = (
    title: string,
    disable?: boolean,
    isCenter?: boolean,
    onButtonPress?: () => void
  ) => (
      <TouchableOpacity
        onPress={onButtonPress}
        activeOpacity={disable ? 1 : 0.3}
        style={[
          ListTaskTabStyles.commonButton,
          {
            marginHorizontal: isCenter ? theme.space[4] : 0,
          },
          disable
            ? ListTaskTabStyles.disableButton
            : ListTaskTabStyles.activeButton,
        ]}
      >
        <Text
          style={{ color: disable ? theme.colors.blue200 : theme.colors.black }}
        >
          {` ${title} `}
        </Text>
      </TouchableOpacity>
    );

  /**
   * press icon item
   * @param name
   * @param item
   */
  const pressIcon = (name: string, item: any) => {
    if (name === ICON_OBJECT.erase) {
      const taskListId = [{ taskId: item.taskId }];
      let processFlg = 1;
      if (isAllSubTaskComplete(item.subtasks, item.parentTaskId)) {
        if (item.subtasks.length > 0) {
          processFlg = 2;
        }
        dispatch(
          taskAction.toggleModalRemove({
            visible: true,
            optionVisible: false,
            taskListId,
            processFlg,
          })
        );
      } else {
        dispatch(
          taskAction.toggleModalRemove({
            visible: false,
            optionVisible: true,
            taskListId,
            processFlg: 0,
          })
        );
      }
    }
    if (name === ICON_OBJECT.edit) {
      navigation.navigate(

        ScreenName.CREATE_TASK,
        {
          taskId: item.taskId,
          type: ControlType.EDIT,
        }
      );
    }
  };

  /**
   * close update status modal
   */
  const handleCloseModal = () => {
    setOptionVisible(false);
  };

  /**
   * navigate to task detail screen
   */
  const pressTaskItem = (taskId: number) => {
    navigation.navigate(ScreenName.TASK_DETAIL, { taskId });
  };

  /**
   * render item
   */
  const renderTaskItem = (dataTaskItem: { item: Task; index: number }) => {
    const { item } = dataTaskItem;
    const { customers, productTradings, employees = [] } = item;
    const productName =
      productTradings.length > 0 ? productTradings[0].productName : TEXT_EMPTY;
    const customerName =
      customers.length > 0 ? customers[0].customerName : TEXT_EMPTY;

    return (
      <TouchableOpacity
        onPress={() => pressTaskItem(item.taskId)}
        key={item.taskId}
        style={[ListTaskTabStyles.itemContainer,
        moment(item.finishDate).unix() - moment().unix() < 0 && item.statusTaskId != 3
        && ListTaskTabStyles.themeError]}
      >
        <Text>{`${customerName} ${
          productName && LEFT_SLASH
          } ${productName}`}</Text>
        <Text
          style={[
            ListTaskTabStyles.taskName,
            {
              textDecorationLine:
                item.statusTaskId !== routes.params.statusTaskId &&
                  item.statusTaskId === StatusTaskId.DONE
                  ? 'line-through'
                  : 'none',
            },
          ]}
        >
          {item.taskName}
        </Text>
        <Text>
          {`${translate(messages.deadlineTask)}: `}
          {moment(item.finishDate, EnumFmDate.YEAR_MONTH_DAY_NORMAL).format(
            EnumFmDate.YEAR_MONTH_DAY_NORMAL
          )}
        </Text>
        <View style={ListTaskTabStyles.infoContainer}>
          <View style={ListTaskTabStyles.iconView}>
            {!!item.milestoneId && (
              <TouchableOpacity
                onPress={() => pressIcon(ICON_OBJECT.milestone, item)}
                key={ICON_OBJECT.milestone}
              >
                <Icon
                  name={ICON_OBJECT.milestone}
                  style={ListTaskTabStyles.iconItem}
                />
              </TouchableOpacity>
            )}
            {item.subtasks && item.subtasks.length > 0 ? (
              <TouchableOpacity
                onPress={() => pressIcon(ICON_OBJECT.memo, item)}
                key={ICON_OBJECT.memo}
              >
                <Icon
                  name={ICON_OBJECT.memo}
                  style={ListTaskTabStyles.iconItem}
                />
              </TouchableOpacity>
            ) : (
                <View />
              )}
            <TouchableOpacity
              onPress={() => pressIcon(ICON_OBJECT.edit, item)}
              key={ICON_OBJECT.edit}
            >
              <Icon
                name={ICON_OBJECT.edit}
                style={ListTaskTabStyles.iconItem}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pressIcon(ICON_OBJECT.erase, item)}
              key={ICON_OBJECT.erase}
            >
              <Icon
                name={ICON_OBJECT.erase}
                style={ListTaskTabStyles.iconItem}
              />
            </TouchableOpacity>
          </View>
          <View style={ListTaskTabStyles.employeeList}>
            {employees.length > 0 ? (
              item.employees.slice(0, 3).map((employee: any) => (
                <TouchableOpacity key={`${item.taskId}_${employee.employeeId}`}>
                  {employee.photoFilePath ? <Image
                    style={TabHistoryStyles.userAvatar}
                    source={{ uri: employee.photoFilePath }}
                  />
                    : <View style={TabHistoryStyles.userAvatarDefault}>
                      <Text style={TabHistoryStyles.txtUserName}>
                        {`${employee.employeeName + employee.employeeSurname}`[0]}
                      </Text>
                    </View>}
                </TouchableOpacity>
              ))
            ) : (
                <View />
              )}
            {item.countEmployee - 3 > 0 ? (
              <View style={ListTaskTabStyles.moreEmpoyee}>
                <Text style={ListTaskTabStyles.numberMoreEmpoyees}>
                  +{employees.length - 3}
                </Text>
              </View>
            ) : (
                <View />
              )}
          </View>
        </View>
        <View style={ListTaskTabStyles.buttonContainer}>
          {renderCommonButton(
            translate(messages.notStartedTask),
            item.statusTaskId === 1,
            false,
            () => clickButton(0, item)
          )}
          {renderCommonButton(
            translate(messages.doingTask),
            item.statusTaskId === 2,
            true,
            () => clickButton(1, item)
          )}
          {renderCommonButton(
            translate(messages.doneTask),
            item.statusTaskId === 3,
            false,
            () => clickButton(2, item)
          )}
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * pull to refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(taskAction.getListTask([]));
    const { params } = routes;
    const { statusTaskId = 0 } = params;
    callApiGetListTaskData(statusTaskId);
  };

  /**
   * call API when reach end of list
   */
  const onEndReached = () => {
    setLoadingBottom(true);
    const { params } = routes;
    const { statusTaskId = 0 } = params;
    if (dataTask?.length < totalTask) {
      callApiGetListTaskData(statusTaskId);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={ListTaskTabStyles.loadingContainer}>
        <AppIndicator />
      </SafeAreaView>
    );
  }

  const keyExtractor = (item: Task) => `${item.taskId}`;
  return (
    <SafeAreaView style={ListTaskTabStyles.dataContainer}>
      <FlatList
        data={dataTask}
        renderItem={renderTaskItem}
        keyExtractor={keyExtractor}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ListEmptyComponent icon="content/images/task/ic-time1.svg"
            content={translate(responseMessages.INF_COM_0020).replace('{0}', translate(messages.taskTitle))}
          />}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum = false;
        }}
        ListHeaderComponent={
          <AppIndicator
            visible={Platform.OS === PlatformOS.ANDROID && refreshing}
          />
        }
        ListFooterComponent={
          taskSelector.length < totalTask ? (
            <AppIndicator visible={isLoadingBottom} />
          ) : (
              <View />
            )
        }
      />
      <ModalOption
        visible={optionVisible}
        titleModal={translate(messages.confirmTask)}
        contentModal={translate(messages.askSubtaskFinished)}
        contentBtnFirst={translate(messages.subTaskComplele)}
        contentBtnSecond={translate(messages.convertToTask)}
        txtCancel={translate(messages.cancelUpdate)}
        closeModal={handleCloseModal}
        onPressFirst={() => clickButton(2, itemSaved, 3)}
        onPressSecond={() => clickButton(2, itemSaved, 4)}
      />
    </SafeAreaView>
  );
};
