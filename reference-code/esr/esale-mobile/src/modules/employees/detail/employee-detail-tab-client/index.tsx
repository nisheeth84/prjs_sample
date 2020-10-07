import * as React from 'react';
import { TouchableOpacity, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { CustomerItem } from '../common/customer-list-item';
import { customerSelector } from '../detail-screen-selector';
import { Icon } from '../../../../shared/components/icon';
import { CustomerListItemStyles } from '../detail-style';

export const ClientScreen: React.FC = () => {
  const customers = useSelector(customerSelector);
  return (
    <ScrollView>
      <View style={CustomerListItemStyles.customerBlock}>
        <TouchableOpacity style={CustomerListItemStyles.paddingRgiht15}>
          <Icon name="filter" />
        </TouchableOpacity>
        <TouchableOpacity style={CustomerListItemStyles.paddingRgiht15}>
          <Icon name="descending" />
        </TouchableOpacity>
      </View>
      <View>
        {customers.map((customer: any, index: number) => {
          return (
            <CustomerItem
              key={index.toString()}
              name={customer.name}
              address={customer.address}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};
