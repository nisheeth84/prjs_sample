import React from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { AppbarCommon } from "../../shared/components/appbar/appbar-common";
import { styles } from "./portal-style";
import { messages } from "./portal-messages";
import { translate } from "../../config/i18n";
import {
  getStatusContract
} from '../login/authorization/authorization-repository';

interface FirstLoginParams {
  onClose: (custom? : () => void) => void
}

export const FirstLogin = ({
  onClose
} : FirstLoginParams) => {
  const navigation = useNavigation();

  const onNext = async () => {
    const getContractResult = await getStatusContract()
    if (getContractResult && getContractResult.status === 200) {
      const data = getContractResult.data;
      if (data.dayRemainTrial === null) {
        navigation.navigate("modal-portal")
      } else {
        navigation.navigate("proceed-portal")
      }
    } else {
      // TODO: display error message
    }
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <AppbarCommon
        title={translate(messages.modalTitle)}
        styleTitle={styles.titleHeader}
        containerStyle={styles.appbarCommonStyle}
        onPress={() => { onNext() }}
        buttonText={translate(messages.portalFirstNext)}
        leftIcon="close"
        handleLeftPress={() => { onClose() }}
        buttonType="complete"
      />
      <ScrollView scrollEnabled={false} style={styles.container}>
        <View>
          <View style={styles.content}>
            <Text style={styles.txtTitle}>{translate(messages.portalFirst)}</Text>
            <Text style={styles.txtContent}>
              {translate(messages.portalFirstIntroduce)}
            </Text>
            <Text style={styles.txtContent2}>
              {translate(messages.portalSecondIntroduce)}
            </Text>
          </View>
          <View style={styles.videoContainer}>
            <WebView
              style={styles.video}
              javaScriptEnabled
              source={{
                uri: "https://www.youtube.com/embed/x4PMKb8iXRM?controls=0",
              }}
            />
          </View>
        </View>
        <View style={styles.img}>
          <Image
            resizeMode="contain"
            source={require("../../../assets/logoESM.png")}
            style={styles.imgLogo}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
