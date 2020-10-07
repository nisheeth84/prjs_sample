import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CustomerDetailStyles } from "./customer-list-style";
import { CaseScreenShowCustomer, StackScreenListCustomer, CustomerRegisterEditMode } from "./customer-list-enum";
import { ItemCustomer } from "./customer-list-repository";
import { useNavigation } from "@react-navigation/native";
import { ModeScreen, ControlType } from "../../../config/constants/enum";
import { StackScreen } from "../../activity/constants";
import { ActivityRegisterEditMode } from "../../activity/api/get-activities-type";
import { ScreenName } from "../../../config/constants/screen-name";

interface CustomersDetail {
  id: number;
  name: string;
}

interface CustomerDetailProps {
  // data of CustomerDetail
  data: CustomersDetail;
  // index of CustomerDetail
  index: number;
  // data of ItemCustomer
  dataItemCustomer: ItemCustomer;
}

/**
 * Component for show case list of customer list item 
 * @param CustomerDetailProps 
*/

export const CustomerDetail: React.FC<CustomerDetailProps> = ({
  index,
  data,
  dataItemCustomer
}) => {
  const navigation = useNavigation();
  /**
   * action handle ItemCustomer
   * @param indexItem item of CustomerDetailProps
  */
  const actionItemCustomer = (indexItem: number, customerId: number, customerName: string) => () => {
    if(indexItem == CaseScreenShowCustomer.HistoryActive) {
      navigation.navigate(StackScreen.ACTIVITY_LIST, {
        customerId: customerId
      })
    }else if(indexItem == CaseScreenShowCustomer.RegisterActive) {
      navigation.navigate(StackScreen.ACTIVITY_CREATE_EDIT, { 
        mode: ActivityRegisterEditMode.REGISTER, 
        customerId: customerId
      })
    }else if(indexItem == CaseScreenShowCustomer.RegisterShedule) {
      navigation.navigate(StackScreenListCustomer.REGISTER_SHEDULE, {
        mode: CustomerRegisterEditMode.REGISTER_SHEDULE,
        customerId: customerId
      })
    }else if(indexItem == CaseScreenShowCustomer.RegisterTask) {
      navigation.navigate(ScreenName.CREATE_TASK, {
        type: ControlType.ADD,
        customerId: customerId
      })
    }else if(indexItem == CaseScreenShowCustomer.Post) {
      navigation.navigate(StackScreenListCustomer.POST, {
        customerId: customerId,
        customerName: customerName
      })
    }else if(indexItem == CaseScreenShowCustomer.CreateMail) {
      // TODO Go to the Create mail screen
      alert("TODO Go to the Create mail screen phase 2");
      // navigation.navigate(StackScreenListCustomer.CREATE_MAIL, {
      //   customerId: customerId
      // })
    }else if(indexItem == CaseScreenShowCustomer.RegisterBusinessCard) {
      navigation.navigate(StackScreenListCustomer.REGISTER_BUSINESS_CARD, {
        customerId: customerId
      })
    }else if(indexItem == CaseScreenShowCustomer.ChildCustomerRegistration) {
      navigation.navigate(StackScreenListCustomer.CHILD_CUSTOMER_REGISTER, {
        mode: ModeScreen.CREATE,
        customerId: customerId
      })
    }
  }

  return (
    <View>
      <TouchableOpacity style={CustomerDetailStyles.inforCustomerDetail} onPress={actionItemCustomer(index, dataItemCustomer.customerId, dataItemCustomer.customerName)}>
        <Text style={CustomerDetailStyles.inforTextCustomerDetail}>{data.name}</Text>
      </TouchableOpacity>
    </View>
  );
}