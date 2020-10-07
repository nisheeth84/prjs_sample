import React, { useEffect } from "react";
import { View, Dimensions, FlatList } from "react-native";
import { TabbarItem } from "./tabbar-item";
import { TabbarContainerStyle } from "./styles";

/**
 * Tab bar props
 */
interface TopBarProps {
  // default state of tab navigator
  state: any;
  // navigation get from tab navigator
  navigation: any;
  // array of badge on tab
  count: Array<any>;
  // array of icon
  arrIcon?: Array<string>;
}

const device_width = Dimensions.get("window").width;

/**
 * render top tabbar
 * @param param0
 */
export function TopTabbar({ state, navigation, count, arrIcon }: TopBarProps) {
  let flatRef: any;
  useEffect(() => {
    if (flatRef) {
      if (state.index == 0) {
        flatRef.scrollToIndex({
          animate: true,
          index: state.index
        });
      } else {
        flatRef.scrollToIndex({
          animate: true,
          index: state.index,
          viewOffset: 0.5,
          viewPosition: 0.5
        });
      }
    }
  }, [state.index]);

  /**
   *
   * @param isFocused handle press tabbar
   * @param navigation
   * @param route
   */
  const onPressTabBtn = (
    isFocused: boolean,
    navigation: any,
    route: any
  ) => () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <View style={TabbarContainerStyle.btnTabWrap}>
      <FlatList
        getItemLayout={(_data, index) => ({
          length: (arrIcon || []).length >= 2 ? device_width / 2 : device_width / 3,
          offset: (arrIcon || []).length >= 2 ? (device_width / 2) * index : (device_width / 3) * index,
          index,
        })}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={state.routes}
        renderItem={({ item, index }) => (
          <TabbarItem
            badge={count[index]}
            item={item}
            currentIdx={state.index}
            idx={index}
            length={state.routes.length}
            onPressTabBtn={onPressTabBtn(
              state.index == index,
              navigation,
              item
            )}
            icon={arrIcon ? arrIcon[index] : ""}
          />
        )}
        ref={(ref) => (flatRef = ref)}
        keyExtractor={(item: any) => item.key}
      />
    </View>
  );
}
