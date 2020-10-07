import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "../../../config/constants";
import { AddToGroup } from "../group/group-add-to-group";
import { MoveToGroup } from "../group/group-move-to-group";
import { DetailScreen } from "../detail";
import { GroupCreateMyGroup } from "../group/group-create-my-group";
import { GroupCreateShareGroup } from "../group/group-create-share-group";
import { GroupAddListMember } from "../group/group-add-list-member";
import { EmployeeListScreen } from "../list/employee-list-screen";
import { InviteEmployee } from "../invite/invite-employee";
import { InviteEmployeeConfirm } from "../invite/invite-employee-confirm";
import { EmployeeListSortScreen } from "../list/employee-list-sort-screen";
import { ChangeLogTabScreen } from "../detail/employee-detail-tab-change-log";
import { ListTasks } from "../detail/employee-detail-tab-task/list-task";
import { EmailTabScreen } from "../detail/employee-detail-tab-email";
import { CalendarTabScreen } from "../detail/employee-detail-tab-calendar";
import { PostTabScreen } from "../detail/employee-detail-tab-business-post";
import { SearchNavigator } from "../../search/search-stack";
import { MOVE_GROUP_SCREEN } from "../list/employee-list-constants";

const Stack = createStackNavigator();

export function EmployeeNavigator() {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{ cardStyle: { backgroundColor: theme.colors.white100 } }}
    >
      <Stack.Screen name="employee-list" component={EmployeeListScreen} />
      <Stack.Screen name="history-log" component={ChangeLogTabScreen} />
      <Stack.Screen name="schedule" component={CalendarTabScreen} />
      <Stack.Screen name="create-mail" component={EmailTabScreen} />
      <Stack.Screen name="post" component={PostTabScreen} />
      <Stack.Screen name="search-stack" component={SearchNavigator} />
      <Stack.Screen name="task" component={ListTasks} />
      <Stack.Screen name="move-to-group" component={MoveToGroup} />
      <Stack.Screen name="detail-employee" component={DetailScreen} />
      <Stack.Screen name="invite-employee" component={InviteEmployee} />
      <Stack.Screen
        name="invite-employee-confirm"
        component={InviteEmployeeConfirm}
      />
      <Stack.Screen
        name="employee-list-sort"
        component={EmployeeListSortScreen}
      />
      <Stack.Screen name="add-to-group" component={AddToGroup} />

      <Stack.Screen
        name={MOVE_GROUP_SCREEN.TO_MY_GROUP}
        component={GroupCreateMyGroup}
      />
      <Stack.Screen
        name={MOVE_GROUP_SCREEN.TO_SHARE_GROUP}
        component={GroupCreateShareGroup}
      />
      <Stack.Screen
        name="group-add-list-member"
        component={GroupAddListMember}
      />
    </Stack.Navigator>
  );
}
