import React, { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { CalendarList, LocaleConfig } from "react-native-calendars";
import moment from "moment";
import { TouchableOpacity } from "react-native-gesture-handler";
// import { DayView } from "./day-view";
import { Icon } from "../../../shared/components/icon";

import {
  // DUMMY_CALENDAR_DAY,
  dummyChooseDay,
  dummyDataOverday,
} from "./dummy-data";
import { styleCalendarDay } from "./tab-calendar-styles";
// import { translate } from "../../../config/i18n";
// import { messages } from "./tab-calendar-messages";
// import { styles } from "../../search/search-styles";
import { useSelector } from "react-redux";
import { dataCalendarByDaySelector } from "./tab-calendar-selector";

const { width } = Dimensions.get("window");

// multi language day name
LocaleConfig.locales.fr = {
  monthNames: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  monthNamesShort: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  dayNames: ["月", "火", "水", "木", "金", "土", "日"],
  dayNamesShort: ["月", "火", "水", "木", "金", "土", "日"],
  //   today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = "fr";

export interface CalendarByDayProps {
  openCalendar: boolean;
}
export function CalendarByDay({ openCalendar }: CalendarByDayProps) {
  const dataCalendar = useSelector(dataCalendarByDaySelector).itemList;

  const [dataOverTime, setDataOverTime] = useState(dummyDataOverday);
  const renderItem = (item: any) => {
    const areaCom = {
      left: item.left,
      height: item.height,
      width: item.width,
      top: item.top,
    };
    switch (item.itemType) {
      case 1:
        return renderMilestone(item);
      case 2:
        return renderTask(item, areaCom);
      case 3:
        return renderSchedule(item, areaCom);
      default:
        return "";
    }
  };

  // render item schedule
  const renderSchedule = (item: any, areaCom: any) => {
    let styleContainerSchedule = {};
    if (item.participationDivision === "00") {
      if (item.attendanceDivision === "00") {
        styleContainerSchedule = styleCalendarDay.containerSchedule;
      } else if (item.attendanceDivision === "01") {
        styleContainerSchedule = styleCalendarDay.containerScheduleJoined;
      } else {
        styleContainerSchedule = styleCalendarDay.containerSchedule;
      }
    } else {
      styleContainerSchedule = styleCalendarDay.containerScheduleShare;
    }

    return item.isPublic === 0 && item.isParticipantUser === 0 ? (
      <View style={[styleContainerSchedule, areaCom]}>
        <View style={styleCalendarDay.viewRow}>
          {/* <Icon name="circleGreen" /> */}
          <Text
            style={
              item.attendanceDivision === "02" && styleCalendarDay.textAbsent
            }
          >
            {item.itemName}
          </Text>
          <Icon name="schedule" />
        </View>
      </View>
    ) : (
      <View style={styleCalendarDay.containerSchedule}>
        <View style={styleCalendarDay.viewRow}>
          <Icon name="circleGreen" />
          <Icon name="schedule" />
          <Text>{item.itemName}</Text>
        </View>
        <Text>
          {moment(item.startDate).format("HH:mm")} ~{" "}
          {moment(item.endDate).format("HH:mm")}
        </Text>
      </View>
    );
  };

  // render item task
  const renderTask = (item: any, areaCom: any) => {
    // render Icon in task

    const renderIconTask = () => {
      return item.taskStatus === "00" ? (
        <Icon style={styleCalendarDay.sizeIcon} name="task" />
      ) : item.taskStatus === "01" ? (
        <Icon style={styleCalendarDay.sizeIcon} name="taskComplete" />
      ) : (
        <Icon style={styleCalendarDay.sizeIcon} name="taskOvertime" />
      );
    };

    const styleText =
      item.taskStatus === "02"
        ? styleCalendarDay.txtMilestoneOvertime
        : styleCalendarDay.txtMilestone;

    return item.isPublic === 0 && item.isParticipantUser === 0 ? (
      <View style={[styleCalendarDay.containerItem, areaCom]}>
        {renderIconTask()}
      </View>
    ) : (
      <View style={[styleCalendarDay.containerItem, areaCom]}>
        <View style={styleCalendarDay.viewRow}>
          {renderIconTask()}
          <Text style={styleText}>{item.itemName}</Text>
        </View>
        <Text>
          {moment(item.startDate).format("HH:mm")} ~{" "}
          {moment(item.endDate).format("HH:mm")}
        </Text>
      </View>
    );
  };
  // render item milestone
  const renderMilestone = (item: any) => {
    const renderIconMilestone = () => {
      return item.milestoneStatus === "00" ? (
        <Icon style={styleCalendarDay.sizeIcon} name="milestoneCalendar" />
      ) : item.milestoneStatus === "01" ? (
        <Icon
          style={styleCalendarDay.sizeIcon}
          name="milestoneCalendarComplete"
        />
      ) : (
        <Icon
          style={styleCalendarDay.sizeIcon}
          name="milestoneCalendarOvertime"
        />
      );
    };

    return item.isPublic === 0 && item.isParticipantUser === 0 ? (
      <View style={styleCalendarDay.containerItemComplete}>
        <View style={styleCalendarDay.viewRow}>{renderIconMilestone()}</View>
      </View>
    ) : (
      <View
        style={
          item.milestoneStatus === "00"
            ? styleCalendarDay.containerItem
            : item.milestoneStatus === "01"
            ? styleCalendarDay.containerItemComplete
            : styleCalendarDay.containerItemOvertime
        }
      >
        <View style={styleCalendarDay.viewRow}>
          {renderIconMilestone()}
          <Text
            style={
              item.milestoneStatus === "02"
                ? styleCalendarDay.txtMilestoneOvertime
                : styleCalendarDay.txtMilestone
            }
          >
            {item.itemName}
          </Text>
        </View>
      </View>
    );
  };

  const dataCutOverDay = dummyDataOverday.slice(2, dummyDataOverday.length);

  const changeDataOverTime = () => {
    dataOverTime.length > 2
      ? setDataOverTime(dataOverTime.slice(0, 2))
      : setDataOverTime(dataOverTime.concat(dataCutOverDay));
  };

  return (
    <View style={styleCalendarDay.container}>
      {openCalendar && (
        <CalendarList
          horizontal
          pagingEnabled
          current={new Date()}
          hideExtraDays={false}
        />
      )}
      <View style={styleCalendarDay.viewDayLeft}>
        <View style={styleCalendarDay.containerDayLeft}>
          <View style={styleCalendarDay.contentDayLeft}>
            <Text style={styleCalendarDay.textStyle}>
              {dummyChooseDay.dayname}
            </Text>
            <Text style={styleCalendarDay.textStyle}>{dummyChooseDay.day}</Text>
            <Text style={styleCalendarDay.textStyle}>
              {dummyChooseDay.holiday}
            </Text>
          </View>
          <TouchableOpacity
            style={styleCalendarDay.btnIconChangeArr}
            onPress={() => changeDataOverTime()}
          >
            {dataOverTime.length <= 2 ? (
              <Icon name="arrowDown" />
            ) : (
              <Icon name="arrowUp" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styleCalendarDay.viewEventAllDay}>
          {dataOverTime.map((elm, index) => {
            return (
              <View
                key={index}
                style={styleCalendarDay.containerScheduleJoined}
              >
                <View style={styleCalendarDay.viewRow}>
                  <Icon name="schedule" />
                  <Text>{elm.itemName}</Text>
                </View>
              </View>
            );
          })}
          {dataOverTime.length <= 2 && (
            <View style={styleCalendarDay.viewOtherItemOverDay}>
              <Text>他{dummyDataOverday.length - 2}件</Text>
            </View>
          )}
        </View>
      </View>
      {/* <DayView
        // date={date}
        // index={index}
        format24h
        eventTapped={() => {}}
        events={dataCalendar}
        widthProps={width}
        renderEvent={renderItem}
        // initDate={"2017-09-08"}
        // scrollToFirstProps={scrollToFirst}
      /> */}
    </View>
  );
}
