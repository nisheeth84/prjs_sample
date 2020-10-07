import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Text, TextInput, View } from "react-native";
import { BusinessCardStyle } from "./business-card-displacement-style";
import { Header } from "../../../shared/components/header";
import { messages } from "./business-card-displacement-messages";
import { translate } from "../../../config/i18n";

const styles = BusinessCardStyle;

export function BusinessCardDisplacement() {
  const navigation = useNavigation();

  /**
   * GO BACK TO LIST
   */
  const goList = () => {
    navigation.navigate("business-card");
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={translate(messages.title)}
        nameButton={translate(messages.btn)}
        onLeftPress={() => {
          navigation.goBack();
        }}
        onRightPress={goList}
      />
      <View style={styles.body}>
        <Text style={styles.text}>{translate(messages.displacement)}</Text>
        <View style={styles.textInput}>
          <TextInput
            style={styles.input}
            placeholder={translate(messages.placeholder)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
