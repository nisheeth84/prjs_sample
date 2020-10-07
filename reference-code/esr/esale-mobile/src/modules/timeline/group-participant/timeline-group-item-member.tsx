import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { messages } from "./timeline-group-participant-messages";
import { translate } from "../../../config/i18n";
import { TimelineParticipantStyles } from "./timeline-group-participant-style";
import { AuthorityEnum } from "../../../config/constants/enum";
import { ScreenName } from "../../../config/constants/screen-name";
import { Icon } from "../../../shared/components/icon";
import { CommonStyles } from "../../../shared/common-style";

const styles = TimelineParticipantStyles;

interface ItemMemberProps {
  // user info
  item: any;
  //  show user info
  onPressIcon: Function;
  // check user type
  userType: number;
  //  check member tab
  isMemberTab: boolean;
  // approval user
  onApproval: Function;
  // refusal user
  onRefusal: Function;
  // set Permissions
  setPermissions?: Function;
  // remove member
  removeMember?: Function;
}

export const ItemMember: React.FC<ItemMemberProps> = ({
  item,
  onPressIcon,
  userType,
  isMemberTab,
  onApproval = () => {},
  onRefusal = () => {},
  setPermissions = () => {},
  // removeMember = () => { },
}) => {
  const navigation = useNavigation();
  /**
   * check color icon avatar
   * @param inviteType
   */
  // const checkColor = (inviteType: number) => {
  //   switch (inviteType) {
  //     case InviteType.DEPARTMENT:
  //       return styles.themeBlue;
  //     case InviteType.EMPLOYEE:
  //       return styles.themeGreen200;
  //     default:
  //       return styles.themeGreen100;
  //   }
  // };
  /**
   * render item member option
   * @param authority
   */
  const optionMember = (authority: number) => {
    if (!isMemberTab) {
      return (
        <View style={styles.viewOwner}>
          <View style={styles.owner}>
            <Text style={styles.txtOwner}>
              {authority === AuthorityEnum.OWNER
                ? translate(messages.owner)
                : translate(messages.member)}
            </Text>
          </View>
        </View>
      );
    }
    return <View style={styles.viewBtnConfirm} />;
  };
  /**
   * render item Owner option
   * @param authority
   */
  const optionOwner = (authority: number) => {
    if (isMemberTab) {
      return (
        <View style={styles.viewBtnConfirm}>
          <TouchableOpacity
            style={styles.approval}
            onPress={() => onApproval && onApproval(item)}
          >
            <Text>{translate(messages.approval)}</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={styles.approval}
            onPress={() => onRefusal && onRefusal(item)}
          >
            <Text>{translate(messages.refusal)}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={CommonStyles.row}>
        <TouchableOpacity
          style={styles.viewPicker}
          onPress={() => setPermissions()}
        >
          <Text style={styles.textPicker}>
            {Number(authority) === AuthorityEnum.MEMBER
              ? translate(messages.member)
              : translate(messages.owner)}
          </Text>
          <Icon name="arrowDown" />
        </TouchableOpacity>
        {/* 
        use in phase 2
        <TouchableOpacity
          style={styles.btnRemove}
          onPress={() => removeMember()}
        >
          <Text>{translate(messages.leaveTheRoom)}</Text>
        </TouchableOpacity> */}
      </View>
    );
  };
  console.log("itemmmmmmmmmmmmmmmmmmmmmmmmmmmmm", item);
  return (
    <View style={styles.itemParticipate}>
      <TouchableOpacity
        style={[styles.avatar]}
        onPress={() => onPressIcon(item)}
      >
        {item.inviteImagePath === null || item.inviteImagePath === "" ? (
          <View>
            <Text style={{ fontSize: 12, color: "#fff" }}>
              {item.inviteName === "" || item.inviteName === null
                ? " "
                : item.inviteName.charAt(0)}
            </Text>
          </View>
        ) : (
          // <Text
          //   style={styles.txtIcon}
          // onPress={() => {
          //   navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {
          //     employeeId: item.inviteId,
          //   });
          // }}
          // >
          //   {item.inviteName}
          // </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {
                employeeId: item.inviteId,
              });
            }}
          >
            <Image source={{ uri: item.inviteImagePath }} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      <View style={styles.flex4}>
        <Text style={styles.txtNameGroup}>{item.inviteName}</Text>
      </View>
      {userType === AuthorityEnum.MEMBER
        ? optionMember(item.authority)
        : optionOwner(item.authority)}
    </View>
  );
};
