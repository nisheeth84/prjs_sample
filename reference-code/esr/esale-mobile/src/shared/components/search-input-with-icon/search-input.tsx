import React, { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "../icon";
import { Input } from "../input";
import { theme } from "../../../config/constants";
import { InputWithIconStyle } from "./styles";

export interface InputIconProps {
  iconName?: string;
  placeHolder?: string;
  placeHolderColor?: string;
  searchText?: string;
  file?: boolean;
  filter?: boolean;
  sorting?: boolean;
  onPressSearch?: (value: string) => void;
  handleChangeText?: (value: string) => void;
  hasClear?: boolean;
  clearText?: () => void;
}

export function InputWithIcon({
  iconName = "search",
  placeHolder = "タイムラインを検索",
  placeHolderColor = theme.colors.gray,
  sorting,
  filter,
  file,
  onPressSearch = () => {},
  handleChangeText = () => {},
  hasClear = false,
  clearText = () => {},
  searchText=""
}: InputIconProps) {
  const navigation = useNavigation();
  const [value] = useState("");

  // const handleChangeText = (text: string) => {
  //   setValue(text);
  //   onPressSearch(text);
  // };

  const hanlePressIcon = () => {
    onPressSearch(value);
  };

  return (
    <View style={InputWithIconStyle.container}>
      <View style={InputWithIconStyle.containerInput}>
        <View style={[InputWithIconStyle.inputContainer]}>
          <TouchableOpacity onPress={hanlePressIcon}>
            <Icon name={iconName} style={InputWithIconStyle.searchIcon} />
          </TouchableOpacity>
          <Input
            style={InputWithIconStyle.searchInput}
            placeholder={placeHolder}
            placeholderColor={placeHolderColor}
            value={searchText}
            onChangeText={handleChangeText}
          />
          {hasClear && (
            <TouchableOpacity
              onPress={clearText}
              style={{
                position: "absolute",
                alignSelf: "center",
                right: theme.space[4],
              }}
            >
              <Icon name={"closeCircle"} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {sorting && (
        <TouchableOpacity
          onPress={() => navigation.navigate("sorting-timeline")}
          style={InputWithIconStyle.containerIcon}
        >
          <Image
            source={require("../../../../assets/icons/iconDropdown.png")}
            resizeMethod="resize"
          />
        </TouchableOpacity>
      )}
      {filter && (
        <TouchableOpacity
          onPress={() => navigation.navigate("filter-timeline")}
          style={InputWithIconStyle.containerIcon}
        >
          <Image
            source={require("../../../../assets/icons/iconFilter.png")}
            resizeMethod="resize"
          />
        </TouchableOpacity>
      )}

      {file && (
        <TouchableOpacity
          onPress={() => navigation.navigate("file-timeline")}
          style={InputWithIconStyle.containerIcon}
        >
          <Image
            source={require("../../../../assets/icons/iconListFile.png")}
            resizeMethod="resize"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
