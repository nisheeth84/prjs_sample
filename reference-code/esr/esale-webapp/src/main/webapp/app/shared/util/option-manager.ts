import { getValueProp } from './entity-utils';
import _ from 'lodash';

export const EXTENDED_FIELD = 0;
export const FIELD_OPTION = {
  DEFAULT_VALUE: 'defaultValue',
  REQUIRED: 'required',
  USE_METHOD: 'avaiableFlag', // according to existing key - avaiableFlag
  PERMISSION: 'permission',
  SALES_PROCESS: 'salesProcess',
  DIFFERENCE_SETTING: 'differenceSetting'
};
const OptionFieldManager = [
  {
    fieldBelong: 8,
    employeeId: { defaultValue: false, required: false, avaiableFlag: true, permission: true },
    employeeIcon: { defaultValue: false, required: true, avaiableFlag: false },
    employeeDepartments: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      permission: true
    },
    employeePositions: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      permission: true
    },
    employeeSurname: { defaultValue: false, required: false, avaiableFlag: false },
    employeeName: { defaultValue: false, required: true, avaiableFlag: true, permission: true },
    employeeSurnameKana: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      permission: true
    },
    employeeNameKana: { defaultValue: false, required: true, avaiableFlag: true, permission: true },
    email: { defaultValue: true, required: true, avaiableFlag: true, permission: true },
    cellphoneNumber: { defaultValue: true, required: true, avaiableFlag: true, permission: true },
    telephoneNumber: { defaultValue: true, required: true, avaiableFlag: true, permission: true },
    employeeManagers: { defaultValue: false, required: false, avaiableFlag: false },
    employeeSubordinates: { defaultValue: false, required: false, avaiableFlag: false },
    subscriptionId: { defaultValue: false, required: false, avaiableFlag: true, permission: true },
    userId: { defaultValue: false, required: false, avaiableFlag: true, permission: true }
  },
  {
    fieldBelong: 14,
    productId: { defaultValue: false, required: false, avaiableFlag: true, salesProcess: true },
    productImageName: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      salesProcess: true
    },
    productName: { defaultValue: false, required: false, avaiableFlag: false, salesProcess: true },
    unitPrice: { defaultValue: false, required: true, avaiableFlag: true, salesProcess: true },
    productCategoryName: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      salesProcess: true
    },
    productTypeName: {
      defaultValue: false,
      required: false,
      avaiableFlag: true,
      salesProcess: true
    },
    memo: { defaultValue: true, required: true, avaiableFlag: true, salesProcess: true },
    isDisplay: { defaultValue: false, required: false, avaiableFlag: false, salesProcess: false },
    createdDate: { defaultValue: false, required: false, avaiableFlag: true, salesProcess: false },
    createdUser: { defaultValue: false, required: false, avaiableFlag: true, salesProcess: false },
    updatedDate: { defaultValue: false, required: false, avaiableFlag: true, salesProcess: false },
    updatedUser: { defaultValue: false, required: false, avaiableFlag: true, salesProcess: false }
  },
  {
    fieldBelong: 15,
    taskName: {
      defaultValue: false,
      required: false,
      avaiableFlag: false,
      differenceSetting: false
    },
    memo: { defaultValue: true, required: true, avaiableFlag: true, differenceSetting: false },
    operatorId: {
      defaultValue: false,
      required: false,
      avaiableFlag: false,
      differenceSetting: false
    },
    startDate: {
      defaultValue: false,
      required: false,
      avaiableFlag: false,
      differenceSetting: true
    },
    finishDate: {
      defaultValue: false,
      required: false,
      avaiableFlag: false,
      differenceSetting: true
    },
    customerName: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      differenceSetting: false
    },
    productsTradingsId: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      differenceSetting: false
    },
    milestoneName: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      differenceSetting: false
    },
    fileName: { defaultValue: false, required: true, avaiableFlag: true, differenceSetting: false },
    status: { defaultValue: false, required: false, avaiableFlag: false, differenceSetting: true },
    isPublic: {
      defaultValue: false,
      required: false,
      avaiableFlag: false,
      differenceSetting: false
    },
    taskId: { defaultValue: false, required: true, avaiableFlag: true, differenceSetting: false },
    createdDate: {
      defaultValue: false,
      required: false,
      avaiableFlag: true,
      differenceSetting: false
    },
    createdUser: {
      defaultValue: false,
      required: false,
      avaiableFlag: true,
      differenceSetting: false
    },
    updatedDate: {
      defaultValue: false,
      required: false,
      avaiableFlag: true,
      differenceSetting: false
    },
    updatedUser: {
      defaultValue: false,
      required: false,
      avaiableFlag: true,
      differenceSetting: false
    }
  },
  {
    fieldBelong: 16,
    productTradingId: { defaultValue: false, required: false, avaiableFlag: false },
    productName: { defaultValue: false, required: false, avaiableFlag: false },
    quantity: { defaultValue: false, required: true, avaiableFlag: true },
    price: { defaultValue: false, required: true, avaiableFlag: true },
    amount: { defaultValue: false, required: false, avaiableFlag: true },
    productTradingProgressId: { defaultValue: true, required: false, avaiableFlag: false },
    endPlanDate: { defaultValue: false, required: true, avaiableFlag: false },
    productsTradingsId: { defaultValue: false, required: true, avaiableFlag: true },
    memo: { defaultValue: true, required: true, avaiableFlag: true },
    employeeId: { defaultValue: false, required: false, avaiableFlag: true },
    createdDate: {
      defaultValue: false,
      required: false,
      avaiableFlag: true,
      differenceSetting: false
    },
    createdUser: { defaultValue: false, required: false, avaiableFlag: true },
    updatedDate: {
      defaultValue: false,
      required: false,
      avaiableFlag: true,
      differenceSetting: false
    },
    updatedUser: { defaultValue: false, required: false, avaiableFlag: true },
    orderPlanDate: { defaultValue: false, required: true, avaiableFlag: false }
  },
  {
    fieldBelong: 5,
    customerId: { defaultValue: false, required: false, avaiableFlag: true },
    customerParent: { defaultValue: false, required: true, avaiableFlag: true },
    customerName: { defaultValue: false, required: false, avaiableFlag: false },
    customerAliasName: { defaultValue: false, required: true, avaiableFlag: true },
    phoneNumber: { defaultValue: true, required: true, avaiableFlag: true },
    zipCode: { defaultValue: false, required: true, avaiableFlag: true },
    prefecture: { defaultValue: false, required: true, avaiableFlag: true },
    address: { defaultValue: false, required: true, avaiableFlag: true },
    building: { defaultValue: false, required: true, avaiableFlag: true },
    businessMainId: { defaultValue: true, required: true, avaiableFlag: true },
    employeeId: { defaultValue: true, required: true, avaiableFlag: true },
    totalTradingAmount: { defaultValue: false, required: false, avaiableFlag: true },
    scenarioId: { defaultValue: false, required: true, avaiableFlag: true },
    url: { defaultValue: true, required: true, avaiableFlag: true },
    scheduleNext: { defaultValue: false, required: true, avaiableFlag: true },
    actionNext: { defaultValue: false, required: false, avaiableFlag: true },
    memo: { defaultValue: true, required: true, avaiableFlag: true },
    createdDate: { defaultValue: false, required: false, avaiableFlag: true },
    createdUser: { defaultValue: false, required: false, avaiableFlag: true },
    updatedDate: { defaultValue: false, required: false, avaiableFlag: true },
    updatedUser: { defaultValue: false, required: false, avaiableFlag: true },
    customerLogo: { defaultValue: false, required: true, avaiableFlag: true }
  },
  {
    fieldBelong: 4,
    businessCardId: { defaultValue: false, required: false, avaiableFlag: true },
    businessCardImagePath: { defaultValue: false, required: true, avaiableFlag: true },
    firstName: { defaultValue: false, required: true, avaiableFlag: true },
    lastName: { defaultValue: false, required: false, avaiableFlag: false },
    lastNameKana: { defaultValue: false, required: true, avaiableFlag: true },
    firstNameKana: { defaultValue: false, required: true, avaiableFlag: true },
    position: { defaultValue: true, required: true, avaiableFlag: true },
    departmentName: { defaultValue: true, required: true, avaiableFlag: true },
    zipCode: { defaultValue: false, required: true, avaiableFlag: true },
    prefecture: { defaultValue: false, required: true, avaiableFlag: true },
    address: { defaultValue: false, required: true, avaiableFlag: true },
    building: { defaultValue: false, required: true, avaiableFlag: true },
    emailAddress: { defaultValue: true, required: true, avaiableFlag: true },
    phoneNumber: { defaultValue: true, required: true, avaiableFlag: true },
    mobileNumber: { defaultValue: true, required: true, avaiableFlag: true },
    employeeId: { defaultValue: true, required: true, avaiableFlag: true },
    receivedLastContactDate: { defaultValue: true, required: true, avaiableFlag: true },
    isWorking: { defaultValue: false, required: true, avaiableFlag: true },
    memo: { defaultValue: true, required: true, avaiableFlag: true },
    createdDate: { defaultValue: false, required: false, avaiableFlag: true },
    createdUser: { defaultValue: false, required: false, avaiableFlag: true },
    updatedDate: { defaultValue: false, required: false, avaiableFlag: true },
    updatedUser: { defaultValue: false, required: false, avaiableFlag: true }
  },
  {
    fieldBelong: 6,
    contactDate: { defaultValue: false, required: false, avaiableFlag: false, salesProcess: true },
    activityTime: { required: false, defaultValue: false, avaiableFlag: false, salesProcess: true },
    activityFormatName: {
      defaultValue: true,
      required: false,
      avaiableFlag: false,
      salesProcess: true
    },
    activityDuration: {
      defaultValue: false,
      required: false,
      avaiableFlag: false,
      salesProcess: true
    },
    employeeId: { defaultValue: false, required: false, avaiableFlag: false, salesProcess: true },
    interviewer: { defaultValue: false, required: true, avaiableFlag: true, salesProcess: true },
    customerName: { defaultValue: false, required: true, avaiableFlag: true, salesProcess: true },
    productTradingId: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      salesProcess: true
    },
    memo: { defaultValue: false, required: true, avaiableFlag: true, salesProcess: true },
    createdDate: { defaultValue: false, required: false, avaiableFlag: true, salesProcess: false },
    createdUser: { defaultValue: false, required: false, avaiableFlag: true, salesProcess: false },
    updatedDate: { defaultValue: false, required: false, avaiableFlag: true, salesProcess: false },
    updatedUser: { defaultValue: false, required: false, avaiableFlag: true, salesProcess: false }
  },
  {
    fieldBelong: EXTENDED_FIELD,
    1: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: true
    },
    2: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    3: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    4: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: true
    },
    5: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: true
    },
    6: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: true
    },
    7: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: true
    },
    8: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    9: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    10: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    11: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    12: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    13: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    14: {
      defaultValue: true,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    15: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    16: {
      defaultValue: false,
      required: false,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    17: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    18: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    19: {
      defaultValue: false,
      required: true,
      avaiableFlag: true,
      salesProcess: true,
      differenceSetting: false
    },
    20: {
      defaultValue: false,
      required: false,
      avaiableFlag: false,
      salesProcess: true,
      differenceSetting: false
    },
    21: {
      defaultValue: false,
      required: false,
      avaiableFlag: false,
      salesProcess: false,
      differenceSetting: false
    },
    99: {
      defaultValue: false,
      required: false,
      avaiableFlag: false,
      salesProcess: false,
      differenceSetting: false
    }
  }
];

export const isCanSettingField = (
  fieldBelong: number,
  fieldName: string,
  item: string,
  isDefault = true
) => {
  const belong = isDefault ? fieldBelong : EXTENDED_FIELD;
  const idx = OptionFieldManager.findIndex(el => el.fieldBelong === belong);
  if (idx < 0) {
    return true;
  }
  if (
    !(
      _.has(OptionFieldManager[idx], _.camelCase(fieldName)) ||
      _.has(OptionFieldManager[idx], _.snakeCase(fieldName))
    )
  ) {
    return true;
  }
  const attribute = getValueProp(OptionFieldManager[idx], fieldName);
  if (!attribute) {
    return true;
  }
  if (!_.has(attribute, item)) {
    return true;
  }
  return getValueProp(attribute, item);
};
