import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Animated,
  Dimensions,
  Switch,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { CheckBox } from '../../../shared/components/checkbox';
import { theme, appImages } from '../../../config/constants';
import { Icon } from '../../../shared/components/icon';
import { Input } from '../../../shared/components/input';
import { DUMMY_LOCAL_MENU } from './drawer-task-dummy';
import {
  getTaskLocalNavigation,
  saveTaskLocalNavigation,
} from '../task-repository';
import { CommonStyles } from '../../../shared/common-style';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { messages } from './drawer-task-messages';
import { translate } from '../../../config/i18n';
import { DrawerTaskStyle } from './drawer-task-styles';
import { drawerTaskAction } from './drawer-task-reducer';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { EmployeeSuggestView } from '../../../shared/components/suggestions/employee/employee-suggest-view';
import {
  TypeSelectSuggest,
  KeySearch,
  PlatformOS,
  formatDateJP,
} from '../../../config/constants/enum';
import { ControlType } from '../../../config/constants/enum';
import { ScreenName } from '../../../config/constants/screen-name';
import { useNavigation } from '@react-navigation/native';
import { IndexChoiceSuggestion } from '../../../config/constants/enum';
import { index } from 'mathjs';
import { EmployeeSuggestSearchModal } from '../../../shared/components/suggestions/employee/employee-suggest-search-modal/employee-suggest-search-modal';

const { width, height } = Dimensions.get('window');

const moment = require('moment');

/**
 * Left Drawer in product screen
 */

const textCommonStyle = {
  color: theme.colors.black
};
const textHeaderStyle = {
  fontSize: 18,
  color: theme.colors.black
};

const rowView = {
  paddingLeft: theme.space[4],
  paddingRight: theme.space[5],
};

const formatStartDateString = formatDateJP.startDate;
const formatEndDateString = formatDateJP.endDate;

