import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../../../config";
import styles from "../style";
import { DepartmentsType, EmployeesType, EquipmentTypesType, GroupsType } from "../../../api/get-local-navigation-type";
import BoxEmployee from "./box-employee";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../../calendar-list-messages";
import { ACTION_LOCAL_NAVIGATION } from "../../../constants";
// import { AntDesign } from "@expo/vector-icons";
// import ComponentSuggest from "./component-suggest";


import {EmployeeSuggestView} from '../../../../../shared/components/suggestions/employee/employee-suggest-view'
/**
 * interface plan employee
 */
type IPlanEmployee = {
  groups?: Array<GroupsType>;
  departments?: Array<DepartmentsType>;
  handleUpdateDynamic: (data: Array<DepartmentsType> | Array<EquipmentTypesType>, key: ACTION_LOCAL_NAVIGATION) => void;
}

/**
 * component plan employee
 * @param groups
 * @param departments
 * @param handleUpdateDynamic
 * @constructor
 */
const PlanEmployee = ({ groups, departments, handleUpdateDynamic }: IPlanEmployee) => {
  /**
   * status show or hidden component
   */
  const [isShow, setIsShow] = useState(true);

  /**
   * data input from form
   */
  // const [user, setUser] = useState('');
  /**
   * list data
   */
  // const [listData, setListData] = useState<any>();
  /**
   * scheduleTypes
   */
  // const userTypesIn = useState([])
  /**
   * locale
   */
  // const localeDraft = 'ja_jp';

  /**
   * check Department
   * @param flag
   * @param department
   */
  const handleCheckedDepartment = (flag: boolean, department: any) => {
    const draftDepartments = JSON.parse(JSON.stringify(departments));
    draftDepartments.forEach((item: DepartmentsType) => {
      if (item.departmentId === department?.departmentId) {
        if (flag) {
          item.isSelected = 1;
        }
        else if (!flag) {
          item.isSelected = 0;
        }
        Array.isArray(item.employees) && item.employees &&
          item.employees.length > 0 &&
          item.employees.forEach((employee: EmployeesType) => {
            if (flag) {
              employee.isSelected = 1;
            } else {
              employee.isSelected = 0;
            }
          })
      }
    })
    handleUpdateDynamic(draftDepartments, ACTION_LOCAL_NAVIGATION.DEPARTMENT);
  }

  /**
   * update departments
   * @param item
   */
  const handleUpdateDepartments = (item: any) => {
    const draftDepartments = JSON.parse(JSON.stringify(departments));
    if (Array.isArray(draftDepartments)) {
      draftDepartments.forEach((obj: DepartmentsType, idx: number) => {
        if (obj.departmentId === item?.departmentId)
          draftDepartments[idx] = item;
      })
      handleUpdateDynamic(draftDepartments, ACTION_LOCAL_NAVIGATION.DEPARTMENT);
    }
  }

  /**
   * remove item
   * @param data
   * @param type
   */
  const handleClose = (data: any, type: ACTION_LOCAL_NAVIGATION) => {
    if (type === ACTION_LOCAL_NAVIGATION.DEPARTMENT) {
      const draftDepartments = JSON.parse(JSON.stringify(departments));
      draftDepartments.forEach((item: DepartmentsType, index: number) => {
        if (item.departmentId === data?.departmentId)
          draftDepartments.splice(index, 1);
      });
      handleUpdateDynamic(draftDepartments, type);
    }

    if (type === ACTION_LOCAL_NAVIGATION.GROUP) {
      const draftGroups = JSON.parse(JSON.stringify(groups));
      draftGroups.forEach((item: GroupsType, index: number) => {
        if (item.groupId === data?.groupId)
          draftGroups.splice(index, 1);
      });
      handleUpdateDynamic(draftGroups, type);
    }
  }

  /**
   * Check group
   * @param flag
   * @param group
   */
  const handleCheckedGroup = (flag: boolean, group: any) => {
    const draftData = JSON.parse(JSON.stringify(groups));
    draftData.forEach((item: GroupsType) => {
      if (item.groupId === group?.groupId) {
        if (flag) {
          item.isSelected = 1;
        }
        else if (!flag) {
          item.isSelected = 0;
        }
        Array.isArray(item.employees) &&
          item.employees.length > 0 &&
          item.employees.forEach((employee: EmployeesType) => {
            if (flag) {
              employee.isSelected = 1;
            }
            else if (!flag) {
              employee.isSelected = 0;
            }
          });
      }
    })

    handleUpdateDynamic(draftData, ACTION_LOCAL_NAVIGATION.GROUP);
  }

  /**
   * update groups
   * @param item
   */
  const handleUpdateGroup = (item: any) => {
    const draftData = JSON.parse(JSON.stringify(groups));
    if (Array.isArray(draftData)) {
      draftData.forEach((obj: GroupsType, idx: number) => {
        if (obj.groupId === item?.groupId)
          draftData[idx] = item;
      })
      handleUpdateDynamic(draftData, ACTION_LOCAL_NAVIGATION.GROUP);
    }
  }

  // const insertItem = (item: GroupsType | EquipmentTypesType) => {
  //   setListData(undefined);
  //   setUser('');
  //   const draftScheduleTypes = JSON.parse(JSON.stringify(departments));
  //   draftScheduleTypes.push(item);
  //   handleUpdateDynamic(draftScheduleTypes, ACTION_LOCAL_NAVIGATION.SCHEDULE);
  // }

  // const handleChangeInput = (dataInput: string) => {
  //   if (dataInput) {
  //     setUser(dataInput);
  //     const CALL_API_SUCCESS = true;
  //     if (CALL_API_SUCCESS) {
  //       userTypesIn.forEach((item: any) => {
  //         if (typeof item.groupId === 'string')
  //           item.groupName = JSON.parse(item.groupName);
  //       });
  //       const response = userTypesIn.filter((item: any) => {
  //         if (typeof item.groupName === 'object') {
  //           const check = item.groupName[localeDraft].indexOf(dataInput);
  //           if (check >= 0)
  //             return item;
  //         }
  //         return null;
  //       }).map((item: any) => {
  //         return {
  //           ...item,
  //           scheduleTypeName: item?.groupName[localeDraft],
  //         }
  //       });
  //       response.length ? setListData(response) : setListData('');
  //     } else {
  //       setListData('CALL API ERROR');
  //     }
  //   }
  //   else {
  //     setUser('')
  //   }
  // }
  return <View style={styles.content_checkbox}>
    <TouchableOpacity onPress={() => setIsShow(!isShow)}>
      <View style={styles.boxArrow}>
        <Image
          source={isShow ? Images.localNavigation.ic_up : Images.localNavigation.ic_down}
          style={styles.icon_up_down}
        />
        <Text style={[styles.textFontSize, styles.textBoxArrow]}>
          {translate(messages.employee)}
        </Text>
      </View>
    </TouchableOpacity>
    {isShow &&
      <View style={styles.ContentSmall}>
       {/* <View style={CustomerSuggestStyles.buttonViewAll}> */}
        <EmployeeSuggestView 
        typeSearch={3}
        invisibleLabel={true}
        fieldLabel={translate(messages.participant)}
        updateStateElement={()=>{}}
        />
       {/* </View> */}
        {/* <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={user.length > 0 ? styles.inputSearchTextData : styles.inputSearchText}
              placeholder="社員を追加"
              placeholderTextColor="#989898"
              defaultValue={user}
              onChangeText={(dataInput) => handleChangeInput(dataInput)}
            />
            <View style={styles.textSearchContainer}>
              {user.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setUser('');
                  setListData('');
                }}>
                  <AntDesign name="closecircle" style={styles.iconDelete} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <ComponentSuggest
            listData={listData}
            typeComponent={ACTION_LOCAL_NAVIGATION.SCHEDULE}
            insertItem={insertItem}
            dataScreen={groups}
          />
        </View> */}
        <View>
          {Array.isArray(departments) &&
            departments.length > 0 &&
            departments.map((item: DepartmentsType, idx: number) => {
              return <BoxEmployee
                itemData={item}
                idx={idx}
                key={`department_${idx}`}
                handleCheckedData={handleCheckedDepartment}
                handleUpdateData={handleUpdateDepartments}
                handleClose={handleClose}
                typeAction={ACTION_LOCAL_NAVIGATION.DEPARTMENT}
              />
            })
          }

          {
            Array.isArray(groups) &&
            groups.length > 0 &&
            groups.map((item: GroupsType, idx: number) => {
              return <BoxEmployee
                itemData={item}
                idx={idx}
                key={`group_${idx}`}
                handleCheckedData={handleCheckedGroup}
                handleUpdateData={handleUpdateGroup}
                handleClose={handleClose}
                typeAction={ACTION_LOCAL_NAVIGATION.GROUP}
              />
            })
          }

        </View>
      </View>
    }
  </View>
}

export default PlanEmployee;