import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  Product,
  ProductDetailTrading,
  ProductSetDetailInfoResponse,
  ProductDetailSetInclude,
  ProductDetailTradingGeneralInfo,
  HistoryProduct,
  HistorySetProduct
} from "../products-repository";
import { EnumStatus } from "../../../config/constants/enum-status";


export interface ProductSetDetailsState {
  productSetDetail: Array<ProductDetailSetInclude>;
  product: Array<Product>;
  productDetailSetInclude: Array<ProductDetailSetInclude>;
  productDetailTrading: Array<ProductDetailTrading>;
  productDetailTradingGeneralInfo: Array<ProductDetailTradingGeneralInfo>;
  status: EnumStatus;
  historyProduct: Array<HistoryProduct>;
  historySetProduct: Array<HistorySetProduct>;
  fieldInfo?: Array<any>;
  fieldInfoSet?: Array<any>;
  productTypesSet?: Array<any>;
  tabInfo?: Array<any>;
}

export interface ProductDetailsReducers extends SliceCaseReducers<ProductSetDetailsState> { }

const productSlice = createSlice<ProductSetDetailsState, ProductDetailsReducers>({
  name: "product",
  initialState: {
    productSetDetail: [],
    product: [],
    productDetailTradingGeneralInfo: [],
    productDetailTrading: [],
    productDetailSetInclude: [],
    status: EnumStatus.pending,
    historyProduct: [],
    historySetProduct: [],
    fieldInfo: [],
    fieldInfoSet: [],
    productTypesSet: [],
    tabInfo: []
  },
  reducers: {
    /**
     * get product set detail
     * @param state
     * @param param1
     */
    getProductSetDetails(state, { payload }: PayloadAction<ProductSetDetailInfoResponse>) {
      state.productSetDetail = [payload.productSet];
      state.product = payload.products;
      state.productDetailSetInclude = payload.productSets;
      state.productDetailTradingGeneralInfo = [payload.productTradings];
      state.status = EnumStatus.success;
      state.productTypesSet = payload.productTypes;
    },

    /**
     * get product detail trading
     * @param state
     * @param param1
     */
    getproductDetailTrading(state, { payload }: PayloadAction<Array<ProductDetailTrading>>) {
      state.productDetailTrading = payload;
      state.status = EnumStatus.success;
    },

    /**
     * get product set history
     * @param state
     * @param param1
     */
    getProductSetHistories(state, { payload }: PayloadAction<Array<HistorySetProduct>>) {
      state.historySetProduct = payload
    },

    /**
     * get product error
     * @param state
     */
    getProductError(state) {
      state.status = EnumStatus.error;
      state.productSetDetail = [];
    },

    /**
     * set field info product
     * @param state
     */
    setFieldInfo(state, { payload }: PayloadAction<Array<any>>) {
      state.fieldInfo = payload;
    },
    /**
     * set field info product set
     * @param state
     */
    setFieldInfoSet(state, { payload }: PayloadAction<Array<any>>) {
      state.fieldInfoSet = payload;
    },
    /**
     * set status set
     * @param state
     */
    setStatusSet(state, { payload }: PayloadAction<number>) {
      state.status = payload;
    },
    /**
     * set tab info
     * @param state 
     */
    setTabInfo(state, { payload }: PayloadAction<Array<any>>) {
      state.tabInfo = payload;
    }
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;
