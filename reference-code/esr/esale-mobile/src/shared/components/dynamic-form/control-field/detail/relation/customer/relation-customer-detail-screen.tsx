import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,


  Text, TouchableOpacity, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../../../config/constants/constants';
import { DefineFieldType, RelationDisplay, TypeRelationSuggest } from '../../../../../../../config/constants/enum';
import { customerDetailActions } from '../../../../../../../modules/customer/detail/customer-detail-reducer';
import { authorizationSelector } from '../../../../../../../modules/login/authorization/authorization-selector';
import StringUtils from '../../../../../../util/string-utils';
import { extensionDataSelector } from '../../../../../common-tab/common-tab-selector';
import { getCustomers } from '../../../dynamic-control-repository';
import { CustomerItem } from './customer-list-item';
import { CustomerListStyles } from './customer-relation-style';
import { ListCustomers, RelationCustomerProps } from './customer-types';


/**
 * Component for searching text fields
 * @param props see ICustomerSuggestProps
 */
export function RelationCustomerDetail(props: RelationCustomerProps) {
  const [responseApiCustomer, setResponseApiCustomer] = useState<ListCustomers>();
  const { fieldInfo } = props;
  const displayTab = fieldInfo.relationData ? fieldInfo.relationData.displayTab : 0;
  const typeSuggest = fieldInfo.relationData ? fieldInfo.relationData.format : 0;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ? authorizationState?.languageCode : TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(props?.fieldInfo, FIELD_LABLE, languageCode);
  const navigation = useNavigation();
  const extensionData = props?.extensionData ? props?.extensionData : useSelector(extensionDataSelector);
  const [relationData, setRelationData] = useState<any>();
  const dispatch = useDispatch();

  /**
   * Handling after first render
   */
  useEffect(() => {
    if (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) {
      handleGetRelationCustomersList();
    } else if (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) {
      handleGetRelationCustomersTab();
    }
  }, []);

  /**
  * Call api get relation business cards
  */
  const handleGetRelationCustomersTab = async () => {
    const customersData: any = extensionData.find((item: any) => (item?.fieldType === DefineFieldType.RELATION));
    const customerIds: number[] = JSON.parse(customersData.value);
    const resCustomers = await getCustomers({
      searchConditions: [],
      filterConditions: [],
      localSearchKeyword: "",
      selectedTargetType: 0,
      selectedTargetId: 0,
      isUpdateListView: false,
      orderBy: [],
      offset: 0
    });
    if (resCustomers.data) {
      resCustomers.data = resCustomers.data.filter((item:any) => customerIds.includes(item.customerId))
      setResponseApiCustomer(resCustomers.data);
    }
  }

  /**
* Call api get relation product list
*/
  const handleGetRelationCustomersList = async () => {
    const customerData: any = extensionData.find((item: any) => (item.key === fieldInfo.fieldName && item.fieldType === DefineFieldType.RELATION));
    const customerIds: number[] = customerData?.value ? JSON.parse(customerData.value) :[];
    if(customerIds) {
      setRelationData(customerIds);
    }
  }

  /**
   * action handle show customer-detail
   * @param customerId number
   * @param customerName string
  */
  const showCustomerDetail = (customerId: number, customerName: string) => {
    let param = {
      customerId: customerId,
      customerName: customerName ? customerName : TEXT_EMPTY,
    };

    dispatch(customerDetailActions.addCustomerIdNavigation(customerId));

    return (
      navigation.navigate("customer-detail", param)
    );
  }

  /**
   * reader customer tab
   */
  const renderCustomerTab = () => {
    return (
      <View>
        <FlatList
          data={responseApiCustomer?.customers}
          onEndReachedThreshold={0.1}
          keyExtractor={(item) => item.customerId.toString()}
          renderItem={({ item }) => (
            <CustomerItem
              key={item.customerId}
              data={item}
            />
          )}
        />
      </View>
    );
  };

  /**
   * reader customer list
   */
  const renderCustomerList = () => {
    return (
      <View>
        <Text style={CustomerListStyles.labelHeader}>{title}</Text>
        <View style={CustomerListStyles.mainContainer}>
          {
            relationData &&
            relationData?.map((customer: any, index: number) =>
              <View style={CustomerListStyles.employeeContainer} key={customer + index}>
                <TouchableOpacity onPress={() => showCustomerDetail(customer, "")} >
                  <Text style={CustomerListStyles.link}>{customer}</Text>
                </TouchableOpacity>
                {
                  ++index !== relationData?.length && relationData?.length > 1 &&
                  <Text style={CustomerListStyles.link}>,</Text>
                }
              </View>
            )
          }
        </View>
      </View>

    );
  };

  /*
   * Render the list customer component
   */
  return (
    <View>
      {
        (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) && renderCustomerTab()
      }
      {
        (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) && renderCustomerList()
      }
    </View>
  );

}

