import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { TaskDetailModalStyle } from "../task-detail-style";
import { messages } from "./task-detail-modal-messages";
import { translate } from "../../../../config/i18n";

export interface ModalProps {
    // on close modal
    onCloseModal: Function;
    // on click delete
    onClickDelete: Function;
}

export const DeleteTaskModal: React.FunctionComponent<ModalProps> = ({
    onCloseModal,
    onClickDelete = () => { }
}) => {
    return (
        <View style={TaskDetailModalStyle.mainContainer}>
            <View style={TaskDetailModalStyle.container} >
                <Text style={TaskDetailModalStyle.title}>{translate(messages.deleteTask)}</Text>
                <Text style={TaskDetailModalStyle.content}>{translate(messages.deleteTaskMessage)}</Text>
                <View style={TaskDetailModalStyle.wrapButton}>
                    <TouchableOpacity onPress={() => { onCloseModal(); }} style={TaskDetailModalStyle.buttonCancelBorder}>
                        <Text style={TaskDetailModalStyle.buttonTextCancel}>{translate(messages.cancel)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { onClickDelete() }} style={TaskDetailModalStyle.buttonDelete}>
                        <Text style={TaskDetailModalStyle.buttonTextDelete}>{translate(messages.deleteTask)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
