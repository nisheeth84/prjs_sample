import React, { useCallback } from "react";
import {
  Text,
  View,
  Linking,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Icon } from "../../../../shared/components/icon";
import { InforModalStyles } from "../detail-style";
import { messages } from "../detail-messages";
import { translate } from "../../../../config/i18n";
import { EmployeeData } from "../../employees-repository";
import { PREFIX_EMPLOYEE } from "../../../../config/constants/constants";

interface Props {
  email: string;
  telephoneNumber: string;
  cellphoneNumber: string;
  employeeData: EmployeeData[];
}
/**
 * Component for information modal for detail employee screen
 * @param email
 * @param telephoneNumber
 * @param cellphoneNumber
 */
export const InforModal: React.FC<Props> = ({
  email = "",
  telephoneNumber = "",
  cellphoneNumber = "",
  employeeData = null,
}) => {
  const listPhone = employeeData?.filter(
    (item) =>
      item.key.startsWith(PREFIX_EMPLOYEE.PHONE) && item.value?.length > 0
  );
  const listMail = employeeData?.filter(
    (item) =>
      item.key.startsWith(PREFIX_EMPLOYEE.MAIL) && item.value?.length > 0
  );
  /**
   * Open call in smart phone
   */
  const getCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  /**
   * Open send email in smart phone
   */
  const handlePress = useCallback(async (email: string) => {
    const url = `mailto:${email}`;
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, []);

  const showPhone = (phoneNumber: string) => {
    return (
      <TouchableOpacity
        onPress={() => {
          getCall(phoneNumber);
        }}
        style={[
          InforModalStyles.modalSubBlock,
          InforModalStyles.borderBottomStyles,
        ]}
      >
        <View style={InforModalStyles.body}>
          <View>
            <Icon name="callIcon" style={InforModalStyles.icon} />
          </View>
          <View style={InforModalStyles.viewInfo}>
            <Text style={InforModalStyles.infor}>
              {phoneNumber}
              {translate(messages.modalCallTo)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const showMail = (emailInfo: string) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handlePress(emailInfo);
        }}
        style={InforModalStyles.modalSubBlock}
      >
        <View style={InforModalStyles.body}>
          <View>
            <Icon name="emailIcon" style={InforModalStyles.icon} />
          </View>
          <View style={InforModalStyles.viewInfo}>
            <Text style={InforModalStyles.infor}>
              {emailInfo}
              {translate(messages.modalSend)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={InforModalStyles.modalBlock}>
      <ScrollView>
        {telephoneNumber?.length > 0 && showPhone(telephoneNumber)}
        {listPhone &&
          listPhone.length > 0 &&
          listPhone.map((item) => {
            return showPhone(item.value);
          })}
        {cellphoneNumber?.length > 0 && showPhone(cellphoneNumber)}
        {email?.length > 0 && showMail(email)}
        {listMail &&
          listMail.length > 0 &&
          listMail.map((item) => {
            return showMail(item.value);
          })}
      </ScrollView>
    </View>
  );
};
