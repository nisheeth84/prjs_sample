import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import { tabEditStyles } from "../styles";
import { messages } from "../products-manage-messages";
import { translate } from "../../../config/i18n";

interface TabEditProps {
  /**
   *show model delete
   */
  onEdit: () => void;
  /**
   * cancel selections and hide the Edit tab
   */
  onCancel: () => void;
  /**
   * select all selections
   */
  onSelectAll: () => void;
  /**
   * cancel all selections
   */
  onDeselect: () => void;
  /**
   * check show tab edit
   */
  edit: boolean;
  /**
   * check show select all or deselect
   */
  selectAll: boolean;
}
/**
 * component tab edit products trading
 */
export const TabEditProducts: React.FC<TabEditProps> = ({
  onEdit,
  onCancel,
  onSelectAll,
  onDeselect,
  selectAll,
  edit,
}) => {
  const fadeAnim = useRef(new Animated.Value(-62)).current;
  /**
   * animation show tab
   */
  useEffect(() => {
    const showTabEdit = () => {
      Animated.timing(fadeAnim, {
        toValue: edit ? 0 : -62,
        duration: 500,
        useNativeDriver: false
      }).start();
    };
    showTabEdit();
  });

  return (
    <Animated.View
      style={[tabEditStyles.containerTabEdit, { bottom: fadeAnim }]}
    >
      <TouchableOpacity
        onPress={selectAll ? onDeselect : onSelectAll}
        style={tabEditStyles.itemTabEditLeft}
      >
        <Text style={tabEditStyles.txtTabEdit}>
          {selectAll
            ? translate(messages.productsManageDeselect)
            : translate(messages.productSelectAll)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCancel}
        style={tabEditStyles.itemBetweenTabEdit}
      >
        <Text style={tabEditStyles.txtTabEdit}>
          {translate(messages.productsManageCancel)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onEdit} style={tabEditStyles.itemTabEditRight}>
        <Text style={tabEditStyles.txtTabEdit}>
          {translate(messages.productsManageDelete)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
