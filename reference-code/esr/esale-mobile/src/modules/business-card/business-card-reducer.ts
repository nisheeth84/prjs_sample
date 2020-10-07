import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  BusinessCardListDataResponse,
  BusinessCardsDataResponse,
  GetAddressesFromZipCodeDataResponse,
  GetBusinessCardDataResponse,
  GetCustomerSuggestionDataResponse,
  GetEmployeesSuggestionDataResponse,
  SuggestBusinessCardDepartmentDataResponse,
} from "./business-card-repository";
import {
  LIST_TYPE,
  BUSINESS_CARD_SELECTED_TARGET_TYPE,
} from "../../config/constants/enum";

export interface BusinessCard {
  businessCardId: number;
  avatarUrl: any;
  name: string;
  role: string;
  label: boolean;
}
export interface BusinessCardState {
  cards: Array<BusinessCard>;
  data: BusinessCardsDataResponse;
  dataBusinessCardList: any;
  tab: boolean;
  list: number;
  department: Array<{
    departmentId: number;
    departmentName: string;
  }>;
  dataEmployeesSuggestion: any;
  dataGetBusinessCard: any;
  listBusinessCardSuggestion: any;
  addressInfos: any;
  customers: any;
  refreshing: boolean;
  drawerListSelected: {
    selectedTargetType: number;
    selectedTargetId?: number;
    listMode?: number;
    displayOrderOfFavoriteList?: number;
    listId?: number;
    listName?: string;
    displayOrderFavoriteList?: number | null;
    listCard?: any;
  };
}

export interface UpdateCardPayload {
  position: number;
  connection: BusinessCard;
}

export interface AddCardPayload {
  card: BusinessCard;
}

export interface DeleteCardPayload {
  position: number;
}

export interface BusinessCardReducers
  extends SliceCaseReducers<BusinessCardState> {}

