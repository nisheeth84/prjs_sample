import React, {useEffect, useState} from "react";
import {
  Image,
  TouchableOpacity,
} from "react-native";
import styles from "./style";
import { Images } from "../../config";
import {
  DepartmentsType,
  EmployeesType,
  EquipmentTypesType,
  GroupsType,
  ScheduleTypesType
} from "../../api/get-local-navigation-type";
import { ACTION_LOCAL_NAVIGATION, EMPLOYEE_ACTION } from "../../constants";
/**
 * interface ICheckBoxCustom
 */
type ICheckBoxCustom = {
  active?: boolean;
  borderColorOther?: string | null;
  background?: string;
  borderColor?: string;
  isParent?: boolean;
  type?: ACTION_LOCAL_NAVIGATION | null;
  item?: ScheduleTypesType | DepartmentsType | GroupsType | EquipmentTypesType | EmployeesType;
  handleCheck?: (
    flag: boolean,
    item: ScheduleTypesType | DepartmentsType | GroupsType | EquipmentTypesType | EmployeesType | undefined
  ) => void;
  handleCheckStatic?: (flag: boolean, type: ACTION_LOCAL_NAVIGATION) => void
}

/**
 * component CheckBoxCustom
 * @param props
 * @constructor
 */
const CheckBoxCustom = (props: ICheckBoxCustom) => {
  /**
   * status check of component
   */
  const [isChecked, setChecked] = useState(!!props.active);
  /**
   * Check component is parent
   */
  const isParent = props.isParent;

  /**
   * set check component
   */
  const changeCheckbox = () => {
    const flag = !isChecked;
    setChecked(flag);
    if (!props.type) {
      isParent
      ?
        props.handleCheck && props.handleCheck(flag, undefined)
      :
        props.handleCheck && props.item && props.handleCheck(flag, props.item)
    } else {
      props.handleCheckStatic && props.handleCheckStatic(flag, props.type);
    }
  };

  /**
   * when active pass, set status check of component
   */
  useEffect(() => {
    setChecked(!!props.active);
  }, [props.active]);
  
  return (
    <TouchableOpacity
      style={[
        styles.checkBox,
        { borderColor: props.borderColorOther || EMPLOYEE_ACTION.DEFAULT_COLOR_BORDER },
        (isChecked) && {
          backgroundColor: props.background,
          borderColor: props.borderColor,
        },
      ]}
      activeOpacity={0.8}
      onPress={changeCheckbox}
    >
      <Image source={Images.localNavigation.ic_check}/>
    </TouchableOpacity>
  );
}

export default CheckBoxCustom;