import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';

export const COLOR_PRODUCT_TRADING = {
  'color-0': '#fb7d7d',
  'color-1': '#ff9d9d',
  'color-2': '#ffb379',
  'color-3': '#88d9b0',
  'color-4': '#85acdc',
  'color-5': '#fc82fc',
  'color-6': '#ff9d9d',
  'color-7': '#ff92b9',
  'color-8': '#b4d887',
  'color-9': '#d8cc75',
  'color-10': '#6dcacc',
  'color-11': '#7171e2',
  'color-12': '#cc8bd1',
  'color-13': '#ceaa91',
  'color-14': '#fed3d3',
  'color-15': '#ffe7d2',
  'color-16': '#d8f2e5',
  'color-17': '#d6e3f3',
  'color-18': '#ffdede',
  'color-19': '#d6e3f3',
  'color-20': '#ffdede',
  'color-21': '#d6e3f3',
  'color-22': '#ffe0eb',
  'color-23': '#d7eabe',
  'color-24': '#ece5b9',
  'color-25': '#c8ebec',
  'color-26': '#dbdbf7',
  'color-27': '#e7d3ef',
  'color-28': '#e6d4c7'
};

export const PRODUCT_DEF = {
  FIELD_BELONG: 7,
  EXTENSION_BELONG_LIST: 5,
  EXTENSION_BELONG_EDIT: 3
};
export const MENU_TYPE = {
  ALL_PRODUCT_TRADING: 0,
  MY_PRODUCT_TRADING: 1,
  ALL_SALES: 0,
  DEPARTMENT: 1,
  QUIT_JOB: 2,
  MY_GROUP: 3,
  SHARED_GROUP: 4,
  FAVORITE_GROUP: 5
};
export const SALES_SPECIAL_FIELD_NAMES = {
  IS_FINISH: 'is_finish',
  PT_PROGRESS_ID: 'product_trading_progress_id',
  LAST_CONTACT_DATE: 'last_contact_date',
  CONTACT_DATE: 'contact_date'
};

export const SPECIAL_LAST_CONTACT_DATE = {
  createdDate: '2020-07-31T12:43:47.244276Z',
  createdUser: 0,
  updatedDate: '2020-08-06T11:14:26.020268Z',
  updatedUser: 10010,
  fieldId: 9999,
  fieldBelong: 16,
  fieldName: SALES_SPECIAL_FIELD_NAMES.LAST_CONTACT_DATE,
  fieldLabel:
    '{"en_us": "Last contact date", "ja_jp": "最終接触日から日以上経っている", "zh_cn": "最終接触日から日以上経っている-en"}',
  fieldType: DEFINE_FIELD_TYPE.DATE,
  fieldOrder: 11,
  isDefault: true,
  maxLength: null,
  modifyFlag: 1,
  availableFlag: 3,
  isDoubleColumn: false,
  defaultValue: null,
  currencyUnit: '円',
  typeUnit: null,
  decimalPlace: 1,
  urlType: null,
  urlTarget: null,
  urlText: null,
  urlEncode: null,
  linkTarget: null,
  iframeHeight: null,
  configValue: null,
  isLinkedGoogleMap: null,
  fieldGroup: null,
  lookupData: null,
  relationData: null,
  selectOrganizationData: null,
  tabData: [],
  lookupFieldId: null,
  fieldItems: [],
  differenceSetting: null,
  statisticsItemFlag: 0,
  statisticsConditionFlag: 0
};
export const SALES_LIST_ID = 'SALES_LIST_ID';
export const SEARCH_LOCAL_SUGGEST = 'SEARCH_LOCAL_SUGGEST';
export const SEARCH_MODE = {
  NONE: 0,
  TEXT_DEFAULT: 1,
  CONDITION: 2
};
export const FILTER_MODE = {
  OFF: 0,
  ON: 1
};

export const PRODUCT_TRADINGS_ACTION_TYPES = {
  CREATE: 0,
  UPDATE: 1
};

export const PRODUCT_TRADINGS_VIEW_MODES = {
  EDITABLE: 0,
  PREVIEW: 1
};

export const SHOW_MESSAGE = {
  NONE: 0,
  ERROR: 1
};

export const SHOW_MESSAGE_SUCCESS = {
  NONE: 0,
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3,
  ADD_TO_FAVORITE: 4,
  REMOVE_FROM_FAVORITE: 5,
  DRAG_TO_LIST: 6
};

export const LIST_TYPE = {
  MY_LIST: 1,
  SHARE_LIST: 2
};
export const LIST_MODE = {
  HANDED: 1,
  AUTO: 2
};
export const IS_OVER_WRITE = {
  FALSE: 0,
  TRUE: 1
};

export const PARTICIPANT_TYPE = {
  VIEWER: 1,
  OWNER: 2
};

export const DND_DEPARTMENT_TYPE = {
  CARD: 'DepartmentCard'
};

export const SALES_GROUP_TYPE = {
  CARD: 'Group Card',
  SALE_LIST_CARD: 'Sale list card'
};

