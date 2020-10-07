import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import _ from "lodash";
import { translate } from "../../../../config/i18n";
import { theme } from "../../../../config/constants";
import { messages } from "./create-shared-list-messages";
import { messages as responseMessage } from "../../../messages/response-messages";
import { messages as commonMessage } from "../../../messages/common-messages";
import { Header } from "../../header";
import { CreateShareListStyles } from "./styles";
import {
  KeySearch,
  TypeSelectSuggest,
  TypeMessage,
  PlatformOS,
} from "../../../../config/constants/enum";
import { EmployeeDTO } from "../../suggestions/interface/employee-suggest-interface";
import { CommonMessage } from "../../message/message";
import { EmployeeSuggestView } from "../../suggestions/employee/employee-suggest-view";
import { CommonStyles, CommonModalStyles } from "../../../common-style";
import { ModalCancel } from "../../modal-cancel";

interface ShareListProps {
  titleScreen: string;
  buttonName: string;
  inputTitle: string;
  inputHolder: string;
  onTopRightPress?: Function;
  listName?: string;
  contentMessage?: string;
  isShowMessage?: boolean;
  typeMessage?: string;
  suggestionsChoice: any;
  onTextChange: Function;
  isChangeToShareList?: boolean;
  checkShowModalConfirmClose?: Function;
}

/**
 * Component show create share list business card screen
 */
export function CreateShareListScreen({
  titleScreen,
  buttonName,
  inputTitle,
  inputHolder,
  onTopRightPress = () => { },
  listName = "",
  contentMessage = "",
  isShowMessage = false,
  typeMessage = TypeMessage.INFO,
  suggestionsChoice,
  onTextChange = () => { },
  isChangeToShareList = false,
  checkShowModalConfirmClose = () => { }
}: ShareListProps) {
  const [valueSelected, setValueSelected] = useState<EmployeeDTO[]>([]);
  const navigation = useNavigation();
  const [isShowDirtyCheck, setShowDirtyCheck] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == PlatformOS.IOS ? "padding" : undefined}
      style={CreateShareListStyles.container}
    >
      <Header
        title={titleScreen}
        nameButton={buttonName}
        onLeftPress={() => {
          checkShowModalConfirmClose(valueSelected)
            ? setShowDirtyCheck(true)
            : navigation.goBack()
        }}
        onRightPress={() => {
          onTopRightPress(valueSelected);
        }}
        textBold
        leftIconStyle={CommonStyles.headerIconLeft}
      />
      <ScrollView>
        {isShowMessage && (
          <View style={CreateShareListStyles.warning}>
            <CommonMessage content={contentMessage} type={typeMessage} />
          </View>
        )}
        <View style={[CreateShareListStyles.viewFragment]}>
          {!isChangeToShareList && <View style={CreateShareListStyles.view}>
            <View style={CreateShareListStyles.directionRow}>
              <Text style={CreateShareListStyles.txt}>{inputTitle}</Text>
              <View style={CreateShareListStyles.required}>
                <Text style={CreateShareListStyles.txtRequired}>
                  {translate(messages.required)}
                </Text>
              </View>
            </View>
            <View style={CreateShareListStyles.padding} />
            <TextInput
              style={CreateShareListStyles.input}
              placeholder={inputHolder}
              onChangeText={(text) => onTextChange(text)}
              value={listName}
              placeholderTextColor={theme.colors.gray}
            />
          </View>}
          <View style={CreateShareListStyles.body}>
            <View style={CreateShareListStyles.directionRow}>
              <Text style={CreateShareListStyles.txt}>
                {translate(messages.listParticipants)}
              </Text>
              <View style={CreateShareListStyles.required}>
                <Text style={CreateShareListStyles.txtRequired}>
                  {translate(messages.required)}
                </Text>
              </View>
            </View>
            <EmployeeSuggestView
              suggestionsChoice={suggestionsChoice}
              typeSearch={TypeSelectSuggest.MULTI}
              groupSearch={KeySearch.EMPLOYEE}
              withAuthorization
              fieldLabel={translate(messages.participant)}
              invisibleLabel
              updateStateElement={setValueSelected}
            />
          </View>
        </View>
      </ScrollView>
      <ModalCancel
        visible={isShowDirtyCheck}
        titleModal={translate(commonMessage.confirmBack)}
        textBtnRight={translate(commonMessage.ok)}
        textBtnLeft={translate(commonMessage.cancel)}
        btnBlue
        onPress={() => navigation.goBack()}
        closeModal={() => setShowDirtyCheck(false)}
        contentModal={translate(responseMessage.WAR_COM_0005)}
        containerStyle={CommonModalStyles.boxConfirm}
        textStyle={CommonModalStyles.txtContent}
      />
    </KeyboardAvoidingView>
  );
}
