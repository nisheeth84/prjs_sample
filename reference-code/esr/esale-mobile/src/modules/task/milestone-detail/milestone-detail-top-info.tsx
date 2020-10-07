import * as React from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { MilestoneDetailStyles } from "./milestone-detail-style";
import { getFormatDateTaskDetail, checkOutOfDate } from "../utils";
import { appImages, theme } from "../../../config/constants";
import { Button } from "../../../shared/components/button";

import { messages } from "./milestone-detail-messages";
import { translate } from "../../../config/i18n";
import { getWeekdays } from "../utils";
import { CommonStyles } from "../../../shared/common-style";
import { handleEmptyString } from "../../../shared/util/app-utils";
import { useSelector } from "react-redux";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import moment from "moment";

interface MilestoneItemProps {
  // milestone name
  milestoneName: string;
  // end date
  endDate: string;
  // is done
  isDone: number;
  // is public
  isPublic: number;
  // compelete milestone function
  completeMilestone: Function;
  // copy milestone function
  copyMilestone: Function;
  // share milestone
  shareMilestone: Function;
  // edit milestone
  editMilestone: Function;
  // delete milestone
  deleteMilestone: Function;
  // navigate to timeline milestone
  timelineMilestone: Function;
  isCreatedUser: boolean
}

/**
 * Component show milestone general information
 * @param props
 */

export const MilestoneDetailTopInfo: React.FC<MilestoneItemProps> = ({
  milestoneName,
  endDate,
  isDone,
  isPublic,
  completeMilestone = () => { },
  copyMilestone = () => { },
  editMilestone = () => { },
  deleteMilestone = () => { },
  shareMilestone = () => { },
  timelineMilestone = () => { },
  isCreatedUser
}) => {

  const userInfo = useSelector(authorizationSelector);
  return (
    <View style={[MilestoneDetailStyles.generalInfoItem]}>
      <View style={MilestoneDetailStyles.rowCenter}>
        <View style={CommonStyles.flex1}>
          <View style={[MilestoneDetailStyles.mileGrpParentName]}>
            <View style={[MilestoneDetailStyles.mileGrpName]}>
              {isPublic ? (
                <View style={MilestoneDetailStyles.roundViewPublic} />
              ) : (
                  <View style={MilestoneDetailStyles.roundViewNotPublic} />
                )}
              <Text
                style={[
                  MilestoneDetailStyles.black,
                  MilestoneDetailStyles.milestoneName,
                ]}
              >
                {handleEmptyString(milestoneName)}
              </Text>
            </View>
            <View style={[MilestoneDetailStyles.rowSpaceBetween]}>
              <TouchableOpacity
                onPress={() => {
                  timelineMilestone();
                }}
              >
                <Image
                  resizeMode="contain"
                  style={MilestoneDetailStyles.topInfoIconShare}
                  source={appImages.timeline}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  shareMilestone();
                }}
              >
                <Image
                  resizeMode="contain"
                  style={MilestoneDetailStyles.topInfoIconShare}
                  source={appImages.iconShare}
                />
              </TouchableOpacity>
            </View>

          </View>
          <Text style={MilestoneDetailStyles.timeRange}>
            {checkOutOfDate(endDate) ? (
              <Text style={MilestoneDetailStyles.outOfDate}>
                {/* {`${getFormatDateTaskDetail(endDate)}(${getWeekdays(endDate)})`} */}
                {moment(endDate).format(userInfo.formatDate) + `(${getWeekdays(endDate)})`}
              </Text>
            ) : (
                <Text style={MilestoneDetailStyles.timeRange}>
                  {/* {`${getFormatDateTaskDetail(endDate)}(${getWeekdays(endDate)})`} */}
                  {moment(endDate).format(userInfo.formatDate) + `(${getWeekdays(endDate)})`}
                </Text>
              )}
          </Text>
          <View style={MilestoneDetailStyles.topInfoButtonGroup}>
            {isDone == 0 && isCreatedUser ?
              <Button
                onPress={() => {
                  completeMilestone();
                }}
                variant={"incomplete"}
                style={MilestoneDetailStyles.buttonCompleteMilestone}
              >
                <Text style={MilestoneDetailStyles.textButtonCompleteMilestone}>
                  {translate(messages.completeMilestone)}
                </Text>
              </Button> : <View />
            }
            {isDone == 1 && isCreatedUser ?
              <Button
                disabled
                variant={"incomplete"}
                style={MilestoneDetailStyles.buttonCompleteMilestone}
              >
                <Text style={MilestoneDetailStyles.textButtonCompleteMilestone}>
                  {translate(messages.completeMilestone)}
                </Text>
              </Button> : <View />
            }
            <View style={MilestoneDetailStyles.rowSpaceBetween}>
              <TouchableOpacity
                onPress={() => {
                  copyMilestone();
                }}
              >
                <Image
                  resizeMode="contain"
                  style={MilestoneDetailStyles.topInfoIconCopy}
                  source={appImages.iconCopy}
                />
              </TouchableOpacity>
              {isCreatedUser && <TouchableOpacity
                onPress={() => {
                  editMilestone();
                }}
              >
                <Image
                  resizeMode="contain"
                  style={[
                    MilestoneDetailStyles.topInfoIconCopy,
                    { marginHorizontal: theme.space[4] },
                  ]}
                  source={appImages.iconEdit}
                />
              </TouchableOpacity>}

              {isCreatedUser && <TouchableOpacity
                onPress={() => {
                  deleteMilestone();
                }}
              >
                <Image
                  resizeMode="contain"
                  style={MilestoneDetailStyles.topInfoIconCopy}
                  source={appImages.iconDelete}
                />
              </TouchableOpacity>
              }
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
