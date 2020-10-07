import React from "react";
import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { AppbarCommon } from "../../shared/components/appbar/appbar-common";
import { styles } from "./portal-style";
import { translate } from "../../config/i18n";
import { messages } from "./portal-messages";
import { EmployeeSelector } from '../menu/menu-personal-settings/menu-settings-selector'


interface ModalPortalParams {
  onClose: (custom : () => void) => void
}

export const ModalPortal = ({
  onClose
} : ModalPortalParams) => {
  const navigation: any = useNavigation();
  const employee = useSelector(EmployeeSelector);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <AppbarCommon
        title={translate(messages.modalTitle)}
        styleTitle={styles.titleHeader}
        containerStyle={styles.appbarCommonStyle}
        leftIcon="close"
        handleLeftPress={() => {
          onClose(() => {
            navigation.dispatch(CommonActions.reset({
              index: 0,
              routes: [{ name: "menu" }]
            }));
          })
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.txtTitle}>{translate(messages.title)}</Text>
          <Text style={styles.txtContent}>
            {translate(messages.modalPortalContent)}
          </Text>
        </View>
        <WebView
          style={styles.video}
          javaScriptEnabled
          source={{
            uri: "https://www.youtube.com/embed/x4PMKb8iXRM?controls=0",
          }}
        />

        {employee.isAdmin ? (
          <>
            <View style={styles.titleSolution}>
              <Text style={styles.txtTitleSolution}>
                {translate(messages.portalInviteMembers)}
              </Text>
            </View>
            <View style={styles.solution}>
              <Image
                source={require("../../../assets/invite.png")}
                style={styles.imgSolution}
                resizeMode="contain"
              />
              <Text style={styles.txtContentSolution}>
                {translate(messages.portalInviteMembersContent)}
              </Text>
              <TouchableOpacity style={styles.btnSolution}>
                <Text style={styles.txtBtnSolution}>
                  {translate(messages.portalInviteEmployees)}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        <View style={styles.titleSolution}>
          <Text style={styles.txtTitleSolution}>
            {translate(messages.modalTitleSolution)}
          </Text>
        </View>
        <View style={styles.solution}>
          <Image
            source={require("../../../assets/solution.png")}
            style={styles.imgSolution}
          />
          <Text style={styles.txtContentSolution}>
            {translate(messages.modalContentSolution)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.e-sales-ms.jp/reason/cost/")
            }
            style={styles.btnSolution}
          >
            <Text style={styles.txtBtnSolution}>
              {translate(messages.modalBtnContent)}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
