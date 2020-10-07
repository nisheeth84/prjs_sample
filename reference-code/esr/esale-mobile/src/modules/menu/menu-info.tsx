import * as React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { MenuInfoStyles } from "./menu-style";
import { Icon } from "../../shared/components/icon";
import { EmployeeSelector } from "./menu-personal-settings/menu-settings-selector";
import { TEXT_EMPTY } from "../../config/constants/constants";

interface MenuInfoProp {
  /**
   * navigate employee detail
   */
  onEmployees: () => void;
  companyName: string;
}

export const MenuInfo: React.FC<MenuInfoProp> = ({
  companyName,
  onEmployees,
}) => {
  const employee = useSelector(EmployeeSelector);
  const [textAvatar, setTextAvatar] = React.useState(TEXT_EMPTY);
  React.useEffect(() => {
      if(!!employee.employeeSurname){
        setTextAvatar(employee?.employeeSurname[0]||TEXT_EMPTY)
      }else if(!!employee.employeeName){
        setTextAvatar(employee?.employeeName[0]||TEXT_EMPTY)
      }
  }, [employee]);
  return (
    <View style={MenuInfoStyles.container}>
      <View style={MenuInfoStyles.infoUser}>
        {employee?.employeeIcon ? (
          <Image
            source={{ uri: employee.employeeIcon.fileUrl }}
            style={MenuInfoStyles.image}
          />
        ) : (
          <View style={MenuInfoStyles.image}>
            <Text style={MenuInfoStyles.txtAvatar}>{textAvatar}</Text>
          </View>
        )}

        <View style={MenuInfoStyles.wrapContent}>
          <Text numberOfLines={1} style={MenuInfoStyles.companyTitle}>
            {`${employee?.employeeSurname || TEXT_EMPTY} ${
              employee?.employeeName || TEXT_EMPTY
            }`}
          </Text>
          <Text numberOfLines={1} style={MenuInfoStyles.jobTitle}>
            {companyName}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        hitSlop={MenuInfoStyles.scopeSelect}
        onPress={onEmployees}
      >
        <Icon name="arrowRight" style={MenuInfoStyles.iconStyle} />
      </TouchableOpacity>
    </View>
  );
};
