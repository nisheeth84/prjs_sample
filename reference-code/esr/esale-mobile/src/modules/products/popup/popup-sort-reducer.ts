import {
    PayloadAction,
    SliceCaseReducers,
    createSlice,
} from "@reduxjs/toolkit";

export interface SortConditionState {
    order: string;
    category: string;
}

export interface SortConditionPayload {
    order: string;
    category: string;
}
export interface SortConditionReducers extends SliceCaseReducers<SortConditionState> { }

const popupSortSlice = createSlice<SortConditionState, SortConditionReducers>({
    name: "popupSort",
    initialState: {
        order: "ASC",
        category: "product_name",
    },
    reducers: {
        /**
         * Update Sort Condition
         * @param state 
         * @param param1 
         */
        updateSortCondition(state, { payload }: PayloadAction<SortConditionPayload>) {
            state.order = payload.order;
            state.category = payload.category;
        },
    },
});

export const popupSortActions = popupSortSlice.actions;
export default popupSortSlice.reducer;