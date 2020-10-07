import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  HistoryProduct,
  Product,
  ProductDetailInfoResponse,
  ProductDetailSetInclude,
  ProductDetailTrading,
  ProductDetailTradingGeneralInfo,
} from "../products-repository";
import { EnumStatus } from "../../../config/constants/enum-status";

export interface ProductDetailsState {
  productDetails: Array<Product>;
  productDetailTrading: Array<ProductDetailTrading>;
  productDetailTradingGeneralInfo: Array<ProductDetailTradingGeneralInfo>;
  productDetailSetInclude: Array<ProductDetailSetInclude>;
  status: EnumStatus;
  historyProduct: Array<HistoryProduct>;
  fieldInfo?: Array<any>;
  productTypes?: Array<any>;
  tabInfo?: Array<any>;
}

export interface ProductDetailsReducers
  extends SliceCaseReducers<ProductDetailsState> {}

const productSlice = createSlice<ProductDetailsState, ProductDetailsReducers>({
  name: "product",
  initialState: {
    productDetails: [],
    productDetailTradingGeneralInfo: [],
    productDetailTrading: [],
    productDetailSetInclude: [],
    status: EnumStatus.pending,
    historyProduct: [],
    fieldInfo: [],
    productTypes: [],
  },
  reducers: {
    /**
     * update product detail into state
     * @param state
     * @param payload
     */
    getProductDetails(
      state,
      { payload }: PayloadAction<ProductDetailInfoResponse>
    ) {
      state.productDetails = [payload.product];
      state.productDetailSetInclude = payload.productSets;
      state.productDetailTradingGeneralInfo = [payload.productTradings];
      state.status = EnumStatus.success;
      state.fieldInfo = payload.fieldInfo;
      state.productTypes = payload.productTypes;
      state.tabInfo = payload.tabInfo;
    },
    /**
     * update product trading detail into state
     * @param state
     * @param payload
     */
    getproductDetailTrading(
      state,
      { payload }: PayloadAction<Array<ProductDetailTrading>>
    ) {
      state.productDetailTrading = payload;
      state.status = EnumStatus.success;
    },

    /**
     * update product history into state
     * @param state
     * @param payload
     */
    getProductHistories(
      state,
      { payload }: PayloadAction<Array<HistoryProduct>>
    ) {
      state.historyProduct = payload;
    },
    /**
     * update data when api error
     * @param state
     * @param payload
     */
    getProductError(state) {
      state.status = EnumStatus.error;
      state.productDetails = [];
    },
    /**
     * set status
     * @param state
     * @param payload
     */
    setStatus(state, { payload }: PayloadAction<number>) {
      state.status = payload;
    },
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;
