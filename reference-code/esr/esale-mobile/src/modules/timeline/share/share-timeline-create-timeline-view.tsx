import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { shareStyles } from "./share-timeline-styles";

interface CreateTimelineViewProps {
  // choose file form AVD
  onPickDocument?: () => void;
  // check disable button create
  isDisableButtonCreate?: boolean;
  // title button
  titleButtonCreate?: string;
  // on create function
  onCreate?: () => void;
}

/**
 * Component show create timeline view
 * @param param0 
 */

export const CreateTimelineView: React.FC<CreateTimelineViewProps> = ({
  onPickDocument,
  onCreate,
  isDisableButtonCreate,
  titleButtonCreate,
}) => {
  return (
    <View style={shareStyles.boxSend}>
      <View style={shareStyles.boxIcon}>
        <TouchableOpacity onPress={onPickDocument}>
          <Icon style={shareStyles.icon} name="uploadFile" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon style={shareStyles.icon} name="formatText" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={onCreate}
        disabled={!isDisableButtonCreate}
        style={
          isDisableButtonCreate
            ? shareStyles.btnComplete
            : shareStyles.btnInComplete
        }
      >
        <Text
          style={
            isDisableButtonCreate ? shareStyles.txtWhite : shareStyles.txtGray12
          }
        >
          {titleButtonCreate}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
