import React, { useEffect, useState } from "react";
import { Modal, SafeAreaView, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { DeleteTaskModal } from "./modal/delete-task-modal";
import { statusSelector, taskDetailSelector } from "./task-detail-selector";
import { messages } from "./task-detail-messages";
import { translate } from "../../../config/i18n";
import { taskDetailActions } from "./task-detail-reducer";
import { TaskDetailTopInfo } from "./task-detail-top-info";
import { TaskDetailStyles } from "./task-detail-style";
import { TaskGeneralInforTabScreen } from "./tab-general-info/task-general-infor-tab-screen";
import { EnumStatus } from "../../../config/constants/enum-status";
import {
  Task,
  TaskDetailResponse,
  getTaskDetail,
  updateTaskStatus,
  removeTask,
} from "../task-repository";
import {
  EnumTaskStatus,
  checkTaskAndSubTaskComplete,
  checkTaskStatus,
  getFirstItem,
} from "../utils";
import { DeleteTaskNotCompleteModal } from "./modal/delete-task-not-complete-modal";
import { CompleteTaskModal } from "./modal/complete-task-modal";
import { TaskHistoryTabScreen } from "./tab-history/task-history-tab-screen";
// import { DUMMY_TASK_DETAIL } from "./task-dummy-data";
import { TaskDetailScreenRouteProp } from "../../../config/constants/root-stack-param-list";
import { ListEmptyComponent } from "../../../shared/components/list-empty/list-empty";
import { CommonStyles } from "../../../shared/common-style";
import { TopTabbar } from "../../../shared/components/toptabbar/top-tabbar";
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";
import { ControlType, UpdateTaskStatusFlag, deleteTaskFlg } from "../../../config/constants/enum";
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu";
import { ScreenName } from "../../../config/constants/screen-name";
// import { authorizationSelector } from "../../login/authorization/authorization-selector";

export enum TaskDetailDialog {
  DeleteTaskAndSubTaskComplete,
  DeleteTaskAndSubTaskNotComplete,
  CompleteTask,
}
export interface TaskDetailModal {
  isOpenModal: boolean;
  modalType: TaskDetailDialog;
}

const Tab = createMaterialTopTabNavigator();

/**
 * Task detail screen
 */
export const TaskDetailScreen = () => {
  const taskDetails = useSelector(taskDetailSelector);
  // const auth = useSelector(authorizationSelector);

  const taskDetail: Task = getFirstItem(taskDetails);

  const taskDetailSubtaskComplete =
    taskDetail === undefined
      ? false
      : checkTaskAndSubTaskComplete(taskDetail, false);

  const statusGetTask = useSelector(statusSelector);
  const route = useRoute<TaskDetailScreenRouteProp>();
  const [showEmpty, setShowEmpty] = useState(false);
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const [taskDetailModal, handleToggleModal] = useState<TaskDetailModal>({
    isOpenModal: false,
    modalType: TaskDetailDialog.CompleteTask,
  });

  /**
   * open delete task complete modal
   */
  const openDeleteTaskCompleteModal = () => {
    handleToggleModal({
      isOpenModal: true,
      modalType: TaskDetailDialog.DeleteTaskAndSubTaskComplete,
    });
  };

  /**
   * open delete task not complete modal
   */

  const openDeleteTaskNotCompleteModal = () => {
    handleToggleModal({
      isOpenModal: true,
      modalType: TaskDetailDialog.DeleteTaskAndSubTaskNotComplete,
    });
  };

  /**
   * open complete task modal
   */

  const openCompleteTaskModal = () => {
    handleToggleModal({
      isOpenModal: true,
      modalType: TaskDetailDialog.CompleteTask,
    });
  };

  /**
   * close modal
   */
  const closeModal = () => {
    handleToggleModal({
      isOpenModal: false,
      modalType: taskDetailModal.modalType,
    });
  };

  /**
   * call api complete task
   */
  const completeTask = () => {
    async function callApiCompleteTask() {
      const params = {
        taskId: taskDetail?.taskId,
        statusTaskId: taskDetail?.statusTaskId,
        updateFlg: 2,
      };
      const taskDetailResponse = await updateTaskStatus(params, {});

      if (taskDetailResponse) {
        if (
          taskDetailResponse.status === 200 &&
          taskDetailResponse.data.data.updateTaskStatus !== null
        ) {
          const detail = { ...taskDetail };
          detail.statusTaskId = 3;
          dispatch(taskDetailActions.saveTaskDetail(detail));
        }
      }
    }
    callApiCompleteTask();
  };

  /**
   * call api complete task and subtask
   */

  const changeStatusTask = (flag:number) => {
    async function callApiChangeStatusTask() {
      const params = {
        taskId: taskDetail?.taskId,
        statusTaskId: taskDetail?.statusTaskId,
        updateFlg: flag,
      };
      const taskDetailResponse = await updateTaskStatus(params, {});
      if (taskDetailResponse) {
        if (
          taskDetailResponse.status === 200 &&
          taskDetailResponse.data.data.updateTaskStatus != null
        ) {
          const detail = { ...taskDetail };
          detail.statusTaskId = 3;
          dispatch(taskDetailActions.saveTaskDetail(detail));
          closeModal();
        }
      }
    }
    callApiChangeStatusTask();
  };

  
  /**
   * call api delete task
   */

  const deleteTask = (flag :number) => {
    async function callApiDeleteTask() {
      const params = {
        taskIdList: [{ taskId: taskDetail?.taskId }],
        processFlg: flag,
      };
      const taskDetailResponse = await removeTask(params, {});
      if (taskDetailResponse) {
        if (taskDetailResponse.status === 200) {
          navigation.goBack();
        } else {
          closeModal();
        }
      }
    }
    callApiDeleteTask();
  };

  /**
   * copy task and navigate to add task screen
   */
  const copyTask = () => {
    navigation.navigate(ScreenName.CREATE_TASK, {
      taskId: taskDetail.taskId,
      type: ControlType.COPY,
    });
  };

  /**
   * navigate to edit task screen
   */

  const editTask = () => {
    navigation.navigate(ScreenName.CREATE_TASK, {
      taskId: taskDetail.taskId,
      type: ControlType.EDIT,
    });
  };

  /**
   * handle get task detail
   * @param response
   */
  const handleErrorGetTaskDetail = (response: TaskDetailResponse) => {
    switch (response.status) {
      case 400: {
        break;
      }
      case 500: {
        break;
      }
      case 403: {
        break;
      }
      case 200: {
        if (response.data?.dataInfo?.task) {
          dispatch(taskDetailActions.getTaskDetail(response.data));
        } else {
          setShowEmpty(true);
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      getDataTaskDetail();
    });
    async function getDataTaskDetail() {
      const params = {
        taskId: route.params?.taskId,
      };

      const taskDetailResponse = await getTaskDetail(params, {});

      if (taskDetailResponse) {
        handleErrorGetTaskDetail(taskDetailResponse);
      }
    }
    getDataTaskDetail();
  }, [route.params?.taskId]);

  /**
   * check status get task detail
   * @param status
   */
  const checkStatus = (status: EnumStatus) => {
    switch (status) {
      case EnumStatus.PENDING:
        return (
          <View style={TaskDetailStyles.container}>
            <AppIndicator />
          </View>
        );
      case EnumStatus.SUCCESS:
        return (
          taskDetail && (
            <View style={CommonStyles.flex1}>
              <TaskDetailTopInfo
                taskId={taskDetail.taskId}
                totalEmployees={taskDetail.totalEmployees}
                taskName={taskDetail.taskName}
                startDate={taskDetail.startDate}
                finishDate={taskDetail.finishDate}
                completeTask={() => {
                  taskDetailSubtaskComplete
                    ? completeTask()
                    : openCompleteTaskModal();
                }}
                copyTask={() => {
                  copyTask();
                }}
                editTask={() => {
                  editTask();
                }}
                deleteTask={() => {
                  if (
                    checkTaskStatus(taskDetail.statusTaskId) ===
                    EnumTaskStatus.done
                  ) {
                    openDeleteTaskCompleteModal();
                  } else if (!taskDetailSubtaskComplete) {
                    openDeleteTaskNotCompleteModal();
                  } else {
                    openDeleteTaskCompleteModal();
                  }
                }}
                statusTaskId={taskDetail.statusTaskId}
              />
              <View style={CommonStyles.flex1}>
                <Tab.Navigator
                  lazy
                  tabBar={(props: any) => (
                    <TopTabbar count={[0, 0, 0]} {...props} />
                  )}
                >
                  <Tab.Screen
                    name={translate(messages.basicInfo)}
                    component={TaskGeneralInforTabScreen}
                  />
                  {/* <Tab.Screen name={translate(messages.timeLine)}>
                    {() => (
                      <View>
                        <Text>Timeline Tab</Text>
                      </View>
                    )}
                  </Tab.Screen> */}
                  <Tab.Screen
                    name={translate(messages.changeLog)}
                    component={TaskHistoryTabScreen}
                    initialParams={{ taskId: taskDetail.taskId }}
                  />
                </Tab.Navigator>
              </View>
            </View>
          )
        );
      default:
    }
  };

  /**
   * check and get modal type
   * @param type
   */
  const checkModalType = (type: TaskDetailDialog) => {
    switch (type) {
      case TaskDetailDialog.CompleteTask:
        return (
          <CompleteTaskModal
            onClickCompleteSubTask={() => {
              changeStatusTask(UpdateTaskStatusFlag.TASK_AND_SUBTASK_COMPLETE);
            }}
            onClickConvertSubTaskToTask={() => {
              changeStatusTask(UpdateTaskStatusFlag.TASK_COMPLETE_SUBTASK_NEWTASK);
            }}
            onCloseModal={() => closeModal()}
          />
        );
      case TaskDetailDialog.DeleteTaskAndSubTaskComplete:
        return (
          <DeleteTaskModal
            onClickDelete={() => {
              deleteTask(deleteTaskFlg.DELETE_ONLY_TASK_SUBTASK);
            }}
            onCloseModal={() => {
              closeModal();
            }}
          />
        );

      case TaskDetailDialog.DeleteTaskAndSubTaskNotComplete:
        return (
          <DeleteTaskNotCompleteModal
            onClickDeleteSubTask={() => {
              deleteTask(deleteTaskFlg.DELETE_ALL);
            }}
            onClickConvertSubTaskToTask={() => {
              deleteTask(deleteTaskFlg.DELETE_TASK_CONVERT_SUBTASK);
            }}
            onCloseModal={() => closeModal()}
          />
        );
      default:
    }
  };

  return (
    <SafeAreaView style={TaskDetailStyles.container}>
      <AppBarMenu name={translate(messages.screenTitle)} hasBackButton />
      {showEmpty ? (
        <ListEmptyComponent />
      ) : (
          <View style={CommonStyles.flex1}>
            {checkStatus(statusGetTask)}
            <Modal
              visible={taskDetailModal.isOpenModal}
              animationType="fade"
              transparent
              onRequestClose={() => closeModal()}
            >
              {checkModalType(taskDetailModal.modalType)}
            </Modal>
          </View>
        )}
    </SafeAreaView>
  );
};
