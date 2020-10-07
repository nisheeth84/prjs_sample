import React, { } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { CustomerListStyles } from "./customer-list-style";
import { CustomerListItemStyles } from "./customer-list-style";
import { CustomerDetail } from "./customer-detail";
import { Icon } from "../../../shared/components/icon";
import { clickSelector } from "./customer-list-selector";
import { useSelector, useDispatch } from "react-redux";
import { ItemCustomer } from "./customer-list-repository";
import { customerListActions } from "./customer-list-reducer";
import { useNavigation } from "@react-navigation/native";
import { CustomerListItemDescription } from "./customer-list-item-description";
import { StatusCustomerType } from "./customer-list-enum";
import { translate } from "../../../config/i18n";
import { messages } from "./customer-list-messages";
import { customerDetailActions } from "../detail/customer-detail-reducer";
import { TEXT_EMPTY } from "../../../shared/components/message/message-constants";
import { format } from "react-string-format";

interface CustomerProps {
  // data item customer
  data: ItemCustomer;
  // index item customer
  index: number,
}

interface CustomersDetail {
  id: number;
  name: string;
}

/**
 * Component for show item of customer list
 * @param CustomerProps 
*/

export const CustomerItem: React.FC<CustomerProps> = ({
  data,
  index,
}) => {

  const [customerDetail] = React.useState([
    {id : 1, name : translate(messages.customerListItemHistoryActivity)},
    {id : 2, name : translate(messages.customerListItemActivityRegistration)},
    {id : 3, name : translate(messages.customerListItemScheduleRegistration)},
    {id : 4, name : translate(messages.customerListItemTaskRegistration)},
    {id : 5, name : translate(messages.customerListItemPost)},
    {id : 6, name : translate(messages.customerListItemCreateEmail)},
    {id : 7, name : translate(messages.customerListItemBusinessCardRegistration)},
    {id : 8, name : translate(messages.customerListItemChildCustomerRegistration)},
  ]);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  /**
   * action handle set select and selected item customers
   * @param indexItemSelectCustomers get index of Item Select Customers
  */
  const handleSetItemSelectCustomers = (indexItemSelectCustomers: number) => () => {
    dispatch(
      customerListActions.handleSetItemSelectCustomers({
        position: indexItemSelectCustomers,
      })
    );
  }

  // set status select item list customers
  const statusSelect = useSelector(clickSelector);

  /**
   * action handle show customer-detail
   * @param customerId get customerId
   * @param customerName get customerName 
  */
  const arrowShowCustomerDetail = (customerId:number, customerName: string) => {
    let paramCustomer = {
      customerId: customerId,
      customerName: customerName,
    };
    console.log("paramCustomer", paramCustomer)
    dispatch(customerDetailActions.addCustomerIdNavigation(customerId));
    navigation.navigate("customer-detail", paramCustomer)
    // return (
    //   navigation.navigate("customer-detail", paramCustomer)
    // );
  }

  /**
   * action handle show item list customers
  */
  const check = () => {
    var role = TEXT_EMPTY;
    var arrayParent = data?.customerParent?.pathTreeName;
    if (arrayParent?.length !== undefined && arrayParent?.length > 0) {
      role = arrayParent[0];
      if(arrayParent?.length > 1){
        role += format(translate(messages.customerListFormat),arrayParent.join(translate(messages.customerListFormatDash)).slice(arrayParent[0]?.length + 1));
      }
    }
    if (statusSelect === StatusCustomerType.Current) {
      return (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={true}>
          <TouchableOpacity style={CustomerListItemStyles.inforCustomer} onPress={() => arrowShowCustomerDetail(data.customerId, data.customerName)}>
            {CustomerListItemDescription(role, data.customerName,data.customerAddressObject.buildingName, data.customerAddressObject.address)}
            <View style={CustomerListItemStyles.inforCustomerIcon}>
              <Icon name="arrowRight" style={CustomerListItemStyles.iconArrowRight} />
            </View>
          </TouchableOpacity>
          {customerDetail.map((item : CustomersDetail) =>  {
              return (
                <CustomerDetail
                  index={item.id}
                  data={item}
                  dataItemCustomer={data}
                />
              );
          })}
        </ScrollView>
      );
    } else if (!data.select || data.select) {
      return (
        <TouchableOpacity style={[CustomerListItemStyles.inforCustomer]} onPress = {handleSetItemSelectCustomers(index)}>
          {CustomerListItemDescription(role, data.customerName,data.customerAddressObject.buildingName, data.customerAddressObject.address)}
          <View style={CustomerListItemStyles.inforCustomerIcon}>
            {!data.select ? (
              <Icon name="unchecked" style={CustomerListItemStyles.iconUnchecked} />
            ):(
              <Icon name="selected" style={CustomerListItemStyles.iconUnchecked} />
            )}
          </View>
        </TouchableOpacity>
      );
    }else{
      return;
    }
  };
  
  return (
    <View style={CustomerListStyles.listCard}>
      {check()}
    </View>
  );
}