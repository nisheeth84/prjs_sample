/**
 * Define structure values of data api
 */
export interface DataResponse {
  status: number,
  data: any
}

/**
 * Define values of product
 */
export interface AddressInfo {
  zipCode: string;// data in mapping response
  prefectureName: string;// data in mapping response
  cityName: string;// data in mapping response
  areaName: string;// data in mapping response
}