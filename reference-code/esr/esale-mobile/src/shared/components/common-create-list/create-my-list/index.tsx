import React, { useState } from "react";
import { Text, TextInput, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { CreateMyList } from "./styles";
import { Header } from "../../header";
import { translate } from "../../../../config/i18n";
import { messages } from "./create-my-list-messages";
import { TEXT_EMPTY } from "../../../../config/constants/constants";
// import { CommonMessage } from "../../message/message";
import { Icon } from "../../icon";
import { CommonMessage } from "../../message/message";
import { CommonStyles, CommonModalStyles } from "../../../common-style";
import { theme } from "../../../../config/constants";
import { NotificationSettingStyles } from "../../../../modules/menu/menu-personal-settings/menu-personal-settings-styles";
import { PlatformOS } from "../../../../config/constants/enum";
import { messages as responseMessage } from "../../../messages/response-messages";
import { messages as commonMessage } from "../../../messages/common-messages";
import { ModalCancel } from "../../modal-cancel";

const styles = CreateMyList;

interface CreateMyListInterface {
  title: string;
  buttonName: string;
  onPressLeft: () => void;
  onRightPress: (result?: any) => void;
  warningMessage: string;
  placeHolderInput: string;
  inputTitle: string;
  txtSearch: string;
  onChangeText: (text: string) => void;
  typeMessage?: string;
  messagesWarning?: boolean;
  checkShowModalConfirmClose?: Function;
}

/**
 * Component show create my list business card screen
 */
export function CreateMyListScreen({
  title = "",
  buttonName = "",
  onPressLeft = () => { },
  onRightPress,
  warningMessage,
  placeHolderInput,
  inputTitle,
  typeMessage,
  // messagesWarning = false,
  onChangeText,
  txtSearch,
  checkShowModalConfirmClose = () => { }
}: CreateMyListInterface) {
  const [validate, setValidate] = useState(false);
  const [isShowDirtyCheck, setShowDirtyCheck] = useState(false);

  /**
   * handle press right header
   */
  const handlePressRight = () => {
    if(txtSearch===""){
      setValidate(true)
    } else{
      setValidate(false)
      onRightPress();
    }
  };

  /**
   * get content message
   */
  const getMessageWarning = () => {
    if (warningMessage === TEXT_EMPTY) {
      return
    }
    if (!!typeMessage) {
      return (
        <View style={[styles.prViewWarning]}>
          <CommonMessage content={warningMessage} type={typeMessage} />
        </View>
      )
    } else {
      return (
        <View style={styles.viewWarming}>
          <Icon name="warning" />
          <Text style={styles.text}>{warningMessage}</Text>
        </View>
      )
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == PlatformOS.IOS ? "padding" : undefined}
      style={NotificationSettingStyles.container}
    >
      <Header
        title={title}
        nameButton={buttonName}
        onLeftPress={() => {
          checkShowModalConfirmClose()
            ? setShowDirtyCheck(true)
            : onPressLeft()
        }}
        onRightPress={handlePressRight}
        leftIconStyle={CommonStyles.headerIconLeft}
        textBold
      />
      <ScrollView>
        {getMessageWarning()}
        <View style={[styles.viewFragment]}>
          <View style={styles.paddingTxtInput}>
            <View style={styles.directionRow}>
              <Text style={[styles.txt, CommonStyles.textBold]}>{inputTitle}</Text>
              <View style={styles.txtRequiredContainer}>
                <Text style={styles.txtRequired}>
                  {translate(messages.required)}
                </Text>
              </View>
            </View>
            <View style={styles.padding} />
            <TextInput
              style={styles.input}
              placeholder={placeHolderInput}
              onChangeText={onChangeText}
              value={txtSearch}
              placeholderTextColor={theme.colors.gray}
            />
            {
              validate &&<Text style={{color: "red"}}>{translate(messages.validate)}</Text>
            }
          </View>    
          <View style={styles.divider} />
        </View>
      </ScrollView>
      <ModalCancel
        visible={isShowDirtyCheck}
        titleModal={translate(commonMessage.confirmBack)}
        textBtnRight={translate(commonMessage.ok)}
        textBtnLeft={translate(commonMessage.cancel)}
        btnBlue
        onPress={() => {
          onPressLeft()
        }}
        closeModal={() => setShowDirtyCheck(false)}
        contentModal={translate(responseMessage.WAR_COM_0005)}
        containerStyle={CommonModalStyles.boxConfirm}
        textStyle={CommonModalStyles.txtContent}
      />
    </KeyboardAvoidingView>
  );
}
