import React, { useEffect } from "react";
import { Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getHistoryTask, Task } from "../../task-repository";
import { Icon } from "../../../../shared/components/icon";
import { TabHistoryStyles } from "../task-detail-style";
import {
  taskDetailHistorySelector,
  taskDetailSelector,
} from "../task-detail-selector";
import { taskDetailActions } from "../task-detail-reducer";
import {
  getFormatDateTaskDetail,
  getFirstItem,
} from "../../utils";
import { EnumFmDate } from "../../../../config/constants/enum-fm-date";
import { CommonStyles } from "../../../../shared/common-style";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TEXT_EMPTY } from "../../../../config/constants/constants";
import { ScreenName } from "../../../../config/constants/screen-name";
import { TaskDetailScreenRouteProp } from "../../../../config/constants/root-stack-param-list";
import {messages} from '../task-detail-messages'
import { translate } from "../../../../config/i18n";

let currentPage = 1

export const TaskHistoryTabScreen = () => {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const taskDetails = useSelector(taskDetailSelector);
  let taskDetail: Task = getFirstItem(taskDetails);
  const historySelector = useSelector(taskDetailHistorySelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  console.log("historySelector", historySelector);


  /**
   * navigate to employee detail screen
   * @param id
   */
  const openEmployeeDetail = (employeeId: number, employeeName: string) => {
    navigation.navigate(ScreenName.EMPLOYEE_DETAIL, { id: employeeId, title: employeeName });
  };

  /**
   * Get list History product
   */
  useEffect(() => {
    const callApi = async () => {
      const params = {
        taskId: route?.params.taskId,
        currentPage: currentPage,
        limit: 30,
      };
      const listTaskHistory = await getHistoryTask(params, {});
      if (listTaskHistory?.status === 200 && !!listTaskHistory?.data?.data) {
        dispatch(taskDetailActions.getTaskHistory(listTaskHistory.data))
      }
    }

    callApi();

  }, [taskDetail]);

  /**
   * Render content change of product
   */
  const renderChangedContent = (contentChange: Array<{
    fieldChange: string;
    valueChange: string;
  }>, contentChangeStr: string) => {

    return (
      <>
      {contentChangeStr && (
          <Text
            numberOfLines={1}
            style={[TabHistoryStyles.changedLabel, {marginBottom: 8}]}
          >
            {contentChangeStr}
          </Text>
      )}
      <View style={TabHistoryStyles.changedContainerParent}>
        <View style={[CommonStyles.flex1]}>
          {contentChange.map((elm, index) => {
            const arrChange = elm.valueChange.split(">");
            const contentCurrent = arrChange[0];
            const contentChanges = arrChange[1];
            return (
              <View style={[TabHistoryStyles.changedContainer]} key={index}>
                <Text numberOfLines={1} style={TabHistoryStyles.changedLabel}>
                  {elm.fieldChange}
                </Text>
                <Text style={CommonStyles.font12}>:</Text>
                <Text numberOfLines={1}  style={CommonStyles.flex1}>
                  <Text style={CommonStyles.font12}>{contentCurrent}</Text>
                  <Icon
                    name="fowardArrow"
                    style={[TabHistoryStyles.arrowIcon]}
                  />
                  <Text style={CommonStyles.font12}>{contentChanges}</Text>
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      </>
    );
  };
  const renderItem = (item: any, index: any) => {
    const {
      updatedDate = TEXT_EMPTY,
      updatedUserId = 0,
      updatedUserName = TEXT_EMPTY,
      updatedUserImage = TEXT_EMPTY,
      contentChange = [],
      contentChangeStr = TEXT_EMPTY
    } = item;
    return (
      <View key={index.toString()} style={TabHistoryStyles.itemContainer}>
        <View style={TabHistoryStyles.timeLine}>
          <View style={TabHistoryStyles.roundView} />
          <View style={TabHistoryStyles.verticalLine} />
        </View>

        <View style={TabHistoryStyles.contentHistory}>
          <Text style={[TabHistoryStyles.dateChange]}>
            {getFormatDateTaskDetail(
              updatedDate,
              EnumFmDate.YEAR_MONTH_DAY_HM_NORMAL
            )}
          </Text>
          <View style={TabHistoryStyles.historyInfo}>
            {updatedUserImage ? <Image
              style={TabHistoryStyles.userAvatar}
              source={{ uri: updatedUserImage }}
            />
              : <View style={TabHistoryStyles.userAvatarDefault}>
                <Text style={TabHistoryStyles.txtUserName}>
                  {updatedUserName[0]}
                </Text>
              </View>}
            <TouchableOpacity
              onPress={() => {
                openEmployeeDetail(updatedUserId, updatedUserName);
              }}
            >
              <Text style={[TabHistoryStyles.userName]}>
                {updatedUserName}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={TabHistoryStyles.dataContent}>
            <Text
              numberOfLines={1}
              style={[CommonStyles.bold12]}
            >
              {translate(messages.historyTaskInfo)}
            </Text>
            {renderChangedContent(contentChange, contentChangeStr)}
          </View>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={historySelector}
      renderItem={({ item, index }) => renderItem(item, index)}
      contentContainerStyle={TabHistoryStyles.container}
    />
  );
};
