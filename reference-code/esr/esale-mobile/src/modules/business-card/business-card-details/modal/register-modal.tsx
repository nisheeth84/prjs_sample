import React from "react";
import { Text, View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { messages } from "./business-card-detail-modal-messages";
import { translate } from "../../../../config/i18n";
import { CommonModalStyles, CommonStyles } from "../../../../shared/common-style";
import { Line } from "../../../../shared/components/line";
import { theme } from "../../../../config/constants";

export interface ModalProps {
    // on close
    onCloseModal: Function;
    // on click register schedule
    onClickRegisterSchedule: Function;
    // on click register activity
    onClickRegisterActivity: Function;
    // on click create email
    onClickCreateEmail: Function;

}

/**	
 * Component show register modal
 * @param param0 
 */

export const RegisterModal: React.FunctionComponent<ModalProps> = ({
    onCloseModal = () => { },
    onClickRegisterSchedule = () => { },
    onClickRegisterActivity = () => { },
    onClickCreateEmail = () => { },
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
                        onPress={() => { onClickRegisterSchedule(); }}
                        style={[CommonModalStyles.touchableTextPadding5, CommonStyles.width100]}>
                        <Text style={CommonModalStyles.buttonTextCancelCenter}>
                            {translate(messages.registerSchedule)}
                        </Text>
                    </TouchableOpacity>

                    <Line colorLine={theme.colors.gray100} marginLine={theme.space[0]} />

                    <TouchableOpacity
                        onPress={() => { onClickRegisterActivity(); }}
                        style={[CommonModalStyles.touchableTextPadding5, CommonStyles.width100]}>
                        <Text style={CommonModalStyles.buttonTextCancelCenter}>
                            {translate(messages.registerActivity)}
                        </Text>
                    </TouchableOpacity>

                    <Line colorLine={theme.colors.gray100} marginLine={theme.space[0]} />

                    <TouchableOpacity
                        onPress={() => { onClickCreateEmail(); }}
                        style={[CommonModalStyles.touchableTextPadding5, CommonStyles.width100]}>
                        <Text style={CommonModalStyles.buttonTextCancelCenter}>
                            {translate(messages.createEmail)}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </TouchableWithoutFeedback>
    );
};
