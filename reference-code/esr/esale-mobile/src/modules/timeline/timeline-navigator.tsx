import React from "react";
import { Dimensions } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "../../config/constants";
// import { FollowedManagementScreen } from "./follow-management-list/follow-management-screen";
// import { DrawerLeftTaskContent } from "./drawer-task-content";
import { DrawerTimelineScreen } from "./drawer/timeline-drawer-content";
import { SortingTimeline } from "./sorting-timeline/sorting-timeline-screen";
import { FilterTimeline } from "./filter-timeline/filter-timeline-screen";
import { FileTimeline } from "./file-timeline/file-timeline-screen";
import { ModalDetail } from "./modal-detail/modal-detail-screen";
import { RegisterGroupChanelScreen } from "./register-editer-group-chanel/register-group-chanel-screen";
import { RegisterGroupChanelColorScreen } from "./register-editer-group-chanel/register-group-chanel-color-screen";
import { CommonStyles } from "../../shared/common-style";
import { ShareTimeline } from "./share/share-timeline-screen";
import { TimelineContentScreen } from "./list/timeline-list-screen";
import { FollowedManagementScreen } from "./follow-management-list/follow-management-screen";
import { DummyScreen } from "../business-card/activity-history/dummy-screen";
import { TimelineListGroupScreen } from "./list-group/timeline-list-group-screen";
import { TimelinePageGroupScreen } from "./page-group/timeline-page-group-screen";
import { TimelineGroupParticipantScreen } from "./group-participant/timeline-group-participant-screen";

// import { DrawerLeftTaskContent } from "../drawer-task-content";

const { width } = Dimensions.get("window");
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export function TimelineStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ cardStyle: { backgroundColor: theme.colors.white100 } }}
    >
      <Stack.Screen name="content-timeline" component={TimelineContentScreen} />
      <Stack.Screen
        name="register-group-chanel"
        component={RegisterGroupChanelScreen}
      />
      <Stack.Screen
        name="timeline-list-group"
        component={TimelineListGroupScreen}
      />
      <Stack.Screen name="share-timeline" component={ShareTimeline} />
      <Stack.Screen name="modal-detail-timeline" component={ModalDetail} />
      <Stack.Screen name="sorting-timeline" component={SortingTimeline} />
      <Stack.Screen name="filter-timeline" component={FilterTimeline} />
      <Stack.Screen name="file-timeline" component={FileTimeline} />
      <Stack.Screen
        name="register-group-chanel-color"
        component={RegisterGroupChanelColorScreen}
      />
      <Stack.Screen
        name="followed-management-screen"
        component={FollowedManagementScreen}
      />
      <Stack.Screen
        name="timeline-page-group"
        component={TimelinePageGroupScreen}
      />
      <Stack.Screen
        name="timeline-participant-group"
        component={TimelineGroupParticipantScreen}
      />
    </Stack.Navigator>
  );
}

export function DrawerLeftTimelineNavigator() {
  return (
    <Drawer.Navigator
      key="drawer-left"
      drawerStyle={{
        width: width - 40,
      }}
      drawerContent={() => {
        return <DrawerTimelineScreen />;
      }}
    >
      <Drawer.Screen name="task-stack" component={TimelineStack} />
    </Drawer.Navigator>
  );
}
