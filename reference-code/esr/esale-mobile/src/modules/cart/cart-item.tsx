import * as React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import NumberFormat from 'react-number-format';
import { Icon } from '../../shared/components/icon';
import { theme } from '../../config/constants';
import { CartItemStyles } from './cart-style';

interface CartItemProps {
  avatarUrl: any;
  name: string;
  role: string;
  price: number;
}

/**
 * Component for cart item
 */
export const CartItem: React.FC<CartItemProps> = ({
  avatarUrl,
  name,
  role,
  price,
}) => {
  return (
    <View style={CartItemStyles.inforEmployee}>
      <View style={CartItemStyles.employeeBlock}>
        <Image source={avatarUrl} style={CartItemStyles.avatar} />
        <View style={CartItemStyles.name}>
          <Text style={{ color: theme.colors.gray1 }}>{name}</Text>
          <Text>{role}</Text>
          <Text style={{ color: theme.colors.gray1 }}>
            <NumberFormat
              value={price}
              displayType="text"
              thousandSeparator
              prefix="¥ "
              renderText={(value) => <Text>{value}</Text>}
            />
          </Text>
        </View>
      </View>
      <TouchableOpacity style={CartItemStyles.iconArrowRight}>
        <Icon name="arrowRight" />
      </TouchableOpacity>
    </View>
  );
};
