import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import { useIsDrawerOpen } from '@react-navigation/drawer';

import { RenderItemGlobal } from './render-item-global';
import {
  getGlobalTool,
  updateTaskStatus,
  updateMilestoneStatus,
  deleteMilestones,
  removeTask,
} from '../task-repository';
import { AppIndicator } from '../../../shared/components/app-indicator/app-indicator';
import { CommonStyles } from '../../../shared/common-style';
import { ON_END_REACHED_THRESHOLD, TEXT_EMPTY } from '../../../config/constants/constants';
import { ListEmptyComponent } from '../../../shared/components/list-empty/list-empty';
import moment from 'moment';

import { messages } from './recent-misson-messages';
import { translate } from '../../../config/i18n';
import { ScreenName } from '../../../config/constants/screen-name';
import {
  ControlType,
  UpdateTaskStatusFlag,
  MilestoneStatusFlag,
  deleteTaskFlg,
  TypeMessage,
} from '../../../config/constants/enum';
import { ModalCancel } from '../../../shared/components/modal-cancel';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { stylesRecent } from './recent-misson-style';
import { CommonMessage } from '../../../shared/components/message/message';
import { responseMessages } from '../../../shared/messages/response-messages';

const LIMIT = 20;
export function RecentMissonComplete() {
  const [dataGlobalComplete, setDataGlobalComplete] = useState<Array<any>>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isDrawerOpenDone = useIsDrawerOpen();

  const [modalDeleteTask, setModalDeleteTask] = useState(false);
  const [modalDeleteMilestone, setModalDeleteMilestone] = useState(false);
  const [detailItem, setDetailItem] = useState<any>({});
  const [pageNumber, setPageNumber] = useState(0);
  const [totalData, setTotalData] = useState(0);
  const textEmpty = {
    content: TEXT_EMPTY,
    type: TEXT_EMPTY,
  };

  const [message, setMessage] = useState([textEmpty]);
  const navigation = useNavigation();

  const handleErrorGetDataGlobal = (response: any) => {
    if (response.status === 200) {
        const totalCount =
          response.countTotalTask || 0 + response.countMilestone || 0;
        setDataGlobalComplete(response.data.dataGlobalTools);
        setTotalData(totalCount);
        setRefreshing(false);
    }
  };
  async function getDataGlobalTools(page: number) {
    const params = {
      statusTaskIds: [3],
      statusMilestoneId: 1,
      finishDateFrom:
        moment().subtract(2, 'days').format('YYYY-MM-DDT00:00:00.000') + 'Z',
      finishDateTo: moment().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z',
      limit: LIMIT,
      offset: page * LIMIT,
    };

    const dataGlobalToolComplete = await getGlobalTool(params);

    if (dataGlobalToolComplete) {
      handleErrorGetDataGlobal(dataGlobalToolComplete);
    }
  }

  useEffect(() => {
    if (isDrawerOpenDone) {
      getDataGlobalTools(pageNumber);
    }
  }, []);

  useEffect(() => {
    if (dataGlobalComplete.length == LIMIT || pageNumber > 0) {
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

  const showMessSuccess = (code:any) => {
    setMessage([
      {
        content: translate(code),
        type: TypeMessage.SUCCESS,
      },
    ]);
    setTimeout(() => {
      setMessage([textEmpty]);
    }, 2000);
  }

  // open modal change status task and milestone

  const changeStatusTaskAndMilestone = (item: any) => {
    if (item.taskData) {
      changeStatusTaskAndSubTask(
        UpdateTaskStatusFlag.ONLY_TASK_NOT_DONE,
        item.taskData
      );
    } else {
      changeStatusMilestone(
        MilestoneStatusFlag.ONLY_MILESTONE_UNFINISHED,
        item.milestoneData
      );
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
        const newDataGlobal = _.cloneDeep(dataGlobalComplete).map(
          (elm: any) => {
            if (
              taskDetailResponse.data.taskIds.includes(elm.taskData?.taskId)
            ) {
              elm.taskData.statusTaskId = 1;
            }
            return elm;
          }
        );
        showMessSuccess(responseMessages. INF_TOD_0002)
        setDataGlobalComplete(newDataGlobal);

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
          const newDataGlobal = _.cloneDeep(dataGlobalComplete).map((elm: any) => {
            if (response.data === elm.milestoneData?.milestoneId) {
              elm.milestoneData.statusMilestoneId = 0;
            }
            return elm;
          });
          setDataGlobalComplete(newDataGlobal);
          showMessSuccess(responseMessages. INF_TOD_0002)
         
        }
    }
    callApiChangeStatusMilestone();
  };

  // handel open modal delete

  const openModalDelete = (item: any) => {
    if (item.taskData) {
      setModalDeleteTask(true);
      setDetailItem(item.taskData);
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
      if (response) {
        if (response.status === 200) {
          const newData = _.cloneDeep(dataGlobalComplete).filter((elm: any) => {
            return !response.data.taskIds.includes(elm.taskData?.taskId);
          });
          setDataGlobalComplete(newData)
          setModalDeleteTask(false);
          showMessSuccess(responseMessages.INF_COM_0005)
        }
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
      if (milestoneDetailResponse) {
        if (milestoneDetailResponse.status === 200) {
          const newData = _.cloneDeep(dataGlobalComplete).filter(
            (elm: any) =>
              elm.milestoneData.milestoneId !== milestoneDetailResponse.data
          );
          setDataGlobalComplete(newData);
          setModalDeleteMilestone(false);
          showMessSuccess(responseMessages.INF_COM_0005)
        }
      }
    }
    callApiDeleteMilestone();
  };

  //handel delete task
  const handelDeleteTask = () => {
    detailItem.parentTaskId
      ? deleteTask(deleteTaskFlg.DELETE_ONLY_TASK_SUBTASK)
      : deleteTask(deleteTaskFlg.DELETE_ALL);
  };

  const renderItemGlobal = (item: any) => {
    return (
      <RenderItemGlobal
        item={item}
        screen="complete"
        changeStatus={() => changeStatusTaskAndMilestone(item)}
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
      />
    );
  };

  /**
   * pull to refresh
   */
  const onRefresh = () => {
    // dispatch empty array in here
    setDataGlobalComplete([]);
    setRefreshing(true);
  };

  const onEndReached = () => {
    if (
      dataGlobalComplete.length < totalData &&
      dataGlobalComplete.length > 0
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
          dataGlobalComplete.length < totalData && dataGlobalComplete.length > 0
        }
      />
    );
  };

  const renderListEmptyComponent = () => {
    return <ListEmptyComponent />;
  };
  return (
    <View style={{flex:1}}>
      <FlatList
        data={dataGlobalComplete}
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
      <ModalCancel
        visible={modalDeleteMilestone}
        closeModal={() => setModalDeleteMilestone(false)}
        titleModal={translate(messages.confirmation)}
        contentModal={translate(messages.evenIfDeleteMilestone)}
        textBtnLeft={translate(messages.cancel)}
        textBtnRight={translate(messages.delete)}
        onPress={() => deleteMilestone()}
      />
      <ModalCancel
        visible={modalDeleteTask}
        closeModal={() => setModalDeleteTask(false)}
        titleModal={translate(messages.confirmation)}
        contentModal={translate(messages.confirmDeleteTask)}
        textBtnLeft={translate(messages.cancel)}
        textBtnRight={translate(messages.delete)}
        onPress={() => handelDeleteTask()}
      />
      {message[0].type == TypeMessage.SUCCESS && (
          <View style={stylesRecent.boxMessageSuccess}>
            <CommonMessage  widthMessage="90%" content={message[0].content} type={message[0].type} />
          </View>
        )}
    </View>
  );
}
