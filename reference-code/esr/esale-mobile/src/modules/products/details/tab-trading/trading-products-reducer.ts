import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

export interface Sort {
  key: string;
  value: string;
  fieldType: number;
}

export interface FieldInfoProduct {
  fieldId: number;
  fieldName: any;
  forwardColor: any;
  forwardText: any;
  backwardText: any;
  backwardColor: any;
  fieldLabel: any;
  isDefault: any;
}
/**
 * interface productsTradings
 */
export interface TradingProductsState {
  productsTradings: Array<any>;
  status: any;
  sort: Array<Sort>;
  fieldInfo: Array<any>;
}
/**
 * interface extends TradingProductsState
 */
export interface TradingReducers
  extends SliceCaseReducers<TradingProductsState> {}
/**
 * control state Product trading
 */
const TradingProductsSlice = createSlice<TradingProductsState, TradingReducers>(
  {
    name: "trading-production",
    initialState: {
      productsTradings : [],
      status: "pending",
      sort: [ {
        key: "customer_id",
        value: "ASC",
        fieldType: 99
    }],
      fieldInfo: [],
    },
    reducers: {
      /**
       * get trading product to tab
       * @param state 
       * @param param1 
       */
      getDataTradingProducts(state, { payload }: PayloadAction<any>) { 
        state.productsTradings = payload.productTradings;
        state.fieldInfo = payload.fieldInfo
      },
      /**
       * get load more data product
       * @param state 
       * @param param1 
       */
      addItemLoadmoreProduct(state, { payload }: PayloadAction<any>){
        state.productsTradings = [...state.productsTradings,...payload.productTradings];
      },
      getSortData(state, { payload }: PayloadAction<any>) { 
        state.sort = payload;
      },
    },
  }
); 

export const TradingActions = TradingProductsSlice.actions;
export default TradingProductsSlice.reducer;
