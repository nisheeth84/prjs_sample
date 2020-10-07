import React from 'react';
import {ScrollView} from "react-native-gesture-handler";
import { View, Text } from "react-native";
import { getHeight, Style } from '../../common';
import moment from "moment";
import {ScheduleListType} from "../../api/schedule-list-type";
import GlobalContent from "./global-tool-body/global-content";
import styles from "./style";
import GlobalTop from "./global-tool-body/global-top";
import { translate } from '../../../../config/i18n';
import { messages } from '../../calendar-list-messages';
/**
 * interface global tool body
 */
type IGlobalToolBody = {
  calendarDay: moment.Moment;
  itemList?: ScheduleListType[];
  updateStatusItem: (itemId: number, flag: string, updatedDate: string) => void;
  handlePrevNextDay: (action: number) => void
};

/**
 * component flobal tool body
 * @param props
 * @constructor
 */
const GlobalToolBody = (props: IGlobalToolBody) => {
  const array:any[] = []
  return <ScrollView>
    <GlobalTop calendarDay={props.calendarDay} handlePrevNextDay={props.handlePrevNextDay}/>
    {Array.isArray(props.itemList) && props.itemList.length <= 0 && 
      <Text style={{textAlign: 'center', marginTop: getHeight(10)}}>{translate(messages.noSchedule)}</Text>
    }
    {
       props.itemList?.map((item, idx) => {
        if(!array.includes(item.itemId)) {
          array.push(item.itemId)
          return <View style={Style.container} key={`index_component_${idx}`}>
           <View style={styles.content_Schedule}>
             <View>
               <GlobalContent
                 item={item}
                 index={idx}
                 updateStatusItem={props.updateStatusItem}
                 calendarDay={props.calendarDay}
               />
             </View>
           </View>
         </View>
       }else{
         return <></>
       }
      })
    }
  </ScrollView>
};

export default GlobalToolBody;