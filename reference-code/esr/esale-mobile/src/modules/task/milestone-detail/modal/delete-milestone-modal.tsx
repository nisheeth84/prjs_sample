import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { MilestoneDetailModalStyle } from "../milestone-detail-style";
import { messages } from "./milestone-detail-modal-messages";
import { translate } from "../../../../config/i18n";

export interface ModalProps {
    onCloseModal: Function;
    onClickDelete: Function;
}

export const DeleteMilestoneModal: React.FunctionComponent<ModalProps> = ({
    onCloseModal = () => { },
    onClickDelete = () => { }
}) => {
    return (
        <View style={MilestoneDetailModalStyle.mainContainer}>
            <View style={MilestoneDetailModalStyle.container} >
                <Text style={MilestoneDetailModalStyle.title}>{translate(messages.deleteMilestone)}</Text>
                <Text style={MilestoneDetailModalStyle.contentDelete}>{translate(messages.deleteMilestoneMessage1)}</Text>
                <Text style={MilestoneDetailModalStyle.contentDelete2}>{translate(messages.deleteMilestoneMessage2)}</Text>
                <View style={MilestoneDetailModalStyle.wrapButton}>
                    <TouchableOpacity onPress={() => { onCloseModal(); }} style={MilestoneDetailModalStyle.buttonCancelBorder}>
                        <Text style={MilestoneDetailModalStyle.buttonTextCancel}>{translate(messages.cancel)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { onClickDelete() }} style={MilestoneDetailModalStyle.buttonDelete}>
                        <Text style={MilestoneDetailModalStyle.buttonTextDelete}>{translate(messages.deleteMilestone)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
