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
import { standsSelector } from "./network-business-card-selector";
import { TypeButton, STATUSBUTTON } from "../../../../../config/constants/enum";
import { CommonButton } from "../../../../../shared/components/button-input/button";
import { getLabelFormatByUserLanguage } from "../../../shared/utils/utils";

interface SelectedPositionModalProps {
  // callback selectedPosition function
  selectedPosition: any,

  // value is selected
  selectedValue: KeyValueObject
}

/**
 * Component for show selected position modal
 * 
 * @param param0 SelectedPositionModalProps
 */
export const SelectedPositionModal: React.FC<SelectedPositionModalProps> = ({
  selectedPosition,
  selectedValue
}) => {
  const [selected, setSelected] = useState(selectedValue);
  const standDatas = useSelector(standsSelector);

  // convert standDatas to KeyValueObject type
  const standList = standDatas ? standDatas.map((item) => {
    return {
      key: item.masterStandId,
      value: getLabelFormatByUserLanguage(item.masterStandName)
    }
  }) : []
  
  return (
    <View style={SelectedPositionModalStyle.container}>
      <ScrollView>
        {standList.map((item, index) => {
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
        <CommonButton onPress= {() => selectedPosition(selected)} status = {STATUSBUTTON.ENABLE} icon = "" textButton= {translate(messages.decideButton)} typeButton = {TypeButton.BUTTON_MINI_MODAL_SUCCESS}></CommonButton>
      </View>
    </View>
    
  )
}
