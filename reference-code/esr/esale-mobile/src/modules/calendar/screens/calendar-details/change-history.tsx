import React, { useEffect, useState } from "react";
import { Image, NativeScrollEvent, ScrollView, Text, View } from "react-native";
import { Images } from "../../config";
import styles from "./style";
import { Style } from "../../common";
// import { isObject } from "util";
import { getValueByKey, checkResponse } from "../../common/helper"
import { ScheduleHistoriesType } from "../../api/get-schedule-type";
import { getScheduleHistory } from "../../calendar-repository";
import { useDispatch, useSelector } from "react-redux";
import { calendarActions } from "../../calendar-reducer";
import { scheduleHistoriesSelector } from "../../calendar-selector";
import moment from 'moment';
import _ from 'lodash';
// import { CALENDAR_DETAIL } from "../../assets/dummy";


/**
 * type props ChangeHistory
 */
type IChangeHistory = {
  scheduleHistories?: ScheduleHistoriesType[];
  scheduleId?: number
}

const LIMIT = 30;

/**
 * Change History component
 * @param scheduleHistories data transfer
 * @param scheduleId data transfer
 */
export const ChangeHistory = React.memo(({ scheduleHistories, scheduleId }: IChangeHistory) => {
  const [listScheduleHistories, setListScheduleHistories] = useState(scheduleHistories);
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * get property and value of item
   * @param item
   */
  // const getPropertyAndValue = (item: string) => {
  //   if (!isObject(item)) {
  //     return;
  //   }
  //   const property: any = Object.keys(item)[0];
  //   const value = item[property];
  //   return { property, value };
  // }

  /**
   * render convert Icon History
   * @param value 
   */
  // const convertIconHistory = (value: string) => {
  //   let arrOldNewValue = [];
  //   arrOldNewValue = value.split('>');
  //   return <Text>{arrOldNewValue[0]} &#8594; {arrOldNewValue[1]}</Text>
  // }
  /**
   * render history Item Change Detail
   * @param item 
   * @param idDetail 
   */
  // const historyItemChangeDetail = (item: any, idDetail: number) => {
  //   const { property, value }: any = getPropertyAndValue(item);
  //   return <Text key={idDetail} style={styles.history_text}>{getValueByKey(property)}: {convertIconHistory(value)}</Text>
  // }
  /**
   * render history item change
   * @param item 
   * @param idx 
   */
  // const historyItemChange = (item: any, idx: number) => {

  //   const { property, value }: any = getPropertyAndValue(item);
  //   return <View key={idx}>
  //     <Text style={styles.history_title}>{getValueByKey(property)}</Text>
  //     {Array.isArray(value) ?
  //       <View style={styles.history_item}>
  //         {value.map((detail, idDetail) => {
  //           return historyItemChangeDetail(detail, idDetail);
  //         })}
  //       </View>
  //       :
  //       <View style={styles.history_item}>
  //         <Text style={styles.history_text}>{convertIconHistory(value)}</Text>
  //       </View>
  //     }
  //   </View>
  // }
  /**
   * render history item
   * @param item 
   * @param key 
   */
  const historyItem = (item: ScheduleHistoriesType, key: number) => {

    return <View key={key} style={styles.tab_history}>
      <View style={styles.dot_history} />
      <View style={styles.top_title}>
        <Text style={styles.item_text}>{moment(item?.updatedDate)?.format("yyyy/MM/DD")} - {moment(item?.updatedDate)?.format("hh:mm:ss")}</Text>
        <View style={styles.item}>
          <View style={styles.block_user}>
            <Image style={styles.icon_user} source={item.updatedUserImage ? item.updatedUserImage : Images.schedule_details.icon_user_green} />
            <Text style={[styles.time, { color: "#0F6DB1" }]}>
              {item.updatedUserName}
            </Text>
          </View>
        </View>

        <View style={styles.contents_history}>
          {
            item.contentChange ?
              Object.keys(JSON.parse(item.contentChange)).map((key) => {
                // console.log('OTTTTTTT', JSON.parse(item.contentChange)[key].old, key);
                // console.log('message', getValueByKey('schedule_type'),key);


                return <View>
                  <Text>{getValueByKey(key)}</Text>
                  <Text>{JSON.parse(item.contentChange)[key].old} {`---->`} {JSON.parse(item.contentChange)[key].new}</Text>
                  {/* <Text>${`>>>>>`}</Text>
                  <Text>{JSON.parse(item.contentChange)[key].new}</Text> */}
                </View>
              })
              :
              null
            // Array.isArray(item.contentChange) &&
            // item.contentChange.map((content, idx) => {
            //   return historyItemChange(content, idx);
            // })
          }
        </View>
      </View>
    </View>
  }

  const dispatch = useDispatch();
  /**
   * Handle scroll load data
   * @param e
   */
  const handleScroll = async ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      const response = await getScheduleHistory(scheduleId!, nextPage, LIMIT);
      if (response) {
        const dataCheck = checkResponse(response);
        if (dataCheck.result) {
          dispatch(calendarActions.getScheduleHistories({
            scheduleHistories: response.data
          }));
        } else {
          dispatch(calendarActions.setMessages({ messages: dataCheck.messages }))
        }
      }
    }
  }

  const responseGetScheduleHistories = useSelector(scheduleHistoriesSelector);
  useEffect(() => {
    if (responseGetScheduleHistories?.length > 0) {
      const draftData = Array.isArray(listScheduleHistories) ? listScheduleHistories : [];
      setListScheduleHistories([...draftData, ..._.clone(responseGetScheduleHistories)]);
    }
  }, [responseGetScheduleHistories]);

  return (
    <ScrollView
      style={[Style.container, styles.scroll]}
      showsVerticalScrollIndicator={false}
      onScroll={({ nativeEvent }) => handleScroll(nativeEvent)}
      nestedScrollEnabled={true}>
      {
        Array.isArray(listScheduleHistories) &&
        listScheduleHistories.map((item, idx) => {
          return historyItem(item, idx);
        })
      }
    </ScrollView>
  );
})
