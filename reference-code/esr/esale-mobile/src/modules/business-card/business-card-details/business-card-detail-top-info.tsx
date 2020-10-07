import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { appImages, theme } from "../../../config/constants";
import { Button } from "../../../shared/components/button";

import { messages } from "./business-card-detail-messages";
import { translate } from "../../../config/i18n";
import { CommonStyles } from "../../../shared/common-style";
import { BusinessCardDetailStyle } from "./business-card-detail-style";
import { Activity, Follow } from "../../../config/constants/enum";
import { BusinessCardReceives } from "./business-card-repository";
import { EnumFmDate } from "../../../config/constants/enum-fm-date";
import { getFormatDateTaskDetail } from "../../../shared/util/app-utils";
import { useNavigation } from "@react-navigation/native";
// import { compareDate } from "../utils";
import {
  checkEmptyString,
  handleEmptyString,
} from "../../../shared/util/app-utils";
import { CommonLabel } from "../../../shared/components/label";
import { DetailScreenActions } from "../../employees/detail/detail-screen-reducer";

interface MilestoneItemProps {
  // image path
  businessCardImagePath: string;
  // image name
  businessCardImageName: string;
  // customer id
  customerId: number;
  // customer name
  customerName: string;
  // alternative customer name
  alternativeCustomerName: string;
  // department name
  departmentName: string;
  // position
  position: string;
  // first name
  firstName: string;
  // last name
  lastName: string;
  // has activity
  hasActivity: number;
  // last contact date
  lastContactDate: string;
  // has follow
  hasFollow: number;
  // show image
  pressImage: Function;
  // press timeline icon
  openTimeline: Function;
  // press delete icon
  deleteBusinessCard: Function;
  // press edit icon
  editBusinessCard: Function;
  // press edit icon
  follow: Function;
  // press edit icon
  unfollow: Function;
  // business card receives array
  businessCardReceives: Array<BusinessCardReceives>;
  // check is show in history
  isHistory: boolean;
  // copy
  copyLink?: Function;
}

/**
 * Component show business card top general information
 * @param props
 */