const businessCardSlice = createSlice<BusinessCardState, BusinessCardReducers>({
  name: "business",
  initialState: {
    // cards: [],
    cards: [
      {
        businessCardId: 1,
        avatarUrl: require("../../../assets/Group94.png"),
        name: "顧客 A / 顧客 A",
        role: "田中 太郎",
        label: true,
      },
      {
        businessCardId: 2,
        avatarUrl: require("../../../assets/frame.png"),
        name: "顧客 A / 顧客 A",
        role: "田中 太郎",
        label: false,
      },
      {
        businessCardId: 3,
        avatarUrl: require("../../../assets/Group94.png"),
        name: "顧客 A / 顧客 A",
        role: "田中 太郎",
        label: false,
      },
      {
        businessCardId: 4,
        avatarUrl: require("../../../assets/frame.png"),
        name: "顧客 A / 顧客 A",
        role: "田中 太郎",
        label: false,
      },
      {
        businessCardId: 5,
        avatarUrl: require("../../../assets/Group94.png"),
        name: "顧客 A / 顧客 A",
        role: "田中 太郎",
        label: false,
      },
      {
        businessCardId: 6,
        avatarUrl: require("../../../assets/frame.png"),
        name: "顧客 A / 顧客 A",
        role: "田中 太郎",
        label: true,
      },
      {
        businessCardId: 7,
        avatarUrl: require("../../../assets/Group94.png"),
        name: "顧客 A / 顧客 A",
        role: "田中 太郎",
        label: false,
      },
      {
        businessCardId: 8,
        avatarUrl: require("../../../assets/frame.png"),
        name: "顧客 A / 顧客 A",
        role: "田中 太郎",
        label: false,
      },
      {
        businessCardId: 9,
        avatarUrl: require("../../../assets/Group94.png"),
        name: "顧客 A / 顧客 A",
        role: "田中 太郎",
        label: true,
      },
    ],
    data: {
      businessCards: [],
      totalRecords: -1,
      initializeInfo: {},
      fieldInfo: [],
      lastUpdateDate: "",
    },
    dataBusinessCardList: {
      favorListBC: [],
      myListBC: [],
      sharedListBC: [],
    },
    list: 0,
    tab: true,
    department: [],
    dataEmployeesSuggestion: {
      employeess: [],
      employees: [],
    },
    dataGetBusinessCard: {},
    listBusinessCardSuggestion: {
      favorListBC: [],
      myListBC: [],
      sharedListBC: [],
    },
    addressInfos: [],
    customers: [],
    refreshing: false,
    drawerListSelected: {
      selectedTargetType: BUSINESS_CARD_SELECTED_TARGET_TYPE.allBusinessCard,
      selectedTargetId: 0,
    },
  },
  reducers: {
    update(state, { payload }: PayloadAction<UpdateCardPayload>) {
      const newList = state.cards;
      newList[payload.position] = payload.connection;
      state.cards = newList;
    },
    add(state, { payload }: PayloadAction<AddCardPayload>) {
      const newList = state.cards;
      newList.push(payload.card);
      state.cards = newList;
    },
    delete(state, { payload }: PayloadAction<DeleteCardPayload>) {
      state.cards = state.cards.filter(
        (_, index) => index !== payload.position
      );
    },
    getTabbar(state, { payload }: PayloadAction<boolean>) {
      state.tab = payload;
    },
    getCreatList(state, { payload }: PayloadAction<number>) {
      state.list = payload;
    },
    getBusinessCards(
      state,
      { payload }: PayloadAction<BusinessCardsDataResponse>
    ) {
      state.data = payload;
      state.refreshing = false;
    },
    loadMoreBusinessCards(
      state,
      { payload }: PayloadAction<BusinessCardsDataResponse>
    ) {
      state.data.businessCards = [
        ...state.data.businessCards,
        ...payload.businessCards,
      ];
    },
    getBusinessCard(
      state,
      { payload }: PayloadAction<GetBusinessCardDataResponse>
    ) {
      state.dataGetBusinessCard = payload.data;
    },
    suggestBusinesCardDepartment(
      state,
      { payload }: PayloadAction<SuggestBusinessCardDepartmentDataResponse>
    ) {
      state.department = payload.department;
    },
    getAddressesFromZipCode(
      state,
      { payload }: PayloadAction<GetAddressesFromZipCodeDataResponse>
    ) {
      state.addressInfos = payload.addressInfos;
    },
    getEmployeesSuggestion(
      state,
      { payload }: PayloadAction<GetEmployeesSuggestionDataResponse>
    ) {
      state.dataEmployeesSuggestion = payload.data;
    },
    getCustomerSuggestion(
      state,
      { payload }: PayloadAction<GetCustomerSuggestionDataResponse>
    ) {
      state.customers = payload.data.customers;
    },
    getBusinessCardList(
      state,
      { payload }: PayloadAction<BusinessCardListDataResponse>
    ) {
      let data = payload;
      state.dataBusinessCardList = { ...state.dataBusinessCardList, ...data };
      state.dataBusinessCardList.favorListBC = data.listInfo.filter(
        (el) => el.displayOrderOfFavoriteList
      );
      state.dataBusinessCardList.myListBC = data.listInfo.filter(
        (el) => el.listType === LIST_TYPE.myList
      );
      state.dataBusinessCardList.sharedListBC = data.listInfo.filter(
        (el) => el.listType === LIST_TYPE.sharedList
      );
    },
    changeToSharedList(state, { payload }: PayloadAction<any>) {
      const { listId } = payload;
      const dataMyList = state.dataBusinessCardList.myListBC.filter(
        (el: any) => el.listId !== listId
      );
      const dataShareList = [
        ...state.dataBusinessCardList.sharedListBC,
        payload,
      ];
      state.dataBusinessCardList.myListBC = dataMyList;
      state.dataBusinessCardList.sharedListBC = dataShareList;
    },
    getBusinessCardSuggestionList(
      state,
      { payload }: PayloadAction<BusinessCardListDataResponse>
    ) {
      const data = payload;
      state.listBusinessCardSuggestion = {
        ...state.listBusinessCardSuggestion,
        ...data,
      };
      state.listBusinessCardSuggestion.favorListBC = data.listInfo.filter(
        (el) => el.displayOrderOfFavoriteList
      );
      state.listBusinessCardSuggestion.myListBC = data.listInfo.filter(
        (el) => el.listType === LIST_TYPE.myList
      );
      state.listBusinessCardSuggestion.sharedListBC = data.listInfo.filter(
        (el) => el.listType === LIST_TYPE.sharedList
      );
    },
    refresh(state, { payload }: PayloadAction<boolean>) {
      state.refreshing = payload;
    },
    saveDrawerListSelected(state, { payload }: PayloadAction<any>) {
      state.drawerListSelected = payload;
    },
  },
});

export const businessCardActions = businessCardSlice.actions;
export default businessCardSlice.reducer;
