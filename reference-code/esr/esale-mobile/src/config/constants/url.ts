import { apiUrl } from "./api";

export const productDetailUrl =
  apiUrl + "[tenantExample]/product/product-detail";
export const productSetDetailUrl =
  apiUrl + "[tenantExample]/product/product-set-detail";
export const taskDetailUrl =
  apiUrl + "[tenantExample]/todo/task/detail";

export const getUrl = (defaultUrl: string, tenantID: string, id: number) => {
  return `${defaultUrl.replace(/\[tenantExample\]/g, tenantID)}/${id}`;
}
