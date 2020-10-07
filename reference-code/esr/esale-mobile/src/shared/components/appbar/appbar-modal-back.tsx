import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../icon";
import { theme } from "../../../config/constants";
import { ButtonColorHighlight } from "../button/button-color-highlight";
import {
  EnumButtonStatus,
  EnumButtonType,
} from "../../../config/constants/enum";

interface AppBarModalProps {
  onClose?: () => void;
  title: string;
  onCreate?: () => void;
  // check disable button create
  isEnableButtonCreate?: boolean;
  // title button
  titleButtonCreate?: any;
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: theme.colors.gray200,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  hitSlop: { top: 10, right: 10, left: 10, bottom: 10 },
  iconClose: { paddingLeft: theme.space[3], flex: 1 },
  btnRight: { alignItems: "flex-end", flex: 1 },
  txtHeader: {
    fontSize: 18,
    flex: 2,
    textAlign: "center",
    alignItems: "center",
  },
  btnComplete: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[1],
    margin: theme.space[2],
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.blue200,
  },
  btnInComplete: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[1],
    margin: theme.space[2],
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.gray100,
  },
  txtWhite: {
    padding: theme.space[1],
    color: theme.colors.white,
    fontSize: theme.fontSizes[1],
  },
  txtGray12: {
    fontSize: theme.fontSizes[1],
    padding: theme.space[1],
    color: theme.colors.gray300,
  },
});

export const AppBarModalBack: React.FC<AppBarModalProps> = ({
  onClose,
  title,
  onCreate,
  isEnableButtonCreate,
  titleButtonCreate,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onClose}
        hitSlop={styles.hitSlop}
        style={styles.iconClose}
      >
        <Icon name="back" />
      </TouchableOpacity>
      <Text style={styles.txtHeader}>{title}</Text>
      <View style={styles.btnRight}>
        {titleButtonCreate && (
          <ButtonColorHighlight
            onPress={() => onCreate}
            type={EnumButtonType.complete}
            title={titleButtonCreate}
            status={
              !isEnableButtonCreate
                ? EnumButtonStatus.disable
                : EnumButtonStatus.normal
            }
          />
        )}
      </View>
    </View>
  );
};
