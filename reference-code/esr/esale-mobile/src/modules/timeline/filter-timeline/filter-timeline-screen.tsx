import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../../config/constants";
import { AppbarCommon } from "../../../shared/components/appbar/appbar-common";
import { messages } from "../../../shared/components/search-input-with-icon/search-input-messages";
import { translate } from "../../../config/i18n";
import { FilterScreen } from "./filter-timeline-styles";
import { Icon } from "../../../shared/components/icon";
import { updateTimelineFilters } from "./filter-timeline-repository";
import { FilterTimelineActions } from "./filter-timeline-reducer";
import { timelineActions } from "../timeline-reducer";
// import { updateFilterOptionsSelector } from "../timeline-selector";
// import { employeeIdSelector } from "../../auth/authentication/auth-selector";

export interface EmojiProps {
  emoji?: any;
  emojiPopular?: any;
}

export function FilterTimeline() {
  const [unRead, setUnRead] = useState(true);
  const [activityReport, setActivityReport] = useState(true);
  const [post, setPost] = useState(false);
  const [channelPost, setChannelPost] = useState(false);
  const [client, setClient] = useState(false);
  const [business, setBusiness] = useState(false);
  const [schedule, setSchedule] = useState(false);
  const [milestone, setMilestone] = useState(false);
  const [notification, setNotification] = useState(false);
  const [ruleNotification, setRuleNotification] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [filterOptions, setFilterOptions] = useState<any>([3]);
  // const updateFilterOptions = useSelector(updateFilterOptionsSelector) || [1];
  // const filterTimeline = useSelector(FilterTimelineSelector);

  // useEffect(() => {
  //   const params = {
  //     employeeId: employeeId || 0,
  //     listType: 1,
  //     listId: 1,
  //     filters: {
  //       filterOptions,
  //       isOnlyUnreadTimeline: unRead,
  //     },
  //     sort: "createdDate",
  //     searchValue: "",
  //   };
  //   const response = await getUserTimelines(queryGetUserTimelines(params));

  //   switch (response.status) {
  //     case 200:
  //       dispatch(timelineActions.getUserTimelines(response.data));
  //       break;
  //     default:
  //       break;
  //   }
  // }, [
  //   unRead,
  //   activityReport,
  //   post,
  //   channelPost,
  //   client,
  //   business,
  //   schedule,
  //   milestone,
  //   notification,
  // ]);

  /**
   * update Timeline Filters api
   */
  async function onUpdateTimelineFilters() {
    const params = {
      timelineType: filterOptions,
    };
    const response = await updateTimelineFilters(params, {});
      if (response?.status == 200){
        dispatch(FilterTimelineActions.updateTimelineFilters(response?.data));
        dispatch(timelineActions.updateFilterOptions(params.timelineType));
        navigation.goBack();
    }
    // navigation.goBack();
  }

  useEffect(() => {}, []);

  /**
   *
   * @param type value number checkbox
   * @param isCheck check true / false
   */
  function checkFilterOptions(type: number, isCheck: boolean) {
    const arrFilterOptions = [...filterOptions];
    if (isCheck) {
      arrFilterOptions.push(type);
    } else {
      const index = arrFilterOptions.indexOf(type);
      arrFilterOptions.splice(index, 1);
    }
    setFilterOptions(arrFilterOptions);
  }

  /**
   *
   * @param key function change status checkbox
   */

  const onCheck = (key: any) => {
    switch (key) {
      case "activityReport": {
        setActivityReport(!activityReport);
        checkFilterOptions(3, !activityReport);
        break;
      }
      case "post": {
        setPost(!post);
        checkFilterOptions(1, !post);
        break;
      }
      case "channelPost": {
        setChannelPost(!channelPost);
        checkFilterOptions(2, !channelPost);
        break;
      }
      case "client": {
        setClient(!client);
        checkFilterOptions(4, !client);
        break;
      }
      case "business": {
        setBusiness(!business);
        checkFilterOptions(5, !business);
        break;
      }
      case "schedule": {
        setSchedule(!schedule);
        checkFilterOptions(6, !schedule);
        break;
      }
      case "milestone": {
        setMilestone(!milestone);
        checkFilterOptions(7, !milestone);
        break;
      }
      case "notification": {
        setNotification(!notification);
        checkFilterOptions(9, !notification);
        break;
      }
      case "ruleNotification": {
        setRuleNotification(!ruleNotification);
        checkFilterOptions(10, !ruleNotification);
        break;
      }
      case "all": {
        setActivityReport(true);
        setClient(true);
        setChannelPost(true);
        setBusiness(true);
        setNotification(true);
        setRuleNotification(true);
        setSchedule(true);
        setPost(true);
        setMilestone(true);
        break;
      }
      default: {
        setActivityReport(false);
        setClient(false);
        setChannelPost(false);
        setBusiness(false);
        setNotification(false);
        setRuleNotification(false);
        setSchedule(false);
        setPost(false);
        setMilestone(false);
        break;
      }
    }
  };

  /**
   *
   * @param key render icons for item
   */

  const isCheck = (key: any) => {
    switch (key) {
      case "activityReport": {
        return activityReport;
      }
      case "post": {
        return post;
      }
      case "channelPost": {
        return channelPost;
      }
      case "client": {
        return client;
      }
      case "business": {
        return business;
      }
      case "schedule": {
        return schedule;
      }
      case "milestone": {
        return milestone;
      }
      case "notification": {
        return notification;
      }
      case "ruleNotification": {
        return ruleNotification;
      }
      default: {
        return false;
      }
    }
  };

  /**
   *
   * @param title
   * @param key differential status icons
   */

  function itemCheckBox(title: string, key: any) {
    return (
      <View style={FilterScreen.item}>
        <Text style={FilterScreen.titleItem}>{title}</Text>

        <TouchableOpacity onPress={() => onCheck(key)}>
          <Icon
            name={isCheck(key) ? "filterTrue" : "filterFalse"}
            style={FilterScreen.imgItem}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={FilterScreen.safe}>
      <AppbarCommon
        title={translate(messages.titleFilterSearch)}
        styleTitle={FilterScreen.titleHeader}
        containerStyle={FilterScreen.appbarCommonStyle}
        leftIcon="md-close"
        onPress={() => onUpdateTimelineFilters()}
        buttonText={translate(messages.btnFilterSearch)}
      />
      <ScrollView style={FilterScreen.scroll}>
        <View style={FilterScreen.unread}>
          <Text style={FilterScreen.txtUnread}>
            {translate(messages.filterUnRead)}
          </Text>

          <Switch
            trackColor={{
              false: theme.colors.gray100,
              true: theme.colors.blue200,
            }}
            thumbColor={theme.colors.white}
            onValueChange={setUnRead}
            value={unRead}
          />
        </View>

        <View style={FilterScreen.container}>
          <View style={FilterScreen.options}>
            <View style={FilterScreen.optionsLeft}>
              <TouchableOpacity
                onPress={() => onCheck("all")}
                style={FilterScreen.btnLeft}
              >
                <Text style={FilterScreen.btnTxt}>
                  {translate(messages.filterSelectAll)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={FilterScreen.optionsRight}>
              <TouchableOpacity
                onPress={() => onCheck("del")}
                style={FilterScreen.btnRight}
              >
                <Text style={FilterScreen.btnTxt}>
                  {translate(messages.filterDeselect)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {itemCheckBox(translate(messages.filterActivity), "activityReport")}
          {itemCheckBox(translate(messages.filterPost), "post")}
          {itemCheckBox(translate(messages.filterChannelPost), "channelPost")}
          {itemCheckBox(translate(messages.filterClient), "client")}
          {itemCheckBox(translate(messages.filterBusiness), "business")}
          {itemCheckBox(translate(messages.filterSchedule), "schedule")}
          {itemCheckBox(translate(messages.filterMilestone), "milestone")}
          {itemCheckBox(translate(messages.filterNotification), "notification")}
          {itemCheckBox(
            translate(messages.filterRuleNotification),
            "ruleNotification"
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
