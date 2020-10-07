import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { MilestoneDetailModalStyle } from "../milestone-detail-style";
import { messages } from "./milestone-detail-modal-messages";
import { translate } from "../../../../config/i18n";

export interface ModalProps {
    // on close modal
    onCloseModal: Function;
    // on click complete submilestone
    onClickCompleteMilestone: Function;
}

export const CompleteMilestoneModal: React.FunctionComponent<ModalProps> = ({
    onCloseModal = () => { },
    onClickCompleteMilestone = () => { }
}) => {
    return (
        <View style={MilestoneDetailModalStyle.mainContainer}>
            <View style={MilestoneDetailModalStyle.container}>
                <Text style={MilestoneDetailModalStyle.title}>{translate(messages.confirm)}</Text>
                <View style={MilestoneDetailModalStyle.content}>
                    <Text style={MilestoneDetailModalStyle.contentConfirm}>{translate(messages.confirmComplete1)}</Text>
                    <Text style={MilestoneDetailModalStyle.contentConfirm}>{translate(messages.confirmComplete2)}</Text>
                    <Text style={MilestoneDetailModalStyle.contentConfirm}>{translate(messages.confirmComplete3)}</Text>
                </View>
                <View style={MilestoneDetailModalStyle.wrapButtonVer}>
                    <TouchableOpacity onPress={() => { onClickCompleteMilestone() }} style={MilestoneDetailModalStyle.buttonDeleteMilestoneNotComplete}>
                        <Text style={MilestoneDetailModalStyle.buttonTextDelete}>{translate(messages.completeMilestone)}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { onCloseModal(); }} style={MilestoneDetailModalStyle.buttonCancel}>
                    <Text style={MilestoneDetailModalStyle.buttonTextCancel}>{translate(messages.cancel)}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
