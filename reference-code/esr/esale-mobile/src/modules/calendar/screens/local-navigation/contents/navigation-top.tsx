import React from "react";
import styles from "../style";
import { Text, TouchableOpacity, View } from "react-native";
import { TabFocus } from "../../../constants";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../../calendar-list-messages";

/**
 * interface navigation top
 */
type INavigationTop = {
  layout: number,
  handleLayout: (layout: number) => void
}

/**
 * component navigation top
 * @param props
 * @constructor
 */
const NavigationTop = (props: INavigationTop) => {
  return <View style={styles.tab}>
    <TouchableOpacity
      style={props.layout === TabFocus.SCHEDULE ? [styles.titleTab, styles.tab_active] : styles.titleTab}
      onPress={() => props.handleLayout(TabFocus.SCHEDULE)}>
      <Text style={props.layout === TabFocus.SCHEDULE ? [styles.textFontSize, styles.color_active] : styles.textFontSize}>
        {translate(messages.plan)}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={props.layout === TabFocus.RESOURCE ? [styles.titleTab, styles.tab_active] : styles.titleTab}
      onPress={() => props.handleLayout(TabFocus.RESOURCE)}>
      <Text style={props.layout === TabFocus.RESOURCE ? [styles.textFontSize, styles.color_active] : styles.textFontSize}>
        {translate(messages.resource)}
      </Text>
    </TouchableOpacity>
  </View>
}

export default NavigationTop;