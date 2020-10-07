import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon } from '../../shared/components/icon';
import { CartItem } from './cart-item';
import { cartsSelector } from './cart-selector';
import { CartStyles } from './cart-style';

interface Cart {
  id: number;
  avatarUrl: any;
  name: string;
  role: string;
  price: number;
}

/**
 * Component for show list product cart card item
 */
export function CartScreen() {
  const carts = useSelector(cartsSelector);
  return (
    <View style={CartStyles.container}>
      <ScrollView>
        <View style={CartStyles.inforBlock}>
          <Text style={CartStyles.title}>全ての社員（100名）</Text>
          <View style={CartStyles.fristRow}>
            <Text style={CartStyles.date}>最終更新: 2019/07/28</Text>
            <View style={CartStyles.iconBlock}>
              <TouchableOpacity style={CartStyles.iconEditButton}>
                <Icon name="edit" />
              </TouchableOpacity>
              <TouchableOpacity style={CartStyles.iconFilterButton}>
                <Icon name="filterActive" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon
                  name="descending"
                  style={CartStyles.iconDescendingButton}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="other" style={CartStyles.iconOtherButton} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={CartStyles.listEmployee}>
          {carts.map((item: Cart) => {
            return (
              <CartItem
                key={item.id.toString()}
                avatarUrl={item.avatarUrl}
                name={item.name}
                role={item.role}
                price={item.price}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
