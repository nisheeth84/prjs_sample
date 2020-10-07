import React, { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { TimelineListGroupModalStyles } from "./timeline-list-group-style";
import {
  SuggestionTimelineGroupNameDataDataResponse,
  // SuggestionTimelineGroupNameResponse,
  suggestTimelineGroupName,
} from "../timeline-repository";
// import { querySuggestionTimelineGroupName } from "../timeline-query";
import { timelineActions } from "../timeline-reducer";
// import { dataSuggestionTimelineGroupNameDataDummy } from "./timeline-list-group-data-dummy";
import { dataSuggestTimelineGroupNameSelector } from "../timeline-selector";

const styles = TimelineListGroupModalStyles;

interface TimelineListGroupModalInterface {
  /**
   * visible
   */
  visible: boolean;
  /**
   * text search
   */
  txtSearch: string;
  /**
   * toggle search
   */
  onPressSuggestion: (
    item: SuggestionTimelineGroupNameDataDataResponse
  ) => void;
}

/**
 * Compnent show Timeline List Group Modal Suggestion
 * @param param0
 */

export const TimelineListGroupModalSuggestion = ({
  visible,
  txtSearch,
  onPressSuggestion = () => {},
}: TimelineListGroupModalInterface) => {
  const dispatch = useDispatch();
  const data = useSelector(dataSuggestTimelineGroupNameSelector);
  // let timeout = 1;

  /**
   * handle error suggestTimelineGroupName
   * @param response
   */

  // const handleErrorSuggestTimelineGroupName = (
  //   response: SuggestionTimelineGroupNameResponse
  // ) => {
  //   switch (response.status) {
  //     case 200:
  //       dispatch(timelineActions.suggestTimelineGroupName());
  //       break;
  //     default:
  //       break;
  //   }
  // };

  /**
   * call api suggestTimelineGroupName
   */

  const suggestTimelineGroupNameFunc = async () => {
    const params = {
      timelineGroupName: txtSearch,
    };
    const dataSuggest = await suggestTimelineGroupName(params);
    if (dataSuggest) {
      dispatch(timelineActions.suggestTimelineGroupName(dataSuggest.data));
      // handleErrorSuggestTimelineGroupName(data);
    }
  };
  /**
   * call api
   */
  useEffect(() => {
    // if (timeout) clearTimeout(timeout);
    // timeout = setTimeout(() => {
    suggestTimelineGroupNameFunc();
    // alert(txtSearch);
    // }, 1000);
  }, [txtSearch]);

  return visible ? (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item: SuggestionTimelineGroupNameDataDataResponse) => {
          return item.timelineGroupId.toString();
        }}
        keyboardShouldPersistTaps="always"
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.btnItem}
              onPress={() => onPressSuggestion(item)}
            >
              <Image source={{ uri: item.imagePath }} style={styles.image} />
              <Text style={styles.txt}>{item.timelineGroupName}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  ) : null;
};
