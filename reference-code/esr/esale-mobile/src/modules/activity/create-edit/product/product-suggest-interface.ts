import { ActivityFormat } from "../../detail/activity-detail-reducer";

/**
 * Define product suggest view
 */
export interface IProductSuggestProps {
  actionMode: any
  fieldLabel: string, // label of field
  customerId: any,
  activityFormatId: number,
  activityFormatList: Array<ActivityFormat>,
  updateStateElement: (property: string, value: any) => void // callback when change status control
}

export const DefaultProductTrading = {
  productTradingId: null,
  customerId: null,
  productId: null,
  quantity: null,
  price: null,
  amount: null,
  productTradingProgressId: null,
  endPlanDate: null,
  orderPlanDate: null,
  employeeId: null,
  memo: null,
  isFinish: null,
  productTradingData: null
}

export interface SectionProductTrading {
  icon: string
  title: string
  type: string
  data: Array<any>
  renderItem: ({item, index, section : {data}}: any) => any
}