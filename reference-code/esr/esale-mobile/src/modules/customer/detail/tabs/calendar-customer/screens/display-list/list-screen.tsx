import React, { useEffect, useState } from 'react';
import { Text, View, FlatList,  ActivityIndicator} from 'react-native';
import { styles } from './style';
import { useSelector, useDispatch } from 'react-redux';
import { calendarListSelector } from '../../calendar-selector';
import moment from 'moment';
import { DataOfDay, DataOfViewList } from '../../type';
import { CalenderViewWeekList } from '../../calendar-util';
import { ItemList } from '../../item/item-list';
import { calendarActions } from '../../calendar-reducer';
import { messages } from '../../calendar-list-messages';
import { getDataApiForByList } from '../../api';
import AsyncStorage from "@react-native-community/async-storage";
import { ID_TOKEN } from '../../../../../../../config/constants/constants';
import { translate } from '../../../../../../../config/i18n';

export const ListScreen = () => {
  const dispatch = useDispatch();
  // selector start
  const dataCalendarForList = useSelector(calendarListSelector);
  const [listDay, setListDay] = useState<any>([]);
  const [isRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const paramFromDate = moment.utc(new Date()).format();
  const monthCurrent = moment.utc(new Date()).format("MM");

  const getDataCalendarOfList = async (dateFrom: any) => {
    setLoading(true);
    const old: DataOfViewList = {
      dataSchedule: {},
      dataResource: {},
    };
    
    const param = {
      isGetDateInfo: true,
      dateFrom: dateFrom,
      isSearchSchedule: true,
      isSearchTask: true,
      isSearchMilestone: true,
    };
    
    const token: any = await AsyncStorage.getItem(ID_TOKEN);
    const response = await getDataApiForByList(token, param)
    switch(response.status){
      case 200:
        {
          const data = CalenderViewWeekList.buildScheduleOfCalendarList(old, response.data);
          dispatch(
            calendarActions.setDataCalendarOfList({ dataCalendarOfList: data })
          );
          setLoading(false);
          break;
        }
      case 401:
        {
          alert("Error token");
          setLoading(false);
          break;
        }  
      case 500: 
        {
          setLoading(false);
          alert("Error server!")
          break;
        }
      default:
        return alert("Gateway Time-out:")
    }
  };

  const onRefresh = async () => {
    getDataCalendarOfList(paramFromDate);
  };

  useEffect(() => {
    getDataCalendarOfList(paramFromDate);
  }, []);

  useEffect(() => {
    if (!!dataCalendarForList) {
      let listDataOfDay: any = dataCalendarForList?.dataSchedule?.listDay;
      setListDay(listDataOfDay);
    }
  }, [dataCalendarForList]);

  /**
   * render item for flatList
   * @param param0
   */
  const renderItemFlatList = ({
    item,
    index,
  }: {
    item: DataOfDay;
    index: number;
  }) => {
    if (!!item) {
      let month = moment(item.dataHeader.dateMoment).format('MM');
      if (!!item.dataHeader.isScheduleHeader) {
        return (
          <View>
            {
              month === monthCurrent ? <View style={{marginTop: 20}}/> : (<View
                style={styles.otherMonth}
                key={`${item.dataHeader.timestamp!.toLocaleString()}_${
                  item.dataHeader.isScheduleHeader ? 'true' : ''
                }`}
              >
                <View style={[styles.container, { justifyContent: 'center' }]}>
                  <Text style={styles.titleOtherMonth}>
                    {moment(item.dataHeader.dateMoment).format('YYYY')}
                    {translate(messages.year)}{' '}
                    {moment(item.dataHeader.dateMoment).format('M')}
                    {translate(messages.month)}
                  </Text>
                </View>
              </View>)
            }
          </View>
        );
      } else {
        return (
          <View key={`${index}${item.dataHeader.timestamp!.toLocaleString()}`}>
            {moment(item.dataHeader.dateMoment).date() ===
              moment(item.dataHeader.dateMoment).startOf('isoWeeks').date() && (
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={[styles.titleMusty, styles.fBold]}
              >
                {moment(item.dataHeader.dateMoment).format('M')}
                {translate(messages.month)}
                {moment(item.dataHeader.dateMoment).format('D')}
                {translate(messages.day)}〜
                {moment(item.dataHeader.dateMoment).add(6, 'days').format('D')}
                {translate(messages.day)}
              </Text>
            )}
            <ItemList
              dataOfDay={item}
              preKey={`ItemList${item.dataHeader.timestamp!.toLocaleString()}_${
                item.dataHeader.isScheduleHeader
              }`}
            />
          </View>
        );
      }
    } else {
      return;
    }
  };

  return (
    <View style={styles.body}>
      {listDay && listDay.length > 0 && (
        <FlatList
          data={listDay}
          renderItem={renderItemFlatList}
          keyExtractor={(item) => {
            return `${item.dataHeader.timestamp!.toLocaleString()}_${
              item.dataHeader.isScheduleHeader ? 'true' : ''
            }`;
          }}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      )}
      {
        loading ? (
          <View style={{width: "100%", height: "100%", justifyContent: 'center',}}>
            <ActivityIndicator />
          </View>
        ) : null
      }
    </View>
  );
};
