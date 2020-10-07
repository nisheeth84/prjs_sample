import React from "react";
import { Text, View } from "react-native";
import { EmptyStyle } from "./styles";
import { Icon } from "../icon";
import { SvgCssUri } from "react-native-svg";
import { apiUrl } from "../../../config/constants/api";

interface ListEmptyComponentProps {
  content?: string;
  icon?: string
}

export const ListEmptyComponent: React.FC<ListEmptyComponentProps> = ({
  content = "Empty",
  icon
}) => {
  return (
    <View style={EmptyStyle.container}>
      {/* TODO pass icon service to this  */}
      {!!icon ?
        <View style={EmptyStyle.imageSVG}>
          <SvgCssUri
            uri={`${apiUrl}${icon}`}
            width="100%"
            height="100%"
          />
        </View>
        : <Icon name={"employees"} style={EmptyStyle.image} />
      }
      <Text style={EmptyStyle.txt}>{content}</Text>
    </View>
  );
};
