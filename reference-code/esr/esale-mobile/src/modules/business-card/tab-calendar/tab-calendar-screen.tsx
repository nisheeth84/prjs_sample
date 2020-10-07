import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
// import moment from "moment";
// import { Icon } from "../../../shared/components/icon";
import { styles } from "./tab-calendar-styles";
// import { theme } from "../../../config/constants";
// import { CalendarByList } from "./calendar-by-list";
import { CalendarByDay } from "./calendar-by-day";
import { translate } from "../../../config/i18n";
import { messages } from "./tab-calendar-messages";
import {
  getDataForCalendarByDay,
  getDataForCalendarByList,
} from "./tab-calendar-repository";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { tabCalendarActions } from "./tab-calendar-reducer";
import { DUMMY_CALENDAR_DAY, DUMMY_CALENDAR_LIST } from "./dummy-data";
import { CalendarByDayScreen } from "../../calendar/screens/grid/grid-day/calendar-by-day-screen";
import { GridList } from "../../calendar/screens/grid/grid-list/grid-list";

export function TabCalendarScreen() {
  const route = useRoute();
  const dispatch = useDispatch();
  const [onpenCalendar, setOpenCalendar] = useState(false);
  const [typeCalendar, setTypeCalendar] = useState({
    typeName: translate(messages.day),
    typeId: 1,
  });

  const getDataForCalendarByDayFunc = async () => {
    const { businessCardId }: any = route.params;
    const param = {
      businessCardIds: [businessCardId],
    };
    const response = await getDataForCalendarByDay(param);
    if (response) {
      switch (response.status) {
        case 200:
          dispatch(tabCalendarActions.getDataCalendarByDay(response.data));
          break;
        case 400:
          break;
        default:
          break;
      }
    }
  };

  const getDataForCalendarByListFunc = async () => {
    const { businessCardId }: any = route.params;
    const param = {
      businessCardIds: [businessCardId],
    };
    const response = await getDataForCalendarByList(param);
    if (response) {
      switch (response.status) {
        case 200:
          dispatch(tabCalendarActions.getDataCalendarByList(response.data));
          break;
        case 400:
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    dispatch(
      tabCalendarActions.getDataCalendarByDay({
        itemList: DUMMY_CALENDAR_DAY,
      })
    );
    dispatch(tabCalendarActions.getDataCalendarByList(DUMMY_CALENDAR_LIST));
    getDataForCalendarByDayFunc();
    getDataForCalendarByListFunc();
  }, []);
  const renderContent = () => {
    switch (typeCalendar.typeId) {
      case 1:
        return <CalendarByDayScreen />;

      case 2:
        return <GridList />;
      default:
        return <CalendarByDay openCalendar={onpenCalendar} />;
    }
  };

  // const renderAgenda = () => {};
  return (
    <ScrollView style={styles.container}>
      {renderContent()}
    </ScrollView>
  );
}
