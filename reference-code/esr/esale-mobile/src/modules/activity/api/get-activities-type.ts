/**
 * Define data structure for API getActivities
 **/
type CustomersType = {
  customerId?: any
  customerName?: any
}
type ProductTradingsType = {
  productTradingId?: any
  productId?: any
  productName?: any
  quantity?: any
  price?: any
  amount?: any
  productTradingProgressId?: any
  productTradingProgressName?: any
  endPlanDate?: any
  orderPlanDate?: any
  employeeId?: any
  employeeName?: any
  memo?: any
}
type BusinessCardsType = {
  businessCardId?: any
  firstName?: any
  lastName?: any
  firstNameKana?: any
  lastNameKana?: any
  position?: any
  departmentName?: any
}
type DataInfoType = {
  activities?: {
    activityId?: any
    contactDate?: any
    activityStartTime?: any
    activityEndTime?: any
    activityDuration?: any
    employee?: {
      employeeName?: any
      employeeId?: any
      employeePhoto?: {
        photoFileName?: any
        photoFilePath?: any
      }
    }

    businessCards?: BusinessCardsType[]

    interviewer?: any
    customer?: {
      customerId?: any
      customerName?: any
    }

    productTradings?: ProductTradingsType[]

    customers?: CustomersType[]

    memo?: any
    createdUser?: {
      createdDate?: any
      createdUserName?: any
      createdUserId?: any
    }

    updatedUser?: any
    updatedDate?: any
    updatedUserName?: any
    updatedUserId?: any
    extTimeline?: {}
    initializeInfo?: {}
  }
}
export interface GetActivities {
  dataInfo?: DataInfoType[]
}

type FilterConditionsType = {
  fieldType?: any
  fieldName?: any
  filterType?: any
  filterOption?: any
  fieldValue?: any
}

type SearchConditionsType = {
  fieldType?: any
  isDefault?: any
  fieldName?: any
  fieldValue?: any
  searchType?: any
  searchOption?: any
}

export type GetActivitiesForm = {
  employeeId?: any
  listBusinessCardId?: []
  listCustomerId?: []
  searchLocal?: any
  searchConditions?: SearchConditionsType
  filterConditions?: FilterConditionsType[]
  isFirstLoad?: any
  selectedTargetType?: any
  selectedTargetId?: any
  orderBy?: []
  offset?: any
  limit?: any
  hasTimeline?: any
}

export enum ActivityRegisterEditMode {
  REGISTER = 1,
  EDIT = 2,
  COPY = 3
}