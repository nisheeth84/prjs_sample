import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SceneMap, TabView } from "react-native-tab-view";
import { messages } from "./business-list-card/business-card-messages";
import { translate } from "../../config/i18n";
import { tabsStyle } from "./business-list-card/business-card-style";

export const BusinessCardTabs = () => {
  const [selected, setSelected] = useState(0);
  const [routes] = useState([
    { key: "first", title: translate(messages.basicInfo), count: 1 },
    { key: "second", title: translate(messages.history), count: 2 },
    { key: "third", title: translate(messages.tradingProduct), count: 1 },
    { key: "four", title: translate(messages.calendar), count: 1 },
    { key: "five", title: translate(messages.email), count: 2 },
    { key: "six", title: translate(messages.changeHistory), count: 1 },
  ]);
  /**
   * render content tab with key
   */
  const renderScene = SceneMap({
    first: () => (
      <View>
        <Text>man hinh 1</Text>
      </View>
    ),
    second: () => (
      <View>
        <Text>man hinh 1</Text>
      </View>
    ),
    third: () => (
      <View>
        <Text>man hinh 1</Text>
      </View>
    ),
    four: () => (
      <View>
        <Text>man hinh 1</Text>
      </View>
    ),
    five: () => (
      <View>
        <Text>man hinh 1</Text>
      </View>
    ),
    six: () => (
      <View>
        <Text>man hinh 1</Text>
      </View>
    ),
  });

  /**
   * function handle change tab
   * @param propsTab
   * @param itemTab
   */
  const onPressTabBtn = (propsTab: any, itemTab: any) => () => {
    propsTab.jumpTo(itemTab.key);
  };

  /**
   * render item tab bar
   * @param param0
   * @param propsTab
   */
  const renderItem = ({ item, index }: any, propsTab: any) => {
    return (
      <TouchableOpacity
        key={index}
        style={selected === index ? tabsStyle.btnTabActive : tabsStyle.btnTab}
        onPress={onPressTabBtn(propsTab, item)}
      >
        <Text
          style={selected === index ? tabsStyle.btnTxtActive : tabsStyle.btnTxt}
        >
          {item.title}
        </Text>
        <View style={tabsStyle.countNoti}>
          <Text style={tabsStyle.txtCountNoti}>{item.count}</Text>
        </View>
        <View style={tabsStyle.lineGray} />
      </TouchableOpacity>
    );
  };

  /**
   * render list tab bar
   * @param propsTab
   */
  const renderTabBar = (propsTab: any) => {
    return (
      <FlatList
        style={tabsStyle.btnTabWrap}
        data={routes}
        horizontal
        keyExtractor={(item) => item.key}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }: any) =>
          renderItem({ item, index }, propsTab)
        }
      />
    );
  };

  return (
    <SafeAreaView style={tabsStyle.container}>
      <ScrollView scrollEnabled={false}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index: selected, routes }}
          renderScene={renderScene}
          onIndexChange={setSelected}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
