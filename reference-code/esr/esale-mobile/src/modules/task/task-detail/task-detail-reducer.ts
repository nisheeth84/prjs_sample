import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  Task,
  Employee,
  Customer,
  File,
  TaskDetailInfoResponse,
  HistoryUpdateTaskInfoResponse,
  HistoryTask,
  ProductDetailTrading
} from "../task-repository";
import { EnumStatus } from "../../../config/constants/enum-status";
import { FieldInfoItem } from "../../../config/constants/field-info-interface";

export interface TaskDetailState {
  taskDetail: Array<Task>;
  totalEmployees: Array<Employee>;
  customers: Array<Customer>;
  files: Array<File>;
  subtasks: Array<Task>;
  status: EnumStatus;
  productTradings: Array<ProductDetailTrading>,
  histories: Array<HistoryTask>;
  fieldInfo: Array<FieldInfoItem>;
}

export interface TaskDetailReducers extends SliceCaseReducers<TaskDetailState> { }

const taskSlice = createSlice<TaskDetailState, TaskDetailReducers>({
  name: "task-detail",
  initialState: {
    taskDetail: [],
    totalEmployees: [],
    customers: [],
    files: [],
    subtasks: [],
    productTradings: [],
    status: EnumStatus.PENDING,
    histories: [],
    fieldInfo: [],
  },
  reducers: {
    getTaskDetail(state, { payload }: PayloadAction<TaskDetailInfoResponse>) {
      let dataInfo = payload.dataInfo;
      state.taskDetail = [dataInfo?.task];
      state.totalEmployees = dataInfo?.task?.totalEmployees;
      state.customers = dataInfo?.task?.customers;
      state.files = dataInfo?.task?.files;
      state.subtasks = dataInfo?.task?.subtasks;
      state.productTradings = dataInfo?.task?.productTradings;
      state.fieldInfo = payload.fieldInfo;
      state.status = EnumStatus.SUCCESS;
    },

    saveTaskDetail(state, { payload }: PayloadAction<Task>) {
      state.taskDetail = [payload];
      state.status = EnumStatus.SUCCESS;
    },


    getTaskHistory(state, { payload }: PayloadAction<HistoryUpdateTaskInfoResponse>) {
      state.histories = payload.data;
      state.status = EnumStatus.SUCCESS;
    },

    getTaskError(state) {
      state.status = EnumStatus.ERROR;
      state.taskDetail = [];
    },
  },
});

export const taskDetailActions = taskSlice.actions;
export default taskSlice.reducer;
