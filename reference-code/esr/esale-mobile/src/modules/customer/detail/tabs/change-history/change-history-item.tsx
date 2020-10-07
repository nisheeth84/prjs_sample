import * as React from "react";
import { View, Text, TouchableOpacity, Dimensions, Alert, Image } from "react-native"
import { CustomerDetailScreenStyles } from "../../customer-detail-style"
import { Icon } from "../../../../../shared/components/icon";
import { ChangeHistoryStyles } from "./change-history-style";
import { useState } from "react";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../customer-detail-messages";
import { CustomerHistory } from "./change-history-repository";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../../../config/constants/screen-name";
import { utcToTz, DATE_TIME_FORMAT } from "../../../../../shared/util/date-utils";
import { APP_DATE_FORMAT_ES } from "../../../../../config/constants/constants";
import { useSelector } from "react-redux";
import { authorizationSelector } from "../../../../login/authorization/authorization-selector";

interface ChangeHistoryItemProps {
  // data of contact history item
  data: CustomerHistory;
  // value is true if item is lastest contact history list
  isLast: boolean;
}

/**
 * Component for show contact history information item
 * @param ContactHistoryItemProps 
 */
export const ChangeHistoryItem: React.FC<ChangeHistoryItemProps> = (
  {
    data,
    isLast
  }
) => {
  const screenWidth = Math.round(Dimensions.get('window').width);
  // value 15 is padding horizontal and  30 is width of icon employee  
  const contentWidth = screenWidth - (15 * 2) - 30;
  const [lineHeight, setLineHeight] =  useState(0);
  const contentHistory = JSON.parse(data.contentChange);
  const navigation = useNavigation();
  const authState = useSelector(authorizationSelector);
  return (contentHistory &&
    <View style={[
      ChangeHistoryStyles.item
    ]}
      onLayout={(event) => {
        setLineHeight(event.nativeEvent.layout.height);
      }}
    >
      <View style={ChangeHistoryStyles.imageLeftBlock}>
        <Icon name="ellipseBlue" style={ChangeHistoryStyles.ellipseBlueIcon} />
        {!isLast && <Icon name="verticalLine" style={[ChangeHistoryStyles.imageVerticalLine, { height: lineHeight }]} />}
      </View>
      <View>
        <View style={ChangeHistoryStyles.titleBlock}>
          <View style={ChangeHistoryStyles.avatarBlock}>
            <Image
              style={ChangeHistoryStyles.employeeImage}
              source={{
                uri: data.createdUserImage
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {id: data.createdUserId})}>
              <Text style={ChangeHistoryStyles.employeeText}>
                {data.createdUserName}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={ChangeHistoryStyles.dateLabel}>{data.createdDate?
          utcToTz(
            data.createdDate,
            authState.timezoneName,
            authState.formatDate || APP_DATE_FORMAT_ES,
            DATE_TIME_FORMAT.User
          ):""}</Text>
        </View>


        <View style={[ChangeHistoryStyles.contentBlock, { width: contentWidth }]}>
          <Text style={[CustomerDetailScreenStyles.boildLabel]}>
            {data.contentChange === null ? translate(messages.changeCreatedTitle) : translate(messages.changeUpdatedTitle)}
          </Text>
          {Object.keys(contentHistory).map((item: string, index: number) => {
            return (
              <View key={index}>
                <View style={ChangeHistoryStyles.contentChange}>
                  <Text>{item}: <Text>{contentHistory[item].old} <Text style={ChangeHistoryStyles.arrowLabel}>→ </Text>{contentHistory[item].new}</Text></Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}
