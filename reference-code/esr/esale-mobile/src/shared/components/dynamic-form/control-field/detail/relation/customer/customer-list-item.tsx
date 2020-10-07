import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "../../../../../icon";
import { CustomerListItemDescription } from "./customer-list-item-description";
import { CustomerListItemStyles, CustomerListStyles } from "./customer-relation-style";
import { CustomerProps } from "./customer-types";
import { customerDetailActions } from "../../../../../../../modules/customer/detail/customer-detail-reducer";
import { useDispatch } from "react-redux";
import { TEXT_EMPTY } from "../../../../../../../config/constants/constants";

/**
 * Component for show item of customer list
 * @param CustomerProps 
*/
export const CustomerItem: React.FC<CustomerProps> = ({
  data,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  /**
   * action handle show customer-detail
   * @param customerId number
   * @param customerName string
  */
  const arrowShowCustomerDetail = (customerId: number, customerName: string) => {
    let param = {
      customerId: customerId,
      customerName: customerName,
    };

    dispatch(customerDetailActions.addCustomerIdNavigation(customerId));

    return (
      navigation.navigate("customer-detail", param)
    );
  }

  /**
   * action handle show item list customers
  */
  const check = () => {
    var stringTreeName: string = data?.customerParent?.pathTreeName ?? TEXT_EMPTY;
    var arrayTreeName: Array<string> = stringTreeName.split(", ");
    let pathTreeName = "";
    var role = "";
    if (arrayTreeName.length === 0 || arrayTreeName.length === 1) {
      role = "";
    } else if (arrayTreeName.length === 2) {
      role = arrayTreeName[0];
    } else {
      var fatherCustomers = arrayTreeName[(arrayTreeName.length - 2)];
      arrayTreeName.forEach((item,indexTreeName) => {
        if(indexTreeName != (arrayTreeName.length -2) && indexTreeName != (arrayTreeName?.length - 1)){
          pathTreeName += item + "-";
        }
      });
      pathTreeName = pathTreeName.substring(0, pathTreeName?.length - 1);
      role = fatherCustomers + "(" + pathTreeName + ")";
    }
    return (
      <TouchableOpacity style={CustomerListItemStyles.inforCustomer}
        onPress={() => arrowShowCustomerDetail(data.customerId, data.customerName)}>
        {CustomerListItemDescription(role, data.customerName, data.customerAddress)}
        <View style={CustomerListItemStyles.btnArrowRight}>
          <Icon name="iconArrowRight" style={CustomerListItemStyles.iconArrowRight} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={CustomerListStyles.listCard}>
      {check()}
    </View>
  );
}