export const DrawerLeftTaskContent = () => {
  const [searchText, setSearchText] = useState(TEXT_EMPTY);
  const [switchValue, setSwitchValue] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState(moment().format(formatStartDateString));
  const [endDate, setEndDate] = useState(moment().format(formatEndDateString));
  const [dateKey, setDateKey] = useState(TEXT_EMPTY);
  const [isVisible, setIsVisible] = React.useState(false);

  const navigation = useNavigation();

  const [dataNavigation, setDataNavigation] = useState(
    DUMMY_LOCAL_MENU.data.data.getLocalNavigation
  );
  const dispatch = useDispatch();
  // const { searchDynamic, searchStatic } = dataNavigation;

  const getLocalNavigation = async () => {
    const responseNavigation = await getTaskLocalNavigation(
      { functionDivision: '00' },
      {}
    );

    if (responseNavigation.status === 200) {
      dispatch(drawerTaskAction.getLocalNavigation(responseNavigation.data));
      setDataNavigation(responseNavigation.data);
    }
  };

  useEffect(() => {
    getLocalNavigation();
  }, []);

  // const deleteName =(array: Array<any>)=>{
  //     const newArray = array
  //     for(let i=0; i<=newArray.length-1; i++){
  //         delete newArray[i].listName
  //     }
  //     return array
  // }

  // useEffect(() => {
  //     let paramsSaveNavigation: any = {}
  //     let searchDynamic: any = {}
  //     let searchStatic: any = {}
  //     searchStatic.isAllTime = switchValue ? 1 : 0
  //     searchStatic.startDate = startDate
  //     searchStatic.endDate = endDate
  //     searchDynamic = dataNavigation.searchDynamic
  //     let { customersFavourite, departments, groups, scheduleTypes, equipmentTypes } = searchDynamic

  //     searchDynamic.customersFavourite = deleteName(customersFavourite)
  //     paramsSaveNavigation.searchDynamic = searchDynamic
  //     paramsSaveNavigation.searchStatic = searchStatic
  //     const queryNavigation = querySaveLocalNavigation({ functionDivision: "00", searchConditions: paramsSaveNavigation });
  //     async function saveLocalNavigation() {
  //         const responseNavigation = await saveTaskLocalNavigation(queryNavigation)
  //         // setDataNavigation(responseNavigation.data.data.getLocalNavigation)
  //     }
  //     saveLocalNavigation();
  //     //
  // }, [dataNavigation, switchValue, startDate, endDate])

  const findNestingEmployee = (
    parentType: number,
    parentArray: any,
    employeeId: number,
    employeeSelected: number
  ) => {
    const newParent = [...parentArray];
    parentArray.forEach((element: any, index: number) => {
      const employees = element.employees;
      const newElement = { ...element };
      const empIdx = employees.findIndex((emp: any) => {
        return emp.employeeId === employeeId;
      });
      if (empIdx >= 0) {
        employees[empIdx].isSelected = 1 - employees[empIdx].isSelected;
        newElement.employees = employees;
        newElement.isSelected = getParentSelected(
          element,
          employeeSelected,
          employeeId
        );
        newParent[index] = newElement;
      }
    });
    return newParent;
  };

  const getParentSelected = (
    parentItem: any,
    employeeSelected: number,
    employeeId: number
  ) => {
    if (parentItem?.employees?.length <= 1) {
      return employeeSelected;
    }
    const isAllSelected = parentItem.employees.findIndex((el: any) => {
      return el.employeeId !== employeeId && el.isSelected !== employeeSelected;
    });
    if (isAllSelected >= 0) {
      return parentItem.isSelected;
    }
    return employeeSelected;
  };

  const createDepartments = (departments: any) => {
    let newDepartments = [...departments].map((depart: any) => {
      return {
        departmentId: depart.departmentId,
        isSelected: depart.isSelected,
        employees: depart.employees.map((emp: any) =>
          convertEmp(emp, emp.isSelected)
        ),
      }
    });
    return newDepartments
  }

  const createGroups = (groups: any) => {
    let newGroups = [...groups].map((group: any) => {
      return {
        groupId: group.groupId,
        isSelected: group.isSelected,
        employees: group.employees.map((emp: any) =>
          convertEmp(emp, emp.isSelected)
        ),
      };
    });
    return newGroups
  }

  const pressCheckBox = async (
    type: number,
    item: any,
    parentIndex?: number,
    parentType?: number,
    itemIndex?: number
  ) => {
    const { departments = [], groups = [] } = {
      ...dataNavigation,
    }.searchDynamic;

    let newDepartments = createDepartments(departments);
    let newGroups = createGroups(groups);
    switch (type) {
      case KeySearch.DEPARTMENT:
        const department: any = newDepartments[itemIndex || 0];
        const { employees } = department;
        department.isSelected = 1 - department.isSelected;
        const newEmpDepart = employees.map((emp: any) =>
          convertEmp(emp, 1 - emp.isSelected)
        );
        department.employees = newEmpDepart;
        newDepartments[itemIndex || 0] = department;
        // callSaveNavigation(newDepartments, "departments");
        break;
      case KeySearch.GROUP:
        const group: any = newGroups[itemIndex || 0];
        const employeesGroup = group.employees;
        group.isSelected = 1 - group.isSelected;
        const newEmpGroup = employeesGroup.map((empGroup: any) =>
          convertEmp(empGroup, 1 - empGroup.isSelected)
        );

        group.employees = newEmpGroup;
        newGroups[itemIndex || 0] = group;
        // callSaveNavigation(newGroups, "groups");
        break;
      default:
        const newEmployeeSelected = 1 - item.isSelected;
        newDepartments = findNestingEmployee(
          parentType || 0,
          newDepartments,
          item.employeeId,
          newEmployeeSelected
        );
        newGroups = findNestingEmployee(
          parentType || 0,
          newGroups,
          item.employeeId,
          newEmployeeSelected
        );
        break;
    }

    const params: any = { ...dataNavigation };
    // const newSearchDynamic = params.searchDynamic;
    // newSearchDynamic.departments = newDepartments;
    // newSearchDynamic.groups = newGroups
    // params.searchDynamic = newSearchDynamic;
    // params.searchDynamic.groups = newGroups;

    const taskNavigationResponse = await saveTaskLocalNavigation({
      functionDivision: '00',
      searchConditions: {
        searchStatic: params.searchStatic,
        searchDynamic: {
          customersFavourite: dataNavigation.searchDynamic.customersFavourite,
          departments: newDepartments,
          groups: newGroups,
          equipmentTypes: dataNavigation.searchDynamic.equipmentTypes,
          scheduleTypes: dataNavigation.searchDynamic.scheduleTypes,
        },
      },
    });
    if (taskNavigationResponse.status === 200) {
      getLocalNavigation();
    }
  };

  const checkBoxWithText = (
    itemIndex: number,
    parentType: number,
    item: any,
    type: number,
    content: string,
    parentId?: number
  ) => (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginLeft: parentId !== undefined ? theme.space[5] : 0,
          paddingTop: theme.space[5],
        }}
      >
        <TouchableOpacity
          onPress={() =>
            pressCheckBox(type, item, parentId, parentType, itemIndex)
          }
        >
          <CheckBox
            onChange={() =>
              pressCheckBox(type, item, parentId, parentType, itemIndex)
            }
            checked={!!item.isSelected}
            children={content}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            pressRemoveCheckbox(item, itemIndex, type, parentType, parentId)
          }
        >
          <Icon name="close" />
        </TouchableOpacity>
      </View>
    );

  const pressRemoveCheckbox = async (
    item: any,
    itemIndex: number,
    type: number,
    parentType?: number,
    parentIndex?: number
  ) => {
    const { departments = [], groups = [] } = {
      ...dataNavigation,
    }.searchDynamic;
    let newDepartments = createDepartments(departments)

    let newGroups = createGroups(groups)
    switch (type) {
      case KeySearch.DEPARTMENT:
        newDepartments.splice(itemIndex, 1);
        break;
      case KeySearch.GROUP:
        newGroups.splice(itemIndex, 1);
        break;
      default:
        newDepartments = removeParent(
          parentType || 0,
          newDepartments,
          item.employeeId
        );
        newGroups = removeParent(parentType || 0, newGroups, item.employeeId);
        break;
    }
    const params: any = { ...dataNavigation };
    params.searchDynamic.departments = newDepartments;
    params.searchDynamic.groups = newGroups;
    const taskNavigationResponse = await saveTaskLocalNavigation({
      functionDivision: '00',
      searchConditions: params,
    });
    if (taskNavigationResponse.status === 200) {
      getLocalNavigation();
    }
  };

  const removeParent = (
    parentType: number,
    parentArray: any,
    employeeId: number
  ) => {
    const newParent = [...parentArray];
    parentArray.forEach((element: any, index: number) => {
      const employees = element.employees;
      const newElement = { ...element };
      const empIdx = employees.findIndex((emp: any) => {
        return emp.employeeId === employeeId;
      });
      if (empIdx >= 0) {
        if (employees.length === 1) {
          newParent.splice(index, 1);
        } else {
          employees.splice(empIdx, 1);
          newElement.employees = employees;
          newParent[index] = newElement;
        }
      }
    });
    return newParent;
  };

  const convertResultToData = (array: any) => {
    const newArray = [...array].map((el: any) => {
      return {
        employeeId: el.employeeId,
        isSelected: 1,
      };
    });
    return newArray;
  };

  const findId = (array: any, id: number, property: string) => {
    return array.findIndex((el: any) => {
      return el[property] === id;
    });
  };

  const callSaveNavigation = async (element: any, property: string) => {
    const params: any = { ...dataNavigation };
    const { departments, groups } = params.searchDynamic;
    params.searchDynamic.customersFavourite = [];
    if (property === 'employees') {
      params.searchDynamic.departments = element.departments;
      params.searchDynamic.groups = element.groups;
      const taskNavigationResponse = await saveTaskLocalNavigation({
        functionDivision: '00',
        searchConditions: params,
      });

      if (taskNavigationResponse.status === 200) {
        getLocalNavigation();
      }
      return;
    }
    if (property === 'departments') {
      if (findId(departments, element.departmentId, 'departmentId') >= 0) {
        departments[
          findId(departments, element.departmentId, 'departmentId')
        ] = element;
      } else {
        departments.push(element);
      }
    } else {
      if (findId(groups, element.groupId, 'groupId') >= 0) {
        departments[findId(groups, element.groupId, 'groupId')] = element;
      } else {
        groups.push(element);
      }
    }
    const newGroup = groups.map((el: any) => {
      return {
        groupId: el.groupId,
        isSelected: 1,
        employees: el.employees.map((emp: any) => {
          return { employeeId: emp.employeeId, isSelected: 1 };
        }),
      };
    });

    const newDepartment = departments.map((el: any) => {
      return {
        departmentId: el.departmentId,
        isSelected: 1,
        employees: el.employees.map((emp: any) => {
          return { employeeId: emp.employeeId, isSelected: 1 };
        }),
      };
    });

    params.searchDynamic.departments = newDepartment;
    params.searchDynamic.groups = newGroup;
    const taskNavigation = await saveTaskLocalNavigation({
      functionDivision: '00',
      searchConditions: params,
    });

    if (taskNavigation.status === 200) {
      getLocalNavigation();
    }
  };

  const convertEmp = (emp: any, isSelected?: number) => {
    return {
      employeeId: emp.employeeId,
      isSelected: isSelected !== undefined ? isSelected : 1,
    };
  };

  const findRelateContainer = (
    departmentEmp: any,
    groupEmp: any,
    employeeId: number
  ) => {
    const { departments = [], groups = [] } = {
      ...dataNavigation,
    }.searchDynamic;
    let newDepartments: any = [...departments].map((el: any) => {
      return {
        departmentId: el.departmentId,
        isSelected: el.isSelected,
        employees: el.employees.map(convertEmp),
      };
    });
    let newGroups: any = [...groups].map((el: any) => {
      return {
        groupId: el.groupId,
        isSelected: el.isSelected,
        employees: el.employees.map(convertEmp),
      };
    });
    departmentEmp.forEach((department: any) => {
      const departmentIdx = findId(
        departments,
        department.departmentId,
        'departmentId'
      );
      if (departmentIdx < 0) {
        newDepartments.push({
          departmentId: department.departmentId,
          isSelected: 1,
          employees: [
            {
              employeeId,
              isSelected: 1,
            },
          ],
        });
      }
    });
    // handle group
    groupEmp.forEach((group: any) => {
      const groupIdx = findId(groups, group.groupId, 'groupId');
      if (groupIdx < 0) {
        newGroups.push({
          groupId: group.groupId,
          isSelected: 1,
          employees: [
            {
              employeeId,
              isSelected: 1,
            },
          ],
        });
      } else {
        const groupElement = newGroups[groupIdx];
        const grEmployees: any = groupElement.employees;
        const empFindIdx = findId(grEmployees, employeeId, 'employeeId');
        if (empFindIdx < 0) {
          grEmployees.push({
            employeeId,
            isSelected: 1,
          });
          groupElement.employees = grEmployees;
          newGroups[groupIdx] = groupElement;
        }
      }
    });

    callSaveNavigation(
      { departments: newDepartments, groups: newGroups },
      'employees'
    );
  };

  const handleChooseEmployee = (searchValue: any) => {
    const value = [...searchValue][0];
    const employees = value.employee;
    const { indexChoice } = value;
    const { employeeDepartments = [], employeeGroups = [] } = employees;
    switch (indexChoice) {
      case IndexChoiceSuggestion.EMPLOYEE:
        findRelateContainer(employeeDepartments, employeeGroups, value.itemId);
        break;
      case IndexChoiceSuggestion.DEPARTMENT:
        const department = {
          departmentId: value.itemId,
          isSelected: 1,
          employees: convertResultToData(employeeDepartments),
        };
        callSaveNavigation(department, 'departments');
        break;
      default:
        const groups = {
          groupId: value.itemId,
          isSelected: 1,
          employees: convertResultToData(employeeGroups),
        };
        callSaveNavigation(groups, 'groups');
        break;
    }
  };

  const handleConfirmDate = (date: any) => {
    setDatePickerVisibility(false);
    if (dateKey === 'start') {
      setStartDate(moment(date).format(formatStartDateString));
    } else {
      setEndDate(moment(date).format(formatEndDateString));
    }
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showDatePicker = (key: string) => {
    setDateKey(key);
    setDatePickerVisibility(true);
  };

  const closeModalChoose = () => {
    setIsVisible(false);
  };
  const openModal = () => {
    setIsVisible(true);
  };

  /**
   * add task
   */
  const openAddTask = () => {
    navigation.navigate(ScreenName.CREATE_TASK, { type: ControlType.ADD });
    closeModalChoose();
  };

  /**
   * add milestone
   */
  const openAddMilestone = () => {
    navigation.navigate(ScreenName.CREATE_MILESTONE, { type: ControlType.ADD });
    closeModalChoose();
  };

  const renderModalChoose = () => {
    return (
      <Modal transparent animationType="slide" visible={isVisible}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModalChoose}
          style={DrawerTaskStyle.containerModal}
        >
          <View style={DrawerTaskStyle.contentModal}>
            <TouchableOpacity
              style={DrawerTaskStyle.btnAddTask}
              onPress={() => openAddTask()}
            >
              <Text style={DrawerTaskStyle.txtModal} >{translate(messages.addTask)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={DrawerTaskStyle.btnAddMilestone}
              onPress={() => openAddMilestone()}
            >
              <Text style={DrawerTaskStyle.txtModal}>{translate(messages.addMilestone)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={{ height }}>
      <ScrollView>
        <View style={[DrawerTaskStyle.rowView, DrawerTaskStyle.container]}>
          <Text style={textHeaderStyle}>{translate(messages.taskMenu)}</Text>
          {/* <Icon name={"edit"} /> */}
        </View>
        <View style={DrawerTaskStyle.customerListTask}>
          <Text style={textCommonStyle}>
            {translate(messages.customerListTask)}
          </Text>
          <View style={DrawerTaskStyle.customersFavourite}>
            {dataNavigation?.searchDynamic?.customersFavourite &&
              dataNavigation.searchDynamic.customersFavourite.map(
                (customer) => (
                  <Text style={DrawerTaskStyle.customersFavouriteListName}>
                    {customer.listName}
                  </Text>
                )
              )}
          </View>
        </View>
        <View style={DrawerTaskStyle.personInCharge}>
          <Text>{translate(messages.personInCharge)}</Text>
          <View style={[DrawerTaskStyle.inputContainer]}>
            <EmployeeSuggestView
              typeSearch={TypeSelectSuggest.SINGLE}
              groupSearch={KeySearch.NONE}
              invisibleLabel={false}
              // suggestionsChoice={suggestionsChoice}
              fieldLabel={'test'}
              updateStateElement={handleChooseEmployee}
            />
          </View>
          {dataNavigation.searchDynamic.departments.length > 0 ? (
            dataNavigation.searchDynamic.departments.map(
              (department, indexDepartment) => (
                <>
                  {checkBoxWithText(
                    indexDepartment,
                    KeySearch.NONE,
                    department,
                    KeySearch.DEPARTMENT,
                    department.departmentName
                  )}
                  {department.employees.map(
                    (employee: any, indexEmpDepart: number) =>
                      checkBoxWithText(
                        indexEmpDepart,
                        KeySearch.DEPARTMENT,
                        employee,
                        KeySearch.NONE,
                        `${employee.employeeSurname} ${
                        employee.employeeName ?? ''
                        }`,
                        indexDepartment
                      )
                  )}
                </>
              )
            )
          ) : (
              <View />
            )}
          {dataNavigation.searchDynamic.groups.length > 0 ? (
            dataNavigation.searchDynamic.groups.map((group, indexGroup) => (
              <>
                {checkBoxWithText(
                  indexGroup,
                  KeySearch.NONE,
                  group,
                  KeySearch.GROUP,
                  group.groupName
                )}
                {group.employees.map((employee, indexEmp) =>
                  checkBoxWithText(
                    indexEmp,
                    KeySearch.GROUP,
                    employee,
                    KeySearch.NONE,
                    `${employee.employeeSurname} ${
                    employee.employeeName ?? ''
                    }`,
                    indexGroup
                  )
                )}
              </>
            ))
          ) : (
              <View />
            )}
          {/* {dataNavigation.searchDynamic.scheduleTypes.length > 0 ? (
            dataNavigation.searchDynamic.scheduleTypes.map((scheduleType) => (
              <>
                {checkBoxWithText(
                  0,
                  scheduleType,
                  "scheduleTypes",
                  scheduleType.scheduleTypeName
                )}
              </>
            ))
          ) : (
            <View />
          )} */}
          {/* {dataNavigation.searchDynamic.equipmentTypes.length > 0 ? (
            dataNavigation.searchDynamic.equipmentTypes.map((equipmentType) => (
              <>
                {checkBoxWithText(
                  0,
                  equipmentType,
                  "equipmentTypes",
                  equipmentType.equipmentTypeName
                )}
              </>
            ))
          ) : (
            <View />
          )} */}
        </View>
        <View style={DrawerTaskStyle.specifyPeriod}>
          <Text style={textCommonStyle}>
            {translate(messages.specifyPeriod)}
          </Text>
          <Switch
            value={switchValue}
            onValueChange={(v) => {
              setSwitchValue(v);
            }}
          />
        </View>
        {switchValue ? (
          <>
            <TouchableOpacity
              onPress={() => showDatePicker('start')}
              style={{ ...rowView, paddingBottom: theme.space[5] }}
            >
              <Text>{startDate}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => showDatePicker('end')}
              style={{ ...rowView, paddingBottom: theme.space[5] }}
            >
              <Text>{endDate}</Text>
            </TouchableOpacity>
          </>
        ) : (
            <View />
          )}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={moment(
            dateKey === 'start' ? startDate : endDate,
            dateKey === 'start' ? formatStartDateString : formatEndDateString
          ).toDate()}
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />
        {/* <TouchableOpacity style={DrawerTaskStyle.fab}>
        <Image
          style={DrawerTaskStyle.fabIcon}
          source={appImages.iconPlusGreen}
        />
      </TouchableOpacity>  */}
      </ScrollView>
      <View style={DrawerTaskStyle.fabBtnContainer}>
        <TouchableOpacity
          onPress={() => openModal()}
          style={DrawerTaskStyle.fab}
        >
          <Image
            style={DrawerTaskStyle.fabIcon}
            source={appImages.iconPlusGreen}
          />
        </TouchableOpacity>
      </View>
      {renderModalChoose()}
    </View>
  );
};