export const SELECT_TARGET_TYPE = {
  ALL_SALES: 0,
  SALES_QUIT_JOB: 1,
  DEPARTMENT: 2,
  LIST: 3,
  SHARE_LIST: 4,
  MY_LIST: 5
};

export const MY_GROUP_MODES = {
  MODE_CREATE_GROUP: 1,
  MODE_EDIT_GROUP: 2,
  MODE_COPY_GROUP: 3,
  MODE_SWICH_GROUP_TYPE: 4
};

export const SHARE_GROUP_MODES = {
  // setting mode add condition search employee
  ADD_CONDITION_SEARCH_MANUAL: 1,
  ADD_CONDITION_SEARCH_AUTO: 2,
  // actions with group
  MODE_CREATE_GROUP: 1,
  MODE_EDIT_GROUP: 2,
  MODE_COPY_GROUP: 3,
  MODE_CREATE_GROUP_LOCAL: 4,
  MODE_SWICH_GROUP_TYPE: 5
};

export const API_URL = {
  GET_PRODUCT_TRADING: '/get-product-tradings',
  UPDATE_PRODUCTS_TRADING: '/update-product-tradings',
  DELETE_PRODUCTS_TRADING: '/delete-product-tradings',
  GET_PRODUCT_PROGRESS: '/get-progresses',
  GET_PRODUCT_TRADING_BY_PROGRESS: '/get-product-tradings-by-progress',
  GET_FIELD_INFO_PROGRESS_PERSONAL: '/get-field-info-progress-personals',
  UPDATE_FIELD_INFO_PROGRESS_PERSONAL: '/update-field-info-progress-personals',
  GET_LIST: '/get-list',
  GET_EMPLOYEE: '/get-employee',
  REMOVE_LIST_FROM_FAVORITE: '/remove-list-from-favorite',
  ADD_LIST_TO_FAVORITE: '/add-list-to-favorite',
  CHANGE_MY_LIST_TO_SHARED_LIST: '/update-product-tradings-list',
  DRAG_DROP_PRODUCT_TRADING: '/drag-drop-product-trading',
  UPDATE_PRODUCT_TRADING_BY_FIELD_NAME: '/update-product-tradings-by-field-name'
};

export const TYPE_DRAG = {
  CUSTOMER: 'customer',
  TRADING: 'trading'
};

export const TYPE_DROP = {
  DROP_TRADING: 'dropTrading',
  COLUMN: 'column'
};
export const orderDefault = [
  {
    // fix bug #15837
    key: 'customer_id',
    value: 'ASC',
    fieldType: '99'
  }
];

export const orderDefaultNested = [
  {
    // fix bug #15837
    key: 'customer_id',
    value: 'ASC',
    fieldType: '99',
    isNested: false
  }
];

export const DUMMY_PRODUCT_TRADING = {
  data: {
    productTradings: [
      {
        productTradingId: 1,
        customerId: 1,
        customerName: 'kh1',
        productTradingProgressId: 1,
        progressName: 'finish',
        progressOrder: 1,
        isAvailable: 'true',
        productId: 1,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 2,
        customerId: 2,
        customerName: 'kh2',
        productTradingProgressId: 2,
        progressName: 'finish',
        progressOrder: 2,
        isAvailable: 'true',
        productId: 2,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 3,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 4,
        customerId: 4,
        customerName: 'kh3',
        productTradingProgressId: 4,
        progressName: 'finish',
        progressOrder: 4,
        isAvailable: 'true',
        productId: 43,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 5,
        customerId: 5,
        customerName: 'kh3',
        productTradingProgressId: 5,
        progressName: 'finish',
        progressOrder: 5,
        isAvailable: 'true',
        productId: 5,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 6,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 7,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 8,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 9,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 10,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 11,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 12,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 13,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 14,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 15,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 16,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 17,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 18,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 19,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 20,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 21,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 22,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      },
      {
        productTradingId: 23,
        customerId: 3,
        customerName: 'kh3',
        productTradingProgressId: 3,
        progressName: 'finish',
        progressOrder: 3,
        isAvailable: 'true',
        productId: 3,
        productName: '製品',
        quantity: 1,
        price: 30000,
        amount: 10000,
        employeeId: 2,
        employeeName: '部員',
        endPlanDate: '2020/12/12',
        orderPlanDate: '2020/12/12',
        memo: 'ABC',
        updatedDate: '2020-05-06T10:16:58.89568Z',
        productTradingData: [{ key: 'text_1', value: 'one', fieldType: '1' }]
      }
    ],
    totalCount: 23,
    progresses: [
      {
        productTradingProgressId: 1,
        progressName: '{"ja_jp": "役職A","en_us": "english","zh_cn": "chinesse"}',
        isAvailable: true,
        progressOrder: 1
      },
      {
        productTradingProgressId: 2,
        progressName: '{"ja_jp": "役職B","en_us": "english","zh_cn": "chinesse"}',
        isAvailable: true,
        progressOrder: 2
      }
    ],
    fieldInfo: [
      {
        fieldId: 1,
        fieldName: 'customerName',
        labelJaJp: 'customerName',
        isAvailable: true
      },
      {
        fieldId: 2,
        fieldName: 'price',
        labelJaJp: 'price',
        isAvailable: true
      },
      {
        fieldId: 3,
        fieldName: 'memo',
        labelJaJp: 'memo',
        isAvailable: true
      },
      {
        fieldId: 4,
        fieldName: 'productName',
        labelJaJp: 'productName',
        isAvailable: true
      }
    ]
  }
};
export const QUERY_DELETE_PRODUCTS_TRADING = params =>
  `mutation{
    deleteProductTradings(productTradingIds : ${JSON.stringify(params).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )})
    {
        productTradingIds
    }
  }`;

