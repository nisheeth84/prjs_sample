import React from "react";
import { Dimensions, Text, View } from "react-native";
import {
  createDrawerNavigator,
  
} from "@react-navigation/drawer";
import { DrawerLeftTaskContent } from "./drawer-task-content";

import { ListTaskScreen } from "../list-task/list-task-screen";
import { TaskDetailScreen } from "../task-detail/task-detail-screen";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "../../../config/constants";
import { CreateTask } from "../add-edit-task/create-task";
import { CreateMilestone } from "../add-edit-milestone/create-milestone-screen";
import { MilestoneDetailScreen } from "../milestone-detail/milestone-detail-screen";
import { ActivityListScreen } from "../activity-list/activity-list-screen";
import { CreateSubTask } from "../add-edit-task/create-subtask";
import { ScreenName } from "../../../config/constants/screen-name";
import { DetailScreen } from "../../employees/detail";
import { CustomDetailScreen } from "../../customer/detail/customer-detail-screen";
import { TimelineStack } from "../../timeline/timeline-navigator";

const { width } = Dimensions.get("window");
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export function DrawerLeftTaskNavigator() {
  return (
    <Drawer.Navigator
      key="drawer-left"
      drawerStyle={{
        width: width - 50,
      }}
      drawerContent={() => {
        return <DrawerLeftTaskContent />;
      }}
    >
      <Drawer.Screen name="task-stack" component={TaskStack} />
    </Drawer.Navigator>
  );
}

export function TaskStack() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ cardStyle: { backgroundColor: theme.colors.white100 } }}
    >
      <Stack.Screen name={ScreenName.LIST_TASK} component={ListTaskScreen} />
      <Stack.Screen name={ScreenName.CREATE_TASK} component={CreateTask} />
      <Stack.Screen
        name={ScreenName.CREATE_SUB_TASK}
        component={CreateSubTask}
      />
      <Stack.Screen
        name={ScreenName.TASK_DETAIL}
        component={TaskDetailScreen}
      />
      <Stack.Screen
        name={ScreenName.MILESTONE_DETAIL}
        component={MilestoneDetailScreen}
      />
      <Stack.Screen
        name={ScreenName.CREATE_MILESTONE}
        component={CreateMilestone}
      />
      <Stack.Screen
        name={ScreenName.ACTIVITY_LIST}
        component={ActivityListScreen}
      />

      <Stack.Screen
        name={ScreenName.CUSTOMER_DETAIL} component={CustomDetailScreen}
      />
      <Stack.Screen name={ScreenName.EMPLOYEE_DETAIL} component={DetailScreen} />

      <Stack.Screen name={ScreenName.CUSTOMER_ACTIVITY_DETAIL}>
        {() => (
          <View>
            <Text>customer-activity-detail</Text>
          </View>
        )}
      </Stack.Screen>
      <Stack.Screen name={ScreenName.TIMELINE_SCREEN} component={TimelineStack} />

    </Stack.Navigator>
  );
}
