import * as React from "react";
import { View, Text } from "react-native";
import { Agenda, LocaleConfig } from "react-native-calendars";
import moment from "moment";

import { Icon } from "../../../shared/components/icon";
// import { DUMMY_CALENDAR_LIST } from "./dummy-data";
import XDate from "xdate";
import _ from "lodash";
import { styles } from "./tab-calendar-styles";
// import { CommonStyles } from "../../../shared/common-style";
import { useSelector } from "react-redux";
import { dataCalendarByListSelector } from "./tab-calendar-selector";

// multi language day name
LocaleConfig.locales["fr"] = {
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
export function CalendarByList() {
  // const [items, setItems] = React.useState({});

  // let refAgendar: any;
  // const dataCalendar = DUMMY_CALENDAR_LIST;
  const dataCalendar = useSelector(dataCalendarByListSelector);
  let formatCalendar: any = {};

  // convert date time
  const timeToString = (time: string) => {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  };

  // handle reponse
  React.useEffect(() => {
    let newDataCalendar = dataCalendar.itemList.map((elm) => {
      const date = elm.startDate !== null ? elm.startDate : elm.finishDate;

      const dateFormat = timeToString(date);
      return Object.assign(elm, { dateSort: dateFormat });
    });

    let sortDataCalendar = [...newDataCalendar].sort((a, b) => {
      return (
        moment(a.dateSort, "YYYY-MM-DD").unix() -
        moment(b.dateSort, "YYYY-MM-DD").unix()
      );
    });

    for (let i = 0; i <= sortDataCalendar.length - 1; i++) {
      if (
        i === 0 ||
        sortDataCalendar[i].dateSort !== sortDataCalendar[i - 1].dateSort
      ) {
        formatCalendar[sortDataCalendar[i].dateSort] = [sortDataCalendar[i]];
      }
      if (
        i < sortDataCalendar.length - 1 &&
        sortDataCalendar[i].dateSort === sortDataCalendar[i + 1].dateSort
      ) {
        formatCalendar[sortDataCalendar[i].dateSort].push(
          sortDataCalendar[i + 1]
        );
      }
    }
  }, []);

  // Number of scroll items
  // const loadItems = (day) => {
  //   setTimeout(() => {
  //     for (let i = -15; i < 5; i++) {
  //       const time = day.timestamp + i * 24 * 60 * 60 * 1000;
  //       const strTime = timeToString(time);

  //       if (!items[strTime]) {
  //         items[strTime] = [];
  //         const numItems = Math.floor(Math.random() * 3 + 1);
  //         for (let j = 0; j < numItems; j++) {
  //           items[strTime].push({
  //             name: `Item for ${strTime} #${j}`,
  //           });
  //         }
  //       }
  //     }
  //     const newItems = {};
  //     Object.keys(items).forEach((key) => {
  //       newItems[key] = items[key];
  //     });
  //     setItems(newItems);
  //   }, 1000);
  // };
  // render Item
  const renderItem = (item: any) => {
    switch (item.itemType) {
      case 1:
        return renderMilestone(item);
      case 2:
        return renderTask(item);
      case 3:
        return renderSchedule(item);
    }
  };
  //render item schedule
  const renderSchedule = (item: any) => {
    let styleContainerSchedule = {};
    if (item.participationDivision === "00") {
      if (item.attendanceDivision === "00") {
        styleContainerSchedule = styles.containerSchedule;
      } else if (item.attendanceDivision === "01") {
        styleContainerSchedule = styles.containerScheduleJoined;
      } else {
        styleContainerSchedule = styles.containerSchedule;
      }
    } else {
      styleContainerSchedule = styles.containerScheduleShare;
    }

    return item.isPublic === 0 && item.isParticipantUser === 0 ? (
      <View style={styleContainerSchedule}>
        <View style={styles.viewRow}>
          {/* <Icon name="circleGreen" /> */}
          <Text style={item.attendanceDivision === "02" && styles.textAbsent}>
            {item.itemName}
          </Text>
          <Icon name="schedule" />
        </View>
      </View>
    ) : (
      <View style={styles.containerSchedule}>
        <View style={styles.viewRow}>
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
  const renderTask = (item: any) => {
    const styleContainerTask =
      item.taskStatus === "00"
        ? styles.containerItem
        : item.taskStatus === "01"
        ? styles.containerItemComplete
        : styles.containerItemOvertime;
    // render Icon in task
    const renderIconTask = () => {
      return item.taskStatus === "00" ? (
        <Icon style={styles.sizeIcon} name="task" />
      ) : item.taskStatus === "01" ? (
        <Icon style={styles.sizeIcon} name="taskComplete" />
      ) : (
        <Icon style={styles.sizeIcon} name="taskOvertime" />
      );
    };

    const styleText =
      item.taskStatus === "02"
        ? styles.txtMilestoneOvertime
        : styles.txtMilestone;

    return item.isPublic === 0 && item.isParticipantUser === 0 ? (
      <View style={styles.containerItemComplete}>{renderIconTask()}</View>
    ) : (
      <View style={styleContainerTask}>
        <View style={styles.viewRow}>
          {renderIconTask()}
          <Text style={styleText}>{item.itemName}</Text>
        </View>
      </View>
    );
  };
  // render item milestone
  const renderMilestone = (item: any) => {
    const renderIconMilestone = () => {
      return item.milestoneStatus === "00" ? (
        <Icon style={styles.sizeIcon} name="milestoneCalendar" />
      ) : item.milestoneStatus === "01" ? (
        <Icon style={styles.sizeIcon} name="milestoneCalendarComplete" />
      ) : (
        <Icon style={styles.sizeIcon} name="milestoneCalendarOvertime" />
      );
    };

    return item.isPublic === 0 && item.isParticipantUser === 0 ? (
      <View style={styles.containerItemComplete}>
        <View style={styles.viewRow}>{renderIconMilestone()}</View>
      </View>
    ) : (
      <View
        style={
          item.milestoneStatus === "00"
            ? styles.containerItem
            : item.milestoneStatus === "01"
            ? styles.containerItemComplete
            : styles.containerItemOvertime
        }
      >
        <View style={styles.viewRow}>
          {renderIconMilestone()}
          <Text
            style={
              item.milestoneStatus === "02"
                ? styles.txtMilestoneOvertime
                : styles.txtMilestone
            }
          >
            {item.itemName}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Agenda
      items={formatCalendar}
      // loadItemsForMonth={loadItems}
      // selected={new Date()}
      selected={"2020-06-12"}
      renderItem={renderItem}
      ref={(ref: any) => (refAgendar = ref)}
      theme={{
        backgroundColor: "white",
        selectedDayBackgroundColor: "#0F6DB4",
      }}
      renderDay={(day: any, item: any) => {
        const dayNumber = day?.day;
        const dayName =
          dayNumber &&
          XDate.locales[XDate.defaultLocale].dayNamesShort[
            moment(day?.dateString).day()
          ];
        return (
          <View style={styles.containerRenderDay}>
            <Text style={styles.txtDayNumber}>{dayNumber}</Text>
          </View>
        );
      }}
    />
  );
}
