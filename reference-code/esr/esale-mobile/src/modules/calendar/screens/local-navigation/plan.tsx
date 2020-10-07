import React, { useState } from "react";
import { View } from "react-native";
import styles from "./style";
import NavigationTop from "./contents/navigation-top";
import PlanSchedule from "./contents/plan-schedule";
import PlanEmployee from "./contents/plan-employee";
import PlanStatus from "./contents/plan-status";
import { DepartmentsType, EquipmentTypesType, GroupsType, ScheduleTypesType } from "../../api/get-local-navigation-type";
import NavigationBottom from "./contents/navigation-bottom";
import { ACTION_LOCAL_NAVIGATION } from "../../constants";

/**
 * interface Iplan
 */
type IPlan = {
  layout: number,
  handleLayout: (layout: number) => void;
  groups: Array<GroupsType>;
  scheduleTypes: Array<ScheduleTypesType>;
  departments: Array<DepartmentsType>;
  isAttended?: any;
  isAbsence?: any;
  isUnconfirmed?: any;
  isShared?: any;
  handleUpdateDynamic: (data: Array<ScheduleTypesType> | Array<EquipmentTypesType>, key: ACTION_LOCAL_NAVIGATION) => void;
  handleUpdateStatic: (flag: boolean, type: ACTION_LOCAL_NAVIGATION) => void;
  task?: any;
  milestone?: any
}

/**
 * component plan
 * @param props
 * @constructor
 */
const Plan = (props: IPlan) => {
  /**
   * state show or hidden bottom
   */
  const [isShowBottom, setIsShowBottom] = useState(true);
  /**
   * handle show bottom component
   */
  const handleShowBottom = (flag: boolean) => {
    setIsShowBottom(flag);
  }

  return (
    <View style={styles.content_navigation}>
      <NavigationTop
        handleLayout={props.handleLayout}
        layout={props.layout} />
      <PlanSchedule
        scheduleTypes={props.scheduleTypes}
        handleUpdateDynamic={props.handleUpdateDynamic}
        task={props.task}
        milestone={props.milestone}
        handleUpdateStatic={props.handleUpdateStatic}
      />
      <PlanEmployee
        groups={props.groups}
        departments={props.departments}
        handleUpdateDynamic={props.handleUpdateDynamic} />
      <PlanStatus
        handleShowBottom={handleShowBottom}
        isAttended={props.isAttended}
        isAbsence={props.isAbsence}
        isUnconfirmed={props.isUnconfirmed}
        isShared={props.isShared}
        handleUpdateStatic={props.handleUpdateStatic}
      />

      {
        isShowBottom &&
        <NavigationBottom
          handleUpdateStatic={props.handleUpdateStatic} />
      }
    </View>
  );
}

export default Plan;
