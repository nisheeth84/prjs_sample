import * as React from "react";
import { View, Text } from "react-native";
import { CheckBox } from "../../../shared/components/checkbox";
import { theme } from "../../../config/constants";
import { CommonStyles } from "../../../shared/common-style";
import { RegisterGroupChanelStyles as styles } from "./register-group-chanel-style"

interface ItemProps {
  // name of color
  name: string;
  // hex code of color
  hexColor: string;
  // check color is selected
  checked: boolean;
  // on press checkbox
  onPressCheckbox: Function;
}

/**
 * Component show group manager item
 * @param props
 */

export const ColorItem: React.FC<ItemProps> = ({
  name,
  hexColor,
  checked,
  onPressCheckbox
}) => {

  return (
    <View style={[CommonStyles.rowInlineSpaceBetween, styles.colorItem]}>
      <View style={CommonStyles.rowInline}>
        <View style={[styles.squareColor, { backgroundColor: hexColor }]} />
        <Text style={styles.colorName}>{name}</Text>
      </View>
      <CheckBox
        checkBoxStyle={[
          {
            borderColor: checked ? theme.colors.transparent : theme.colors.gray100,
          },
        ]}
        onChange={() => { onPressCheckbox() }}
        square={false}
        checked={checked}
        icCheckBoxSize={25}
      />
    </View>
  );


}
