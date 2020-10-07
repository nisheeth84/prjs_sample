import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { GlobalToolState } from "./global-tool-reducer";

/**
 * product detail selector
 */
export const getGlobalToolSelector = createSelector(
    (state: RootState) => state.globalTool,
    (dataGlobal: GlobalToolState) => dataGlobal.dataGlobalTool

);

export const getCountTaskAndMilestone = createSelector(
    (state: RootState) => state.globalTool,
    (dataGlobal: GlobalToolState) => dataGlobal.countTaskAndMilestone
);
