import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { IScheduleTypes } from "./plan-schedule";
import styles from "../style";
import { EquipmentTypesType } from "../../../api/get-local-navigation-type";
import { ACTION_LOCAL_NAVIGATION } from "../../../constants";
// import { ItemCalendar } from "../../grid/item/item-calendar";

/**
 * interface IComponentSuggest
 */
type IComponentSuggest = {
  listData: any;
  typeComponent?: ACTION_LOCAL_NAVIGATION;
  insertItem?: ((item: IScheduleTypes) => void) | ((item: EquipmentTypesType) => void);
  dataScreen: any;
}

/**
 * component suggest
 * @param props
 * @constructor
 */
const ComponentSuggest = (props: IComponentSuggest) => {
  /**
   * status show or hidden of component
   */
  const [isShow, setShow] = useState(false);
  const [indexScroll, setIndexScroll] = useState(false);
  /**
   * set show or hidden component
   */
  useEffect(() => {
    if (props.listData) {
      setShow(true);
      if(props.listData.length > 7){
        setIndexScroll(true)
      }
    } else {
      setShow(false);
    }
  }, [props.listData])
  

  /**
   * render error
   */
  const renderError = () => {
    return typeof props.listData === 'string' &&
      <View key={`equipmentTypeSelect`}>
        <Text style={styles.errorMessage}>{props.listData}</Text>
      </View>
  }
  /**
   * render suggest schedule
   */
  const renderSchedule = () => {
    return (isShow &&
      <ScrollView nestedScrollEnabled={indexScroll} style={styles.suggestionContainer} key={'renderSchedule'}>
        {
          Array.isArray(props.listData) &&
          props.listData.map((item: IScheduleTypes, idx: number) => {
            const itemSaveLocal = {
              scheduleTypeId: item.scheduleTypeId,
              scheduleTypeName: item.scheduleTypeName,
              isSelected: item.isSelected === undefined ? 0 : item.isSelected
            }
            return <ScrollView key={`scheduleTypeSelect_${idx}`}>
              {
                (props.dataScreen.some((obj: IScheduleTypes) => obj.scheduleTypeId === item.scheduleTypeId))
                  ?
                  <View style={styles.textSelected}>
                    <Text style={styles.suggestTexted}>
                      {item?.scheduleTypeName}
                    </Text>
                  </View>
                  :
                  <TouchableOpacity
                    style={styles.textNoSelect}
                    onPress={() => { props.insertItem && props.insertItem(itemSaveLocal) }}>
                    <Text style={styles.suggestText}>{item?.scheduleTypeName}</Text>

                  </TouchableOpacity>
              }
            </ScrollView>
          })
        }
        {renderError()}
      </ScrollView>
    )
  }

  /**
   * render suggest equipments
   */
  const renderEquipments = () => {
    return (isShow &&
      <ScrollView nestedScrollEnabled={indexScroll} style={styles.suggestionContainer} key={'renderEquipments'}>
        {
          Array.isArray(props.listData) &&
          props.listData.length > 0 &&
          props.listData.map((item: EquipmentTypesType, idx: number) => {
            return <View key={`equipmentTypeSelect_${idx}`}>
              {
                (props.dataScreen.some((obj: EquipmentTypesType) => obj.equipmentTypeId === item.equipmentTypeId))
                  ?
                  <View style={styles.textSelected}>
                    <Text style={styles.suggestTexted}>
                      {item?.equipmentTypeName}
                    </Text>
                  </View>
                  :
                  <TouchableOpacity
                    style={styles.textNoSelect}
                    onPress={() => props.insertItem && props.insertItem(item)}>
                    <Text style={styles.suggestText}>{item?.equipmentTypeName}</Text>
                  </TouchableOpacity>
              }
            </View>
          })
        }
        {renderError()}
      </ScrollView>
    )
  }

  return <>
    {[
      props.typeComponent === ACTION_LOCAL_NAVIGATION.SCHEDULE && renderSchedule(),
      props.typeComponent === ACTION_LOCAL_NAVIGATION.EQUIPMENT && renderEquipments()
    ]}
  </>
}

export default ComponentSuggest;