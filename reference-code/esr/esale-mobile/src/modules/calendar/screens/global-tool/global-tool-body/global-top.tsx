import React from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";

import styles from "../style";
import { Images } from "../../../config";
import { messages } from '../../../../../config/constants/messages-common';
import {translate} from "../../../../../config/i18n";

/**
 * interface global top
 */
type IGlobalTop = {
  calendarDay?: moment.Moment;
  handlePrevNextDay?: (action: number) => void
}

/**
 * TYPE NEXT OR PREV
 */
const TYPES = {
  PREV: -1,
  NEXT: 1
}

/**
 * component global top
 * @param props
 * @constructor
 */
const GlobalTop = (props: IGlobalTop) => {
  /**
   * calendar date
   */
  const calendarDate = moment.utc(props.calendarDay).format('YYYY-MM-DD').split('-');
  
  return <View style={styles.datepicker}>
    <TouchableOpacity onPress={() => props.handlePrevNextDay && props.handlePrevNextDay(TYPES.PREV)}>
      <Image
        source={Images.globalToolSchedule.ic_pre}
        style={styles.general_icon}
      />
    </TouchableOpacity>
    <Text style={styles.text_datepicker}>
      { 
        translate(messages.formatFullDate, 
          {
            year: calendarDate[0],
            month: calendarDate[1],
            day: calendarDate[2]
          }
        ) 
      }
    </Text>
    <TouchableOpacity onPress={() => props.handlePrevNextDay && props.handlePrevNextDay(TYPES.NEXT)}>
      <Image
        source={Images.globalToolSchedule.ic_next}
        style={styles.general_icon}
      />
    </TouchableOpacity>
  </View>
}

export default GlobalTop;