import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { shareStyles } from "./share-timeline-styles";

interface ItemUploadFileProps {
  // remove file
  onRemoveDocument?: () => void;
  // fileInfo
  itemFile?: any;
}

/**
 * Component show item upload file
 * @param param0
 */

export const ItemUploadFile: React.FC<ItemUploadFileProps> = ({
  itemFile,
  onRemoveDocument,
}) => {
  return (
    <TouchableOpacity style={shareStyles.boxShareFile}>
      <View style={shareStyles.boxEmployeeInfo}>
        <Icon style={shareStyles.iconFile} name="file" />
        <Text>{itemFile.name}</Text>
      </View>
      <TouchableOpacity onPress={onRemoveDocument}>
        <Icon style={shareStyles.iconFile} name="close" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
