/* eslint-disable react/jsx-curly-newline */
import React, { useEffect, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import _ from "lodash";
import { Icon } from "../../../shared/components/icon";
import { styles } from "./timeline-drawer-styles";
import { ItemDrawer } from "./item-drawer";

interface ItemSearchProps {
  dataSearch: any;
  placeholder: string;
  fieldSearch: string;
  fieldId: string;
  fieldNewItem?: string;
  itemArrowRight?: boolean;
  children?: any;
  onPressItem?: (item: any) => void;
  onGetResponseSearch?: (item: any) => void;
}

export const ItemSearchDrawer: React.FC<ItemSearchProps> = ({
  dataSearch,
  fieldSearch,
  fieldId,
  children,
  itemArrowRight,
  fieldNewItem,
  placeholder,
  onPressItem,
  onGetResponseSearch,
}) => {
  const [dataResponse, setDataResponse] = useState([]);
  const [text, setText] = useState("");

  const onSearch = () => {
    const newResponse = dataSearch.filter((eml: any) => {
      if (eml[fieldSearch].toUpperCase().indexOf(text.toUpperCase()) >= 0) {
        return eml;
      }
      return null;
    });
    if (_.isEmpty(text)) {
      setDataResponse([]);
      if (onGetResponseSearch) {
        onGetResponseSearch(dataSearch);
      }
    } else if (onGetResponseSearch) {
      // const newResponse = dataSearch.filter((eml: any) => {
      //   if (eml[fieldSearch].toUpperCase().indexOf(text.toUpperCase()) >= 0) {
      //     return eml;
      //   }
      //   return null;
      // });
      onGetResponseSearch(newResponse);
    } else {
      // const newResponse = dataSearch.filter((eml: any) => {
      //   if (eml[fieldSearch].toUpperCase().indexOf(text.toUpperCase()) >= 0) {
      //     return eml;
      //   }
      //   return null;
      // });
      setDataResponse(newResponse);
    }
  };

  useEffect(() => onSearch(), [text]);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.boxTextInput}>
        <Icon style={styles.iconRight} name="search" />
        <TextInput
          placeholder={placeholder}
          value={text}
          onChangeText={(text) => setText(text)}
          style={styles.textInput}
        />
      </View>
      <FlatList
        style={styles.boxList}
        data={dataResponse}
        keyExtractor={(item) => item[fieldId]}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        renderItem={({ item }) =>
          onPressItem ? (
            <ItemDrawer
              onPress={() => onPressItem(item)}
              title={item[fieldSearch]}
              newItem={fieldNewItem && item[fieldNewItem]}
              arrowRight={itemArrowRight}
            />
          ) : (
            <ItemDrawer
              title={item[fieldSearch]}
              newItem={fieldNewItem && item[fieldNewItem]}
              arrowRight={itemArrowRight}
            />
          )
        }
      />
      {children}
    </View>
  );
};
