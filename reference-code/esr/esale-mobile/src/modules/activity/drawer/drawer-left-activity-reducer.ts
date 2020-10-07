import {
  SliceCaseReducers,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit"

export interface CustomersFavorite {
  customerListType: number
  isAutoList: boolean
  isOverWrite: boolean
  listId: number
  listName: string
  participantType: number
  updatedDate: string
}
export interface Customers {
  customerId: number,
}
export interface ProductTradings {
  productTradingId: number,
}
export interface BusinessCards {
  businessCardId: number,
}
export interface BusinessCard {
  listId: number,
  listName: string,
  displayOrder: number,
  listType: number,
  displayOrderOfFavoriteList: number,
}
export interface GetListProductTradings {
  listId: number,
  listName: string,
  displayOrder: number,
  listType: number,
  displayOrderOfFavoriteList: number,
}

interface ProductTradingsHistoryData {
  productTradingId: number
}

export interface ProductDataFieldItem {
  fieldType: number
  key: string
  value: string
}

export interface ProductTradingItem {
  productTradingId: number
  customerName: string
  customerId: number
  productId: number
  productName: string
  quantity: number
  price: number
  amount: number
  productTradingProgressId: number
  progressName: string
  progressOrder: number
  isFinish: boolean
  isAvailable: boolean
  employeeId: number
  employeeName: string
  employeeSurname: string
  endPlanDate: any
  orderPlanDate: any
  memo: string
  productTradingData: Array<ProductDataFieldItem>
  updateDate: any
  productTradingHistories: Array<ProductTradingsHistoryData>
}

export interface ProgressItem {
  productTradingProgressId: number
  progressName: string
  isAvailable: boolean
  progressOrder: number
}

export interface InitializeDataResponse {
  selectedTargetType?: number
  selectedTargetId?: number
  extraSettings?: Array<{
    key: string
    value: string
  }>
}

export interface FieldDataResponse {
  fieldId: number
  fieldName: string
  forwardColor: string
  forwardText: string
  backwardColor: string
  backwardText: string
}

export interface ProductTradingsDataResponse {
  productTradings: Array<ProductTradingItem>
  progresses: Array<ProgressItem>
  initializeInfo?: InitializeDataResponse
  fieldInfo?: Array<FieldDataResponse>
  total?: number
  lastUpdateDate?: any
}
export interface DrawerActivityState {
  customerFavoriteList: Array<CustomersFavorite>,
  businessCardList: Array<BusinessCard>,
  productTradings: ProductTradingsDataResponse,
  businessCardIdList: Array<number>,
  customerIdList: Array<number>,
  productTradingIdList: Array<number>,
  businessCardListNew: BodyDataResponse,
  listData: BodyDataResponse
}
export interface GetCustomersListPayload {
  favouriteList: Array<CustomersFavorite>,
}
export interface BusinessCardPayload {
  businessCardList: Array<BusinessCard>
}
export interface ProductTradingsPayload {
  listInfo: Array<GetListProductTradings>
}
export interface BusinessCardIdListPayload {
  businessCardIdList: Array<number>
}
export interface CustomerIdListPayload {
  CustomerIdList: Array<number>
}
export interface productTradingIdListPayload {
  productTradingIdList: Array<number>
}

export interface ItemResponse {
  listId: number,
  listName: string,
  displayOrder: number,
  listType: number,
  displayOrderOfFavoriteList: number,
}

export interface BodyDataResponse {
  listInfo: Array<ItemResponse>
  listUpdateTime: string
}

interface DataResponse {
  data: BodyDataResponse
}
export interface DrawerActivityReducers
  extends SliceCaseReducers<DrawerActivityState> {}

const drawerActivitySlice = createSlice<DrawerActivityState, DrawerActivityReducers>({
  name: "drawerActivity",
  initialState: {
    customerFavoriteList: [],
    businessCardList: [],
    productTradings: {
      productTradings: [],
      progresses: [],
      fieldInfo: [],
    },
    businessCardIdList: [],
    customerIdList: [],
    productTradingIdList: [],
    businessCardListNew: {
      listInfo: [],
      listUpdateTime: ""
    },
    listData: {
      listInfo: [],
      listUpdateTime: ""
    }
  },
  reducers: {
    /**
     * Save left drawer customers (open/close) to state
     * @param state 
     * @param param1 
     */
    getCustomers(state, { payload }: PayloadAction<GetCustomersListPayload>) {
      state.customerFavoriteList = payload.favouriteList 
    },
    /**
     * Save left drawer businessCard (open/close) to state
     * @param state 
     * @param param1 
     */
    getBusinessCards(state, { payload }: PayloadAction<BusinessCardPayload>) {
      state.businessCardList = payload.businessCardList
    },
    /**
     * Save left drawer productTradings (open/close) to state
     * @param state 
     * @param param1 
     */
    getProductTradings(state, { payload }: PayloadAction<ProductTradingsDataResponse>) {
      state.productTradings = { ...state.productTradings, ...payload }
    },
    /**
     * Save businessCardIdList to state
     * @param state 
     * @param param1 
     */
    getBusinessCardIdList(state, { payload }: PayloadAction<BusinessCardIdListPayload>) {
      state.businessCardIdList = payload.businessCardIdList
    },
    /**
     * Save customerIdList to state
     * @param state 
     * @param param1 
     */
    getCustomerIdList(state, { payload }: PayloadAction<CustomerIdListPayload>) {
      state.customerIdList = payload.CustomerIdList
    },
    getProductTradingIdList(state, { payload }: PayloadAction<productTradingIdListPayload>) {
      state.productTradingIdList = payload.productTradingIdList
    },
    getBusinessCardList(state, { payload }) {
      state.businessCardListNew = payload
    },
    getProductListForSelection(state, { payload }: PayloadAction<DataResponse>) {
      state.listData = { ...state.listData, ...payload.data }
    },
  },
})
export const drawerActivityActions = drawerActivitySlice.actions
export default drawerActivitySlice.reducer
