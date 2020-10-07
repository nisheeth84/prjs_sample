import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { messages } from "./business-card-detail-modal-messages";
import { translate } from "../../../../config/i18n";
import { DeleteBnCardModalType } from "../../../../config/constants/enum";
import { CommonModalStyles, CommonStyles } from "../../../../shared/common-style";
import { Line } from "../../../../shared/components/line";
import { theme, appImages } from "../../../../config/constants";
import { BusinessCardDetailStyle } from "../business-card-detail-style";

export interface ModalProps {
  // on close modal
  onCloseModal: Function;
  // on click delete business card
  onClickDeleteBusinessCard: Function;
  // on click delete customer and business card
  onClickDeleteCustomerAndBnCard: Function;
  // type of modal
  type: number
}

export const DeleteBusinessCardModal: React.FunctionComponent<ModalProps> = ({
  onCloseModal,
  onClickDeleteBusinessCard = () => { },
  onClickDeleteCustomerAndBnCard = () => { },
  type = DeleteBnCardModalType.DELETE_LAST_MODAL
}) => {

  /**
   * render delete last business card modal
   */
  const renderDeleteLastBusinessCardModal = () => {
    return (
      <View style={CommonStyles.width100}>
        <Text style={BusinessCardDetailStyle.contentModalDeleteBusinessCard}>
          {translate(messages.deleteLastTitle)}
        </Text>
        <TouchableOpacity onPress={() => { onClickDeleteCustomerAndBnCard() }}>
          <Text style={CommonModalStyles.contentNormal}>
            {translate(messages.deleteCustomerAndBnCard)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { onClickDeleteBusinessCard() }}>
          <Text style={CommonModalStyles.contentNormal}>
            {translate(messages.deleteOnlyBnCard)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { onCloseModal() }}>
          <Text style={CommonModalStyles.contentNormal}>
            {translate(messages.cancel)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * render delete normal business card modal
   */
  const renderDeleteNormalBusinessCardModal = () => {
    return (
      <View style={CommonStyles.width100}>
        <Text style={BusinessCardDetailStyle.contentModalDeleteBusinessCard}>
          {translate(messages.deleteTitle)}
        </Text>

        <TouchableOpacity onPress={() => { onClickDeleteBusinessCard() }}>
          <Text style={CommonModalStyles.contentNormal}>
            {translate(messages.deleteWithoutSpace)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { onCloseModal() }}>
          <Text style={CommonModalStyles.contentNormal}>
            {translate(messages.cancel)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={CommonModalStyles.mainModalContainer}>
      <View style={CommonModalStyles.containerNoPadding}>
        <View style={[CommonStyles.rowInlineSpaceBetween, CommonModalStyles.prTitleGrayLeft]}>
          <Text style={CommonModalStyles.titleGrayLeft}>
            {translate(messages.delete)}
          </Text>
          <TouchableOpacity onPress={() => { onCloseModal() }}>
            <Image source={appImages.icClose} />
          </TouchableOpacity>
        </View>
        <Line colorLine={theme.colors.gray200}
          marginLine={theme.space[0]}
        />
        {type == DeleteBnCardModalType.DELETE_LAST_MODAL
          ? renderDeleteLastBusinessCardModal()
          : renderDeleteNormalBusinessCardModal()
        }
      </View>
    </View>
  );
};
