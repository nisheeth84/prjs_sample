import React, { useEffect } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { messages } from "./register-group-chanel-messages";
import { translate } from "../../../config/i18n";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CommonStyles } from "../../../shared/common-style";
import { Header } from "../../../shared/components/header";
import { theme } from "../../../config/constants";
import { RegisterGroupChanelStyles as styles } from "./register-group-chanel-style";
import { ColorItem } from "./color-item";
import { useDispatch, useSelector } from "react-redux";
import { timelineActions } from "../timeline-reducer";
import { groupColorSelector, listColorSelector } from "../timeline-selector";
import { ColorRouteProp } from "../../../config/constants/root-stack-param-list";

export interface Color {
  id: number;
  name: string;
  hexColor: string;
}

/**
 * Component show group chanel color screen
 */

export const RegisterGroupChanelColorScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const groupColor = useSelector(groupColorSelector);
  const route = useRoute<ColorRouteProp>();
  const colorList = useSelector(listColorSelector);
  console.log("colorList", colorList);

  const selectColor = (color: any) => {
    dispatch(timelineActions.saveCurrentColor(color));
  };

  useEffect(() => {}, [route.params?.hexColor]);

  return (
    <View style={CommonStyles.flex1}>
      <Header
        title={translate(messages.groupColorScreenTitle)}
        titleSize={theme.fontSizes[4]}
        onLeftPress={() => {
          navigation.goBack();
        }}
        leftIconName="arrowLeft"
      />
      <ScrollView style={styles.main}>
        {colorList.map((color, index) => {
          return (
            <View key={index}>
              <ColorItem
                checked={groupColor.id === color.id}
                hexColor={color.hexColor}
                name={color.name}
                key={color.id.toString()}
                onPressCheckbox={() => {
                  selectColor(color);
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};
