import React from "react";
import { Text, View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { messages } from "./authority-messages";
import { translate } from "../../../config/i18n";
import { CommonModalStyles, CommonStyles } from "../../../shared/common-style";
import { Line } from "../../../shared/components/line";
import { theme } from "../../../config/constants";
import { AuthorityEnum } from "../../../config/constants/enum";

export interface ModalProps {
    // on close
    onCloseModal: Function;
    // handle click item
    handleSelected: Function;
}

/**	
 * Component show authority modal
 * @param param0 
 */

export const AuthorityModal: React.FunctionComponent<ModalProps> = ({
    onCloseModal = () => { },
    handleSelected = () => { }
}) => {
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                onCloseModal();
            }}
        >
            <View style={CommonModalStyles.mainModalContainerBottom}>

                <View style={CommonModalStyles.containerNoPadding} >
                    <TouchableOpacity
                        onPress={() => {
                            handleSelected(AuthorityEnum.OWNER);
                            onCloseModal();
                        }}
                        style={[CommonModalStyles.touchableTextPadding5, CommonStyles.width100]}>
                        <Text style={CommonModalStyles.buttonTextCancel}>
                            {translate(messages.owner)}
                        </Text>
                    </TouchableOpacity>

                    <Line colorLine={theme.colors.gray100} marginLine={theme.space[0]} />

                    <TouchableOpacity
                        onPress={() => {
                            handleSelected(AuthorityEnum.MEMBER);
                            onCloseModal();
                        }}
                        style={[CommonModalStyles.touchableTextPadding5, CommonStyles.width100]}>
                        <Text style={CommonModalStyles.buttonTextCancel}>
                            {translate(messages.member)}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </TouchableWithoutFeedback>
    );
};
