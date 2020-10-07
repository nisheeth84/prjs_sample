import React from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../common-style";
import { Icon } from "../icon";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const DUMMY_PHONE = "090-1234-5678";
const DUMMY_EMAIL = "mail@example.com";
const DUMMY_STATUS = "オンライン";
const DUMMY_MANAGER = "営業部 部長";
const DUMMY_NAMECARD = "えいぎょうたろう";

interface ModalCardInfo {
  visible: boolean;
  closeModal: () => void;
  inviteName: string;
}
const styles = StyleSheet.create({
  modalItem: {
    flex: 1,
    backgroundColor: theme.colors.blackDeep,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    // height: "48%",
    // width: "60%",
    backgroundColor: "#fff",
    borderRadius: 30,
    position: "absolute",
    top: height * 0.3,
    right: width * 0.2,
    padding: theme.space[4],
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#8AC891",
    justifyContent: "center",
    alignItems: "center",
  },
  img: { height: 50, width: 50 },
  txtName: { fontSize: theme.fontSizes[3] },
  status: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.space[2],
  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: "#15B50F",
    marginRight: 10,
  },
  txtStatus: { fontSize: theme.fontSizes[3], color: "#15B50F" },
  information: {
    alignItems: "flex-start",
    paddingHorizontal: theme.space[4],
    marginTop: theme.space[4],
  },
  detail: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.space[2],
  },
  iconDetail: { height: 18, width: 18, marginRight: theme.space[2] },
  btnSend: {
    paddingHorizontal: theme.space[1],
    backgroundColor: "#0070C0",
    paddingVertical: theme.space[3],
    borderRadius: 12,
    marginTop: theme.space[4],
    alignItems: "center",
  },
  txtInfo: { fontSize: theme.space[4] },
  textSend: { fontSize: theme.fontSizes[3], color: "#fff" },
});
export function ModalCardInfo({
  visible,
  closeModal,
  inviteName,
}: ModalCardInfo) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={closeModal}
    >
      <TouchableHighlight onPress={closeModal} style={styles.modalItem}>
        <View style={CommonStyles.flex1} />
      </TouchableHighlight>
      <View style={styles.card}>
        <View style={CommonStyles.row}>
          <View style={CommonStyles.flex1}>
            <View style={styles.avatar}>
              {/* <Text>社</Text> */}
              <Image
                source={require("../../../../assets/icons/people.png")}
                style={styles.img}
              />
            </View>
          </View>
          <View style={CommonStyles.flex2}>
            <Text style={styles.txtName}>{DUMMY_MANAGER}</Text>
            <Text style={[styles.txtName, { color: "#0070C0" }]}>
              {DUMMY_NAMECARD}
            </Text>
            <Text style={[styles.txtName, { color: "#0070C0" }]}>
              {inviteName}
            </Text>
          </View>
        </View>
        <View style={styles.status}>
          <View style={styles.circle} />
          <Text style={styles.txtStatus}>{DUMMY_STATUS}</Text>
        </View>
        <View style={styles.information}>
          <View style={styles.detail}>
            <Icon name="phone" style={styles.iconDetail} resizeMode="contain" />
            <Text style={styles.txtInfo}>{DUMMY_PHONE}</Text>
          </View>
          <View style={styles.detail}>
            <Icon
              name="landline"
              style={styles.iconDetail}
              resizeMode="contain"
            />
            <Text style={styles.txtInfo}>{DUMMY_PHONE}</Text>
          </View>
          <View style={styles.detail}>
            <Icon
              name="emailIc"
              style={styles.iconDetail}
              resizeMode="contain"
            />
            <Text style={[styles.txtInfo, { color: "#0070C0" }]}>
              {DUMMY_EMAIL}
            </Text>
          </View>
        </View>
        <View style={styles.btnSend}>
          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.textSend}>相談</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
