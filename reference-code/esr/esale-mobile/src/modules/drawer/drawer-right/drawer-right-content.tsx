import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { theme } from "../../../config/constants";
import { TabView, SceneMap } from "react-native-tab-view";
import { ListNotification } from "../../notification/notification-screen";
import { CountNotificationNewSelector } from "../../notification/notification-selector";
import { useSelector } from "react-redux";
import { RecentMisson } from "../../task/global-tool-task/recent-misson";
import { getCountTaskAndMilestone } from "../../task/global-tool-task/global-tool-selector";
// import { import } from "mathjs";
import _ from 'lodash'

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  btnTabWrap: {
    flex: 1,
    flexDirection: "row",
  },
  btnTab: {
    width: (width - 50) / 3,
    justifyContent: "center",
    alignItems: "center",
    height: theme.space[13],
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
  },
  btnTabActive: {
    width: (width - 50) / 3,
    justifyContent: "center",
    alignItems: "center",
    height: theme.space[13],
    backgroundColor: theme.colors.blue100,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.blue200,
    flexDirection: "row",
  },
  btnTxt: {
    color: "black",
    fontSize: theme.fontSizes[2],
  },
  btnTxtActive: {
    color: theme.colors.blue200,
    fontSize: theme.fontSizes[2],
  },
  countNoti: {
    backgroundColor: theme.colors.red,
    height: theme.space[4],
    width: theme.space[4],
    borderRadius: theme.space[2],
    justifyContent: "center",
    alignItems: "center",
    marginLeft: theme.space[1],
  },
  txtCountNoti: {
    color: theme.colors.white,
    fontSize: 8,
  },
});

export const DrawerRightContent = () => {
  const countTaskAndMilestone = useSelector(getCountTaskAndMilestone);
  const [index, setIndex] = React.useState(0);
  const countNotification = useSelector(CountNotificationNewSelector);
  const [routes, setRoutes] = React.useState([
    { key: 'first', title: '通知', count: Number(countNotification) > 99 ? "99+" : countNotification.toString() },
    { key: 'second', title: '直近タスク', count: 0 },
    { key: 'third', title: '直近予定', count: 1 },
  ]);

  const updateRoutes = (nameValue: string, value: any, position: number) => {
    let newArray = [...routes];
    const newRoutes : any = _.cloneDeep(newArray[position]);
    newRoutes[nameValue] = value;
    newArray[position] = newRoutes;
    setRoutes(newArray);
  };


  useEffect(() => {
    const count = Number(countNotification) > 99 ? "99+" : countNotification.toString();
    updateRoutes('count', count, 0)
  }, [countNotification])

  useEffect(() => {
    updateRoutes("count", countTaskAndMilestone, 1);
  }, [countTaskAndMilestone]);

  const NewRoute = () => <ListNotification />;
  const DiscussRoute = () => <RecentMisson />;
  const ScheduleRoute = () => (
    <Text style={{ textAlign: "center" }}> Tính năng đang phát triển</Text>
  );

  const renderScene = SceneMap({
    first: NewRoute,
    second: DiscussRoute,
    third: ScheduleRoute,
  });
  const onPressTabBtn = (propsTab: any, itemTab: any) => () => {
    propsTab.jumpTo(itemTab.key);
  };

  const renderItemBtn = ({ item, idx }: any, propsTab: any) => {
    return (
      <TouchableOpacity
        key={idx}
        style={index === idx ? styles.btnTabActive : styles.btnTab}
        onPress={onPressTabBtn(propsTab, item)}
      >
        {/* <TouchableOpacity > */}
        <Text style={index === idx ? styles.btnTxtActive : styles.btnTxt}>
          {item.title}
        </Text>
        {/* </TouchableOpacity> */}
        {item.count != 0 && (
          <View style={styles.countNoti}>
            <Text style={styles.txtCountNoti}>{item.count}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  const renderTabBar = (propsTab: any) => {
    return (
      <View style={styles.btnTabWrap}>
        {routes.map((item, idx) => renderItemBtn({ item, idx }, propsTab))}
      </View>
    );
  };
  return (
    <ScrollView scrollEnabled={false}>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </ScrollView>
  );
};
