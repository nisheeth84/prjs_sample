/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { styles } from "./timeline-drawer-styles";

interface ItemDrawerProps {
  title: string;
  borderBottom?: boolean;
  newItem?: any;
  arrowRight?: boolean;
  addCircle?: boolean;
  arrowDown?: boolean;
  onPress?: () => void;
  onPressItem?: (item: any) => void;
  children?: any;
  dataSearch?: Array<any>;
  showChildren?: boolean;
}

export const ItemDrawer: React.FC<ItemDrawerProps> = ({
  title,
  borderBottom,
  addCircle,
  arrowDown,
  arrowRight,
  newItem,
  onPress,
  children,
  showChildren,
}) => {
  const [showChildItem, setShowChildItem] = useState(arrowDown);
  useEffect(() => setShowChildItem(showChildren), [showChildren]);
  return (
    <View style={borderBottom && styles.boxItemBorder}>
      <TouchableOpacity
        disabled={!onPress && !arrowDown}
        onPress={arrowDown ? () => setShowChildItem(!showChildItem) : onPress}
        style={styles.boxItemDrawerNoBorder}
      >
        <View style={styles.boxRow}>
          {arrowDown && (
            <Icon
              style={styles.iconLeft}
              name={showChildItem ? "arrowUp" : "arrowDown"}
            />
          )}
          <Text>{title}</Text>
        </View>
        <View style={styles.boxRow}>
          {!!newItem && (
            <View style={styles.itemCircle}>
              <Text style={styles.txtItemCircle}>{newItem}</Text>
            </View>
          )}
          {arrowRight && <Icon style={styles.iconRight} name="arrowRight" />}
          {addCircle && (
            <Icon style={styles.iconRight} name="addCircleOutline" />
          )}
        </View>
      </TouchableOpacity>
      {showChildItem && children}
    </View>
  );
};
