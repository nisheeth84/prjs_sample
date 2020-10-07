import React, { useState, useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { CalendarDetailScreen } from "./screens/calendar-detail-screen";
import { CreateScreen } from "./screens/create-screen";
import { CalendarHomeScreen } from "./screens/calendar-home-screen";
import {CreateTask} from '../task/add-edit-task/create-task';
import {CreateMilestone} from '../task/add-edit-milestone/create-milestone-screen';
import {TaskDetailScreen} from '../task/task-detail/task-detail-screen';
import {MilestoneDetailScreen} from '../task/milestone-detail/milestone-detail-screen';

import {
  Text,
  TouchableOpacity,
  SafeAreaView
} from "react-native";
import styles from "./screens/calendar-details/style";
import { useRoute } from '@react-navigation/native';
import { ModalTypeCreateSchedule } from './modals/modal-type-create-schedule';
import ActionEmployeeScreen from './screens/local-navigation/action-employee/action-employee-screen';
import ColorPickEmployeeScreen from './screens/local-navigation/action-employee/color-pick-employee-screen';
// import { CommonMessage } from '../../shared/components/message/message';
// import { TypeMessage } from '../../config/constants/enum';
// import { messagesSelector, messagesToastSelector } from './calendar-selector';
// import { useSelector } from 'react-redux';
// import { calendarActions } from './calendar-reducer';
// import Toast from 'react-native-toast-message'
// import { SearchNavigator } from "../search/search-stack";
// import { useNavigation } from "@react-navigation/native";
const Stack = createStackNavigator();
/**
 * Calendar Screen
 */
export const CalendarScreen = React.memo(() => {
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showBtnAdd, setShowBtnAdd] = useState(true);
  // const navigation = useNavigation();
  const route: any = useRoute();

  // const dispatch = useDispatch()

  useEffect(() => {
    if (route.state?.routes) {
      const nav = route.state?.routes;
      const curNav = nav[nav.length - 1];
      
      setShowBtnAdd(curNav?.name != 'create-screen')

    }
  }, [route]);

  /* 
  Hide, Show Modal Add
  */
  const showHideModalAdd = (status: boolean) => {
    setShowModalAdd(status);
  }

  // const messages = useSelector(messagesSelector);
  // const messagesToast = useSelector(messagesToastSelector);
  /**
   * hide Messages
   */
  // const hideMessages = () => {
  //   dispatch(calendarActions.setMessages({}))
  // }

  // const toastConfig = {
  //   'success': (internalState: any) => (
  //     <>
  //       <View style={{ alignItems: "center" }}>
  //         <TouchableOpacity>
  //           <CommonMessage content={internalState.text1} type={internalState.text2 || TypeMessage.INFO}></CommonMessage>
  //         </TouchableOpacity>
  //       </View>
  //     </>
  //   ),
  //   'error': () => { },
  //   'info': () => { },
  //   'any_custom_type': () => { }
  // }

  return (

    <SafeAreaView style={styles.bg_main}>
      {/* {messages && messages.content &&
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity>
            <CommonMessage content={messages.content} type={messages.type || TypeMessage.INFO}></CommonMessage>
          </TouchableOpacity>
        </View>
      } */}
      <Stack.Navigator
        headerMode="none"
        screenOptions={{ cardStyle: { backgroundColor: "#FBFBFB" } }
        }
        initialRouteName="calendar-home"
      >
        <>
          <Stack.Screen name="calendar-home" component={CalendarHomeScreen} />
          <Stack.Screen name="schedule-detail-screen" component={CalendarDetailScreen} />
          <Stack.Screen name="create-screen" component={CreateScreen} />
          <Stack.Screen name="action-employee-screen" component={ActionEmployeeScreen} />
          <Stack.Screen name="color-pick-employee-screen" component={ColorPickEmployeeScreen} />
          {/* <Stack.Screen name="search-stack" component={SearchNavigator} /> */}
          <Stack.Screen name="register-task" component={CreateTask} />
          <Stack.Screen name="register-milestone" component={CreateMilestone} />
          <Stack.Screen name="task-detail" component={TaskDetailScreen} />
          <Stack.Screen name="milestone-detail" component={MilestoneDetailScreen} />
        </>
      </Stack.Navigator>

      {showBtnAdd &&
        <TouchableOpacity onPress={() => showHideModalAdd(true)} style={styles.fab}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      }

      <ModalTypeCreateSchedule
        showBtnAdd={showBtnAdd}
        showModalAdd={showModalAdd}
        onBackdropPress={() => showHideModalAdd(false)}
      />
      {/* <Toast config={toastConfig} ref={(refToast: any) => Toast.setRef(refToast)} /> */}
    </SafeAreaView>
  );
})
