import React from "react";
import {
  Image,
  Linking,
  // SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppbarCommon } from "../../shared/components/appbar/appbar-common";
import { stylesProceed as styles, styles as styles1 } from "./portal-style";
import { messages } from "./portal-messages";
import { translate } from "../../config/i18n";
import { ButtonColorHighlight } from "../../shared/components/button/button-color-highlight";
import {
  EnumButtonStatus,
  EnumButtonType,
  proceedOne,
} from "../../config/constants/enum";

export const ProceedPortal = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safe}>
      <AppbarCommon
        title={translate(messages.modalTitle)}
        styleTitle={styles.appBar}
        containerStyle={styles1.appbarCommonStyle}
        onPress={() => navigation.navigate("start-portal")}
        buttonText={translate(messages.portalFirstNext)}
        buttonType="complete"
        leftIcon="backArrow"
      />
      <ScrollView style={[styles.container]}>
        <View style={styles.topContent}>
          <Text style={styles.topContentTitle}>
            {translate(messages.proceedTitle)}
          </Text>
          <Text style={styles.topContentTxt}>
            {translate(messages.proceedContent)}
          </Text>
        </View>

        <View style={styles.formRegister}>
          <Text style={styles.titleNumber}>
            {translate(messages.proceedOne)}
          </Text>
          <Text style={styles.titleRegister}>
            {translate(messages.proceedRegisterTitle)}
          </Text>
          <Text style={styles.txtRegister}>
            {translate(messages.proceedRegisterContent)}
          </Text>
          <Image
            source={require("../../../assets/cv.png")}
            style={styles.imgRegister}
            resizeMode="contain"
          />
        </View>

        <View style={styles.experience}>
          <Text style={styles.titleNumber}>
            {translate(messages.proceedTow)}
          </Text>
          <Text style={styles.titleRegister}>
            {translate(messages.proceedExperienceTitle)}
          </Text>
          <Text style={styles.txtRegister}>
            {translate(messages.proceedExperienceContent)}
          </Text>

          <ButtonColorHighlight
            title={translate(messages.proceedExperienceBtn)}
            status={EnumButtonStatus.normal}
            type={EnumButtonType.large}
            onPress={() =>
              Linking.openURL("https://www.e-sales-ms.jp/reason/cost/")
            }
            containerStyle={styles.btnExperience}
          />
        </View>

        <View style={styles.up}>
          <Text style={styles.titleNumber}>
            {translate(messages.proceedThree)}
          </Text>
          <Text style={styles.txtUp}>
            {translate(messages.proceedUpContent)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
