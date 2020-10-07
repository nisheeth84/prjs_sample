import { I18nMessages } from "../../../../types";

export const messages: I18nMessages = {
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
    confirmTask: {
        id: "tasks_confirm",
        defaultMessage: "確認"
    },
    askSubtaskFinished: {
        id: "tasks_ask_subtask",
        defaultMessage: "完了したタスクに未完了のサブタスクが含まれています。処理を選択してください。"
    },
    subTaskComplete: {
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
    closeListEmployee: {
      id: 'close_list_employee',
      defaultMessage:'閉じる'
    },
    finishDateLabel: {
      id: 'finish_date_label',
      defaultMessage:'期限'
    },
};
