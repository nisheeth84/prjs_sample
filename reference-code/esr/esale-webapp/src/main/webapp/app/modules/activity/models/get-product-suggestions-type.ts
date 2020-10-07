/**
 * Define data structure for API getProductSuggestions
 **/
import { ProductCategoriesType } from './get-activity-type';

export type ProductType = {
  productId?: any;
  productName?: any;
  unitPrice?: any;
  isDisplay?: any;
  productImageName?: any;
  productImagePath?: any;
  productCategoryId?: any;
  productCategoryName?: any;
  memo?: any;
  productCategories?: ProductCategoriesType[];
};
export type GetProductSuggestions = {
  dataInfo?: {
    products?: ProductType[];
  };
};
