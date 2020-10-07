import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { Images } from "../../../config";
import styles from "../style";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../../calendar-list-messages";

/**
 * interface global bottom
 */
type IGlobalBottom = {
  isActive: boolean;
  itemId: number;
  updatedDate?: string;
  updateStatusItem: (itemId: number, flag: string, updatedDate: string) => void;
  data?: any;
};

/**
 * type of participant
 */
const TYPES = {
  ATTENDANCE: "1",
  ABSENTEEISM: "2",
  SHARE: "3"
}

/**
 * component global bottom
 * @param props
 * @constructor
 */
const GlobalBottom = (props: IGlobalBottom) => {
  const [status, setStatus] = useState('')
  useEffect(() => {
    if (props.data?.attendanceDivision == null) {
      setStatus('SHARE')
    }
    else if (props.data?.attendanceDivision == 1) {
      setStatus('JOIN')
    }
    else if (props.data?.attendanceDivision == 2) {
      setStatus('ABSENTEEISM')
    }
  }, [props.data])

  return <View style={[styles.flexD_Btn, styles.pdTB]}>
    {
      status == 'JOIN' ?
        <View
          style={styles.btnTicked}
        // onPress={() => {
        //   !props.isActive
        //     && props.updatedDate
        //     && props.updateStatusItem(props.itemId, TYPES.ATTENDANCE, props.updatedDate)
        // }}
        >
          <Image
            source={Images.globalToolSchedule.ic_check}
            style={styles.btnImaged}
          />
          <Text
            style={[styles.textButtonTick, styles.color_active]}
          >
            {translate(messages.isAttended)}
          </Text>
        </View>
        :
        <TouchableOpacity
          style={styles.btnTick}
          onPress={() => {
             props.updatedDate
              && props.updateStatusItem(props.itemId, TYPES.ATTENDANCE, props.updatedDate)
          }}
        >
          <Image
            source={Images.globalToolSchedule.ic_check}
            style={styles.btnImage}
          />
          <Text
            style={styles.textButtonTick}
          >
            {translate(messages.isAttended)}
          </Text>
        </TouchableOpacity>
    }


    {
      status == 'ABSENTEEISM' ?
        <View
          style={styles.btnTicked}
        // onPress={() => {
        //   !props.isActive
        //     && props.updatedDate
        //     && props.updateStatusItem(props.itemId, TYPES.ABSENTEEISM, props.updatedDate)
        // }}
        >
          <Image
            source={Images.globalToolSchedule.ic_close}
            style={styles.btnImaged}
          />
          <Text style={[styles.textButtonTick, styles.color_active]}>{translate(messages.isAbsence)}</Text>
        </View>
        :
        <TouchableOpacity
          style={styles.btnTick}
          onPress={() => {
            props.updatedDate &&
              props.updateStatusItem(props.itemId, TYPES.ABSENTEEISM, props.updatedDate)
          }}
        >
          <Image
            source={Images.globalToolSchedule.ic_close}
            style={styles.btnImage}
          />
          <Text style={styles.textButtonTick}>{translate(messages.isAbsence)}</Text>
        </TouchableOpacity>
    }



    {
      status == 'SHARE' ?
        <View
          style={styles.btnTicked}
        // onPress={() => !props.isActive &&
        //   props.updatedDate &&
        //   props.updateStatusItem(props.itemId, TYPES.SHARE, props.updatedDate)}
        >
          <Image
            source={Images.globalToolSchedule.ic_share}
            style={styles.btnImaged}
          />
          <Text style={[styles.textButtonTick, styles.color_active]}>{translate(messages.isShared)}</Text>
        </View>
        :
        <TouchableOpacity
          style={styles.btnTick}
          onPress={() => 
            props.updatedDate &&
            props.updateStatusItem(props.itemId, TYPES.SHARE, props.updatedDate)}
        >
          <Image
            source={Images.globalToolSchedule.ic_share}
            style={styles.btnImage}
          />
          <Text style={styles.textButtonTick}>{translate(messages.isShared)}</Text>
        </TouchableOpacity>

    }
  </View>
}

export default GlobalBottom;