import * as React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import { TaskDetailStyles } from "./task-detail-style";
import {
  EnumTaskStatus,
  checkTaskStatus,
  getFormatDateTaskDetail,
  getWeekdays,
} from "../utils";
import { appImages, theme } from "../../../config/constants";
import { Button } from "../../../shared/components/button";
import { messages } from "./task-detail-messages";
import { translate } from "../../../config/i18n";

import { CommonStyles } from "../../../shared/common-style";
import { handleEmptyString, copyToClipboard } from "../../../shared/util/app-utils";
import { EnumFmDate } from "../../../config/constants/enum-fm-date";
import { Icon } from "../../../shared/components/icon";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { AuthorizationState } from "../../login/authorization/authorization-reducer";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { getUrl, taskDetailUrl } from "../../../config/constants/url"
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../config/constants/screen-name";

interface TaskItemProps {
  // task's id
  taskId: number;
  // task's name
  taskName: string;
  // task's start date
  startDate: string;
  // task's finish date
  finishDate: string;
  // task's status id
  statusTaskId: number;
  // handle complete task
  completeTask: Function;
  // handle copy task
  copyTask: Function;
  // handle edit task
  editTask: Function;
  // handle delete task
  deleteTask: Function;
  // total employees
  totalEmployees: any[]
}

/**
 * Component show task general information
 */
export const TaskDetailTopInfo: React.FC<TaskItemProps> = ({
  taskId,
  taskName,
  startDate,
  finishDate,
  statusTaskId,
  completeTask = () => { },
  copyTask = () => { },
  editTask = () => { },
  deleteTask = () => { },
  totalEmployees
}) => {
  const auth: AuthorizationState = useSelector(authorizationSelector);

  const navigation = useNavigation();

  /**
   * check current user is person in charge
   */
  const checkIsPersonInCharge = () => {
    let result = totalEmployees.filter((employee: any) => {
      return employee.employeeId === auth.employeeId
    }) || []
    return result.length > 0

  }
  console.log();


  return (
    <View style={[TaskDetailStyles.generalInfoItem]}>
      <View style={TaskDetailStyles.rowCenter}>
        <View style={CommonStyles.flex1}>
          <View style={TaskDetailStyles.iconTimelineShare}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(ScreenName.TIMELINE_SCREEN)
              }}
            >
              <Image
                resizeMode="contain"
                style={CommonStyles.topInfoIconShare}
                source={appImages.timeline}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(
                  getUrl(
                    taskDetailUrl,
                    auth?.tenantId || TEXT_EMPTY,
                    taskId
                  )
                )
              }}
            >
              <Image
                resizeMode="contain"
                style={CommonStyles.topInfoIconShare}
                source={appImages.iconShare}
              />
            </TouchableOpacity>
          </View>
          <View style={[CommonStyles.rowAlignItemCenter]}>
            {/* <Image
              style={TaskDetailStyles.taskIcon}
              source={appImages.iconTask}
            /> */}
            <Icon name="task" style={TaskDetailStyles.taskIcon} />
            <Text style={[TaskDetailStyles.taskName]}>
              {handleEmptyString(taskName)}
            </Text>
          </View>
          <Text style={TaskDetailStyles.timeRange}>
            {`${getFormatDateTaskDetail(startDate)}(${getWeekdays(
              startDate
            )})〜 ${getFormatDateTaskDetail(finishDate)}(${getWeekdays(
              finishDate
            )})`}
            {/* {moment(finishDate).format(EnumFmDate.YEAR_MONTH_DAY_NORMAL_DASH)} */}
          </Text>
          <View style={TaskDetailStyles.topInfoButtonGroup}>
            {checkIsPersonInCharge() ? (checkTaskStatus(statusTaskId) === EnumTaskStatus.done
              ? (
                <Button
                  disabled
                  variant="incomplete"
                  style={TaskDetailStyles.buttonCompleteTask}
                >
                  <Text style={TaskDetailStyles.textButtonCompleteTask}>
                    {translate(messages.completeTask)}
                  </Text>
                </Button>
              ) : (
                <Button
                  onPress={() => {
                    completeTask();
                  }}
                  variant="incomplete"
                  style={TaskDetailStyles.buttonCompleteTask}
                >
                  <Text style={TaskDetailStyles.textButtonCompleteTask}>
                    {translate(messages.completeTask)}
                  </Text>
                </Button>
              )) : <View />}
            <View style={TaskDetailStyles.rowSpaceBetween}>
              <TouchableOpacity
                onPress={() => {
                  copyTask();
                }}
              >
                <Image
                  resizeMode="contain"
                  style={TaskDetailStyles.topInfoIconCopy}
                  source={appImages.iconCopy}
                />
              </TouchableOpacity>
              {checkIsPersonInCharge() && <TouchableOpacity
                onPress={() => {
                  editTask();
                }}
              >
                <Image
                  resizeMode="contain"
                  style={[
                    TaskDetailStyles.topInfoIconCopy,
                    TaskDetailStyles.topInfoIconEditTask,
                  ]}
                  source={appImages.iconEdit}
                />
              </TouchableOpacity>}
              {checkIsPersonInCharge() && <TouchableOpacity
                onPress={() => {
                  deleteTask();
                }}
              >
                <Image
                  resizeMode="contain"
                  style={TaskDetailStyles.topInfoIconCopy}
                  source={appImages.iconDelete}
                />
              </TouchableOpacity>}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
