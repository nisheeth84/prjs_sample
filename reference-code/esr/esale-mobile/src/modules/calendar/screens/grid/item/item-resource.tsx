import React from 'react';
import { View, Text } from "react-native";
import styles from '../../../calendar-style';
import { DataOfResource } from '../../../api/common';
// import { LocalNavigation } from '../../../constants'
import moment from 'moment';
import {stylesItemResource} from './style';

interface IItemResourceProp {
  dataOfResource: DataOfResource,
  className?: string,
  prefixKey: string,
  isShowStart?: boolean,
  isShowEnd?: boolean,

  top?: string,
  left?: string,
  width?: string,
  height?: string,
  showArrow?: boolean,
  modeInHour?: boolean

}
/**
 * Item schedule Component
 * @param props 
 */
export const ItemResource = React.memo((props: IItemResourceProp) => {
  const resource: DataOfResource = props.dataOfResource

  /**
   * Render blank layout
   */
  const renderBlankObject = () => {
    return <View />
  };

  return (
    <>
      {
        props.dataOfResource.isShow ?
          (
            <View style={[stylesItemResource.styleSchedule]}>
              <View style={[stylesItemResource.styleContent]}>
                <Text style={[styles.txtDt]}>
                  {props.isShowStart && moment(resource.startDateMoment).format('HH:mm') + ' '}
                  <Text style={[styles.txtDt]}>{JSON.parse(resource.resourceName).ja_jp}</Text>
                </Text>
              </View>
            </View>
          )
          :
          (renderBlankObject())
      }
    </>
  )
})