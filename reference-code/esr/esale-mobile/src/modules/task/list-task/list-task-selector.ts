import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { ListTaskState } from "./list-task-reducer";

/**
 * List task selector
 */
export const listTaskSelector = createSelector(
  (state: RootState) => state.listTask,
  (task: ListTaskState) => task.tasks
);

/**
 * tab id selector
 */
export const tabIdSelector = createSelector(
  (state: RootState) => state.listTask,
  (task: ListTaskState) => task.tabId
);

/**
 * modal task selector
 */
export const modalTaskSelector = createSelector(
  (state: RootState) => state.listTask,
  (task: ListTaskState) => {
    return {
      visible: task.visible,
      taskListId: task.taskListId,
      optionVisible: task.optionVisible,
      processFlg: task.processFlg
    }
  }
);



