import React, { useState } from "react";
import { Text, View, Image } from "react-native";
import styles from "../style";
import CheckBoxCustom from "../../../components/checkbox-custom/checkbox-custom";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../../calendar-list-messages";
import { ACTION_LOCAL_NAVIGATION } from "../../../constants";
import { Images } from "../../../config";
import { TouchableOpacity } from "react-native-gesture-handler";

type INavigationBottom = {
  isShowPerpetualCalendar?: any
  isShowHoliday?: any
  handleUpdateStatic: (flag: boolean, type: ACTION_LOCAL_NAVIGATION) => void
}

/**
 * component bottom
 * @constructor
 */
const NavigationBottom = (props: INavigationBottom) => {
  /**
   * status show or hidden component
   */
  const [isShow, setIsShow] = useState(true);

  return <View style={styles.bottom}>
    <TouchableOpacity onPress={() => {
      setIsShow(!isShow)
    }}>
      <View style={styles.boxArrow}>
        <Image
          source={isShow ? Images.localNavigation.ic_up : Images.localNavigation.ic_down}
          style={styles.icon_up_down}
        />
        <Text style={[styles.textFontSize, styles.textBottom]}>
          {translate(messages.displaySettings)}
        </Text>
      </View>
    </TouchableOpacity>
    {isShow &&
      <View style={styles.ContentSmall}>
        <View>
          <View style={styles.checkboxParent}>
            <CheckBoxCustom
              background={"#0F6EB5"}
              borderColor={"#0F6EB5"}
              active={true}
              type={ACTION_LOCAL_NAVIGATION.PERPETUAL_CALENDAR}
              handleCheckStatic={props.handleUpdateStatic}
            />
            <Text style={[styles.textFontSize, styles.textCheckBox]}>
              {translate(messages.option2)}
            </Text>
          </View>
          <View style={styles.checkboxParent}>
            <CheckBoxCustom
              background={"#0F6EB5"}
              borderColor={"#0F6EB5"}
              active={true}
              type={ACTION_LOCAL_NAVIGATION.HOLIDAY}
              handleCheckStatic={props.handleUpdateStatic}
            />
            <Text style={[styles.textFontSize, styles.textCheckBox]}>
              {translate(messages.option3)}
            </Text>
          </View>
        </View>
      </View>
    }
  </View>
}

export default NavigationBottom;