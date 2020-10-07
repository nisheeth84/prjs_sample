import React from "react";
import {
  Modal,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { CustomerModalConfirmStyles } from "./customer-modal-style";
import { CommonStyles } from "../../../shared/common-style";

const styles = CustomerModalConfirmStyles;

/**
 * interface use for CustomerModalConfirm component
 */
interface CustomerModalConfirmInterface {
  // check visible for modal
  visible: boolean;
  // modal title
  title: string;
  // modal content string
  content: string;
  // left button text
  leftBtn: string;
  // right button text
  rightBtn: string;
  // handle press confirm
  onConfirm: () => void;
  // handle press cancel
  onCancel: () => void;
  // style for right button
  styleRightBtn?: StyleProp<ViewStyle>;
}

/**
 * component for customer modal confirm
 * @param props
 */
export const CustomerModalConfirm = ({
  visible = false,
  title = "",
  content = "",
  leftBtn = "",
  rightBtn = "",
  onConfirm = () => {},
  onCancel = () => {},
  styleRightBtn = {},
}: CustomerModalConfirmInterface) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => onCancel()}
    >
      <View style={styles.container}>
        <View style={styles.viewContent}>
          <Text style={styles.txtTitle}>{title}</Text>
          <View style={CommonStyles.padding1} />
          <Text style={styles.txt}>{content}</Text>
          <View style={CommonStyles.padding2} />
          <View style={CommonStyles.rowInlineSpaceBetween}>
            <TouchableOpacity style={styles.btn} onPress={() => onCancel()}>
              <Text style={styles.txt}>{leftBtn}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnConfirm, styleRightBtn]}
              onPress={() => onConfirm()}
            >
              <Text style={styles.txtConfirm}>{rightBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
