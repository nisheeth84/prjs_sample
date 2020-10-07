import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { TaskDetailState } from "./task-detail-reducer";

/**
 * task detail selector
 */
export const taskDetailSelector = createSelector(
  (state: RootState) => state.taskDetail,
  (task: TaskDetailState) => task.taskDetail
);

/**
 * task detail total employee selector
 */
export const taskDetailTotalEmployeeSelector = createSelector(
  (state: RootState) => state.taskDetail,
  (task: TaskDetailState) => task.totalEmployees
);

/**
 * task detail customer selector
 */
export const taskDetailCustomersSelector = createSelector(
  (state: RootState) => state.taskDetail,
  (task: TaskDetailState) => task.customers
);

/**
 * task detail files selector
 */
export const taskDetailFilesSelector = createSelector(
  (state: RootState) => state.taskDetail,
  (task: TaskDetailState) => task.files
);

/**
 * task detail subtask selector
 */
export const taskDetailSubtasksSelector = createSelector(
  (state: RootState) => state.taskDetail,
  (task: TaskDetailState) => task.subtasks
);

/**
 * task detail product trading selector
 */
export const taskDetailProductTradingSelector = createSelector(
  (state: RootState) => state.taskDetail,
  (task: TaskDetailState) => task.productTradings
);

/**
 * task detail state selector
 */
export const statusSelector = createSelector(
  (state: RootState) => state.taskDetail,
  (task: TaskDetailState) => task.status
);

/**
 * task detail history selector
 */
export const taskDetailHistorySelector = createSelector(
  (state: RootState) => state.taskDetail,
  (task: TaskDetailState) => task.histories
);

/**
 * task detail field info selector
 */
export const taskDetailFieldInfoSelector = createSelector(
  (state: RootState) => state.taskDetail,
  (task: TaskDetailState) => task.fieldInfo
);