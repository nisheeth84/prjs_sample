import React, { useEffect } from "react";
import { Text, View, Image } from "react-native";
import { stylesAction } from "./style";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../../calendar-list-messages";
// import { DrawerActions } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { localNavigationSelector } from "../../../calendar-selector";
import { GetLocalNavigation, DepartmentsType, EmployeesType } from "../../../api/get-local-navigation-type";
import { calendarActions } from "../../../calendar-reducer";
import { EMPLOYEE_ACTION } from "../../../constants";
import { Images } from "../../../config";
import {AppBarModal} from '../../../../../shared/components/appbar/appbar-modal'

/**
 * Action Employee Screen
 */
const ActionEmployeeScreen = ({ route }: any) => {
  const { item } = route.params ?? { item: {} };
  /**
   * data in state
   */
  let localNavigation: GetLocalNavigation = { ...useSelector(localNavigationSelector) };
  let departments = JSON.parse(JSON.stringify(localNavigation.searchDynamic?.departments));
  let groups = JSON.parse(JSON.stringify(localNavigation.searchDynamic?.groups));
  /**
   * hook navigation
   */
  const navigation = useNavigation();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(calendarActions.setMessages({}))
  }, [])
  /**
   * pick color
   */
  const toPickColor = () => {
    navigation.navigate("color-pick-employee-screen", { item: item });
  }
  /**
   * only show this employee
   */
  const showThisEmployee = () => {
    departments?.forEach((department: DepartmentsType) => {
      department?.employees?.forEach((employee: EmployeesType) => {
        if (employee.employeeId == item.employeeId) {
          employee.isSelected = EMPLOYEE_ACTION.SELECTED
        } else {
          employee.isSelected = EMPLOYEE_ACTION.UNSELECTED
        }
      })
    })

    groups?.forEach((group: any) => {
      group?.employees?.forEach((employee: EmployeesType) => {
        if (employee.employeeId == item.employeeId) {
          employee.isSelected = EMPLOYEE_ACTION.SELECTED
        } else {
          employee.isSelected = EMPLOYEE_ACTION.UNSELECTED
        }
      })
    })
    localNavigation.searchDynamic = {
      ...localNavigation.searchDynamic,
      groups: groups,
      departments: departments
    }

    dispatch(
      calendarActions.setLocalNavigation({
        localNavigation: localNavigation
      })
    )
    // navigation.dangerouslyGetParent().toggleDrawer()
    // navigation.dispatch(DrawerActions.toggleDrawer())
    navigation.goBack()
  }
  /**
   * close employee
   */
  const closeEmployee = () => {
    departments?.forEach((department: DepartmentsType) => {
      department?.employees?.forEach((employee: EmployeesType, index: number) => {
        if (employee.employeeId == item.employeeId) {
          department?.employees?.splice(index, 1)
        }
      })
    })
    groups?.forEach((group: any) => {
      group?.employees?.forEach((employee: EmployeesType, index: number) => {
        if (employee.employeeId == item.employeeId) {
          group?.employees?.splice(index, 1)
        }
      })
    })
    localNavigation.searchDynamic = {
      ...localNavigation.searchDynamic,
      groups: groups,
      departments: departments
    }

    dispatch(
      calendarActions.setLocalNavigation({
        localNavigation: localNavigation
      })
    )
    navigation.goBack()
  }
  return <View>
    <AppBarModal title='スケジュール設定' onClose ={()=>navigation.goBack()} />
    <TouchableOpacity onPress={() => {
      // navigation.dispatch(DrawerActions.toggleDrawer() )
      showThisEmployee()
    }}>
      <View style={[stylesAction.item]}>
        <Text style={stylesAction.itemContent}>
          {translate(messages.thisEmployee)}
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => closeEmployee()}>
      <View style={[stylesAction.item]}>
        <Text style={stylesAction.itemContent}>
          {translate(messages.notThisEmployee)}
        </Text>
      </View>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => toPickColor()}>
      <View style={[stylesAction.item]}>
        <Text style={stylesAction.itemContent}>
          {translate(messages.colorPicker)}
        </Text>
      </View>
      <View style={[stylesAction.BoxRight]}>
        <View>
          <Image
            source={Images.localNavigation.ic_next}
            style={[stylesAction.ic_checkbox]}
          />
        </View>
      </View>
    </TouchableOpacity>
  </View>
}

export default ActionEmployeeScreen;
