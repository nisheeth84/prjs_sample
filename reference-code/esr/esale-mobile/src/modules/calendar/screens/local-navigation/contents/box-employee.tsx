import React, { useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "../style";
import CheckBoxCustom from "../../../components/checkbox-custom/checkbox-custom";
import {
  DepartmentsType,
  EmployeesType, GroupsType,
} from "../../../api/get-local-navigation-type";
import { Images } from "../../../config";
import { ACTION_LOCAL_NAVIGATION, EMPLOYEE_ACTION } from "../../../constants";
import { useNavigation } from "@react-navigation/native";

/**
 * interface department
 */
type IDepartment = {
  idx?: number;
  itemData: any;
  handleCheckedData?: (flag: boolean, item: DepartmentsType | GroupsType | undefined) => void;
  handleClose?: (item: DepartmentsType | GroupsType, type: ACTION_LOCAL_NAVIGATION) => void;
  handleUpdateData?: (item: DepartmentsType | GroupsType) => void;
  typeAction: ACTION_LOCAL_NAVIGATION
}

/**
 * component box employee
 * @param idx
 * @param itemData
 * @param handleCheckedData
 * @param handleClose
 * @param handleUpdateData
 * @param typeAction
 * @constructor
 */
const BoxEmployee = ({ idx, itemData, handleCheckedData, handleClose, handleUpdateData, typeAction }: IDepartment) => {
  /**
   * status check or unCheck
   */
  const [isActive, setActive] = useState(itemData.isSelected);
  const dataEmployees = itemData?.employees
  useEffect(() => {
    const result_zero = dataEmployees.filter((EmpData : any) => EmpData.isSelected == 0)
    const result_false = dataEmployees.filter((Emp : any) => !Emp.isSelected)
    if (result_false == '' && result_zero == '') {
      setActive(true)
    }
    else {
      setActive(false)
    }
  })

  /**
   * check employee
   * @param flag
   * @param employee
   */
  const handleCheckedEmployee = (flag: boolean, employee: EmployeesType | undefined) => {
    let draftData = JSON.parse(JSON.stringify(itemData))
    if (Array.isArray(draftData.employees)) {
      let checked = 1;
      draftData.employees.forEach((obj: EmployeesType) => {
        if (obj.employeeId === employee?.employeeId)
          if(flag){
            obj.isSelected = 1
          }
          else if(!flag){
            obj.isSelected = 0
          }
        if (!obj.isSelected) {
          checked = 0;
        }
      })
      setActive(checked);
      draftData = {
        ...draftData,
        isSelected: checked
      }
      handleUpdateData && handleUpdateData(draftData);
    }
  }
  /**
   * hook navigation
   */
  const navigation = useNavigation();

  /**
   * remove employee in department 
   * @param index
   */
  const handleClickEmployee = (item: any) => {
    navigation.navigate("action-employee-screen", { item: item });
  }


  return <>
    {
      (Array.isArray(itemData.employees) && itemData.employees.length > 0) &&
      < View style={styles.checkboxParent}>
        <View style={[styles.flexD_row, styles.checkboxParent]}>
          <View style={styles.flexD_row}>
            <CheckBoxCustom
              // background={EMPLOYEE_ACTION.COLOR_SELECTED_DEFAULT}
              // borderColor={EMPLOYEE_ACTION.COLOR_SELECTED_DEFAULT}
              // borderColorOther={EMPLOYEE_ACTION.COLOR_SELECTED_DEFAULT}
              background={EMPLOYEE_ACTION.DEFAULT_COLOR}
              borderColor={EMPLOYEE_ACTION.DEFAULT_COLOR}
              borderColorOther={EMPLOYEE_ACTION.DEFAULT_COLOR}
              active={!!isActive}
              item={itemData}
              handleCheck={handleCheckedData}
            />
            <Text style={[styles.textFontSize, styles.textCheckBox]}>
              {/* {itemData?.departmentName || itemData?.groupName} */}
              {((itemData?.departmentName || itemData?.groupName).length > 20) ?
                        (((itemData?.departmentName || itemData?.groupName).substring(0, 20 - 3)) + '...') :
                        itemData?.departmentName || itemData?.groupName}
            </Text>
          </View>
          <TouchableOpacity style={{position:'absolute',right:0}} onPress={() => handleClose && handleClose(itemData, typeAction)}>
            <Image
              // source={typeAction == 2 ? Images.localNavigation.ic_checklist : Images.localNavigation.ic_close}
              source={Images.localNavigation.ic_close}
              style={styles.ic_checkbox}
            />
          </TouchableOpacity>
        </View>
      </View>
    }
    {
      (Array.isArray(itemData.employees) && itemData.employees.length > 0)
      &&
      <View style={styles.checkBoxChild}>
        {
          itemData.employees.map((item: EmployeesType, index: number) => {
            const colorEmployee = item.color || EMPLOYEE_ACTION.COLOR_SELECTED_DEFAULT;
            return <View style={[styles.flexD_row, styles.boxChild]} key={`employee_${idx}_${index}`}>
              <View style={styles.flexD_row}>
                <CheckBoxCustom
                  background={colorEmployee}
                  borderColor={colorEmployee}
                  borderColorOther={colorEmployee}
                  active={!!item.isSelected}
                  handleCheck={handleCheckedEmployee}
                  item={item}
                />
                <Text style={[styles.textFontSize, styles.marL]}>
                  {/* {item.employeeName} */}
                  {((item.employeeSurname).length > 20) ?
                        (((item.employeeSurname).substring(0, 20 - 3)) + '...') :
                        item.employeeSurname}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleClickEmployee(item)}>
                <Image source={Images.globalToolSchedule.ic_next} />
              </TouchableOpacity>
            </View>
          })
        }
      </View>
    }
  </>
}

export default BoxEmployee;