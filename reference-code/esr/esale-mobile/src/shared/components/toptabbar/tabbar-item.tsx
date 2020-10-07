import React from 'react';
import { Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { TabbarItemStyle } from './styles';
import { CommonStyles } from '../../common-style';
import { checkEmptyString } from '../../util/app-utils';

const { width } = Dimensions.get('window');

/**
 * top tab item props
 */
interface ItemTabbarProps {
  //tab route
  item: any;
  // index of active tab
  currentIdx: number;
  // index of tab
  idx: number;
  // total tab
  length: number;
  // handle press on tabbar item
  onPressTabBtn: () => void;
  // notification
  badge?: any;
  // tab icon
  icon?: string;
}

/**
 * render tabbar item
 * @param param0
 */
export function TabbarItem({
  item,
  currentIdx,
  idx,
  length,
  onPressTabBtn = () => { },
  badge = 0,
  icon,
}: ItemTabbarProps) {
  const checkLength = (lengthList: number) => {
    switch (lengthList) {
      case 1:
        return width;
      case 2:
        return width / 2;
      default:
        return width / 2;
    }
  };

  const getTabLabel = () => {
    const params = item.params || {};
    return params.tabBarLabel || params.title || item.name;
  }

  return (
    <TouchableOpacity
      onPress={onPressTabBtn}
      key={item.key}
      style={[
        TabbarItemStyle.commonTab,
        currentIdx == idx
          ? TabbarItemStyle.btnTabActive
          : TabbarItemStyle.btnTab,
        !!icon
          ? { width: checkLength(length) }
          : (length < 3
            ? { width: width / length }
            : { width: width / 3 }
          ),
      ]}
    >
      <View
        style={[
          TabbarItemStyle.tabContent,
          idx === currentIdx - 1 || currentIdx === idx || idx === length - 1
            ? TabbarItemStyle.activeBorderTab
            : TabbarItemStyle.borderTab,
          CommonStyles.height100,
        ]}
      >
        <View>
          {!!icon ? (
            <Image
              style={TabbarItemStyle.icon}
              resizeMode="contain"
              source={{ uri: icon }}
            />
          ) : (
              <Text
                style={[
                  currentIdx == idx
                    ? TabbarItemStyle.btnTxtActive
                    : TabbarItemStyle.btnTxt,
                ]}
              >
                <Text style={CommonStyles.bold12}>{getTabLabel()}</Text>
              </Text>
            )}
        </View>
        {Number(badge) && Number(badge) > 0 ? (
          <View style={TabbarItemStyle.countNoti}>
            <Text style={TabbarItemStyle.txtCountNoti}>
              {badge < 99 ? badge : '+99'}
            </Text>
          </View>
        ) : (!Number(badge) && checkEmptyString(badge)) ||
          Number(badge) <= 0 ? (
              <View />
            ) : (
              <View style={TabbarItemStyle.countNoti2}>
                <Text style={TabbarItemStyle.txtCountNoti}>{badge}</Text>
              </View>
            )}
      </View>
    </TouchableOpacity >
  );
}
