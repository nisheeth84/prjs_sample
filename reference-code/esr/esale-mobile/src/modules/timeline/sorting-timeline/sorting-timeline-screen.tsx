import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppbarCommon } from "../../../shared/components/appbar/appbar-common";
import { messages } from "../../../shared/components/search-input-with-icon/search-input-messages";
import { translate } from "../../../config/i18n";
import { SortingStyles } from "./sorting-timeline-style";
import { Icon } from "../../../shared/components/icon";
import { timelineActions } from "../timeline-reducer";
import {
  updateSortOptionsSelector,
} from "../timeline-selector";
// import { queryGetUserTimelines } from "../timeline-query";

export interface EmojiProps {
  emoji?: any;
  emojiPopular?: any;
}

export function SortingTimeline() {
  const [ordinal, setOrdinal] = useState(1);
  // const [sort, setSort] = useState("");
  const dispatch = useDispatch();
  const updateSortOptions = useSelector(updateSortOptionsSelector);

  useEffect(() => {
    setOrdinal(updateSortOptions == "createdDate" ? 1 : 2);
  }, [updateSortOptions])


  const onOrdinal = async (key: any) => {
    if (key === 1) {
      // setSort("createdDate");
      dispatch(timelineActions.updateSortOptions("createdDate"));
    } else {
      // setSort("changedDate");
      dispatch(timelineActions.updateSortOptions("changedDate"));
    }
    // call api get User TimeLine
    // const params = {
    //   listType: 1,
    //   limit: 10,
    //   offset: 0,
    //   filters: {
    //     filterOptions: [1],
    //     isOnlyUnreadTimeline: false,
    //   },
    //   sort,
    // };
    // const response = await getUserTimelines(params);
    
    // switch (response.status) {
    //   case 200:
    //     dispatch(timelineActions.getUserTimelines(response.data));
    //     break;
    //   default:
    //     break;
    // }
    // dispatch(timelineActions.getUserTimelines(dataGetUserTimelinesDummy));
    setOrdinal(key);
  };

  return (
    <SafeAreaView style={SortingStyles.safe}>
      <AppbarCommon
        title={translate(messages.sortingTitleHeader)}
        styleTitle={SortingStyles.titleHeader}
        containerStyle={SortingStyles.appbarCommonStyle}
        leftIcon="md-close"
        // handleLeftPress={() => navigation.navigate("home")}
      />
      <View style={SortingStyles.container}>
        <Text 
        style={SortingStyles.txtTitle}>
          {translate(messages.sortingTitle)}
        </Text>

        <View style={SortingStyles.option}>
          <TouchableOpacity
            onPress={() => onOrdinal(1)}
            style={
              ordinal === 1 ? SortingStyles.selected : SortingStyles.notSelected
            }
          >
            <Icon
              name={
                ordinal === 1 ? "activeSortAscending" : "inActiveSortAscending"
              }
              style={SortingStyles.icon}
            />
            <Text
              numberOfLines={1}
              style={
                ordinal === 1
                  ? SortingStyles.txtSelected
                  : SortingStyles.txtNotSelected
              }
            >
              {translate(messages.sortingAscending)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onOrdinal(2)}
            style={
              ordinal === 1 ? SortingStyles.notSelected : SortingStyles.selected
            }
          >
            <Icon
              name={
                ordinal === 1
                  ? "inActiveSortDescending"
                  : "activeSortDescending"
              }
              style={SortingStyles.icon}
            />
            <Text
              numberOfLines={1}
              style={
                ordinal === 1
                  ? SortingStyles.txtNotSelected
                  : SortingStyles.txtSelected
              }
            >
              {translate(messages.sortingDescending)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