export const QUERY_UPDATE_PRODUCTS_TRADING = params =>
  `mutation {
    updateProductTradings(productTradings : ${JSON.stringify(params).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )}) {
            productTradingIds
        }
}`;

export const PARAM_GET_CUSTOM_FIELD_INFO = fieldBelong => ({ fieldBelong });

export const PARAM_GET_PRODUCT_TRADING_LIST = (
  isOnlyData,
  searchLocal,
  searchConditions,
  filterConditions,
  orderBy,
  offset,
  limit,
  isFirstLoad,
  selectedTargetType,
  selectedTargetId
) =>
  `query {
    getProductTradings(
      isOnlyData: ${isOnlyData},
      searchLocal: ${JSON.stringify(searchLocal).replace(/"(\w+)"\s*:/g, '$1:')},
      searchConditions: ${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')},
      filterConditions: ${JSON.stringify(filterConditions).replace(/"(\w+)"\s*:/g, '$1:')},
      orderBy: ${JSON.stringify(orderBy).replace(/"(\w+)"\s*:/g, '$1:')},
      offset: ${offset},
      limit: ${limit},
      isFirstLoad: ${isFirstLoad},
      selectedTargetType: ${selectedTargetType},
      selectedTargetId: ${selectedTargetId},
      ) {
        productTradings{
          productTradingId
          customerName
          customerId
          productId
          productName
          quantity
          price
          amount
          productTradingProgressId
          progressName
          progressOrder
          isAvailable
          employeeId
          employeeName
          endPlanDate
          orderPlanDate
          memo
          productTradingData{
            fieldType
            key
            value
          }
          updatedDate
        }
        progresses{
          productTradingProgressId
          progressName
          isAvailable
          progressOrder
        }
        total
      }
  }`;

// share list

// export const SHARE_GROUP_MODES = {
//   // setting mode add condition search employee
//   ADD_CONDITION_SEARCH_MANUAL: 1,
//   ADD_CONDITION_SEARCH_AUTO: 2,
//   // actions with group
//   MODE_CREATE_GROUP: 1,
//   MODE_EDIT_GROUP: 2,
//   MODE_COPY_GROUP: 3,
//   MODE_CREATE_GROUP_LOCAL: 4,
//   MODE_SWICH_GROUP_TYPE: 5
// };

export const GROUP_TYPES = {
  MY_GROUP: 1,
  SHARED_GROUP: 2
};

export const SALES_SPECIAL_LIST_FIELD = {
  endPlanDate: 'end_plan_date',
  employeeId: 'employee_id',
  createdUser: 'created_user',
  updatedUser: 'updated_user',
  customerId: 'customer_id',
  productTradingProgressId: 'product_trading_progress_id',
  productId: 'product_id',
  price: 'price',
  amount: 'amount',
  employeeDepartments: 'employee_departments',
  employeePositions: 'employee_positions',
  employeeSurname: 'employee_surname',
  employeeSurnameKana: 'employee_surname_kana',
  employeeNameKana: 'employee_name_kana',
  employeeManager: 'employee_managers',
  employeeIcon: 'employee_icon',
  employeeLanguage: 'language_id',
  employeeSubordinates: 'employee_subordinates',
  employeeTimeZone: 'timezone_id',
  employeeTelephoneNumber: 'telephone_number',
  employeeEmail: 'email',
  employeeCellphoneNumber: 'cellphone_number',
  employeeUserId: 'user_id',
  employeePackages: 'employee_packages',
  employeeAdmin: 'is_admin',
  orderPlanDate: 'order_plan_date',
  productTradingId: 'product_trading_id',
  quantity: 'quantity',
  createdDate: 'created_date',
  updatedDate: 'updated_date'
};
export const EDIT_SPECIAL_ITEM = {
  NAME: 'name',
  KANA: 'kana',
  DEPARTMENT: 'deparment',
  LANGUAGE: 'language',
  SUBORDINATES: 'subordinates'
};
export const EMPLOYEE_ADMIN = {
  IS_NOT_ADMIN: 0,
  IS_ADMIN: 1
};

export const TYPE_SALES_CONTROL = {
  LIST: 0,
  TASK: 1
};
