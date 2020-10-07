import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { View, Text, Platform } from 'react-native'
import { ActivityCreateEditStyle } from '../activity-create-edit-style'
import { translate } from '../../../../config/i18n'
import { messages } from "../activity-create-edit-messages"
import { TouchableOpacity } from 'react-native-gesture-handler'
import DateTimePicker, { Event } from "@react-native-community/datetimepicker"
import { TIME_FORMAT, APP_DATE_TIME_FORMAT } from '../../../../config/constants/constants'
import { CheckBox } from '../../../../shared/components/checkbox'
import { CommonUtil } from '../../common/common-util'

interface IActivityDurationProp {
  className?: string
  firstErrorItem?: string
  errors?: { rowId: any, item: any, errorCode: any, errorMsg: any, params: {} }[]
  isDisabled?: boolean
  isRequired?: boolean
  tabIndex?: number
  itemDataField: any
  updateStateField: (fieldName: any, value: any) => void
  elementStatus?: any
  startTime?: any
  endTime?: any
  duration?: any
  fieldLabel?: any
}

/**
 * Component for ActivityDuration fields
 * @param props see IActivityDurationProp
 */
export const ActivityDurationView: React.FC<IActivityDurationProp> = (props) => {
  /**
   * boolean show activityStartTime picker
   */
  const [showStartTimePicker, setShowStartTimePicker] = useState(false)
  /**
   * boolean show activityEndTime picker
   */
  const [showEndTimePicker, setShowEndTimePicker] = useState(false)
  /**
   * checkbox if check will set activityEndTime = activityStartTime + 1h
   */
  const [changeEndTimeByStartTimeCheckbox, setChangeEndTimeByStartTimeCheckbox] = useState(true)
  /**
   * activityStartTime
   */
  const [activityStartTime, setActivityStartTime] = useState<any>(props.startTime)
  /**
   * activityEndTime
   */
  const [activityEndTime, setActivityEndTime] = useState<any>(props.endTime)
  /**
   * duration
   */
  const [activityDuration, setActivityDuration] = useState<any>(props.duration)

  useEffect(() => {
    props.updateStateField('activityStartTime', activityStartTime);
    props.updateStateField('activityEndTime', activityEndTime);
    props.updateStateField('activityDuration', activityDuration);
  }, [changeEndTimeByStartTimeCheckbox, activityStartTime, activityEndTime])

  /**
   * action change startTime, calculate activityDuration
   * @param time
   */
  const onChangeStartTime = async (event: Event, time: any) => {
    Platform.OS !== 'ios' && setShowStartTimePicker(false)
    if (time && event.type !== "dismissed") {
      let start = CommonUtil.toTimeStamp(time)// moment(time).format(DATE_TIME_FORMAT)
      setActivityStartTime(start)
      let end = activityEndTime
      if (changeEndTimeByStartTimeCheckbox) {
        end = CommonUtil.toTimeStamp(time.getTime() + 60 * 60 * 1000)
        setActivityEndTime(end)
      }
      const activityDuration = distanceTime(moment(start).format(TIME_FORMAT), moment(end).format(TIME_FORMAT))
      setActivityDuration(activityDuration)
    }
  }

  /**
   * action change endTime, calculate activityDuration
   * @param time
   */
  const onchangeEndTime = (event: Event, time: any) => {
    Platform.OS !== 'ios' && setShowEndTimePicker(false)
    if (time && event.type !== "dismissed") {
      let end = CommonUtil.toTimeStamp(time)
      setActivityEndTime(end)
      const activityDuration = distanceTime(moment(activityStartTime).format(TIME_FORMAT), moment(end).format(TIME_FORMAT))
      setActivityDuration(activityDuration)
    }
  }

  /**
   * action change checkbox, calculate activityDuration
   * @param isChecked
   */
  const handleChangeEndTimeByStartTimeCheckbox = (isChecked: boolean) => {
    setChangeEndTimeByStartTimeCheckbox(isChecked)
    if (isChecked) {
      let startTime = new Date(activityStartTime).getTime()
      let endTime = startTime + 60 * 60 * 1000
      setActivityEndTime(moment(new Date(endTime)).format(APP_DATE_TIME_FORMAT))
      setActivityDuration(60)
    }
  }

  /**
   * action calculate activityDuration
   * @param start
   * @param end
   */
  const distanceTime = (start: string, end: string) => {
    if (start !== undefined && end !== undefined) {
      let timeStart = start.split(":", 2),
        minStart = Number(timeStart[0]) * 60 + Number(timeStart[1]),
        timeEnd = end.split(":", 2),
        minEnd = Number(timeEnd[0]) * 60 + Number(timeEnd[1])
      let distance = minEnd - minStart
      if (distance < 0) {
        return null
      } else {
        return distance
      }
    }
    return null
  }

  return (
    <View>
      <View style={[ActivityCreateEditStyle.ActivityTop]}>
        <Text style={[ActivityCreateEditStyle.ActivityTitle, ActivityCreateEditStyle.FontWeight]}>
          {props.fieldLabel}
        </Text>
        <Text style={[ActivityCreateEditStyle.ActivityLabel]}>{translate(messages.required)}</Text>
      </View>
      <View style={[ActivityCreateEditStyle.ActivityContent]}>
        <View style={[ActivityCreateEditStyle.BoxChangeTime]}>
          <View style={[ActivityCreateEditStyle.BoxBody]}>
            <View style={[ActivityCreateEditStyle.TimeStart, { flexDirection: "row", alignItems: "center" }]}>
              <TouchableOpacity
                style={[ActivityCreateEditStyle.ActivityInput, ActivityCreateEditStyle.TimeInput, ActivityCreateEditStyle.BoxTime]}
                onPress={() => { setShowStartTimePicker(!showStartTimePicker); setShowEndTimePicker(false)}}
              >
                <Text style={[ActivityCreateEditStyle.TimeText]}>{moment(activityStartTime).format(TIME_FORMAT)}</Text>
              </TouchableOpacity>
              <Text style={[ActivityCreateEditStyle.TimeConnect]}>{translate(messages.timeConnect)}</Text>
            </View>
            <View style={[ActivityCreateEditStyle.TimeEnd]}>
              <TouchableOpacity
                style={[ActivityCreateEditStyle.ActivityInput, ActivityCreateEditStyle.TimeInput, ActivityCreateEditStyle.BoxTime]}
                onPress={() => {
                  if (!changeEndTimeByStartTimeCheckbox) {
                    setShowEndTimePicker(!showEndTimePicker);
                    setShowStartTimePicker(false)
                  }
                }}
              >
                <Text style={[ActivityCreateEditStyle.TimeText]}>{moment(activityEndTime).format(TIME_FORMAT)}</Text>
              </TouchableOpacity>
            </View>
            <View style={[ActivityCreateEditStyle.TimeCalculator]}>
              <View style={[ActivityCreateEditStyle.ActivityInput, ActivityCreateEditStyle.TimeInput, ActivityCreateEditStyle.BoxTime]}>
                <Text style={[ActivityCreateEditStyle.TimeTextV2]}>{activityDuration}</Text>
                <Text style={[ActivityCreateEditStyle.TimeLabel]}>{translate(messages.minute)}</Text>
              </View>
            </View>
          </View>
          {
            showStartTimePicker &&
            <DateTimePicker
              mode="time"
              value={new Date(activityStartTime)}
              is24Hour={true}
              display="clock"
              onChange={(event, time) => { onChangeStartTime(event, time) }}
            />
          }
          {
            showEndTimePicker &&
            <DateTimePicker
              mode="time"
              value={new Date(activityEndTime)}
              is24Hour={true}
              display="default"
              onChange={(event, time) => { onchangeEndTime(event, time) }}>
            </DateTimePicker>
          }
          
          <View style={[ActivityCreateEditStyle.TimeNote]}>
            <CheckBox
              checked={changeEndTimeByStartTimeCheckbox}
              onChange={() => { handleChangeEndTimeByStartTimeCheckbox(!changeEndTimeByStartTimeCheckbox) }}
            >
              {translate(messages.changeEndTimeByStartTimeCheckbox)}
            </CheckBox>
          </View>
        </View>
      </View>
    </View>
  )
}