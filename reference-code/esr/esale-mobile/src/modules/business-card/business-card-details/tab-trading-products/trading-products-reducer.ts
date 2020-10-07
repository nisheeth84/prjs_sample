import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { appStatus } from "../../../../config/constants";
import { ProductsTrading } from "./trading-production-repository";

export interface TradingProductsState {
  productTradings: ProductsTrading[] | any;
  status: string;
}

export interface TradingProductsPayload {
  productTradings: ProductsTrading[];
}

export interface TradingReducers
  extends SliceCaseReducers<TradingProductsState> {}

const TradingProductsSlice = createSlice<TradingProductsState, TradingReducers>(
  {
    name: "trading-production",
    initialState: {
      productTradings: [],
      status: appStatus.PENDING,
    },
    reducers: {
      /**
       * get trading product to tab
       * @param state
       * @param param1
       */
      getDataTradingProducts(
        state,
        { payload }: PayloadAction<TradingProductsPayload>
      ) {
        state.productTradings = [
          ...state.productTradings,
          ...payload.productTradings,
        ];
      },

      /**
       * get trading product to tab load more
       * @param state
       */
      refreshList(state) {
        state.productTradings = [];
      },
    },
  }
);

export const TradingActions = TradingProductsSlice.actions;
export default TradingProductsSlice.reducer;
