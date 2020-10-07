/**
 * Define data structure for API getActivity
 **/
import { AnyARecord } from 'dns';

type FieldInfoType = {
  fieldId?: any;
  fieldName?: any;
};
type SchedulesType = {
  scheduleId?: any;
  scheduleName?: any;
};
type TasksType = {
  taskId?: any;
  taskName?: any;
};
type CustomersType = {
  customerId?: any;
  customerName?: any;
  customerPhoto?: {};
};

type EmployeeType = {
  employeeId?: any;
  employeeName?: any;
  employeeSurname: string;
  employeePhoto?: {
    fileName?: any;
    filePath?: any;
  };
};

type CreatedUserType = EmployeeType & {
  createdDate?: any;
};

type UpdatedUserType = EmployeeType & {
  updatedDate?: any;
};
export type ProductCategoriesType = {
  productCategoryId?: any;
  productCategoryName?: any;
  level?: any;
};

export type ProgressesType = {
  productTradingProgressId?: any;
  progressName?: any;
  isAvailable?: any;
  progressOrder?: any;
};
type FieldInfoProductTradingType = {
  fieldId?: any;
  fieldName?: any;
};
type TabInfoType = {
  tabId?: any;
  tabInfoId?: any;
  tabLabel?: string;
  isDisplay?: boolean;
  isDisplaySummary?: boolean;
  maxRecord?: number;
  tabOrder?: any;
};

type FieldItemsType = {
  itemId?: any;
  isAvailable?: any;
  itemOrder?: any;
  isDefault?: any;
  itemLabel?: any;
};

export type FieldInfoActivityType = {
  fieldId?: any;
  fieldBelong?: any;
  lookupFieldId?: any;
  fieldName?: any;
  fieldLabel?: any;
  fieldType?: any;
  fieldOrder?: any;
  isDefault?: any;
  maxLength?: any;
  modifyFlag?: any;
  availableFlag?: any;
  isDoubleColumn?: any;
  defaultValue?: any;
  currencyUnit?: any;
  typeUnit?: any;
  decimalPlace?: any;
  activityLinkedFieldId?: any;
  urlType?: any;
  urlTarget?: any;
  urlEncode?: any;
  urlText?: any;
  linkTarget?: any;
  configValue?: any;
  isLinkedGoogleMap?: any;
  fieldGroup?: any;
  lookupData?: {
    extensionBelong?: any;
    searchKey?: any;
    itemReflect?: any;
  };

  relationData?: {
    extensionBelong?: any;
    fieldId?: any;
    format?: any;
    displayTab?: any;
    displayFields?: any;
  };
  salesProcess?: any;
  tabData?: any;
  fieldItems?: FieldItemsType[];
  differenceSetting?: {
    isDisplay?: any;
    backwardColor?: any;
    backwardText?: any;
    forwardColor?: any;
    forwardText?: any;
  };
};
type CustomerRelationsType = {
  customerRelationId?: any;
  customerId?: any;
  customerName?: any;
  customerPhoto?: {
    filePath?: any;
    fileName?: any;
  };
  customerParent?: {
    customerName?: AnyARecord;
  };
  customerAddress?: {
    address?: any;
  };
};
export type ProductTradingsType = {
  productTradingId?: any;
  productTradingName?: any;
  producTradingName?: any;
  customerId?: any;
  customerName?: any;
  productId?: any;
  productName?: any;
  productImagePath?: any;
  productImageName?: any;
  quantity?: any;
  price?: any;
  amount?: any;
  productTradingProgressId?: any;
  progressName?: any;
  endPlanDate?: any;
  orderPlanDate?: any;
  employee?: {
    employeeId?: any;
    employeeName?: any;
    employeeSurname?: any;
    employeePhoto?: {
      filePath?: any;
      fileName?: any;
      fileUrl?: any;
    };
  };
  memo?: any;
  productTradingData?: any;
};

export type BusinessCardsType = {
  businessCardId?: any;
  customerName?: any;
  firstName?: any;
  lastName?: any;
  firstNameKana?: any;
  lastNameKana?: any;
  position?: any;
  departmentName?: any;
  businessCardImagePath?: any;
  businessCardImageName?: any;
};
type ActivityFormatsType = {
  activityFormatId?: any;
  name?: any;
  fieldUse?: {};
  productTradingFieldUse?: any;
};

export type ActivityInfoType = {
  isDraft?: any;
  activityId?: any;
  activityDraftId?: any;
  contactDate?: any;
  activityStartTime?: any;
  activityEndTime?: any;
  activityDuration?: any;
  activityFormatId?: any;
  name?: any;
  activityFormats?: ActivityFormatsType[];
  employee?: {
    employeeId?: any;
    employeeName?: any;
    employeeSurname?: any;
    employeePhoto?: {
      filePath?: any;
      fileName?: any;
      fileUrl?: any;
    };
  };
  businessCards?: BusinessCardsType[];
  interviewers?: any[];
  interviewer?: any[];
  customer?: {
    customerId?: any;
    customerName?: any;
    customerPhoto?: {
      filePath?: any;
      fileName?: any;
    };
    customerParent?: {
      customerName?: AnyARecord;
    };
    customerAddress?: {
      address?: any;
    };
  };
  productTradings?: ProductTradingsType[];
  customerRelations?: CustomerRelationsType[];
  memo?: any;
  task?: {
    taskId?: any;
    taskName?: any;
    finishDate?: any;
    milestoneName?: any;
    customers?: {
      customerName?: any;
      parentCustomerName?: any;
    };
    operators?: {
      employeeName?: any;
    };
  };
  schedule?: {
    scheduleId?: any;
    scheduleName?: any;
    finishDate?: any;
    customer?: {
      parentCustomerName?: any;
      customerName?: any;
    };
    productTradings?: {
      producTradingName?: any;
    };
    parentCustomerName?: any;
    customerName?: any;
    producTradingName?: any;
  };
  milestone?: {
    milestoneId?: any;
    milestoneName?: any;
    endDate?: any;
    customer?: {
      customerName?: any;
      parentCustomerName?: any;
    };
  };
  nextSchedules?: any;
  nextSchedule?: {
    activityDraftId?: number;
    scheduleId?: any;
    scheduleName?: any;
    startDate?: any;
    finishDate?: any;
    iconPath?: any;
    customerName?: any;
    scheduleType?: any;
    customer?: any;
    customers?: any;
    productTradings: ProductTradingsType[];
  };
  customerId?: any;
  nextScheduleDate?: any;
  createdUser?: {
    createdDate?: any;
    employeeName?: any;
    employeeSurname?: any;
    employeePhoto?: {
      filePath?: any;
      fileName?: any;
      fileUrl?: any;
    };
    employeeId?: any;
  };
  updatedUser?: {
    updatedDate?: any;
    employeeName?: any;
    employeeSurname?: any;
    employeePhoto?: {
      filePath?: any;
      fileName?: any;
      fileUrl?: any;
    };
    employeeId?: any;
  };
  activityData?: any;
  createdDate?: any;
  updatedDate?: any;
  extTimeline?: any;
};

export type GetActivity = {
  activities?: ActivityInfoType;
  fieldInfoActivity?: FieldInfoActivityType[];
  tabInfo?: TabInfoType[];
  fieldInfoProductTrading?: FieldInfoActivityType[];
  progresses?: ProgressesType[];
  scenario?: {};
  tabListShow?: TabInfoType[];
};

export type APIGetActivityForm = {
  activityId: number;
  isOnlyData?: boolean;
  mode: string;
  hasTimeline?: boolean;
  isDraft?: boolean;
};
