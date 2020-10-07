
import React from 'react'
import { View, Text } from 'react-native';
import { styles } from './style';
import { DataOfResource } from '../type';
import moment from 'moment';

interface IRenderResource {
  dataOfResource: DataOfResource,
  className?: string,
  prefixKey: string,
  isShowStart: boolean,
  formatStart: string,
  isShowEnd: boolean,
  formatEnd: string

  top?: string,
  left?: string,
  width?: string,
  height?: string,
  showArrow?: boolean,
  modeInHour?: boolean
}

export const RenderResource = (props: IRenderResource) => {
  const background = '#b0e6cc'
  const renderArrowLeft = (schedule: DataOfResource) => {
    if ((props.showArrow === undefined || props.showArrow) && schedule.isStartPrevious) {
      const styleBorder = {
        background,
        borderLeftColor: background,
        borderBottomColor: background,
      };
      return (
        <View>
          <Text style={styleBorder}></Text>
        </View>
      )
    }
    return;
  }

  const renderArrowRight = (schedule: DataOfResource) => {
    if ((props.showArrow === undefined || props.showArrow) && schedule.isEndNext) {
      const styleBorder = {
        background,
        borderRightColor: background,
        borderTopColor: background,
      };
      return (
        <View>
          <Text style={styleBorder}></Text>
        </View>
      )
    }
    return;
  }

  const renderResourceTime = (schedule: DataOfResource) => {
    if (props.isShowStart || props.isShowEnd) {
      return (
        <Text style={[styles.txtDt]}>
          {props.isShowStart && moment(schedule.startDateMoment).format(props.formatStart || 'HH:mm')}
          {props.isShowEnd && props.isShowStart && (<>〜</>)}
          {props.isShowEnd && moment(schedule.finishDateMoment).format(props.formatEnd || 'HH:mm')}
        </Text>
      )
    }
    return;
  }

  const renderResourceTitle = (schedule: DataOfResource) => {
    return (
      <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.txtDt, styles.fBold]}>{schedule.resourceName}</Text>
    )
  }


  const renderResource = (schedule: DataOfResource) => {
    const styleSchedule = {
      top: props.top || '',
      left: props.left || '',
      width: props.width,
      height: props.height,
      zIndex: 1
    };
    const styleContent = {
      background,
      borderColor: background
    };

    if (!props.modeInHour) {
      return (
        <View style={[styleSchedule]}>
          {renderArrowLeft(schedule)}
          <View style={[styleContent]}>
            {renderResourceTime(schedule)}
            {renderResourceTitle(schedule)}
          </View>
          {renderArrowRight(schedule)}
        </View>
      )
    } else {
      return (
        <View style={styleSchedule}>
          <View style={styleContent}>
            {renderResourceTime(schedule)}
            {renderResourceTitle(schedule)}
          </View>
        </View>
      )
    }
  }

  return (
    renderResource(props.dataOfResource)
  )
}