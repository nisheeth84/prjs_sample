import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { CheckBoxProps } from "./invite-employee-interfaces"
import { InviteEmployeeDepartmentModalStyles } from "./invite-employee-styles";

/**
 * Invite employee checkbox
 * @param name
 * @function addListSelected
 * @param id
 */
export const InviteEmployeeCheckbox: React.FC<CheckBoxProps> = ({
  name,
  addListSelected,
  id,
  itemChecked
}) => {

  const [checked, setChecked] = useState(itemChecked);
  // function selected employee
  const handleSelectItem = () => {
    setChecked(!checked);
    addListSelected(id);
  };
  return (
    <TouchableOpacity
      style={InviteEmployeeDepartmentModalStyles.wrapGroupItem}
      onPress={() => handleSelectItem()}
    >
      <Text style={InviteEmployeeDepartmentModalStyles.contentStyle} numberOfLines={1}>
        {name}
      </Text>
      {checked ? <Icon name="checkedGroupItem" /> : <Icon name="unCheckGroupItem" />}
    </TouchableOpacity>
  );
};
