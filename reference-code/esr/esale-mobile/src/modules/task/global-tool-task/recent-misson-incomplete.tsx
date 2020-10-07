import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import _ from 'lodash';
import moment from 'moment';

import { RenderItemGlobal } from './render-item-global';
import { ModalOption } from '../../../shared/components/modal-option';
import { ModalCancel } from '../../../shared/components/modal-cancel';
import { messages } from './recent-misson-messages';
import { translate } from '../../../config/i18n';
import {
  deleteMilestones,
  getGlobalTool,
  updateMilestoneStatus,
  updateTaskStatus,
  removeTask,
} from '../task-repository';
import { globalToolActions } from './global-tool-reducer';
import { AppIndicator } from '../../../shared/components/app-indicator/app-indicator';
import { CommonStyles } from '../../../shared/common-style';
import {
  ON_END_REACHED_THRESHOLD,
  TEXT_EMPTY,
} from '../../../config/constants/constants';
import { ListEmptyComponent } from '../../../shared/components/list-empty/list-empty';
import { ScreenName } from '../../../config/constants/screen-name';
import {
  MilestoneStatusFlag,
  UpdateTaskStatusFlag,
  deleteTaskFlg,
  ControlType,
  TypeMessage,
} from '../../../config/constants/enum';
import { getCountTaskAndMilestone } from './global-tool-selector';
import { CommonMessage } from '../../../shared/components/message/message';
import { stylesRecent } from './recent-misson-style';
import { responseMessages } from '../../../shared/messages/response-messages';

