import { IFieldInfoPersonal, ISearchCondition } from "../milestone/milestone-search-detail/search-detail-interface";

/**
 * Define customer suggest view
 */
export interface IMilestoneSuggestionsProps {
  invisibleLabel?: boolean, // hiden label
  typeSearch: number, // type search (SINGLE or MULTI)
  fieldLabel: string, // label of field
  isRelation?: boolean,//status relation
  isError?: boolean,// set background error
  isRequire?: boolean,// display require label
  initData?: any[],// initial data
  hiddenSelectedData?: boolean,// hidden data selected
  updateStateElement: (searchValue: any) => void; // callback when change status control
  exportError?: (err: any) => void;
}

/**
 * Define values of milestone
 */
export interface MilestoneSuggest {
  milestoneId: number,// data mapping response
  milestoneName: string,// data mapping response
  parentCustomerName: string,// data mapping response
  customerName: string,// data mapping response
  productName: string, // data mapping response
  finishDate: string // data mapping response

}


/**
 * Define structure values of data api
 */
export interface MilestoneSuggestionResponse {
  data: MilestoneSuggest[];// list data form response
  status: number;// status off response
}
/**
 * Define structure values of data api
 */
export interface CustomFieldsInfoResponse {
  data: { customFieldsInfo: any[] };// list data form response
  status: number;// status off response
}

/**
 * Define structure values of data api
 */
export interface FieldInfoPersonalsResponse {
  data: { fieldInfoPersonals: IFieldInfoPersonal[] };// data form response
  status: number;// status off response
}
/**
 * Define milestone suggest view
 */
export interface IResultSearchProps {
  typeSearch: number;// type search (SINGLE or MULTI)
  searchConditions: ISearchCondition[];
  isRelation?: boolean;
  updateStateElement: (searchValue: any) => void; // callback when change status control
  closeModal: () => void;
  exportError: (err: any) => void;
}
/**
 * Define structure values of data api
 */
export interface SuggestionsChoiceResponse {
  data: number[];// list data form response
  status: number;// status off response
}