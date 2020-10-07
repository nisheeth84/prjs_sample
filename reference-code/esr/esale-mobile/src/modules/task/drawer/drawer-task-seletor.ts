import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../reducers";
import { DrawerTaskState } from "./drawer-task-reducer";


/**
 * product detail selector
 */
export const getLocalNavigationSelector = createSelector(
    (state: RootState) => state.drawerTask,
    (dataDrawerTask: DrawerTaskState) => dataDrawerTask.localNavigation

);
