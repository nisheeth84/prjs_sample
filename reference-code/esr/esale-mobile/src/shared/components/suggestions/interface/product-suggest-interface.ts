

/**
 * Define product suggest view
 */
export interface IProductSuggestProps {
  invisibleLabel?: boolean, // hiden label
  typeSearch: number, // type search (SINGLE or MULTI)
  fieldLabel: string, // label of field
  isRelation?: boolean,//status relation
  isError?: boolean,// set background error
  isRequire?: boolean,// display require label
  initData?: ProductSuggest[],// initial data
  hiddenSelectedData?: boolean,// hidden data selected
  updateStateElement: (searchValue: any) => void; // callback when change status control
  exportError?: (err: any) => void;
}
/**
 * Define milestone suggest view
 */
export interface IResultSearchProps {
  typeSearch: number, // type search (SINGLE or MULTI)
  isRelation?: boolean
  currencyUnit: string
  searchConditions: any[],
  updateStateElement: (searchValue: any) => void; // callback when change status control
  closeModal: () => void
  exportError: (err: any) => void;
}

export interface ProductState {
  //list of Product
  dataInfo: {
    products: Array<ProductSuggest>;
  }
  //total record
  totalCount: number;
}
/**
 * Define values of product
 */
export interface ProductSuggest {
  productId: number;// data in database mapping
  productName: string;// data in database mapping
  unitPrice: number;// data in database mapping
  isDisplay: boolean;// data in database mapping
  productImageName: string;
  productImagePath: string;
  productCategoryId: number;// data in database mapping
  productCategoryName: string// data in database mapping
  memo: string;
  productCategories?: ProductCategories[];
  quantity?: number;

}

/**
 * Define structure values of data api
 */
export interface ProductsSuggestionData {
  data: {
    productSuggestions: {
      dataInfo: ProductSuggest[] // list data form response
    }
  }
}

/**
 * Define values of api
 */
export interface ProductsSuggestionResponse {
  data: ProductsSuggestionData;// data ressponse from database
  status: number;// status off response
}

/**
 * Define values of api
 */
export interface ProductCategories {
  productCategoryId: number
  productCategoryName: string
}

/**
 * Define structure values of data api
 */
export interface ProductSuggestionsChoiceResponse {
  data: { suggestionChoiceId: number[] };// data form response
  status: number;// status off response
}

/**
 * Define structure values of data api
 */
export interface CustomFieldsInfoResponse {
  data: { customFieldsInfo: any[] };// list data form response
  status: number;// status off response
}