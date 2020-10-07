import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { ProductTradings } from "../product-type";
import {
  ProductTradingActive,
  LIST_TYPE,
  TypeMessage
} from "../../../config/constants/enum";
import { TEXT_EMPTY } from "../../../config/constants/constants";

export interface ProductManageState {
  listProductTrading: any;
  drawerListSelected: {
    selectedTargetType: number;
    selectedTargetId?: number;
    listMode?: number;
    displayOrderOfFavoriteList?: number;
    listId?: number;
    listName?: string;
    displayOrder?: number,
    listType?: number,
    ownerList?: any,
    viewerList?: any,
    updatedDate?: string,
  };
  productTradingListDetailId: number;
  dataProductTradingList: any;
  tab: boolean;
  warningMessage: {
    type: string,
    content: string,
    isShow: boolean
  };
  reloadDrawer: boolean;
  selectRecord: boolean;
  reloadAutoList: boolean;
  refreshList: boolean;
}

export interface AddProductTradingPayload {
  listProductTrading: ProductTradings;
}

export interface ProductManageReducers
  extends SliceCaseReducers<ProductManageState> { }

const productManageSlice = createSlice<
  ProductManageState,
  ProductManageReducers
>({
  name: "product-manage",
  initialState: {
    drawerListSelected: {
      selectedTargetType: ProductTradingActive.ALL_PRODUCT_TRADING,
    },
    listProductTrading: {
      productTradingsByProgress: [],
      progresses: [],
      initializeInfo: {
        selectedListType: 1,
        selectedListId: 50,
      },
      fieldInfo: [],
    },
    productTradingListDetailId: 0,
    dataProductTradingList: {
      favorListBC: [],
      myListBC: [],
      sharedListBC: [],
    },
    tab: true,
    warningMessage: {
      content: TEXT_EMPTY,
      isShow: false,
      type: TypeMessage.SUCCESS
    },
    reloadDrawer: false,
    selectRecord: false,
    reloadAutoList: false,
    refreshList: false,
  },
  reducers: {
    getProductTrading(
      state,
      { payload }: PayloadAction<any>
    ) {
      state.listProductTrading = payload.listProductTrading;
    },
    saveDrawerAllReceived(state, { payload }: PayloadAction<any>) {
      state.drawerListSelected = payload;
    },
    saveDrawerListSelected(state, { payload }: PayloadAction<any>) {
      state.drawerListSelected = payload;
    },

    getProductTradingList(state, { payload }: PayloadAction<any>) {
      const { data } = payload;
      state.dataProductTradingList = { ...state.dataProductTradingList, ...data };

      state.dataProductTradingList.favorListBC = data.listInfo.filter(
        (el: any) => {
          return el.displayOrderOfFavoriteList !== null;
        }
      );
      state.dataProductTradingList.myListBC = data.listInfo.filter(
        (el: any) => el.listType === LIST_TYPE.myList
      );
      state.dataProductTradingList.sharedListBC = data.listInfo.filter(
        (el: any) => el.listType === LIST_TYPE.sharedList
      );
    },
    getTabbar(state, { payload }: PayloadAction<boolean>) {
      state.tab = payload;
    },
    closeMessageWarning(state) {
      state.warningMessage = {
        content: TEXT_EMPTY,
        isShow: false,
        type: TypeMessage.INFO
      }
    },
    showMessageWarning(state, { payload }: PayloadAction<{
      content: string,
      type: string
    }>) {
      state.warningMessage = {
        content: payload.content,
        isShow: true,
        type: payload.type
      };
      state.selectRecord = !state.selectRecord;
    },
    reloadDrawer(state) {
      state.reloadDrawer = !state.reloadDrawer;
      state.drawerListSelected = {
        selectedTargetType: ProductTradingActive.ALL_PRODUCT_TRADING
      }
    },
    reloadAutoList(state) {
      state.reloadAutoList = !state.reloadAutoList;
    },
    refreshListReducer(state) {
      state.refreshList = !state.refreshList;
    },
  },
});

export const productManageActions = productManageSlice.actions;
export default productManageSlice.reducer;
