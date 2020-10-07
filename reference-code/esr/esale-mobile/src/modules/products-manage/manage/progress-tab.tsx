import React, { useState } from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { itemTabStyles } from "../styles";
import { ProductTradingByProcess } from "../product-type";
import { formatLabel } from "../../../shared/util/app-utils";

export interface ProgressTabProps {
  items: Array<ProductTradingByProcess>,
  onChooseTab?: Function;
}
// onChooseTab to call api

interface Tab {
  zIndex: number;
  title: string;
  count: number;
}
/**
 * component tab product status
 */
export const ProgressTab: React.FC<ProgressTabProps> = ({
  items,
  onChooseTab = () => { }
}) => {
  /**
   * item tabbar data
   */
  const listData = (items || []).map((item, index) => ({
    zIndex: items.length - index,
    title: item.progressName,
    count: item?.productTradings?.length
  }))

  /**
   * check tab is selected
   */
  const [isSelected, setSelected] = useState(0);
  /**
   * change color text and tab when choose tab
   * @param i
   */
  const onChoose = (i: number) => {
    setSelected(i);
    if (onChooseTab) {
      onChooseTab(i);
    }
  };

  return (
    <View style={[itemTabStyles.container]}>
      <ScrollView horizontal>
        {listData.map((item: Tab, index: number) => {
          return isSelected === index ? (
            <TouchableOpacity
              key={index}
              onPress={() => onChoose(index)}
              activeOpacity={1}
              style={[itemTabStyles.boxTab, { zIndex: item.zIndex, ...(index ? {} : { marginLeft: -20 }) }]}
            >
              <View style={itemTabStyles.solidView} />
              <View style={itemTabStyles.borderBottom} />
              <View style={itemTabStyles.titleTab}>
                <Text style={itemTabStyles.txtBlue}>{formatLabel(item.title)}</Text>
                <Text style={[itemTabStyles.txtBlue, itemTabStyles.txtNumberOfProducts]}>({item.count}件)</Text>
              </View>
              <View
                style={[
                  itemTabStyles.rectangleViewActive,
                  itemTabStyles.rectangleView,
                ]}
              />
              <View
                style={[
                  itemTabStyles.triangleViewActive,
                  itemTabStyles.triangleView,
                ]}
              />
              <View style={itemTabStyles.borderTriangle} />
            </TouchableOpacity>
          ) : (
              <TouchableOpacity
                key={index}
                onPress={() => onChoose(index)}
                activeOpacity={1}
                style={[itemTabStyles.boxTab, { zIndex: item.zIndex, ...(index ? {} : { marginLeft: -20 }) }]}
              >
                <View style={itemTabStyles.borderBottom} />
                <View style={itemTabStyles.titleTab}>
                  <Text style={itemTabStyles.txtBlack}>{formatLabel(item.title)}</Text>
                  <Text style={[itemTabStyles.txtBlack, itemTabStyles.txtNumberOfProducts]}>({item.count}件)</Text>
                </View>
                <View
                  style={[
                    itemTabStyles.rectangleViewInactive,
                    itemTabStyles.rectangleView,
                  ]}
                />
                <View
                  style={[
                    itemTabStyles.triangleViewInactive,
                    itemTabStyles.triangleView,
                  ]}
                />
                <View style={itemTabStyles.borderTriangle} />
              </TouchableOpacity>
            );
        })}
      </ScrollView>
      <View style={[listData.length ? itemTabStyles.lastView : { width: 0 }]} />
    </View>
  );
};
