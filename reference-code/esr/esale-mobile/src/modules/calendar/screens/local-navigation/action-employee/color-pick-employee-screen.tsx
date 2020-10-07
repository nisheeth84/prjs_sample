import React, { useState } from "react";
import { Text, View, Image } from "react-native";
import { stylesAction } from "./style";
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import { Images } from "../../../config";
import { GetLocalNavigation, EmployeesType, DepartmentsType } from "../../../api/get-local-navigation-type";
import { localNavigationSelector } from "../../../calendar-selector";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { calendarActions } from "../../../calendar-reducer";
import { ARR_COLOR, EMPLOYEE_ACTION } from "../../../constants";
import { messages } from "../../../calendar-list-messages";
// import { getValueByKey } from "../../../common/helper";
import { translate } from "../../../../../config/i18n";
import {AppBarModalBack} from '../../../../../shared/components/appbar/appbar-modal-back'


/**
 * Color Pick Employee Screen
 */
const ColorPickEmployeeScreen = ({ route }: any) => {
  const arrColor = ARR_COLOR
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
  const [colorSelected, setColorSelected] = useState( item.color.toLowerCase() || EMPLOYEE_ACTION.COLOR_SELECTED_DEFAULT)

  /**
   * selected Color
   * @param color color selected
   */
  const clickColor = (color: string) => {
    const setColor = (employee: EmployeesType) => {
      if (employee.employeeId == item.employeeId) {
        employee.color = color;
      }
    }
    departments?.forEach((department: DepartmentsType) => {
      department?.employees?.forEach(setColor)
    })
    
    groups?.forEach((group: any) => {
      group?.employees?.forEach(setColor)
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
    setColorSelected(color)
    navigation.goBack()
  }

  return <View>
  <AppBarModalBack onClose = {()=>navigation.goBack()}  title = '色を選択'/>

    <ScrollView>
    
    {
      arrColor.map((item: any, index: number) => {
        return <TouchableOpacity key={index} onPress={() => clickColor(item.color)}>
          <View style={[stylesAction.item]}>
            <View style={[stylesAction.itemColor, { backgroundColor: item.color }]}></View>
            <View>
              <Text style={stylesAction.itemContent}>
                {translate(messages[item.name])}
              </Text>
            </View>
            {colorSelected == item.color &&
              <View style={[stylesAction.BoxRight]}>
                <View
                  style={[
                    stylesAction.BoxCheckBox,
                    stylesAction.BoxCheckBoxActive,
                  ]}
                >
                  <Image
                    style={[stylesAction.BoxCheckBoxImage]}
                    source={Images.scheduleRegistration.ic_check}
                  ></Image>
                </View>
              </View>
            }
            {colorSelected !== item.color &&
              <View style={[stylesAction.BoxRight]}>
                <View
                  style={[
                    stylesAction.BoxCheckBoxNoSelect,
                  ]}
                >
                </View>
              </View>
            }
          </View>
        </TouchableOpacity>
      })
    }
  </ScrollView>
  </View>
}

export default ColorPickEmployeeScreen;