import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { CompanyName, Service } from "./menu-type";
import {
  ServiceOrder,
  GetListSuggestionsDataDataResponse,
  GetListSuggestionsDataResponse,
} from "./menu-feature-repository";
import { LIST_TYPE } from "../../config/constants/enum";

export interface ServiceInfo {
  serviceId: number;
  serviceName: string;
  serviceType: number;
}
export interface MenuState {
  listServiceFavorite: Array<Service>;
  listServiceOrder: Array<ServiceOrder>;
  listServiceInfo: Array<Service>;
  companyName: CompanyName;
  unreadNotificationNumber: number;
  listSuggestion: {
    favorListBC: GetListSuggestionsDataDataResponse[];
    myListBC: GetListSuggestionsDataDataResponse[];
    sharedListBC: GetListSuggestionsDataDataResponse[];
  };
}
export interface AddServiceFavoritePayload {
  listServiceFavorite: Array<Service>;
}
export interface AddServiceInfoPayload {
  listServiceInfo: Array<Service>;
}
export interface GetServiceOrderPayload {
  listServiceOrder: Array<ServiceOrder>;
}
export interface GetCompanyNamePayload {
  companyName: CompanyName;
}

export interface GetListSuggestionsPayload
  extends GetListSuggestionsDataResponse {}

export interface MenuReducers extends SliceCaseReducers<MenuState> {}

const menuSlice = createSlice<MenuState, MenuReducers>({
  name: "menu",
  initialState: {
    listServiceFavorite: [],
    listServiceInfo: [],
    listServiceOrder: [],
    companyName: { companyName: "" },
    unreadNotificationNumber: 0,
    listSuggestion: {
      favorListBC: [],
      myListBC: [],
      sharedListBC: [],
    },
  },
  reducers: {
    getServiceFavorite(
      state,
      { payload }: PayloadAction<AddServiceFavoritePayload>
    ) {
      state.listServiceFavorite = payload.listServiceFavorite;
    },
    getServiceInfo(state, { payload }: PayloadAction<AddServiceInfoPayload>) {
      state.listServiceInfo = payload.listServiceInfo;
    },
    getServiceOrder(state, { payload }: PayloadAction<ServiceOrder[]>) {
      state.listServiceOrder = payload;
    },
    getCompanyName(state, { payload }: PayloadAction<GetCompanyNamePayload>) {
      state.companyName = payload.companyName;
    },
    getUnreadNotificationNumber(state, { payload }: PayloadAction<number>) {
      state.unreadNotificationNumber = payload;
    },
    getListSuggestions(
      state,
      { payload }: PayloadAction<GetListSuggestionsPayload>
    ) {
      const { listInfo } = payload;
      if (!listInfo) {
        state.listSuggestion.favorListBC = [];
        state.listSuggestion.myListBC = [];
        state.listSuggestion.sharedListBC = [];
        return;
      }
      state.listSuggestion.favorListBC = listInfo.filter(
        (el) => el.displayOrderOfFavoriteList
      );
      state.listSuggestion.myListBC = listInfo.filter(
        (el) => el.listType === LIST_TYPE.myList
      );
      state.listSuggestion.sharedListBC = listInfo.filter(
        (el) => el.listType === LIST_TYPE.sharedList
      );
    },
    getListSuggestionsCustomer(
      state,
      { payload }: PayloadAction<GetListSuggestionsPayload>
    ) {
      const { listInfo } = payload;
      if (!listInfo) {
        state.listSuggestion.favorListBC = [];
        state.listSuggestion.myListBC = [];
        state.listSuggestion.sharedListBC = [];
        return;
      }
      state.listSuggestion.favorListBC = listInfo.filter(
        (el) => el.isFavoriteList
      );
      state.listSuggestion.myListBC = listInfo.filter(
        (el) => el.customerListType === LIST_TYPE.myList
      );
      state.listSuggestion.sharedListBC = listInfo.filter(
        (el) => el.customerListType === LIST_TYPE.sharedList
      );
    },
  },
});

export const menuActions = menuSlice.actions;
export default menuSlice.reducer;
