import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  Product,
  Category,
  ProductsInfoResponse,
} from "../products-repository";
import { EnumStatus } from "../../../config/constants/enum-status";
import { TEXT_EMPTY } from "../../../config/constants/constants";

export const ALL_PRODUCT = "_ALL_PRODUCT";
export const ALL_PRODUCT_ID = 0;

export interface SelectedCategory {
  productCategoryId: number;
  productCategoryName: string;
}

export interface ProductState {
  products: Array<Product>;
  totalCount: number;
  productCategoryName: string;
  productCategoryId: number | null;
  status: EnumStatus;
  isFirstCall: boolean;
  categories: Array<Category>;
  isContainCategoryChild: boolean | null;
  customFieldsInfo: Array<any>;
  isSet: boolean;
  productID: any;
}

export interface UpdateProductPayload {
  position: number;
  connection: Product;
}

export interface AddProductPayload {
  product: Product;
}
export interface GetAllProductPayload {
  products: Array<Product>;
  totalCount: number;
  productCategories: Array<Category>;
}
export interface SaveCategoryPayload {
  categoryId: number;
  categoryName: string;
}
export interface SortConditionPayload {
  order: number;
  category: number;
}

export interface DeleteProductPayload {
  position: number;
}
export interface ProductReducers extends SliceCaseReducers<ProductState> {}

const productSlice = createSlice<ProductState, ProductReducers>({
  name: "product",
  initialState: {
    products: [],
    totalCount: 0,
    productCategoryName: TEXT_EMPTY,
    productCategoryId: null,
    status: EnumStatus.pending,
    categories: [],
    isFirstCall: true,
    isContainCategoryChild: null,
    customFieldsInfo: [],
    isSet: false,
    productID: 0,
  },
  reducers: {
    /**
     * Save product to state
     * @param state
     * @param param1
     */

    getProducts(state, { payload }: PayloadAction<ProductsInfoResponse>) {
      let dataInfo = payload.dataInfo;

      let arrayProduct = dataInfo.products || [];
      state.products = arrayProduct;
      state.status = EnumStatus.success;
      if (state.isFirstCall) {
        state.categories = dataInfo.productCategories;
      }
      state.totalCount = payload.totalCount;
      state.isFirstCall = false;
      // state.isContainCategoryChild =
      //   payload?.initializeInfo?.extraSetting?.isContainCategoryChild;
    },

    /**
     * Save category to state
     * @param state
     * @param param1
     */

    saveCategory(state, { payload }: PayloadAction<Category>) {
      state.status = EnumStatus.success;
      state.productCategoryName = payload.productCategoryName;
      state.productCategoryId = payload.productCategoryId;
      state.isSet = true;
    },

    /**
     * save all product category
     * @param state
     */
    saveAllProductCategory(state) {
      state.status = EnumStatus.success;
      state.productCategoryName = ALL_PRODUCT;
      state.productCategoryId = ALL_PRODUCT_ID;
      state.isSet = true;
    },

    /**
     * save option show category child
     * @param state
     * @param param1
     */
    saveOptionContainCategoryChild(state, { payload }: PayloadAction<boolean>) {
      state.isContainCategoryChild = payload;
      state.isSet = true;
    },

    /**
     * Save category when api error
     * @param state
     * @param param1
     */
    getProductError(state) {
      state.status = EnumStatus.error;
      state.products = [];
    },

    /**
     * Pending when call api
     * @param state
     * @param param1
     */
    pendingProduct(state) {
      state.status = EnumStatus.pending;
      state.products = [];
    },

    /**
     * save custom field info
     * @param state
     * @param param1
     */
    saveCustomFieldsInfo(state, { payload }: PayloadAction<any>) {
      state.customFieldsInfo = payload.customFieldsInfo;
    },

    /**
     * save category name
     * @param state
     * @param param1
     */
    setCategoryName(state, { payload }: PayloadAction<any>) {
      state.productCategoryName = payload;
    },

    /**
     * set is set
     * @param state
     * @param param1
     */
    setIsSet(state, { payload }: PayloadAction<any>) {
      state.isSet = payload;
    },
    /**
     * set is productID
     * @param state
     * @param param1
     */
    setproductID(state, { payload }: PayloadAction<any>) {
      state.productID = payload;
    },
  },
});

export const productActions = productSlice.actions;
export default productSlice.reducer;
