import React from "react";
import { Text, View, Image, TouchableWithoutFeedback } from "react-native";
import { useSelector } from "react-redux";
import { translate } from "../../../../config/i18n";
import { messages } from "../milestone-detail-messages";
import { theme, appImages } from "../../../../config/constants";
import { milestoneDetailSelector } from "../milestone-detail-selector";
import { MilestoneDetailStyles } from "../milestone-detail-style";
import {
  getFirstItem,
  getFormatDateTaskDetail,
  checkOutOfDate,
} from "../../utils";
import { EnumFmDate } from "../../../../config/constants/enum-fm-date";
import { useNavigation } from "@react-navigation/native";
import { Milestone } from "../../task-repository";
import { Button } from "../../../../shared/components/button";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { ScreenName } from "../../../../config/constants/screen-name";
import moment from "moment";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";

/**
 * Component show milestone general information tab
 * @param props
 */

export function MilestoneGeneralInforTabScreen() {
  const milestoneDetail: Milestone = getFirstItem(
    useSelector(milestoneDetailSelector)
  );
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
   * navigate to customer detail screen
   * @param id
   */
  const openCustomerDetail = (id: number, customerName: string) => {
    navigation.navigate(ScreenName.CUSTOMER_DETAIL, { customerId: id, customerName: customerName });
  };

  /**
   * navigate to customer activity detail screen
   * @param id
   */
  const openCustomerActivityDetail = (id: number) => {
    navigation.navigate(ScreenName.CUSTOMER_ACTIVITY_DETAIL, { employeeId: id });
  };

  /**
   * navigate to task detail screen
   * @param id
   */
  const openTask = (id: number) => {
    navigation.navigate(ScreenName.TASK_DETAIL, { taskId: id });
  };

  const renderCustomer = () => {
    return (
      <View style={MilestoneDetailStyles.prRowCustomer}>
        <View style={MilestoneDetailStyles.imageTitle}>
          <View style={MilestoneDetailStyles.prClientIcon}>
            <Image
              resizeMode="contain"
              resizeMethod="resize"
              style={MilestoneDetailStyles.clientIcon}
              source={appImages.iconClient}
            />
          </View>
          <Text style={MilestoneDetailStyles.milestoneDetailListTaskLabel}>
            {translate(messages.milestoneCustomer)}
          </Text>
        </View>
        <View style={MilestoneDetailStyles.rowCustomer}>
          <TouchableWithoutFeedback
            onPress={() => {
              openCustomerDetail(milestoneDetail?.customer?.customerId, milestoneDetail?.customer?.customerName);
            }}
          >
            <Text
              style={[
                MilestoneDetailStyles.milestoneDetailListTask,
                MilestoneDetailStyles.milestoneDetailUser,
              ]}
            >
              {milestoneDetail?.customer?.customerName}
            </Text>
          </TouchableWithoutFeedback>
          <Button
            onPress={() => {
              openCustomerActivityDetail(milestoneDetail.customer.customerId);
            }}
            variant={"incomplete"}
            style={MilestoneDetailStyles.buttonCompleteMilestone}
          >
            <Text style={MilestoneDetailStyles.textButtonCompleteMilestone}>
              {translate(messages.activityHistory)}
            </Text>
          </Button>
        </View>
      </View>
    );
  };
  return (
    <ScrollView>
      {milestoneDetail == undefined ? (
        <View />
      ) : (
          <View style={MilestoneDetailStyles.milestoneDetailContainer}>
            <Text style={MilestoneDetailStyles.milestoneDetailMemo}>
              {milestoneDetail.memo}
            </Text>
            {milestoneDetail.customer && renderCustomer()}
            <View>
              <View style={MilestoneDetailStyles.imageTitle}>
                <Image
                  style={MilestoneDetailStyles.milestoneIcon}
                  source={appImages.iconTaskGray}
                />
                <Text style={MilestoneDetailStyles.milestoneDetailListTaskLabel}>
                  {translate(messages.task)}
                </Text>
              </View>
              <View>
                {(milestoneDetail.listTask || []).map((value: any) => {
                  return (
                    <View
                      style={MilestoneDetailStyles.milestoneDetailListTask}
                      key={value.taskId.toString()}
                    >
                      {
                        <Text
                          style={
                            checkOutOfDate(milestoneDetail.endDate)
                              ? MilestoneDetailStyles.outOfDate
                              : {}
                          }
                        >
                          {getFormatDateTaskDetail(
                            milestoneDetail.endDate,
                            EnumFmDate.YEAR_MONTH_DAY_NORMAL
                          )}
                        </Text>
                      }
                      <TouchableOpacity
                        onPress={() => {
                          openTask(value.taskId);
                        }}
                      >
                        <Text style={MilestoneDetailStyles.taskName}>
                          {value.taskName}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <Text
                  style={[
                    MilestoneDetailStyles.milestoneDetailListTaskLabel,
                    { marginTop: theme.space[4] },
                  ]}
                >
                  <Text>{`${translate(messages.registeredPerson)} : `}</Text>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      openEmployeeDetail(milestoneDetail.createdUser, milestoneDetail.createdUserName);
                    }}
                  >
                    <Text style={MilestoneDetailStyles.milestoneDetailUser}>
                      {milestoneDetail.createdUserName}
                    </Text>
                  </TouchableWithoutFeedback>
                </Text>
                <Text style={MilestoneDetailStyles.milestoneDetailListTaskLabel}>
                  {`${translate(
                    messages.registrationDate
                  )} : ${moment(milestoneDetail.createdDate).format(userInfo.formatDate)
                    //   getFormatDateTaskDetail(
                    //   milestoneDetail.createdDate,
                    //   EnumFmDate.YEAR_MONTH_DAY_NORMAL
                    // )
                    }`}
                </Text>
                <Text style={MilestoneDetailStyles.milestoneDetailListTaskLabel}>
                  {`${translate(messages.lastUpdatedBy)} : `}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      openEmployeeDetail(milestoneDetail.createdUser, milestoneDetail.createdUserName);
                    }}
                  >
                    <Text style={MilestoneDetailStyles.milestoneDetailUser}>
                      {milestoneDetail.updatedUserName}
                    </Text>
                  </TouchableWithoutFeedback>
                </Text>
                <Text style={MilestoneDetailStyles.milestoneDetailListTaskLabel}>
                  {`${translate(
                    messages.lastUpdated
                  )} : ${moment(milestoneDetail.updatedDate).format(userInfo.formatDate)
                    // getFormatDateTaskDetail(
                    // milestoneDetail.updatedDate,
                    // EnumFmDate.YEAR_MONTH_DAY_NORMAL)
                    }`}
                </Text>
              </View>
            </View>
          </View>
        )}
    </ScrollView>
  );
}
