import React, { useState, useEffect } from "react"
import BaseModal from "../calendar/common/modal"
import { Style } from "./common"
import { View, Text } from "react-native"
import { CommonButton } from "../../shared/components/button-input/button"
import { StatusButton, TypeButton } from "../../config/constants/enum"
import { messages } from "./detail/activity-detail-messages"
import { translate } from "../../config/i18n"
import { TypeConfirm } from "./constants"

interface ParamModalProps {
  isVisible: boolean
  setIsVisible: any
  titleModal: string
  processActionCallBack: any
  typeModal: string
}
export const ModalConfirm: React.FC<ParamModalProps> = ({
  isVisible, setIsVisible, titleModal, processActionCallBack, typeModal
}) => {
  /**
   * confirm label value
   */
  const [confirmLabel, setConfirmLabel] = useState('')
  /**
   * handle confirm label
   */
  const handleConfirmLabel = () => {
    switch(typeModal) {
      case TypeConfirm.DELETE:
        setConfirmLabel(translate(messages.confirmDelete))
        break
      case TypeConfirm.AGREE:
        setConfirmLabel(translate(messages.confirmAgree))
        break
      default:
        setConfirmLabel('')
        break
    }
  }
  /** 
   * Set value for confirm label when typeModal has been changed
   */
  useEffect(() => {
    handleConfirmLabel()
  }, [typeModal])

  return (
    <BaseModal
      isVisible={isVisible}
      onBackdropPress={() => setIsVisible(false)}
    >
      <View style={Style.modal}>
        <Text style={Style.titleModal}>{translate(messages.modalCloseTitle)}</Text>
        <View style={[Style.modalContent]}>
          <Text style={Style.textAlignCenter}>{titleModal}</Text>
        </View>
        <View style={Style.footerModal}>
          <CommonButton onPress={() => setIsVisible(false)} status = {StatusButton.ENABLE} icon = "" textButton= {`${translate(messages.cancel)}`} typeButton = {TypeButton.BUTTON_DIALOG_NO_SUCCESS}></CommonButton>
          <CommonButton onPress={() => processActionCallBack()} status = {StatusButton.ENABLE} icon = "" textButton= {confirmLabel} typeButton = {TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
        </View>
      </View>
    </BaseModal>
  )
}