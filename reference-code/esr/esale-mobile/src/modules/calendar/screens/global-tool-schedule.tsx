import React, { useEffect, useState } from "react";
import {
  Dimensions, Text, TouchableOpacity,
  View, SafeAreaView
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
// import { useNavigation } from "@react-navigation/native";

import { Style } from "../common";
import styles from "./global-tool/style";
import GlobalToolHeaders from "./global-tool/global-tool-headers";
import GlobalToolBody from "./global-tool/global-tool-body";
import { getDataForCalendarByList, updateScheduleStatus } from '../calendar-repository';
import { calendarActions } from "../calendar-reducer";
import { dataCalendarByListSelector, dateShowSelector } from "../calendar-selector";
import { GetDataForCalendarByList } from "../api/get-data-for-calendar-by-list-type";
// import { DUMMY_DATA_GLOBAL } from "../assets/dummy";
import { TAB_CURRENT_GLOBAL_TOOL } from "../constants";
import { ModalTypeCreateSchedule } from "../modals/modal-type-create-schedule";

// type IGlobalToolScheduleProps = {};

/**
 * component global tool schedule
 * @constructor
 */
let isLoading = false;
const GlobalToolSchedule = React.memo(() => {
  /**
   * tab show
   */
  const [tabShow, setTabShow] = useState(TAB_CURRENT_GLOBAL_TOOL.SCHEDULE);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showBtnAdd] = useState(true);
  const dateShow = useSelector(dateShowSelector);
  /**
   * hook navigation
   */
  // const navigation = useNavigation();
  /**
   * flag Dummy data
   */
  /**
   * width screen
   */
  const { width } = Dimensions.get("window");
  /**
   * set Moment Date 
   * @param date
   */
  const setMomentInit = (date: Date) => {
    return moment.utc(date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
  };
  /**
   * calendar day
   */
  const [calendarDay, setCalendarDay] = useState(setMomentInit(new Date()));
  const [ToggleReload, setToggleReload] = useState(false);
  /**
   * handle action prev and next schedule
   * @param action
   */
  const handlePrevNextDay = (action: number) => {
    if (!isLoading) {
      const currentDay = moment(calendarDay).add(action, 'days').format('YYYY-MM-DD');
      setCalendarDay(setMomentInit(new Date(currentDay)));
    }

  }
  /**
   * Hook dispatch
   */
  const dispatch = useDispatch();
  /**
   * call api getDataCalendarByList
   */
  const getDataCalendarByListApi = async (date: moment.Moment) => {
    
    try {
      const response = await getDataForCalendarByList(date);
      response && dispatch(
        calendarActions.getDataCalendarByList({
          dataGlobalTool:  response.data,
        })
      )
      isLoading = false;
    } catch (error) {
      isLoading = false;
    }

  }
  /**
   * state data global tool
   */
  const dataGlobalTool: GetDataForCalendarByList = useSelector(dataCalendarByListSelector);
  // console.log('TOLL',dataGlobalTool)

  /**
   * call api get data
   */
  useEffect(() => {
    if (calendarDay.format('yyyy-MM-DD') != dateShow) {
      isLoading = true;
      getDataCalendarByListApi(calendarDay);
      // setTimeout(()=>{
      //   dispatch(
      //     calendarActions.onChangeDateShow({
      //       dateShow: calendarDay.format('yyyy-MM-DD'),
      //     })
      //   );
      // }, 2000);
      
    }

  }, [calendarDay,ToggleReload])

  /**
   * call api updateStatusSchedule
   * @param itemId
   * @param flag 
   * @param updatedDate
   */
  const handleUpdateStatusItem = (itemId: number, flag: string, updatedDate: string) => {
    async function updateScheduleStatusApi(itemId_: number, flag_: string, updatedDate_: string) {
      await updateScheduleStatus(itemId_, flag_, updatedDate_);
    }
    updateScheduleStatusApi(itemId, flag, updatedDate).then(()=>{
          setToggleReload(!ToggleReload)
    })
  }

  /**
   * Handle show tab Notification, task, schedule
   * @param tab
   */
  const handleTabShow = (tab: number) => {
    setTabShow(tab);
  }

  /* 
  Hide, Show Modal Add
  */
  const showHideModalAdd = (status: boolean) => {
    setShowModalAdd(status);
  }

  return (
    <SafeAreaView style={[Style.body, { width: width - 30 }]}>
      <View style={styles.content}>
        <GlobalToolHeaders
          currentTab={tabShow}
          countSchedule={(dataGlobalTool && dataGlobalTool.countSchedule || 0)}
          handleTabShow={handleTabShow}
        />
        {
          tabShow === TAB_CURRENT_GLOBAL_TOOL.SCHEDULE &&
          <GlobalToolBody
            calendarDay={calendarDay}
            itemList={dataGlobalTool?.itemList}
            updateStatusItem={handleUpdateStatusItem}
            handlePrevNextDay={handlePrevNextDay}
          />
        }
        <TouchableOpacity onPress={() => showHideModalAdd(true)} style={styles.fab}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
        <ModalTypeCreateSchedule
          showBtnAdd={showBtnAdd}
          showModalAdd={showModalAdd}
          onBackdropPress={() => showHideModalAdd(false)}
        />
      </View>
    </SafeAreaView>
  )
});

export default GlobalToolSchedule;