const LIMIT = 20;
export function RecentMissonInComplete() {
  const [dataGlobalTool, setDataGlobalTool] = useState<Array<any>>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalStatusComplete, setModalStatusComplete] = useState(false);
  const [modalMilestoneComplete, setModalMilestoneComplete] = useState(false);
  const [modalDeleteTask, setModalDeleteTask] = useState(false);
  const [modalDeleteOnlyTask, setModalDeleteOnlyTask] = useState(false);
  const [modalDeleteMilestone, setModalDeleteMilestone] = useState(false);
  const [detailItem, setDetailItem] = useState<any>({});
  const [pageNumber, setPageNumber] = useState(0);
  const textEmpty = {
    content: TEXT_EMPTY,
    type: TEXT_EMPTY,
  };

  const [message, setMessage] = useState([textEmpty]);
  const countTaskAndMilestone = useSelector(getCountTaskAndMilestone);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const isDrawerOpen = useIsDrawerOpen();

  const handleErrorGetDataGlobal = (response: any) => {
    if (response.status ===200) {
        setDataGlobalTool(response.data.dataGlobalTools);
        dispatch(globalToolActions.getGlobalTool(response.data));
        setRefreshing(false);
    }
  };

  async function getDataGlobalTools(page: number) {
    const params = {
      statusTaskIds: [1, 2],
      statusMilestoneId: 0,
      finishDateFrom: `${moment().format('YYYY-MM-DDT00:00:00.000')}Z`,
      finishDateTo: `${moment()
        .add(2, 'days')
        .format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`,
      limit: LIMIT,
      offset: page * LIMIT,
    };

    const dataGlobalToolResponse = await getGlobalTool(params);
    if (dataGlobalToolResponse) {
      handleErrorGetDataGlobal(dataGlobalToolResponse);
    }
  }

  useEffect(() => {
    if (isDrawerOpen) {
      getDataGlobalTools(pageNumber);
    }
  }, []);

  useEffect(() => {
    if (dataGlobalTool.length == LIMIT || pageNumber > 0) {
      getDataGlobalTools(pageNumber);
    }
  }, [pageNumber]);

  const goEditTask = (item: any) => {
    navigation.navigate(ScreenName.CREATE_TASK, {
      taskId: item.taskId,
      type: ControlType.EDIT,
    });
  };
  const goEditMilestone = (item: any) => {
    navigation.navigate(ScreenName.CREATE_MILESTONE, {
      milestoneId: item.milestoneId,
      type: ControlType.EDIT,
    });
  };

  const goTaskDetail = (item: any) => {
    navigation.navigate(ScreenName.TASK_DETAIL, {
      taskId: item.taskId,
    });
  };
  const goMilestoneDetail = (item: any) => {
    navigation.navigate(ScreenName.MILESTONE_DETAIL, {
      milestoneId: item.milestoneId,
    });
  };

  const showMessSuccess = (code: any) => {
    setMessage([
      {
        content: translate(code),
        type: TypeMessage.SUCCESS,
      },
    ]);
    setTimeout(() => {
      setMessage([textEmpty]);
    }, 2000);
  };
  // open modal change status task and milestone

  const openModalStatusTaskAndMilestone = (item: any) => {
    if (item.taskData) {
      const { taskData } = item;

      setDetailItem(taskData);
      if (
        _.isEmpty(taskData.subtasks) ||
        taskData.subtasks.filter((elm: any) => elm.statusTaskId === 3)
          .length === taskData.subtasks.length
      ) {
        changeStatusTaskAndSubTask(
          UpdateTaskStatusFlag.ONLY_TASK_COMPLETE,
          item.taskData
        );
      } else {
        setModalStatusComplete(true);
      }
    } else {
      setDetailItem(item.milestoneData);
      if (
        _.isEmpty(item.milestoneData.tasks) ||
        item.milestoneData.tasks.filter((elm: any) => elm.statusTaskId === 3)
          .length === item.milestoneData.tasks.length
      ) {
        changeStatusMilestone(
          MilestoneStatusFlag.ONLY_MILESTONE_UNFINISHED,
          item.milestoneData
          );
        } else {
          setModalMilestoneComplete(true);
      }
    }
  };

  // function change status task and subtask

  const changeStatusTaskAndSubTask = (flag: any, item: any) => {
    async function callApiChangeStatusTaskAndSubTask() {
      const params = {
        taskId: item.taskId,
        statusTaskId: item.statusTaskId,
        updateFlg: flag,
      };
      const taskDetailResponse = await updateTaskStatus(params, {});

      if (taskDetailResponse.status === 200) {
        if (flag === UpdateTaskStatusFlag.TASK_COMPLETE_SUBTASK_NEWTASK) {
          const newDataGlobal = _.cloneDeep(dataGlobalTool).map((elm: any) => {
            if (elm.taskData?.taskId === item.taskId) {
              elm.taskData.statusTaskId = 3;
            }
            return elm;
          });
          setDataGlobalTool(newDataGlobal);
        } else {
          const newDataGlobal = _.cloneDeep(dataGlobalTool).map((elm: any) => {
            if (
              taskDetailResponse.data.taskIds.includes(elm.taskData?.taskId)
            ) {
              elm.taskData.statusTaskId = 3;
            }
            return elm;
          });
          setDataGlobalTool(newDataGlobal);
        }
        setModalStatusComplete(false);
        showMessSuccess(responseMessages.INF_TOD_0001);
      }
    }

    callApiChangeStatusTaskAndSubTask();
  };

  // function change status milestone

  const changeStatusMilestone = (flag: any, item: any) => {
    async function callApiChangeStatusMilestone() {
      const params = {
        milestoneId: item.milestoneId,
        statusMilestoneId: item.statusMilestoneId,
        updateFlg: flag,
      };
      const response = await updateMilestoneStatus(params, {});

      if (response.status === 200) {
        const newDataGlobal = _.cloneDeep(dataGlobalTool).map((elm: any) => {
          if (response.data === elm.milestoneData?.milestoneId) {
            elm.milestoneData.statusMilestoneId = 1;
          }
          return elm;
        });
        setDataGlobalTool(newDataGlobal);
        setModalMilestoneComplete(false);
        showMessSuccess(responseMessages.INF_TOD_0001);
      }
    }
    callApiChangeStatusMilestone();
  };

  // handel open modal delete

  const openModalDelete = (item: any) => {
    if (item.taskData) {
      const { taskData } = item;
      setDetailItem(taskData);

      if (
        _.isEmpty(taskData.subtasks) ||
        taskData.subtasks.filter((elm: any) => elm.statusTaskId === 3)
          .length === taskData.subtasks.length
      ) {
        setModalDeleteOnlyTask(true);
      } else {
        setModalDeleteTask(true);
      }
    } else {
      setModalDeleteMilestone(true);
      setDetailItem(item.milestoneData);
    }
  };

  // function call api delete task

  const deleteTask = (flag: any) => {
    async function callApiDeleteTask() {
      const params = {
        taskIdList: [{ taskId: detailItem.taskId }],
        processFlg: flag,
      };
      const response = await removeTask(params, {});
      if (response.status === 200) {

        const newData = _.cloneDeep(dataGlobalTool).filter((elm: any) => {
          return !response.data.taskIds.includes(elm.taskData?.taskId);
        });
        setDataGlobalTool(newData);
        setModalDeleteTask(false);
        setModalDeleteOnlyTask(false);
        showMessSuccess(responseMessages.INF_COM_0005);
      }
    }
    callApiDeleteTask();
  };

  // function call api delete Milestone
  const deleteMilestone = () => {
    async function callApiDeleteMilestone() {
      const params = {
        milestoneId: detailItem.milestoneId,
      };
      const milestoneDetailResponse = await deleteMilestones(params, {});
      if (milestoneDetailResponse.status === 200) {
        const newData = _.cloneDeep(dataGlobalTool).filter(
          (elm: any) =>
            elm.milestoneData.milestoneId !== milestoneDetailResponse.data
        );
        setDataGlobalTool(newData);
        setModalDeleteMilestone(false);
        showMessSuccess(responseMessages.INF_COM_0005);
      }
    }
    callApiDeleteMilestone();
  };

  const renderItemGlobal = (item: any) => {
    return (
      <RenderItemGlobal
        item={item}
        screen="incomplete"
        changeStatus={() => openModalStatusTaskAndMilestone(item)}
        onDelete={() => openModalDelete(item)}
        onEdit={() =>
          item.taskData
            ? goEditTask(item.taskData)
            : goEditMilestone(item.milestoneData)
        }
        goDetail={() =>
          item.taskData
            ? goTaskDetail(item.taskData)
            : goMilestoneDetail(item.milestoneData)
        }
        goEmployeeDetail={(employeeId:any)=> navigation.navigate(ScreenName.EMPLOYEE_DETAIL, { id: employeeId })}  
      />
    );
  };

  /**
   * pull to refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(globalToolActions.clearDataGlobalTool({}));
  };

  const onEndReached = () => {
    if (
      dataGlobalTool.length < countTaskAndMilestone &&
      dataGlobalTool.length > 0
    ) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
    }
  };

  const renderFooter = () => {
    return (
      <AppIndicator
        style={CommonStyles.backgroundTransparent}
        visible={
          dataGlobalTool.length < countTaskAndMilestone &&
          dataGlobalTool.length > 0
        }
      />
    );
  };

  const renderListEmptyComponent = () => {
    return <ListEmptyComponent />;
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dataGlobalTool}
        renderItem={({ item }: any) => renderItemGlobal(item)}
        keyExtractor={(index: number) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderListEmptyComponent}
        onEndReached={onEndReached}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListFooterComponent={renderFooter}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      <ModalOption
        visible={modalStatusComplete}
        titleModal={translate(messages.confirmation)}
        contentModal={translate(messages.completeTaskUnfinishedSubtask)}
        contentBtnFirst={translate(messages.subTaskComplete)}
        contentBtnSecond={translate(messages.convertSubtaskToTask)}
        txtCancel={translate(messages.cancel)}
        closeModal={() => setModalStatusComplete(false)}
        onPressFirst={() =>
          changeStatusTaskAndSubTask(
            UpdateTaskStatusFlag.TASK_AND_SUBTASK_COMPLETE,
            detailItem
          )
        }
        onPressSecond={() =>
          changeStatusTaskAndSubTask(
            UpdateTaskStatusFlag.TASK_COMPLETE_SUBTASK_NEWTASK,
            detailItem
          )
        }
      />
      <ModalOption
        visible={modalMilestoneComplete}
        titleModal={translate(messages.confirmation)}
        contentModal={translate(messages.completeMilestoneContainsTask)}
        contentBtnFirst={translate(messages.completeTask)}
        txtCancel={translate(messages.cancel)}
        closeModal={() => setModalMilestoneComplete(false)}
        onPressFirst={() =>
          changeStatusMilestone(
            MilestoneStatusFlag.MILESTONE_AND_TASK_COMPLETE,
            detailItem
          )
        }
      />
      <ModalOption
        visible={modalDeleteTask}
        titleModal={translate(messages.confirmation)}
        contentModal={translate(messages.taskToDeleteTaskHasSubtask)}
        contentBtnFirst={translate(messages.deleteSubTask)}
        contentBtnSecond={translate(messages.convertSubtaskToTask)}
        txtCancel={translate(messages.cancel)}
        closeModal={() => setModalDeleteTask(false)}
        onPressFirst={() => deleteTask(deleteTaskFlg.DELETE_ALL)}
        onPressSecond={() =>
          deleteTask(deleteTaskFlg.DELETE_TASK_CONVERT_SUBTASK)
        }
      />
      <ModalCancel
        visible={modalDeleteOnlyTask}
        closeModal={() => setModalDeleteOnlyTask(false)}
        titleModal={translate(messages.confirmation)}
        contentModal={translate(messages.confirmDeleteTask)}
        textBtnLeft={translate(messages.cancel)}
        textBtnRight={translate(messages.delete)}
        onPress={() => deleteTask(deleteTaskFlg.DELETE_ONLY_TASK_SUBTASK)}
      />
      <ModalCancel
        visible={modalDeleteMilestone}
        closeModal={() => setModalDeleteMilestone(false)}
        titleModal={translate(messages.confirmation)}
        contentModal={translate(messages.evenIfDeleteMilestone)}
        textBtnLeft={translate(messages.cancel)}
        textBtnRight={translate(messages.delete)}
        onPress={() => deleteMilestone()}
      />
      {message[0].type == TypeMessage.SUCCESS && (
        <View style={stylesRecent.boxMessageSuccess}>
          <CommonMessage
            widthMessage="90%"
            content={message[0].content}
            type={message[0].type}
          />
        </View>
      )}
    </View>
  );
}
