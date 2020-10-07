import React from "react";
import { Text, View } from "react-native";
import styles from "./style";
import { translate } from "../../../../config/i18n";
import { messages } from "../../calendar-list-messages";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { calendarActions } from "../../calendar-reducer";
import { CalendarView } from "../../constants";
import { typeShowGridSelector } from "../../calendar-selector";
import { useNavigation } from "@react-navigation/native";



// type IContentHeader = {}
/**
 * component headers
 * @constructor
 */
const ContentHeader = () => {
  const dispatch = useDispatch();
  const typeShowGrid = useSelector(typeShowGridSelector);
  const navigation = useNavigation();
  return <View style={styles.content_header}>
    <View style={styles.box_header}>
      <Text style={styles.text_header}>{translate(messages.menuCalendar)}</Text>
    </View>
    <TouchableOpacity onPress={() => { dispatch(calendarActions.onChangeTypeShowGrid({ typeShowGrid: CalendarView.DAY }));navigation.goBack() }}>
      <View style={[styles.box_header, typeShowGrid === CalendarView.DAY ? { backgroundColor: "#E8EFF6" } : {}]}>
        <Text
          style={[
            styles.text_header,
            styles.color_active,
            styles.textFontSize,
            {color: typeShowGrid === CalendarView.DAY ?"#0F6DB4": "#333"}
          ]}
        >
          {translate(messages.dayDisplay)}
        </Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => { dispatch(calendarActions.onChangeTypeShowGrid({ typeShowGrid: CalendarView.LIST })); navigation.goBack() }}>
      <View style={[styles.box_header, typeShowGrid === CalendarView.LIST ? { backgroundColor: "#E8EFF6" } : {}]}>
        <Text style={[styles.text_header, styles.textFontSize,
            {color: typeShowGrid === CalendarView.LIST ?"#0F6DB4": "#333"}]}>
          {translate(messages.listDisplay)}
        </Text>
      </View>
    </TouchableOpacity>
  </View>
}

export default ContentHeader;