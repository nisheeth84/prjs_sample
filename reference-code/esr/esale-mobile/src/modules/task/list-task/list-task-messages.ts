import { I18nMessages } from "../../../types";

export const messages: I18nMessages = {
    taskTitle: {
        id: "tasks_title",
        defaultMessage: "タスク"
    },
    notStartedTask: {
        id: "tasks_not_started",
        defaultMessage: "未着手",
    },
    doingTask: {
        id: "tasks_doing",
        defaultMessage: "着手中",
    },
    doneTask: {
        id: "tasks_done",
        defaultMessage: "完了済み"
    },
    deadlineTask: {
        id: "tasks_deadline",
        defaultMessage: "期限",
    },
    confirmTask: {
        id: "tasks_confirm",
        defaultMessage: "確認"
    },
    askSubtaskFinished: {
        id: "tasks_ask_subtask",
        defaultMessage: "完了したタスクに未完了のサブタスクが含まれ\nています。処理を選択してください。"
    },
    subTaskComplele: {
        id: "tasks_complete_subtask",
        defaultMessage: "サブタスクも完了"
    },
    convertToTask: {
        id: "tasks_convert_subtask",
        defaultMessage: "サブタスクをタスクに変換"
    },
    cancelUpdate: {
        id: "tasks_cancel",
        defaultMessage: "キャンセル"
    },
    removeTitle: {
        id: "tasks_remove",
        defaultMessage: "削除"
    },
    removeTaskSimple: {
        id: "tasks_remove_simple",
        defaultMessage: "タスクを削除してもよろしいですか？"
    },
    askSubtaskRemove: {
        id: "tasks_ask_remove",
        defaultMessage: "削除するタスクにサブタスクが\n含まれています。\n処理を選択してください。"
    },
    removeSubtask: {
        id: "tasks_remove_subtask",
        defaultMessage: "サブタスクも削除"
    },
    newSubTask: {
        id: 'tasks_convert_remove',
        defaultMessage: 'サブタスクをタスクに変換'
    }
};
