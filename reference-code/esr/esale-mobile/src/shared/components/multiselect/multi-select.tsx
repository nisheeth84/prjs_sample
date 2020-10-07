import React from "react";
import {
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
} from "react-native";

import { theme } from "../../../config/constants";
import { Icon } from "../icon";

interface MultiSelect {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onPressDelete: () => void;
  isVisible: boolean;
  dataList: Array<any>;
  renderItem: any;
  onTouchStart: () => void;
  onMomentumScrollEnd: () => void;
}
const styles = StyleSheet.create({
  viewInput: {
    width: "100%",
    height: theme.space[12],
    borderRadius: theme.space[4],
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.space[2],
  },
  containerFlatlist: {
    borderRadius: theme.space[4],
    marginTop: theme.space[2],
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    backgroundColor: "white",
  },
  flatlist: {
    flex: 1,
    height: 150,
    marginTop: theme.space[2],
  },
  viewBtnSeach: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: theme.space[2],
  },
  btnAdd: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: 8,
    width: 60,
    justifyContent: "center",
  },
});

export function MultiSelect({
  placeholder,
  value,
  onChangeText,
  onPressDelete,
  isVisible,
  dataList,
  renderItem,
  onTouchStart,
  onMomentumScrollEnd,
}: MultiSelect) {
  return (
    <View>
      <View style={styles.viewInput}>
        <View
          style={{
            flex: 10,
            marginLeft: theme.space[2],
          }}
        >
          <TextInput
            style={{ color: theme.colors.gray }}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
          />
        </View>
        {value !== "" && (
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onPressDelete}>
              <Icon name="delete" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {isVisible && value !== "" && (
        <View style={styles.containerFlatlist}>
          <FlatList
            style={styles.flatlist}
            data={dataList}
            renderItem={renderItem}
            onTouchStart={onTouchStart}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
          <View style={styles.viewBtnSeach}>
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Icon name="search" />
              <Text style={{ marginLeft: 4 }}>検索</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnAdd}>
              <Icon name="plusGray" />
              <Text style={{ marginLeft: 4 }}>検索</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
MultiSelect.defaultProps = {
  value: "",
  isVisible: false,
};
