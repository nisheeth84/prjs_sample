import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

import { appStatus } from "../../../config/constants";
import { FieldInfoItem } from "../../../config/constants/field-info-interface";
import { TaskDetailInfoResponse } from "../task-repository";

export interface CreateTaskState {
  dataTaskLayout: any;
  fieldInfo: Array<FieldInfoItem>;
  subTask: Array<any> | any;
  status: string;
  taskDetail: any;
}

export interface CreateTaskReducers
  extends SliceCaseReducers<CreateTaskState> {}

const CreateTaskSlice = createSlice<CreateTaskState, CreateTaskReducers>({
  name: "createTask",
  initialState: {
    dataTaskLayout: [],
    fieldInfo: [],
    subTask: [],
    taskDetail: {},
    status: appStatus.PENDING,
  },
  reducers: {
    getTaskLayout(state, { payload }: PayloadAction<any>) {
      state.dataTaskLayout = payload.dataInfo;
      state.fieldInfo = payload.fieldInfo;
      state.status = appStatus.SUCCESS;
    },
    getTaskDetail(state, { payload }: PayloadAction<TaskDetailInfoResponse>) {
      state.taskDetail = payload?.dataInfo?.task;
      state.fieldInfo = payload.fieldInfo;
      state.status = appStatus.SUCCESS;
    },
    getSubTask(state, { payload }: PayloadAction<any>) {
      state.subTask = payload;
      state.status = appStatus.SUCCESS;
    },
    clearData(state, { payload }: any) {
      state.taskDetail = {};
      state.subTask = [];
    },
  },
});

export const createTaskActions = CreateTaskSlice.actions;
export default CreateTaskSlice.reducer;
