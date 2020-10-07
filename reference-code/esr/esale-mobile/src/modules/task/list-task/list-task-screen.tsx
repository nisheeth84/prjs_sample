
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { translate } from "../../../config/i18n";
// Use this when API work fine
// import { getProductDetail, ProductDetailResponse } from "../products-repository";
// import { queryProductDetails } from "../../../config/constants/query";
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu";
import { ListTaskTab } from "./list-task-tab";
import { taskAction } from "./list-task-reducer";
import { ModalCancel } from "../../../shared/components/modal-cancel";
import { listTaskSelector, modalTaskSelector } from "./list-task-selector";
import { removeTask } from "../task-repository";
import { ModalOption } from "../../../shared/components/modal-option";
import { messages } from "./list-task-messages";
import { TopTabbar } from "../../../shared/components/toptabbar/top-tabbar";
import { StatusTaskId, Position } from "../../../config/constants/enum";
import { CommonStyles } from "../../../shared/common-style";


const Tab = createMaterialTopTabNavigator();

/**
 * Component show list task screen
 */
export const ListTaskScreen = () => {
  const modalSelector = useSelector(modalTaskSelector);
  const taskSelector = useSelector(listTaskSelector);
  const [optionVisible, setOptionVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  /**
   * change modal status by selector
   */
  useEffect(() => {
    setModalVisible(modalSelector.visible);
    setOptionVisible(modalSelector.optionVisible);
  }, [modalSelector]);


  /**
   * Remove task
   * @param taskFlg
   */
  const removeListTasks = async (taskFlg: number) => {
    const { taskListId, processFlg } = modalSelector;
    let flg = taskFlg >= 0 ? taskFlg : processFlg;
    let params = {
      taskIdList: taskListId,
      processFlg: flg,
    };
    const removeResponse = await removeTask(params, {});
    if (removeResponse) {
      const newArray = [...taskSelector];
      const indexFind = newArray.findIndex((taskItem) => {
        return taskItem.taskId === taskListId[0].taskId;
      });
      if (indexFind >= 0) {
        newArray.splice(indexFind, 1);
      }
      dispatch(taskAction.getListTask(newArray));
      dispatch(
        taskAction.toggleModalRemove({
          visible: false,
          optionVisible: false,
          taskListId,
          processFlg,
        })
      );
    } else {
      alert("fail");
    }
  };

  /**
   * handle close remove modal
   */
  const handleCloseModal = () => {
    dispatch(
      taskAction.toggleModalRemove({
        visible: false,
        taskListId: [],
        optionVisible: false,
        processFlg: 0,
      })
    );
  };

  return (
    <SafeAreaView style={CommonStyles.flex1}>
      <AppBarMenu
        name={translate(messages.taskTitle)}
        hasBackButton={false}
        position={Position.CENTER}
      />
      <Tab.Navigator
        lazy
        tabBar={(props) => <TopTabbar count={[0, 0, 0]} {...props} />}
      >
        <Tab.Screen
          name={translate(messages.notStartedTask)}
          component={ListTaskTab}
          initialParams={{ statusTaskId: StatusTaskId.NOT_DONE }}
        />
        <Tab.Screen
          name={translate(messages.doingTask)}
          component={ListTaskTab}
          initialParams={{ statusTaskId: StatusTaskId.DOING }}
        />
        <Tab.Screen
          name={translate(messages.doneTask)}
          component={ListTaskTab}
          initialParams={{ statusTaskId: StatusTaskId.DONE }}
        />
      </Tab.Navigator>
      <ModalCancel
        titleModal={translate(messages.removeTitle)}
        contentModal={translate(messages.removeTaskSimple)}
        onPress={() => removeListTasks(-1)}
        textBtnLeft={translate(messages.cancelUpdate)}
        textBtnRight={translate(messages.removeTitle)}
        closeModal={handleCloseModal}
        visible={modalVisible}
      />
      <ModalOption
        visible={optionVisible}
        titleModal={translate(messages.removeTitle)}
        contentModal={translate(messages.askSubtaskRemove)}
        contentBtnFirst={translate(messages.removeSubtask)}
        contentBtnSecond={translate(messages.newSubTask)}
        txtCancel={translate(messages.cancelUpdate)}
        closeModal={handleCloseModal}
        onPressFirst={() => removeListTasks(2)}
        onPressSecond={() => removeListTasks(3)}
      />
    </SafeAreaView>
  );
};
