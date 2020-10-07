import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { theme } from "../../config/constants";
import { Icon } from "../../shared/components/icon";
import { getWidth, getHeight } from "../calendar/common";

interface AppBarBack {
  title: string
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.space[4],
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    elevation: 1,
  },
  leftElement: {
    flex: 1,
  },
  centerElement: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  rightElement: {
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  buttonStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: theme.borderRadius,
  },
  buttonBackStyle: {
    width: getWidth(20),
    height: getHeight(20),
    resizeMode: "contain",
  },
});

export function AppBarBack({
  title
}: AppBarBack) {
  const navigation = useNavigation();
  const onHandleBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={{width: '10%'}}>
        <TouchableOpacity onPress={onHandleBack}>
          <Icon name="arrowLeft" style={styles.buttonBackStyle} />
        </TouchableOpacity>
      </View>
      <View style={{width: '85%', paddingLeft: '25%'}}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}
