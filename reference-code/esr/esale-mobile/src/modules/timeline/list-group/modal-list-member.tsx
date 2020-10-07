import React from "react";
import {
  FlatList,
  Modal,
  Text,
  // TouchableHighlight,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
// import { CommonStyles } from "../../../shared/common-style";
// import { translate } from "../../../config/i18n";
import { ModalMemberStyles } from "./timeline-list-group-style";
import { theme } from "../../../config/constants";

interface ModalParticipant {
  visible: boolean;
  closeModal: () => void;
  data: any;
}
// const styles = ModalMemberStyles;

export function ModalListMember({
  visible,
  closeModal,
  data,
}: ModalParticipant) {
  const renderItem = (item: any) => {
    console.log("item.imagePathitem.imagePath", item);
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: theme.space[4],
          paddingVertical: theme.space[2],
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.gray100,
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.green,
          }}
        >
          {item.item.imagePath === undefined ? (
            <Text style={{ fontSize: 14, color: "#fff" }}>
              {item.item.inviteName.substr(0, 1)}
            </Text>
          ) : (
            <Image source={item.item.imagePath} />
          )}
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            marginLeft: theme.space[3],
          }}
        >
          <Text numberOfLines={1} style={{ fontSize: theme.fontSizes[4] }}>
            {item.item.inviteName}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={closeModal}
    >
      <View
        style={{
          backgroundColor: theme.colors.blackDeep,
          flex: 1,
          paddingVertical: "40%",
          paddingHorizontal: "20%",
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              paddingVertical: theme.space[3],
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.gray100,
            }}
          >
            <Text style={{ fontSize: theme.fontSizes[4], fontWeight: "bold" }}>
              部下
            </Text>
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <FlatList data={data} renderItem={(item) => renderItem(item)} />
          </View>
          <View
            style={{
              width: "100%",
              paddingVertical: theme.space[4],
              alignItems: "center",
              borderTopWidth: 1,
              borderTopColor: theme.colors.gray100,
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: theme.space[3],
                paddingVertical: theme.space[2],
                borderWidth: 1,
                borderRadius: theme.borRadius.borderRadius8,
                borderColor: theme.colors.gray1,
              }}
              onPress={closeModal}
            >
              <Text>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
