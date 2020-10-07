import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { CustomerDetailScreenStyles } from "../../customer-detail-style"
import { Icon } from "../../../../../shared/components/icon";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../customer-detail-messages";
import { useState } from "react";
import { SelectedPositionModalStyle } from "./network-business-card-style";
import { KeyValueObject } from "./network-business-card-repository";
import { useSelector } from "react-redux";
import { motivationsSelector } from "./network-business-card-selector";
import { CommonButton } from "../../../../../shared/components/button-input/button";
import { getLabelFormatByUserLanguage } from "../../../shared/utils/utils";
import { TypeButton, STATUSBUTTON } from "../../../../../config/constants/enum";

interface SelectedMotivationModalProps {
  // callback selectedMotivation function
  selectedMotivation: any,

  // value is selected
  selectedValue: KeyValueObject
}

/**
 * Component for show selected motivation modal
 * 
 * @param param0 SelectedMotivationModalProps
 */
export const SelectedMotivationModal: React.FC<SelectedMotivationModalProps> = ({
  selectedMotivation,
  selectedValue
}) => {
  const [selected, setSelected] = useState(selectedValue);
  const motivationDatas = useSelector(motivationsSelector);

  // convert motivationDatas to KeyValueObject type
  const motivationList = motivationDatas ? motivationDatas.map((item) => {
    return {
      key: item.motivationId,
      value: getLabelFormatByUserLanguage(item.motivationName)
    }
  }) : []
  
  return (
    <View style={SelectedPositionModalStyle.container}>
      <ScrollView>
        {motivationList.map((item, index) => {
          return (
              <TouchableOpacity style={[SelectedPositionModalStyle.item, CustomerDetailScreenStyles.borderBottom]}
                key={index}
                onPress={() => setSelected(item)}
              >
                <Text style={CustomerDetailScreenStyles.textBold}>{item.value}</Text>
                {selected.key === item.key ? <Icon name="selected" /> : <Icon name="unchecked" />}
              </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={SelectedPositionModalStyle.selectButtonBlock}>
        <CommonButton onPress= {() => selectedMotivation(selected)} status = {STATUSBUTTON.ENABLE} icon = "" textButton= {translate(messages.decideButton)} typeButton = {TypeButton.BUTTON_MINI_MODAL_SUCCESS}></CommonButton>
      </View>
    </View>
    
  )
}
