import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { EnumStatus } from "../../../config/constants/enum-status";
import {
  BusinessCardDetailInfoResponse,
  BusinessCard,
  BusinessCardHistoryUpdate,
  FieldInfo,
  HistoryUpdateBusinessCardInfoResponse,
} from "./business-card-repository";
// import { Products } from "../../products-manage/product-type";
import { FieldInfoItem } from '../../../config/constants/field-info-interface';

export interface BusinessCardDetailState {
  businessCardDetail: Array<BusinessCard>;
  historyUpdate: Array<BusinessCardHistoryUpdate>;
  oldestHistoryUpdate: Array<BusinessCardHistoryUpdate>;
  historyFieldInfo: Array<FieldInfo>
  status: EnumStatus;
  basicFieldInfo: Array<FieldInfoItem>;
  businessTrading: Array<any>;
  activityHistory: Array<any>;
}

export interface BusinessCardDetailReducers
  extends SliceCaseReducers<BusinessCardDetailState> { }

const BusinessCardSlice = createSlice<
  BusinessCardDetailState,
  BusinessCardDetailReducers
>({
  name: "business-card-detail",
  initialState: {
    businessCardDetail: [],
    historyUpdate: [],
    oldestHistoryUpdate: [],
    historyFieldInfo: [],
    status: EnumStatus.PENDING,
    basicFieldInfo: [],
    businessTrading: [],
    activityHistory: [],
  },
  reducers: {
    getBusinessCardDetail(
      state,
      { payload }: PayloadAction<BusinessCardDetailInfoResponse>
    ) {
      state.businessCardDetail = [payload.businessCardDetail];
      state.status = EnumStatus.SUCCESS;
    },
    /**
     * save basic business field info to selector
     * @param state 
     * @param param1 
     */
    getBusinessCardFieldInfo(
      state,
      { payload }: PayloadAction<Array<FieldInfoItem>>
    ) {
      if (payload) {
        state.basicFieldInfo = payload;
      }
    },
    /**
     * save product trading
     * @param state 
     * @param param1 
     */
    getBusinessTrading(state, { payload }: PayloadAction<Array<any>>) {
      if (payload) {
        state.businessTrading = payload;
      }
    },
    saveBusinessCardDetail(state, { payload }: PayloadAction<BusinessCard>) {
      if (payload != undefined) {
        state.businessCardDetail = [payload];
        state.status = EnumStatus.SUCCESS;
      }
    },

    saveBusinessCardHistoryUpdate(
      state,
      { payload }: PayloadAction<HistoryUpdateBusinessCardInfoResponse>
    ) {
      if (payload != undefined) {
        state.historyUpdate = payload.businessCardHistories;
        state.historyFieldInfo = payload.fieldInfo;
        state.status = EnumStatus.SUCCESS;
      }
    },

    saveOldestBusinessCardHistoryUpdate(state, { payload }: PayloadAction<BusinessCardHistoryUpdate>) {
      if (payload != undefined) {
        state.oldestHistoryUpdate = [payload];
        state.status = EnumStatus.SUCCESS;
      }
    },

    getBusinessCardError(state) {
      state.status = EnumStatus.ERROR;
      state.businessCardDetail = [];
    },
    getActivityHistory(state, { payload }: PayloadAction<Array<any>>) {
      state.activityHistory = payload;
    },
  },
});

export const businessCardDetailActions = BusinessCardSlice.actions;
export default BusinessCardSlice.reducer;
