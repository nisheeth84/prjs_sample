import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { Icon } from "../../../shared/components/icon";
import { theme } from "../../../config/constants";
import { Input } from "../../../shared/components/input";
import {
  InviteEmployeePackageModalStyles,
} from "./invite-employee-styles";
import { translate } from "../../../config/i18n";
import { messages } from "./invite-employee-messages";
import { InviteEmployeeCheckbox } from "./invite-employee-checkbox";
import { listPackageSelector } from "./invite-employee-selector";
import { Packages } from "./invite-employee-reducer";
import { Props } from "./invite-employee-interfaces"
import { CommonButton } from "../../../shared/components/button-input/button";
import { StatusButton, TypeButton } from "../../../config/constants/enum";
/**
 * Modal package
 * @function handleCloseModal
 * @function setObjectSelect
 */
export const InviteEmployeePackageModal: React.FC<Props> = ({
  handleCloseModal,
  setObjectSelect,
  arraySelection
}) => {
  const [searchValue, setSearchValue] = useState("");
  const listPackage = useSelector(listPackageSelector);
  const [listSelected, setListSelected] = useState<number[]>(arraySelection);
  const [list, setList] = useState<Array<Packages>>(listPackage);
  const [checkFocus,setCheckFocus] =useState(false);
  /**
   * Function Get data selected
   * @param id 
   */
  const addListSelected = (packageList: number) => {
    const pos = listSelected.includes(packageList);
    if (pos) {
      setListSelected(listSelected.filter((item) => item !== packageList));
    } else {
      setListSelected(listSelected.concat(packageList));
    }
  };

	/**
	 * Define function set array packageId to reducer
	 * @param packageId 
	 */
  const addToEmpOption = (packageId: Array<number>) => {
    setObjectSelect(packageId);
    handleCloseModal();
  };

  useEffect(() => {
    // Search processing
    let tempListPackage = listPackage;
    tempListPackage = tempListPackage.filter((e) => {
      return e.packageName.indexOf(searchValue) !== -1;
    });
    setList([...tempListPackage]);
  }, [searchValue]);
  return (
    <View style={[InviteEmployeePackageModalStyles.container,{height: checkFocus?"80%":"60%"}]}>
      <View style={InviteEmployeePackageModalStyles.search}>
        <Icon name="search"></Icon>
        <Input
          value={searchValue}
          onChangeText={(text: string) => setSearchValue(text)}
          placeholder={translate(messages.inviteEmployeeSearchPackage)}
          placeholderColor={theme.colors.gray}
          style={InviteEmployeePackageModalStyles.inputStyle}
          autoCapitalize="none"
          autoCompleteType="off"
          autoCorrect={false}
          onFocus={()=>setCheckFocus(true)}
          onEndEditing={()=>setCheckFocus(false)}
        >
        </Input>
      </View>
      <View style={InviteEmployeePackageModalStyles.divide}></View>
      {
        list.map( (item: Packages, index:number) => {
          const checked =arraySelection.includes(item.packageId);
         return  <InviteEmployeeCheckbox
          key={index}
          id={item.packageId}
          name={item.packageName}
          addListSelected={addListSelected}
          itemChecked={checked}
        />
        }
        )
      }
      <View style={InviteEmployeePackageModalStyles.wrapButton}>
        <CommonButton onPress={() => {
          addToEmpOption(listSelected);
        }}
          status={StatusButton.ENABLE} textButton={translate(messages.inviteEmployeeDecision)}
          typeButton={TypeButton.BUTTON_MINI_MODAL_SUCCESS} />
      </View>
    </View>
  );
};
