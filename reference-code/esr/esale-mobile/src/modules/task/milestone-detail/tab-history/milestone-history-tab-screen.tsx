import React from "react";
import { Text, View, Image, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "../../../../shared/components/icon";
import { TabHistoryStyles } from "../milestone-detail-style";
import { milestoneDetailHistorySelector } from "../milestone-detail-selector";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { CommonStyles } from "../../../../shared/common-style";
import { TEXT_EMPTY, TIME_FORMAT } from "../../../../config/constants/constants";
import { ScreenName } from "../../../../config/constants/screen-name";
import moment from "moment";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";
import { translate } from "../../../../config/i18n";
import {messages} from "../milestone-detail-messages";

export const MilestoneHistoryTabScreen = () => {
  const historySelector = useSelector(milestoneDetailHistorySelector);
  const userInfo = useSelector(authorizationSelector);
  const navigation = useNavigation();

  /**
   * navigate to employee detail screen
   * @param id
   */
  const openEmployeeDetail = (employeeId: number, employeeName: string) => {
    navigation.navigate(ScreenName.EMPLOYEE_DETAIL, { id: employeeId, title: employeeName });
  };


  /**
   * Render content change of product
   * @param check
   * @param before
   * @param after
   */

  const renderChangedContent = (contentChange: any, contentChangeStr: any) => {
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
        <View style={CommonStyles.flex1}>
          {contentChange.map((elm: any, index: number) => {
            const arrChange = elm.valueChange.split(">");
            const contentCurrent = arrChange[0];
            const contentChanges = arrChange[1];
            return (
              <View style={[TabHistoryStyles.changedContainer]} key={index}>
                <Text style={TabHistoryStyles.changedLabel}>
                  {elm.fieldChange}
                </Text>
                <Text style={CommonStyles.font12}>:</Text>
                <Text style={CommonStyles.flex1}>
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
      contentChangeStr = TEXT_EMPTY,
    } = item;

    return (
      <View key={index.toString()} style={TabHistoryStyles.itemContainer}>
        <View style={TabHistoryStyles.timeLine}>
          <View style={TabHistoryStyles.roundView} />
          <View style={TabHistoryStyles.verticalLine} />
        </View>
        <View style={TabHistoryStyles.contentHistory}>
          <Text style={[TabHistoryStyles.dateChange]}>
            {/* TODO wait for require confirm */}
            {/* {getFormatDateTaskDetail(
              updatedDate,
              EnumFmDate.YEAR_MONTH_DAY_HM_NORMAL
            )} */}
            {moment(updatedDate).format(`${userInfo.formatDate} ${TIME_FORMAT}`)}
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
              <Text style={TabHistoryStyles.userName}>{updatedUserName}</Text>
            </TouchableOpacity>
          </View>
          <View style={TabHistoryStyles.dataContent}>
            <Text numberOfLines={1} style={[CommonStyles.bold12]}>
              {translate(messages.historyMileStoneInfo)}
            </Text>
            {renderChangedContent(contentChange, contentChangeStr)}
          </View>
        </View>
      </View>
    );
  };
  return (
    <FlatList
      data={historySelector}
      renderItem={({ item, index }) => renderItem(item, index)}
      contentContainerStyle={TabHistoryStyles.container}
    />
  );
};
