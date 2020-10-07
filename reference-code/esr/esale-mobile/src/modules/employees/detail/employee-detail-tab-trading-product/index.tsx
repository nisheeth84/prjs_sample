import * as React from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';
import { Icon } from '../../../../shared/components/icon';
import {
  CustomerListItemStyles,
  DetailTabBasicInformationStyles,
  TradingProductStyles,
} from '../detail-style';
import { TradingProductItem } from '../common/trading-product-item';
import { tradingProductSelector } from '../detail-screen-selector';
import { TradingProduct } from '../../../../config/mock';

/**
 * Component for detail screen trading product tab
 */
export const TradingProductTabScreen: React.FC = () => {
  const tradingProducts = useSelector(tradingProductSelector);
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
      <View style={TradingProductStyles.sumTitle}>
        <Text style={DetailTabBasicInformationStyles.title}>合計：</Text>
        <NumberFormat
          value={100000}
          displayType="text"
          thousandSeparator
          suffix="円"
          renderText={(amount) => (
            <Text style={DetailTabBasicInformationStyles.title}>{amount}</Text>
          )}
        />
      </View>
      <View>
        {tradingProducts.map((item: TradingProduct, index: number) => {
          return (
            <TradingProductItem
              key={index.toString()}
              name={item.name}
              completeDate={item.completeDate}
              progress={item.progress}
              amount={item.amount}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};
