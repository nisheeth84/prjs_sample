import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import Modal from "react-native-modalbox";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { InputWithIcon } from "../../../shared/components/search-input-with-icon/search-input";
import { Item } from "../../../shared/components/timeline/timeline-item-screen";
import { TimelineListStyle } from "./timeline-list-styles";
import { theme } from "../../../config/constants";
import { messages } from "../timeline-messages";
import { translate } from "../../../config/i18n";

import { PersonReactionListScreen } from "../person-reaction-list/person-reaction-list-screen";

import { ModalBoxStyles } from "../../../shared/common-style";

import { TopTabbar } from "../../../shared/components/toptabbar/top-tabbar";
import { DUMMY_REACTION } from "../person-reaction-list/person-reaction-list-dummy-data";
import { TIMELINE_ARRAY } from "../../../shared/components/timeline/timeline-item-dummy";
import { TEXT_EMPTY } from "../../../config/constants/constants";
/**
 * Component for show list of products
 * @param props
 */

const Tab = createMaterialTopTabNavigator();

export interface TimelineSearchBar {
  searchValue?: string;
}

/**
 * Component for timeline search bar
 * @param props
 */

export function TimelineContentScreen() {
  const [content, setContent] = React.useState("");
  const navigation = useNavigation();

  let modalListReaction: any;

  const listReaction = DUMMY_REACTION.reactions;
  const [currentTimelineId, setCurrentTimelineId] = useState(1);

  /**
   * get list reaction icon
   */
  const getListReactionIcon = () => {
    let list: Array<any> = [];
    list = listReaction.map((value, index) => {
      switch (index % 3) {
        case 0:
          return "https://cdn4.iconfinder.com/data/icons/reaction/32/happy-512.png";
        case 1:
          return "https://cdn4.iconfinder.com/data/icons/reaction/32/sad-512.png";
        case 2:
          return "https://cdn4.iconfinder.com/data/icons/reaction/32/angry-512.png";
        default:
          return "";
      }
      // return value.reactionType.toString();
    });
    return list;
  };

  /**
   * render tab screen
   */

  const renderTabScreen = () => {
    const listIcon = getListReactionIcon();
    return listIcon.map((value, key) => {
      return (
        <Tab.Screen
          key={key}
          name={`${value}_${key}`}
          component={PersonReactionListScreen}
          initialParams={{ index: key, timelineId: currentTimelineId }}
        />
      );
    });
  };

  /**
   * open person reaction list
   */

  const openPersonReactionList = (timelineId: number) => {
    setCurrentTimelineId(timelineId);
    modalListReaction.open();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={TimelineListStyle.safe}
    >
      <SafeAreaView style={TimelineListStyle.safe}>
        <InputWithIcon sorting filter file />
        <ScrollView>
          {TIMELINE_ARRAY.map((item, key) => (
            <Item
              key={key}
              data={item}
              onPressModalDetail={() =>
                navigation.navigate("modal-detail-timeline")}
              onPressListReaction={() =>
                openPersonReactionList(currentTimelineId)}
            />
          ))}
          {/* <Item
            onPressListReaction={() =>
              openPersonReactionList(currentTimelineId)}
          /> */}
        </ScrollView>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("share-timeline", {
              title: translate(messages.titleCreatTimeline),
            })}
          style={TimelineListStyle.btnFloat}
        >
          <Image
            source={require("../../../../assets/icons/iconFloat.png")}
            style={TimelineListStyle.btnFloatIcon}
            resizeMethod="resize"
          />
        </TouchableOpacity>
        <View style={TimelineListStyle.create}>
          <Text style={TimelineListStyle.txtCreate}>
            {translate(messages.destination)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("share-timeline", {
                title: translate(messages.titleCreatTimeline),
              })}
          >
            <Image
              resizeMode="contain"
              source={require("../../../../assets/icons/detail.png")}
            />
          </TouchableOpacity>
        </View>
        <View style={TimelineListStyle.create}>
          <TextInput
            placeholder={translate(messages.placeholderCreateTimeline)}
            placeholderTextColor={theme.colors.gray}
            value={content}
            onChangeText={(txt) => setContent(txt)}
            style={TimelineListStyle.inputCreate}
          />

          <TouchableOpacity
            onPress={() => setContent(TEXT_EMPTY)}
            style={
              content
                ? TimelineListStyle.createTimelineIn
                : TimelineListStyle.createTimeline
            }
          >
            <Text
              style={
                content
                  ? TimelineListStyle.txtCreateTimelineIn
                  : TimelineListStyle.txtCreateTimeline
              }
            >
              {translate(messages.buttonCreateTimeline)}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          style={[ModalBoxStyles.modal, ModalBoxStyles.modal4]}
          position="bottom"
          ref={(ref) => {
            modalListReaction = ref;
          }}
          swipeArea={20}
        >
          <View style={TimelineListStyle.reactionListModal}>
            <Tab.Navigator
              lazy
              tabBar={(props) => (
                <TopTabbar
                  count={[]}
                  {...props}
                  arrIcon={getListReactionIcon()}
                />
              )}
            >
              {renderTabScreen()}
            </Tab.Navigator>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
