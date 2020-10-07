import { createSelector } from "@reduxjs/toolkit";
import { CreateTaskState } from "./create-task-reducer";
import { RootState } from "../../../reducers";

/**
 * get task layout data info selector
 */
export const getTaskLayoutSelector = createSelector(
  (state: RootState) => state.createTask,
  (taskLayout: CreateTaskState) => taskLayout.dataTaskLayout
);

/**
 * get task detail selector
 */
export const getTaskDetailSelector = createSelector(
  (state: RootState) => state.createTask,
  (taskDetail: CreateTaskState) => taskDetail.taskDetail
);

/**
 * get task layout field info selector
 */
export const taskLayoutFieldInfoSelector = createSelector(
  (state: RootState) => state.createTask,
  (taskLayout: CreateTaskState) => taskLayout.fieldInfo
);

/**
 * get subtask selector
 */
export const getSubTaskSelector = createSelector(
  (state: RootState) => state.createTask,
  (subTask: CreateTaskState) => subTask.subTask
);
