import React, { useEffect, useState } from "react";
import { View, ScrollView, SafeAreaView } from "react-native";
import { Style } from "../common";
import Equipment from "./local-navigation/equipment";
import Plan from "./local-navigation/plan";
import styles from "./local-navigation/style";
import ContentHeader from "./local-navigation/content-headers";
import { useDispatch, useSelector } from "react-redux";
import { getLocalNavigation, handleSaveLocalNavigation } from "../calendar-repository";
import { calendarActions } from "../calendar-reducer";
import {
  EquipmentTypesType,
  GetLocalNavigation,
  ScheduleTypesType
} from "../api/get-local-navigation-type";
import { localNavigationSelector } from "../calendar-selector";
import { ACTION_LOCAL_NAVIGATION, FUNCTION_DIVISION, TabFocus } from "../constants";
import { DUMMY_DATA_LOCAL_NAVIGATION } from "../assets/dummy";

const isDummy = false;

/**
 * Component Local Navigation
 * @constructor
 */
const LocalNavigation = React.memo(() => {
  /**
   * data in state
   */
  let localNavigation: GetLocalNavigation = useSelector(localNavigationSelector);
  /**
   * layout
   */
  const [layout, setLayout] = useState(TabFocus.SCHEDULE);
  const dispatch = useDispatch();

  /**
   * call Api and set Data to State
   * @param functionDivision
   */
  const callApiGetLocalNavigation = (functionDivision: string) => {
    getLocalNavigation(functionDivision).then((response) => {
      dispatch(calendarActions.setLocalNavigation({
        localNavigation: isDummy ? DUMMY_DATA_LOCAL_NAVIGATION : response.data
      }))
    });
  }
  /**
   * call Api getLocalNavigation
   */
  useEffect(() => {
    callApiGetLocalNavigation(FUNCTION_DIVISION);
  }, []);

  /**
   * set Layout
   */
  useEffect(() => {
    localNavigation.searchStatic &&
      setLayout(Number(localNavigation.searchStatic?.viewTab));
  }, [localNavigation])

  /**
   * set data to global state
   * @param data
   */
  const callDispatch = (data: GetLocalNavigation) => {
    dispatch(calendarActions.setLocalNavigation({
      localNavigation: data
    }))
  }
  /**
   * handle show layout Plan or Equipment
   * @param layout
   */
  const handleLayout = (layout_: number) => {
    if (localNavigation && localNavigation.searchStatic) {
      // setLayout(layout);
      localNavigation = {
        ...localNavigation,
        searchStatic: {
          ...localNavigation.searchStatic,
          viewTab: layout_
        }
      }
      dispatch(calendarActions.onChangeTabFocus({
        tabFocus: layout_
      }))

      // CONVERT DATA OF SCHEDULE BEFORE SEND TO SEVER
      const dataFillNotSchedule = localNavigation.searchDynamic!.scheduleTypes?.map((element) => ({ scheduleTypeId: element.scheduleTypeId, isSelected: element.isSelected }))

      // CONVERT DATA OF DEPARTMENTS BEFORE SEND TO SEVER
      const dataFillNotDepartment = localNavigation.searchDynamic!.departments?.map((element) => ({ departmentId: element.departmentId, isSelected: element.isSelected, employees: element.employees?.map((elm) => ({ employeeId: elm.employeeId, isSelected: elm.isSelected, color: elm.color })) }))

      // CONVERT DATA OF GROUPS BEFORE SEND TO SEVER
      const dataFillNotGroups = localNavigation.searchDynamic!.groups?.map((element) => ({ groupId: element.groupId, isSelected: element.isSelected, employees: element.employees?.map((elm: any) => ({ employeeId: elm.employeeId, isSelected: elm.isSelected, color: elm.color })) }))

      // CONVERT DATA OF EQUIPMENTS BEFORE SEND TO SEVER
      const dataFillNotEquipment = localNavigation.searchDynamic!.equipmentTypes?.map((element) => ({ equipmentTypeId: element.equipmentTypeId, isSelected: element.isSelected }))

      const data = {
        ...localNavigation,
        searchDynamic: {
          ...localNavigation.searchDynamic,
          scheduleTypes: dataFillNotSchedule,
          departments: dataFillNotDepartment,
          groups: dataFillNotGroups,
          equipmentTypes: dataFillNotEquipment
        }
      }
      const dataSaveViewTab = {
        ...data,
        searchStatic: {
          ...localNavigation.searchStatic,
          viewTab: layout_
        }
      }
      handleSaveLocalNavigation(dataSaveViewTab).then(() => {
        callDispatch(localNavigation)
      });
    }
  }




  /**
   * update data in searchDynamic
   * @param data
   * @param key
   */
  const handleUpdateDynamic = (data: Array<ScheduleTypesType> | Array<EquipmentTypesType>, key: ACTION_LOCAL_NAVIGATION) => {
    // CONVERT DATA OF SCHEDULE BEFORE SEND TO SEVER
    const dataFillSchedule = localNavigation.searchDynamic?.scheduleTypes?.map((element) => ({ scheduleTypeId: element.scheduleTypeId, isSelected: element.isSelected }))
    const dataFillNotSchedule = localNavigation.searchDynamic!.scheduleTypes?.map((element) => ({ scheduleTypeId: element.scheduleTypeId, isSelected: element.isSelected }))

    // CONVERT DATA OF DEPARTMENTS BEFORE SEND TO SEVER
    const dataFillDepartment = localNavigation.searchDynamic?.departments?.map((element) => ({ departmentId: element.departmentId, isSelected: element.isSelected, employees: element.employees?.map((elm) => ({ employeeId: elm.employeeId, isSelected: elm.isSelected, color: elm.color })) }))
    const dataFillNotDepartment = localNavigation.searchDynamic!.departments?.map((element) => ({ departmentId: element.departmentId, isSelected: element.isSelected, employees: element.employees?.map((elm) => ({ employeeId: elm.employeeId, isSelected: elm.isSelected, color: elm.color })) }))

    // CONVERT DATA OF GROUPS BEFORE SEND TO SEVER
    const dataFillGroups = localNavigation.searchDynamic?.groups?.map((element) => ({ groupId: element.groupId, isSelected: element.isSelected, employees: element.employees?.map((elm: any) => ({ employeeId: elm.employeeId, isSelected: elm.isSelected, color: elm.color })) }))
    const dataFillNotGroups = localNavigation.searchDynamic!.groups?.map((element) => ({ groupId: element.groupId, isSelected: element.isSelected, employees: element.employees?.map((elm: any) => ({ employeeId: elm.employeeId, isSelected: elm.isSelected, color: elm.color })) }))

    // CONVERT DATA OF EQUIPMENTS BEFORE SEND TO SEVER
    const dataFillEquipment = localNavigation.searchDynamic?.equipmentTypes?.map((element) => ({ equipmentTypeId: element.equipmentTypeId, isSelected: element.isSelected }))
    const dataFillNotEquipment = localNavigation.searchDynamic!.equipmentTypes?.map((element) => ({ equipmentTypeId: element.equipmentTypeId, isSelected: element.isSelected }))

    localNavigation = {
      ...localNavigation,
      searchDynamic: {
        ...localNavigation.searchDynamic,
        scheduleTypes: key === ACTION_LOCAL_NAVIGATION.SCHEDULE ? data : localNavigation.searchDynamic!.scheduleTypes,
        departments: key === ACTION_LOCAL_NAVIGATION.DEPARTMENT ? data : localNavigation.searchDynamic!.departments,
        groups: key === ACTION_LOCAL_NAVIGATION.GROUP ? data : localNavigation.searchDynamic!.groups,
        equipmentTypes: key === ACTION_LOCAL_NAVIGATION.EQUIPMENT ? data : localNavigation.searchDynamic!.equipmentTypes
      }
    }

    const dataSendToSearchDynamic = {
      ...localNavigation,
      searchDynamic: {
        ...localNavigation.searchDynamic,
        scheduleTypes: key === ACTION_LOCAL_NAVIGATION.SCHEDULE ? dataFillSchedule : dataFillNotSchedule,
        departments: key === ACTION_LOCAL_NAVIGATION.DEPARTMENT ? dataFillDepartment : dataFillNotDepartment,
        groups: key === ACTION_LOCAL_NAVIGATION.GROUP ? dataFillGroups : dataFillNotGroups,
        equipmentTypes: key === ACTION_LOCAL_NAVIGATION.EQUIPMENT ? dataFillEquipment : dataFillNotEquipment
      }
    }

    handleSaveLocalNavigation(dataSendToSearchDynamic).then(() => {
      callDispatch(localNavigation)
    })
      .catch((error) => {
        console.log('err', error);
      })
  }

  /**
   * update data in searchStatic
   * @param type
   * @param flag 
   */
  const handleUpdateStatic = (flag: boolean, type: ACTION_LOCAL_NAVIGATION) => {
    // CONVERT DATA OF SCHEDULE BEFORE SEND TO SEVER
    const dataFillNotSchedule = localNavigation.searchDynamic!.scheduleTypes?.map((element) => ({ scheduleTypeId: element.scheduleTypeId, isSelected: element.isSelected }))

    // CONVERT DATA OF DEPARTMENTS BEFORE SEND TO SEVER
    const dataFillNotDepartment = localNavigation.searchDynamic!.departments?.map((element) => ({ departmentId: element.departmentId, isSelected: element.isSelected, employees: element.employees?.map((elm) => ({ employeeId: elm.employeeId, isSelected: elm.isSelected, color: elm.color })) }))

    // CONVERT DATA OF GROUPS BEFORE SEND TO SEVER
    const dataFillNotGroups = localNavigation.searchDynamic!.groups?.map((element) => ({ groupId: element.groupId, isSelected: element.isSelected, employees: element.employees?.map((elm: any) => ({ employeeId: elm.employeeId, isSelected: elm.isSelected, color: elm.color })) }))

    // CONVERT DATA OF EQUIPMENTS BEFORE SEND TO SEVER
    const dataFillNotEquipment = localNavigation.searchDynamic!.equipmentTypes?.map((element) => ({ equipmentTypeId: element.equipmentTypeId, isSelected: element.isSelected }))

    const dataDynamicDefault = {
      ...localNavigation,
      searchDynamic: {
        ...localNavigation.searchDynamic,
        scheduleTypes: dataFillNotSchedule,
        departments: dataFillNotDepartment,
        groups: dataFillNotGroups,
        equipmentTypes: dataFillNotEquipment
      }
    }
    const dataSendToSearchStatic = {
      ...dataDynamicDefault,
      searchStatic: {
        ...localNavigation.searchStatic,
        task: type === ACTION_LOCAL_NAVIGATION.TASK ? flag : localNavigation.searchStatic?.task,
        milestone: type === ACTION_LOCAL_NAVIGATION.MILESTONE ? flag : localNavigation.searchStatic?.milestone,
        isShowHoliday: type === ACTION_LOCAL_NAVIGATION.HOLIDAY ? flag : localNavigation.searchStatic?.isShowHoliday,
        isShowPerpetualCalendar: type === ACTION_LOCAL_NAVIGATION.PERPETUAL_CALENDAR ? flag : localNavigation.searchStatic?.isShowPerpetualCalendar
      }
    }
    localNavigation = {
      ...localNavigation,
      searchStatic: {
        ...localNavigation.searchStatic,
        isAttended: type === ACTION_LOCAL_NAVIGATION.PARTICIPANTS ? flag : localNavigation.searchStatic?.isAttended,
        isAbsence: type === ACTION_LOCAL_NAVIGATION.ABSENTEES ? flag : localNavigation.searchStatic?.isAbsence,
        isUnconfirmed: type === ACTION_LOCAL_NAVIGATION.UNCONFIRMED ? flag : localNavigation.searchStatic?.isUnconfirmed,
        isShared: type === ACTION_LOCAL_NAVIGATION.SHARE ? flag : localNavigation.searchStatic?.isShared,
        task: type === ACTION_LOCAL_NAVIGATION.TASK ? flag : localNavigation.searchStatic?.task,
        milestone: type === ACTION_LOCAL_NAVIGATION.MILESTONE ? flag : localNavigation.searchStatic?.milestone,
        isShowHoliday: type === ACTION_LOCAL_NAVIGATION.HOLIDAY ? flag : localNavigation.searchStatic?.isShowHoliday,
        isShowPerpetualCalendar: type === ACTION_LOCAL_NAVIGATION.PERPETUAL_CALENDAR ? flag : localNavigation.searchStatic?.isShowPerpetualCalendar
      }
    }
    handleSaveLocalNavigation(dataSendToSearchStatic)
      .then(() => {
        callDispatch(localNavigation)
      })
      .catch((error) => console.log('ERR', error))
  }

  return (
    <SafeAreaView style={[Style.body]}>
      <ScrollView>
        <View style={Style.container}>
          <View style={styles.content}>
            {/*Header*/}
            <ContentHeader/>
            {/*Content*/}
            {layout === TabFocus.SCHEDULE &&
              localNavigation.searchDynamic?.scheduleTypes &&
              localNavigation.searchDynamic?.groups &&
              localNavigation.searchDynamic?.departments &&
              <Plan
                handleLayout={handleLayout}
                layout={layout}
                scheduleTypes={localNavigation.searchDynamic?.scheduleTypes}
                groups={localNavigation.searchDynamic?.groups}
                departments={localNavigation.searchDynamic?.departments}
                isAttended={localNavigation.searchStatic?.isAttended}
                isAbsence={localNavigation.searchStatic?.isAbsence}
                isUnconfirmed={localNavigation.searchStatic?.isUnconfirmed}
                isShared={localNavigation.searchStatic?.isShared}
                task={localNavigation.searchStatic?.task}
                milestone={localNavigation.searchStatic?.milestone}
                handleUpdateDynamic={handleUpdateDynamic}
                handleUpdateStatic={handleUpdateStatic}
              />}
            {layout === TabFocus.RESOURCE &&
              localNavigation.searchDynamic?.equipmentTypes &&
              <Equipment
                handleLayout={handleLayout}
                layout={layout}
                equipmentTypes={localNavigation.searchDynamic?.equipmentTypes}
                handleUpdateDynamic={handleUpdateDynamic} />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
})

export default LocalNavigation;