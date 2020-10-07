import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import styles from "./style";
import {translate} from "../../../../config/i18n";
import {messages} from "../../calendar-list-messages";
import {TAB_CURRENT_GLOBAL_TOOL} from "../../constants";

/**
 * interface global tool header
 */
type IGlobalToolHeaders = {
  currentTab?: TAB_CURRENT_GLOBAL_TOOL;
  countSchedule: number;
  handleTabShow: (tab: number) => void
};

/**
 * component global tool header
 * @param props
 * @constructor
 */
const GlobalToolHeaders = (props: IGlobalToolHeaders) => {
  return  <View style={styles.content_header}>
    {/*Tab notification*/}
    <TouchableOpacity 
      style={
        props.currentTab === TAB_CURRENT_GLOBAL_TOOL.NOTIFICATION 
          ? [styles.titleTab, styles.tab_active] 
          : styles.titleTab
      } 
      onPress={() => props.handleTabShow(TAB_CURRENT_GLOBAL_TOOL.NOTIFICATION)}
    >
      <Text 
        style={
          props.currentTab === TAB_CURRENT_GLOBAL_TOOL.NOTIFICATION  
            ? [styles.textTitleTab, styles.color_active]
            : styles.textTitleTab}
      >{translate(messages.notification)}</Text>
      <View style={styles.notification}>
        <Text style={styles.textNotification}>1</Text>
      </View>
    </TouchableOpacity>
    {/*Tab Task*/}
    <TouchableOpacity 
      style={
        props.currentTab === TAB_CURRENT_GLOBAL_TOOL.TASK
          ? [styles.titleTab, styles.tab_active] 
          : styles.titleTab
      } 
      onPress={() => props.handleTabShow(TAB_CURRENT_GLOBAL_TOOL.TASK)}>
      <Text 
        style={
          props.currentTab === TAB_CURRENT_GLOBAL_TOOL.TASK 
            ? [styles.textTitleTab, styles.color_active]
            : styles.textTitleTab
        }
      >{translate(messages.mostRecentTask)}</Text>
      <View style={styles.notification}>
        <Text style={styles.textNotification}>2</Text>
      </View>
    </TouchableOpacity>
    {/*Tab Schedule*/}
    <TouchableOpacity 
      style={
        props.currentTab === TAB_CURRENT_GLOBAL_TOOL.SCHEDULE 
          ? [styles.titleTab, styles.tab_active] 
          : styles.titleTab
      }
      onPress={() => props.handleTabShow(TAB_CURRENT_GLOBAL_TOOL.SCHEDULE)}>
      <Text 
        style={
          props.currentTab === TAB_CURRENT_GLOBAL_TOOL.SCHEDULE 
            ? [styles.textTitleTab, styles.color_active] 
            : styles.textTitleTab
        }
      >
        {translate(messages.latestPlan)}
      </Text>
      <View style={styles.notification}>
        <Text style={styles.textNotification}>{ props.countSchedule }</Text>
      </View>
    </TouchableOpacity>
  </View>
};

export default GlobalToolHeaders;