import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "../../../shared/components/icon";
import { personalSettingStyles } from "./menu-personal-settings-styles";
import { ChooseFeatureSetting } from "../../../config/constants/enum";
import { messages } from "./menu-personal-settings-messages";
import { translate } from "../../../config/i18n";
import { AppBarModal } from "../../../shared/components/appbar/appbar-modal";
import { ScreenName } from "../../../config/constants/screen-name";

/**
 * Component show category setting
 */
export const CategorySetting = () => {
  const [selectedType, setSelectedType] = useState(-1);
  const navigation = useNavigation();
  /**
   * choose item category
   * @param type
   */
  const onSetting = (type: number) => {
    setSelectedType(type);
    switch (type) {
      case ChooseFeatureSetting.PASSWORD:
        navigation.navigate(ScreenName.CHANGE_NORMAL_PASSWORD);
        break;
      case ChooseFeatureSetting.LANGUAGE_AND_TIME:
        navigation.navigate(ScreenName.LANGUAGE_AND_TIME_SETTING);
        break;
      default:
        navigation.navigate(ScreenName.NOTIFICATION_SETTING);
        break;
    }
  };

  /**
   * render item category setting
   * @param type
   * @param icon
   * @param title
   */
  const itemCategorySetting = (type: number, icon: string, title: string) => {
    return (
      <TouchableOpacity
        onPress={() => onSetting(type)}
        style={
          selectedType === type
            ? personalSettingStyles.boxCategorySelected
            : personalSettingStyles.boxCategory
        }
      >
        <Icon name={icon} style={personalSettingStyles.iconCategory} />
        <Text
          style={
            selectedType === type
              ? personalSettingStyles.txtCategorySelected
              : personalSettingStyles.txtCategory
          }
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={personalSettingStyles.container}>
      <AppBarModal
        title={translate(messages.titleSetting)}
        onClose={() => navigation.goBack()}
      />
      <View style={personalSettingStyles.container}>
        {itemCategorySetting(
          ChooseFeatureSetting.PASSWORD,
          "lock",
          translate(messages.passwordSetting)
        )}
        {itemCategorySetting(
          ChooseFeatureSetting.LANGUAGE_AND_TIME,
          "languageTime",
          translate(messages.languageAndTimeSetting)
        )}
        {itemCategorySetting(
          ChooseFeatureSetting.NOTIFICATION,
          "bigBell",
          translate(messages.notificationSetting)
        )}
      </View>
    </View>
  );
};
