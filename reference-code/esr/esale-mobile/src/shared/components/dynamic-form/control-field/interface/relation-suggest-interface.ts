import { EmployeeSuggest } from "../../../suggestions/interface/employee-suggest-interface";
import { ProductSuggest } from "../../../suggestions/interface/product-suggest-interface";

/**
 * Define product suggest view
 */
export interface RelationDataDTO {
  product: ProductSuggest[], // data product suggest
  employee: EmployeeSuggest[], // data employee suggest
  updateStateElement: (searchValue: any) => void; // callback when change status control
}
