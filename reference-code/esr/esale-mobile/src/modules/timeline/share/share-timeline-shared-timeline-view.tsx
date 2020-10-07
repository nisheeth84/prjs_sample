import React from "react";
import { Image, Text, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { shareStyles } from "./share-timeline-styles";

interface SharedTimelineProps {
  // timeline shared info
  dataShare?: any;
}

/**
 * Component share timeline
 * @param param0
 */
export const SharedTimeline: React.FC<SharedTimelineProps> = ({
  dataShare,
}) => {
  return (
    <View style={shareStyles.shareView}>
      <View style={shareStyles.itemShareViewLeft}>
        <Icon name="share" />
        <View style={shareStyles.lineVerticalView} />
      </View>
      <View style={shareStyles.contentShareView}>
        <View style={shareStyles.boxEmployeeInfo}>
          <Image
            style={shareStyles.avatar}
            source={{
              uri: dataShare.createdUser.createdUserImage,
            }}
          />
          <Text style={shareStyles.txtBlue}>
            {dataShare.createdUser.createdUserName}
          </Text>
        </View>
        <Text numberOfLines={3}>{dataShare.comment}</Text>
      </View>
    </View>
  );
};