export const BusinessCardDetailTopInfo: React.FC<MilestoneItemProps> = ({
  businessCardImagePath = "",
  customerName,
  customerId,
  alternativeCustomerName,
  departmentName,
  firstName,
  lastName,
  hasActivity,
  lastContactDate,
  businessCardReceives = [],
  hasFollow,
  pressImage = () => {},
  openTimeline = () => {},
  deleteBusinessCard = () => {},
  editBusinessCard = () => {},
  follow = () => {},
  unfollow = () => {},
  copyLink = () => {},
  isHistory = false,
}) => {
  const navigation = useNavigation();

  /**
   * navigate to customer detail
   */
  const navigateToCustomerDetail = (id: number) => {
    navigation.navigate("customer-detail", { customerId: id });
  };

  /**
   * navigate to employee detail
   */
  const navigateToEmployeeDetail = (employeeId: number) => {
    DetailScreenActions.addEmployeeIds(employeeId);
    navigation.navigate("employee-detail", { id: employeeId });
  };

  /**
   * navigate to action detail
   */
  const navigateToActionDetail = (date: string) => {
    navigation.navigate("activity-detail", { date });
  };

  let businessCardReceivesFillter: Array<BusinessCardReceives> = [];

  (businessCardReceives || []).forEach((value: BusinessCardReceives) => {
    // if (compareDate(lastContactDate, value.receivedLastContactDate)) {
    businessCardReceivesFillter.push(value);
    // }
  });

  // useEffect(() => {
  //   (businessCardReceives || []).forEach((value: BusinessCardReceives) => {
  //     // if (compareDate(lastContactDate, value.receivedLastContactDate)) {
  //     businessCardReceivesFillter.push(value);
  //     // }
  //   });
  // }, []);

  return (
    <View style={[{}]}>
      <View style={[CommonStyles.row]}>
        <TouchableWithoutFeedback
          onPress={() => {
            pressImage();
          }}
        >
          <Image
            style={CommonStyles.imageInfo}
            resizeMode="contain"
            source={
              !checkEmptyString(businessCardImagePath)
                ? { uri: businessCardImagePath }
                : appImages.frame
            }
          />
        </TouchableWithoutFeedback>
        <View style={CommonStyles.flex1}>
          <View style={[CommonStyles.row]}>
            <View style={[CommonStyles.flex1]}>
              <View style={[BusinessCardDetailStyle.topInfoGroupName]}>
                <View style={CommonStyles.rowInline}>
                  {!checkEmptyString(customerName) ? (
                    <TouchableOpacity
                      onPress={() => {
                        navigateToCustomerDetail(customerId);
                      }}
                    >
                      <Text style={CommonStyles.blue12}>
                        {`${customerName} ${departmentName}`}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={CommonStyles.gray12}>
                      {`${alternativeCustomerName} ${departmentName}`}
                    </Text>
                  )}
                </View>
                <Text style={CommonStyles.black14}>
                  <Text>
                    {`${handleEmptyString(firstName)} ${handleEmptyString(
                      lastName
                    )}`}
                  </Text>
                </Text>

                {hasActivity == Activity.HAS_ACTIVITY ? (
                  <CommonLabel
                    bgColor={theme.colors.blue200}
                    textColor={theme.colors.white}
                    size={theme.fontSizes[1]}
                    content={translate(messages.hasActivity)}
                    labelStyle={BusinessCardDetailStyle.labelHasActivity}
                  />
                ) : (
                  <View />
                )}
                <Text
                  style={[
                    CommonStyles.gray12,
                    BusinessCardDetailStyle.lastContactDate,
                  ]}
                >
                  {`${translate(messages.lastContactDate)} : `}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      navigateToActionDetail(lastContactDate);
                    }}
                  >
                    <Text style={CommonStyles.blue12}>
                      {getFormatDateTaskDetail(
                        handleEmptyString(lastContactDate),
                        EnumFmDate.YEAR_MONTH_DAY_NORMAL
                      )}
                    </Text>
                  </TouchableWithoutFeedback>
                </Text>
              </View>
            </View>
            {!isHistory ? (
              <View style={CommonStyles.row}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    openTimeline();
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={BusinessCardDetailStyle.buttonCopy}
                    source={appImages.icMess}
                  />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => {
                    copyLink();
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={BusinessCardDetailStyle.buttonCopy}
                    source={appImages.iconShare}
                  />
                </TouchableWithoutFeedback>
              </View>
            ) : (
              <View />
            )}
          </View>
          <View style={[BusinessCardDetailStyle.listEmployeeName]}>
            <Text style={CommonStyles.gray12}>
              {`${translate(messages.lastContactPerson)} : `}
            </Text>
            {
              //businessCardReceivesFillter?.length > 0 &&

              businessCardReceivesFillter.map(
                (item: any, index: any) => {
                  if (index < 3) {
                    return (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          navigateToEmployeeDetail(item.employeeId);
                        }}
                        key={item?.employeeId?.toString()}
                      >
                        <Image
                          style={BusinessCardDetailStyle.iconEmployee}
                          resizeMode="contain"
                          source={appImages.icUser}
                        />
                      </TouchableWithoutFeedback>
                    );
                  }
                }
              )
            }
            {businessCardReceivesFillter.length > 3 ? (
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate("employee-list-screen", {
                    data: businessCardReceivesFillter,
                  });
                }}
              >
                <View style={BusinessCardDetailStyle.iconEmployeePlus}>
                  <Text style={CommonStyles.white10}>
                    {`+${businessCardReceivesFillter.length - 3}`}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View />
            )}
          </View>
          {!isHistory ? (
            <View
              style={[
                CommonStyles.rowInlineSpaceBetween,
                BusinessCardDetailStyle.topGrButton,
              ]}
            >
              {hasFollow == Follow.HAS_FOLLOW ? (
                <Button
                  onPress={() => {
                    unfollow();
                  }}
                  variant={"incomplete"}
                  style={[BusinessCardDetailStyle.buttonFollow]}
                >
                  <Text style={CommonStyles.black12}>
                    {translate(messages.noFollow)}
                  </Text>
                </Button>
              ) : (
                <Button
                  onPress={() => {
                    follow();
                  }}
                  variant={"incomplete"}
                  style={[BusinessCardDetailStyle.buttonFollow]}
                >
                  <Text style={CommonStyles.black12}>
                    {translate(messages.hasFollow)}
                  </Text>
                </Button>
              )}
              <View style={[CommonStyles.row]}>
                <TouchableOpacity
                  onPress={() => {
                    editBusinessCard();
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={[BusinessCardDetailStyle.buttonCopy]}
                    source={appImages.iconEdit}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    deleteBusinessCard();
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={BusinessCardDetailStyle.buttonCopy}
                    source={appImages.iconDelete}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
  );
};
