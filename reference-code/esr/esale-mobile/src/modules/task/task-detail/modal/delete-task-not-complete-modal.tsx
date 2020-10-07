import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { TaskDetailModalStyle } from "../task-detail-style";
import { messages } from "./task-detail-modal-messages";
import { translate } from "../../../../config/i18n";

export interface ModalProps {
    // on close modal
    onCloseModal: Function;
    // on click delete subtask
    onClickDeleteSubTask: Function;
    // on click delete task and convert subtask to task
    onClickConvertSubTaskToTask: Function
}

export const DeleteTaskNotCompleteModal: React.FunctionComponent<ModalProps> = ({
    onCloseModal,
    onClickDeleteSubTask = () => { },
    onClickConvertSubTaskToTask = () => { }
}) => {
    return (
        <View style={TaskDetailModalStyle.mainContainer}>
            <View style={TaskDetailModalStyle.container}>
                <Text style={TaskDetailModalStyle.title}>{translate(messages.confirm)}</Text>
                <View style={TaskDetailModalStyle.content}>
                    <Text style={TaskDetailModalStyle.contentConfirm}>{translate(messages.confirmDelete1)}</Text>
                    <Text style={TaskDetailModalStyle.contentConfirm}>{translate(messages.confirmDelete2)}</Text>
                    <Text style={TaskDetailModalStyle.contentConfirm}>{translate(messages.confirmDelete3)}</Text>
                </View>
                <View style={TaskDetailModalStyle.wrapButtonVer}>
                    <TouchableOpacity onPress={() => { onClickDeleteSubTask() }} style={TaskDetailModalStyle.buttonDeleteTaskNotComplete}>
                        <Text style={TaskDetailModalStyle.buttonTextDelete}>{translate(messages.deleteSubTask)}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { onClickConvertSubTaskToTask() }} style={TaskDetailModalStyle.buttonDeleteTaskNotComplete}>
                        <Text style={TaskDetailModalStyle.buttonTextDelete}>{translate(messages.convertSubTaskToTask)}</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => { onCloseModal(); }} style={TaskDetailModalStyle.buttonCancel}>
                    <Text style={TaskDetailModalStyle.buttonTextCancel}>{translate(messages.cancel)}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
