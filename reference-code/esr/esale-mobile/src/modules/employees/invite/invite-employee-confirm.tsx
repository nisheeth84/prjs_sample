import React from "react";
import { SafeAreaView, Text, View, FlatList, ScrollView, Linking } from "react-native";
import { AppbarCommon } from "../../../shared/components/appbar/appbar-common";
import { InviteEmployeeConfirmStyles } from "./invite-employee-styles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { translate } from "../../../config/i18n";
import { messages } from "./invite-employee-messages";
import { inviteEmployeeConst } from "./invite-employee-constants";
import { ButtonVariant } from "../../../../src/types";
import { Member } from "./invite-employee-interfaces";
import { CommonMessage } from "../../../shared/components/message/message";
import { TypeMessage } from "../../../config/constants/enum";
import { filterEmployee } from "../../../shared/utils/common-api";
import { useSelector, useDispatch } from "react-redux";
import { filterSelector, conditionSelector } from "../list/employee-list-selector";

/**
 * Screen Comfirm invite employee
 */
export const InviteEmployeeConfirm = () => {
  const navigation = useNavigation();
  // Define value params
  type RootStackParamList = {
    valueListMember: Member[];
  };
  const dispatch = useDispatch();
  const conditonEmployeeSelector = useSelector(conditionSelector);
  // get employee filter from redux
  const employeesFilter = useSelector(filterSelector);
  type ProfileScreenRouteProp = RouteProp<RootStackParamList, "valueListMember">;
  const route = useRoute<ProfileScreenRouteProp>();
  // Get data from screen invite-employee
  const listMembers: Member[] = route.params;
  /**
   * handle event click button confirm
   */
  const handleConfirm = () => {
    filterEmployee(conditonEmployeeSelector.selectedTargetType,
      conditonEmployeeSelector.selectedTargetId,
      conditonEmployeeSelector.isUpdateListView,
      conditonEmployeeSelector.searchConditions,
      conditonEmployeeSelector.filterConditions,
      conditonEmployeeSelector.localSearchKeyword,
      conditonEmployeeSelector.orderBy,
      dispatch,
      {
        offset: 0,
        limit: employeesFilter.limit,
        filterType: employeesFilter.filterType
      }
    );
    navigation.navigate("employee-list");
  }
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={InviteEmployeeConfirmStyles.container}>
          <AppbarCommon
            title={translate(messages.inviteEmployeeTitle)}
            buttonText={translate(messages.inviteEmployeeButtonFinish)}
            buttonType={inviteEmployeeConst.buttonType as ButtonVariant}
            handleLeftPress={() => {
              navigation.navigate("employee-list");
            }}
            onPress={handleConfirm}
            leftIcon="close"
          />
          <View style={InviteEmployeeConfirmStyles.wrapAlert}>
            <CommonMessage content={translate(messages.inviteEmployeeMessageSuccessRessponse)}
              type={TypeMessage.INFO} button={!!listMembers.find(item => item.sentEmailError === true)} buttomName={translate(messages.inviteEmployeeButtonHelp)}
              onPress={() => Linking.openURL(inviteEmployeeConst.inviteUrlHelp)}
            />
          </View>
          <View style={InviteEmployeeConfirmStyles.divideTop} />
          <Text style={InviteEmployeeConfirmStyles.titleText}>
            {translate(messages.inviteSentMember)}
          </Text>
          <View style={InviteEmployeeConfirmStyles.divideTop} />
          <FlatList
            data={listMembers}
            renderItem={({ item: member, index }) => (
              <View >
                <Text style={InviteEmployeeConfirmStyles.labelText}>{member.memberName}</Text>
                <Text style={InviteEmployeeConfirmStyles.inputName}>{member.emailAddress}</Text>
                <View style={(index === listMembers.length - 1) ?
                  InviteEmployeeConfirmStyles.divideVisible : InviteEmployeeConfirmStyles.divide} />
              </View>
            )}
            keyExtractor={item => item.emailAddress}
          >
          </FlatList>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
