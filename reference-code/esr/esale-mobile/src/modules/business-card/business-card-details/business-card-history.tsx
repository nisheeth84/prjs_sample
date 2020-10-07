import React from "react";
import { Text, View } from "react-native";
import { BusinessCardHistoryStyle } from "./business-card-history-style";

const styles = BusinessCardHistoryStyle;

export function BusinessCardHistory() {
  return (
    // <ScrollView style={{ flex: 1, backgroundColor: "red" }}>
    <View style={styles.container}>
      <Text>historyyyyyyyyyyyyyyyyy</Text>
    </View>
    // </ScrollView>
  );
}
