/**
 * interface use for description response get product trading
 */
export interface ProductTradings {
  productTradingsByProgress: Array<ProductTradingByProcess>;
  progresses: Array<Progress>;
  initializeInfo: {
    selectedListType: number;
    selectedListId: number;
  };
  fieldInfo: Array<FieldInfo>;
}
/**
 * interface use for description field info
 */

/**
 * interface use for description progress
 */
export interface Progress {
  productTradingProgressId: number;
  progressName: {
    ja_jp: string;
    en_us: string;
    zh_cn: string;
  };
  isAvailable: boolean;
  progressOrder: number;
}
/**
 * interface use for description product trading by process
 */
export interface ProductTradingByProcess {
  progressName: string;
  productTradings: Array<ProductTrading>;
}
/**
 * interface use for description product trading
 */
export interface ProductTrading {
  productTradingId: number;
  customerId: number;
  productTradingProgressId: number;
  progressName: string;
  progressOrder: number;
  isAvailable: boolean;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  amount: number;
  customerName: string;
  employeeId: number;
  employeeName: string;
  employeeSurname: string;
  endPlanDate: string;
  orderPlanDate: string;
  memo: string;
  updateDate: string;
  productTradingData: Array<ProductTradingData>;
  productTradingHistories: Array<ProductTradingHistory>;
  isFinish: boolean;
  check?: boolean;
  employee: any;
}
/**
 * interface use for description product trading history
 */
export interface ProductTradingHistory {
  productTradingId: number;
  contactDate: string;
  activityId: number;
  productTradingData: any;
}
/**
 * interface use for description  products trading data
 */
export interface ProductTradingData {
  fieldType: number;
  key: string;
  value: string;
}
export interface InitializeInfo {
  selectedTargetType: number;
  selectedTargetId: number;
  extraSettings: Array<{
    key: string;
    value: string;
  }>;
  orderBy: Array<{
    key: string;
    fieldType: number;
    value: string;
    isNested: boolean;
  }>;
  filterListConditions: Array<{
    targetType: number;
    targetId: number;

    filterConditions: Array<{
      fieldId: number;
      fieldName: string;
      fieldType: number;
      filedBelong: number;
      filterType: number;
      filterOption: number;
      fieldValue: string;

      isNested: boolean;
    }>;
  }>;
}

export interface Progresses {
  productTradingProgressId: number;
  progressName: string;
  isAvailable: boolean;
  progressOrder: number;
}

export interface FieldInfo {
  fieldId: number;
  relationFieldId: number;
  fieldOrder: number;
  selectedTargetType: number;
  selectedTargetId: number;
  isColumnFixed: boolean;
  columnWidth: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: number;
  isDefault: boolean;
  forwardColor: string;
  forwardText: string;
  backwardColor: string;
  backwardText: string;
  fieldItems: Array<{
    itemId: number;
    itemLabel: string;
    itemOrder: number;
    isDefault: boolean;
  }>;
}

export interface ProductTradingsByProgress {
  progressName: string;
  productTradings: Array<ProductTrading>;
  total: number;
}
