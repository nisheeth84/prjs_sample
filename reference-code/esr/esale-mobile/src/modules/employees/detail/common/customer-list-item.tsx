import React from 'react';
import { Text, TouchableOpacity, View, Linking } from 'react-native';
import { Icon } from '../../../../shared/components/icon';
import { CustomerListItemStyles } from '../detail-style';

interface CustomerItemProps {
  name: string;
  address: string;
}

/**
 * Component for customer item for detail employee screen
 * @param name
 * @param address
 */
export const CustomerItem: React.FC<CustomerItemProps> = ({
  name,
  address,
}) => {
  /**
   * Tracking action open gg map app
   */
  const openGGMap = () => {
    Linking.openURL(
      'https://www.google.com/maps/search/?api=1&query=centurylink+field'
    );
  };

  return (
    <View style={CustomerListItemStyles.inforEmployee}>
      <View style={CustomerListItemStyles.centerScreenRow}>
        <View style={CustomerListItemStyles.name}>
          <View style={CustomerListItemStyles.column}>
            <TouchableOpacity onPress={() => {}}>
              <Text style={CustomerListItemStyles.customerName}>{name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openGGMap()}>
              <Text style={CustomerListItemStyles.customerAddress}>
                {address}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={CustomerListItemStyles.iconArrowRight}>
        <Icon name="arrowRight" />
      </View>
    </View>
  );
};
