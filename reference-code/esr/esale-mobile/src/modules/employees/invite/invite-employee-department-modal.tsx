import React, { useState, useEffect } from "react";
import { View, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "../../../shared/components/icon";
import { theme } from "../../../config/constants";
import { Input } from "../../../shared/components/input";
import { Props } from "./invite-employee-interfaces";
import { InviteEmployeeDepartmentModalStyles } from "./invite-employee-styles";
import { translate } from "../../../config/i18n";
import { messages } from "./invite-employee-messages";
import { listDepartmentSelector } from "./invite-employee-selector";
import { Department } from "./invite-employee-reducer";
import { InviteEmployeeCheckbox } from "./invite-employee-checkbox";
import { CommonButton } from "../../../shared/components/button-input/button";
import { StatusButton, TypeButton } from "../../../config/constants/enum";

/**
 * Modal invite department
 * @param position
 * @function handleCloseModalDepartment
 * @function setObjectSelect
 */
export const InviteDepartmentModal: React.FC<Props> = ({
  handleCloseModal,
  setObjectSelect,
  arraySelection
}) => {
  // Get departments from store
  const departments = useSelector(listDepartmentSelector);
  const [list, setList] = useState<Array<Department>>(departments);
  const [searchValue, setSearchValue] = useState("");
  const [listSelected, setListSelected] = useState<Array<number>>([...arraySelection]);
  const [checkFocus,setCheckFocus] =useState(false);
  // Get List Department from selecttor
  const addListSelected = (depart: number) => {
    const pos = listSelected.includes(depart);
    if (pos) {
      setListSelected(listSelected.filter((item) => item !== depart));
    } else {
      setListSelected(listSelected.concat(depart));
    }
  };

  /**
   * Define function addToEmpDepartments, add Departments to reducer
   * @param departments 
   */
  const addToEmpDepartments = (departments: Array<number>) => {
    setObjectSelect(departments);
    handleCloseModal();
  };

  useEffect(() => {
    // Search processing
    let temp = departments;
    temp = temp.filter((e) => {
      return e.departmentName.indexOf(searchValue) !== -1;
    });
    setList([...temp]);
  }, [searchValue]);

  return (
    <View style={[InviteEmployeeDepartmentModalStyles.container, {height: checkFocus?"85%":"60%"}]}>
      <View style={InviteEmployeeDepartmentModalStyles.search}>
        <Icon name="search" />
        <Input
          value={searchValue}
          onChangeText={(text) => setSearchValue(text)}
          placeholder={translate(messages.inviteEmployeeSearchDepartment)}
          placeholderColor={theme.colors.gray}
          style={InviteEmployeeDepartmentModalStyles.inputStyle}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          onFocus={()=>setCheckFocus(true)}
          onEndEditing={()=>setCheckFocus(false)}
        />
      </View>
      <View style={InviteEmployeeDepartmentModalStyles.divide}></View>
      <FlatList
        data={list}
        renderItem={({ item: department, index }) => (

          <InviteEmployeeCheckbox
            key={index}
            id={department.departmentId}
            name={department.departmentName}
            addListSelected={addListSelected}
            itemChecked={arraySelection.includes(department.departmentId)}
          />
        )}
        keyExtractor={(item) => String(item.departmentId)}
        contentContainerStyle={InviteEmployeeDepartmentModalStyles.wrapGroup}
        onEndReachedThreshold={0.1}
      />
      <View style={InviteEmployeeDepartmentModalStyles.wrapButton}>
        <CommonButton onPress={() => {
          addToEmpDepartments(listSelected);
        }}
          status={StatusButton.ENABLE} textButton={translate(messages.inviteEmployeeDecision)}
          typeButton={TypeButton.BUTTON_MINI_MODAL_SUCCESS} />
      </View>
    </View>
  );
};
