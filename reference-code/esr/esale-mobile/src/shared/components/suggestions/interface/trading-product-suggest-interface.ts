import { ISearchCondition } from "../trading-product/trading-product-search-detail/search-detail-interface";

/**
 * Define milestone suggest view
 */
export interface IResultSearchProps {
    typeSearch: number, // type search (SINGLE or MULTI)
    isRelation?: boolean
    currencyUnit: string
    searchConditions: ISearchCondition[],
    updateStateElement: (searchValue: any) => void; // callback when change status control
    closeModal: () => void
    exportError: (err: any) => void;
}

/**
 * Define TradingProduct suggest view
 */
export interface ITradingProductSuggestProps {
    typeShowResult: number, // type show result in  case multiple choose
    invisibleLabel?: boolean, // hiden label
    typeSearch: number, // type search (SINGLE or MULTI)
    fieldLabel: string, // label of field
    isRelation?: boolean,//status relation
    isError?: boolean,// set background error
    isRequire?: boolean,// display require label
    initData?: TradingProductSuggest[],// initial data
    hiddenSelectedData?: boolean,// hidden data selected
    customerIds?: any[],
    updateStateElement: (searchValue: any) => void; // callback when change status control
    exportError?: (err: any) => void;


}

/**
 * Define values of TradingProduct
 */
export interface TradingProductSuggest {
    productTradingId: number; // data ressponse from database
    customerId: number; // data ressponse from database
    customerName: string; // data ressponse from database 
    productId: number; // data ressponse from database
    productName: string; // data ressponse from database
    productImageName: string; // data ressponse from database
    productImagePath?: string; // data ressponse from database
    productCategoryId: number; // data ressponse from database
    productCategoryName: any; // data ressponse from database
    memoProduct: string; // data ressponse from database
    quantity: number; // data ressponse from database
    price: number; // data ressponse from database
    amount: number; // data ressponse from database
    employeeId: number; // data ressponse from database
    employeeName: string; // data ressponse from database
    employeePhoto: string; // data ressponse from database
    endPlanDate: string; // data ressponse from database
    orderPlanDate: string; // data ressponse from database
    progressName: string; // data ressponse from database
    memo: string; // data ressponse from database
    completionDate: string;  // data ressponse from database
}

/**
 * Define structure values of data api
 */
export interface TradingProductsSuggestionData {
    data: {
        TradingProductSuggestions: {
            dataInfo: TradingProductSuggest[] // list data form response
        }
    }
}

/**
 * Define values of api
 */
export interface TradingProductsSuggestionResponse {
    data: TradingProductsSuggestionData;// data ressponse from database
    status: number;// status off response
}

/**
 * Define structure values of data api
 */
export interface TradingProductSuggestionsChoiceResponse {
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

export interface TradingProductState {
    //list of Product
    productTradings: ProductTradings[];
    //total record
    total: number;
    //lastUpdateDate:
    lastUpdateDate: string;
}

export interface ProductTradings {
    productTradingId: number;
    customerName: string;
    customerId: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    amount: number;
    productTradingProgressId: number;
    progressName: string;
    progressOrder: number;
    isAvailable: boolean;
    employeeId: number;
    employeeName: string;
    employeeSurname: string;
    endPlanDate: string;
    orderPlanDate: string;
    memo: string;
    updateDate: string;
}

/**
 * Define values of api getTasksSuggestion
 */
export interface GetTradingProductSuggestionResponse {
    data: any
    status: number;// status off response
}