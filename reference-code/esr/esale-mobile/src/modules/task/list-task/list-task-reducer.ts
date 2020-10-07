import {
    PayloadAction,
    SliceCaseReducers,
    createSlice,
} from "@reduxjs/toolkit";

/**
 * task information
 */
export interface Task {
    taskId: number;
    taskData: Array<any>;
    fieldType: number;
    key: string;
    value: string;
    statusTaskId: number;
    parentTaskId: number;
    parentStatusTaskId: number;
    startDate: string;
    finishDate: string;
    milestoneId: number;
    milestoneName: string;
    memo: string;
    customers: Array<any>;
    customerId: number;
    customerName: string;
    productTradings: Array<any>;
    productTradingId: number;
    productId: number;
    productName: string;
    subtasks: Array<any>;
    taskName: string;
    countSubtask: number;
    files: Array<any>;
    fileId: number;
    fileName: string;
    filePath: string;
    employees: Array<any>;
    employeeId: number;
    employeeName: string;
    departmentName: string;
    positionName: string;
    photoFilePath: string;
    employeeNameKana: string;
    flagActivity: number;
    cellphoneNumber: string;
    telephoneNumber: string;
    email: string;
    countEmployee: number;
    isOperator: number;
    countTask: number;
    countTotalTask: number;
    tabId: number;
}

/**
 * list task state information
 */
export interface ListTaskState {
    tasks: Array<Task>;
    tabId: number;
    visible: boolean;
    optionVisible: boolean;
    taskListId: Array<any>;
    processFlg?: number;
    isUpdate: boolean;
}

export interface ListTaskReducers extends SliceCaseReducers<ListTaskState> { }

const tasksSlice = createSlice<ListTaskState, ListTaskReducers>({
    name: "tasks",
    initialState: {
        tasks: [],
        tabId: 1,
        visible: false,
        optionVisible: false,
        taskListId: [],
        processFlg: 0,
        isUpdate: false,
    },
    reducers: {
        /**
         * update list task
         */
        getListTask(state, { payload }: PayloadAction<Array<Task>>) {
            state.tasks = payload;
        },
        /**
         * update tab id for screen
         */
        updateIdTab(state, { payload }: PayloadAction<number>) {
            state.tabId = payload;
        },
        /**
         * toggle modal remove
         */
        toggleModalRemove(state, { payload }: PayloadAction<any>) {
            state.visible = payload.visible;
            state.taskListId = payload.taskListId;
            state.optionVisible = payload.optionVisible;
            state.processFlg = payload.processFlg;
        },
    },
});

export const taskAction = tasksSlice.actions;
export default tasksSlice.reducer;
