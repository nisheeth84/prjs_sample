import { SliceCaseReducers, createSlice, PayloadAction } from "@reduxjs/toolkit"

/**
 * Define values of api
 */
export interface ProductsSuggestionResponse {
  data: ProductsSuggestionData// data response from database
  status: number// status off response
}

/**
 * Define structure values of data api
 */
export interface ProductsSuggestionData {
  data: {
    productSuggestions: {
      dataInfo: ProductSuggestion[] // list data form response
    }
  }
}

export interface GetProductSuggestionPayload {
  productTradings: Array<ProductSuggestion>
}

export type ProductSuggestion = {
  productTradingId?: any,
  customerId?: any,
  customerName?: any,
  productId?: any,
  productName?: any,
  productImageName?: any,
  productImagePath?: any,
  productCategoryId?: any,
  productCategoryName?: any,
  memoProduct?: any,
  quantity?: any,
  price?: any,
  amount?: any,
  employeeId?: any,
  employeeName?: any,
  employeeSurname?: any,
  endPlanDate?: any,
  orderPlanDate?: any,
  progressName?: any,
  memo?: any,
  productTradingData?: any,
  unitPrice?: any,
  isDisplay?: any,
  productCategories?: Array<any>,
  productTradingProgressId?: any
}

export interface IBusinessCardSuggestProps {
  customerId: number
  fieldLabel?: any
  updateStateElement: (searchValue: any) => void // callback when change status control 
}
export interface BusinessCardSuggest {
  businessCardId: number
  departmentName: string
  businessCardName: string
  position: number
  customerName: string
}
export interface BusinessCardSuggestionsPayload {
  offset: number
  searchValue: string
  listIdChoice: Array<number>
  customerIds: Array<number>
  relationFieldId?: number
}
export interface GetBusinessCardSuggestionPayload {
  businessCards: Array<BusinessCardSuggest>
}

export interface ActivityCreateEditState {
  productSuggestions: Array<ProductSuggestion>,
  businessCardSuggestions: Array<BusinessCardSuggest>
}

export interface ActivityCreateEditReducers extends SliceCaseReducers<ActivityCreateEditState> {}

const activityCreateEditSlice = createSlice<ActivityCreateEditState, ActivityCreateEditReducers>({
  name: 'activityCreateEdit',
  initialState: {
    productSuggestions: [],
    businessCardSuggestions: []
  },
  reducers: {
    getProductSuggestion(state, { payload }: PayloadAction<GetProductSuggestionPayload>) {
      state.productSuggestions = payload.productTradings
    },
    getBusinessCardSuggestions(state, { payload }: PayloadAction<GetBusinessCardSuggestionPayload>) {
      state.businessCardSuggestions = payload.businessCards
    }
  }
})

export const activityCreateEditActions = activityCreateEditSlice.actions
export default activityCreateEditSlice.reducer