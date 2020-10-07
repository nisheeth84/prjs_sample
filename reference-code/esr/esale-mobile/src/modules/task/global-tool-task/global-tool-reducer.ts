import {
    PayloadAction,
    SliceCaseReducers,
    createSlice,
} from "@reduxjs/toolkit";

import { appStatus } from "../../../config/constants";

export interface GlobalToolState {
    dataGlobalTool: Array<any>;
    countTaskAndMilestone: number;
    status: string;
}

export interface GlobalToolReducers
    extends SliceCaseReducers<GlobalToolState> { }

const globalToolSlice = createSlice<GlobalToolState, GlobalToolReducers>({
    name: "product",
    initialState: {
        dataGlobalTool: [],
        countTaskAndMilestone: 0,
        status: appStatus.PENDING,
    },
    reducers: {
        getGlobalTool(state, { payload }: PayloadAction<any>) {
            state.dataGlobalTool = payload.dataGlobalTools;
            state.countTaskAndMilestone =
                payload.countMilestone + payload.countTotalTask;
            state.status = appStatus.SUCCESS;
        },
        clearDataGlobalTool(state) {
            state.dataGlobalTool = [];
        }
    },
});

export const globalToolActions = globalToolSlice.actions;
export default globalToolSlice.reducer;
