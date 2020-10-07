/**
 * Type of control
 */
export const ControlType = {
  SEARCH: 0,
  ADD_EDIT: 1,
  DETAIL: 2,
  // this value is custom, change value if need
  LIST: 3,
  ADD: 99,
  EDIT: 100,
  COPY: 101,
  CHANGE_TO_SHARE: 102,
};

/**
 * Flag available
 */
export const AvailableFlag = {
  NOT_AVAILABLE: 0,
  AVAILABLE_IN_WEB: 1,
  AVAILABLE_IN_APP: 2,
  AVAILABLE_IN_BOTH: 3,
};

export enum fieldBelong {
  BUSINESS_CARD = 4,
  CALENDAR = 2,
  TIMELINE = 3,
  CUSTOMER = 5,
  ACTIVITY = 6,
  EMPLOYEE = 8,
  PRODUCT = 14,
  TASK = 15,
  PRODUCT_TRADING = 16,
}

export enum BusinessCardListModal {
  LIST_HAS_IN_FAVORITE = 1,
  LIST_NOT_YET_IN_FAVORITE = 2,
  RECORD_ALL_RECEIVED = 3,
  RECORD_HAND_WORD = 4,
  RECORD_AUTO = 5,
  PREVIEW_IMAGE = 6,
  DELETE_LIST = 7,
  CHANGE_TO_SHARE_LIST = 8,
  DELETE_LAST_CARD_MODAL = 9,
  DELETE_CARD_MODAL = 10,
}

/**
 * define field belong
 */
export const DefineRelationSuggest = {
  EMPLOYEE: 8,
  CUSTOMER: 5,
  BUSINESS_CARD: 4,
  PRODUCT: 14,
  PRODUCT_TRADING: 16,
  TASK: 15,
  MILE_STONE: 1502,
};

/**
 * Flag of type input
 */
export const ModifyFlag = {
  READ_ONLY: 0,
  OPTIONAL_INPUT: 1,
  REQUIRED_INPUT: 2,
};

/**
 * Define type dynamic field
 */
export const DefineFieldType = {
  SINGER_SELECTBOX: '1',
  MULTI_SELECTBOX: '2',
  CHECKBOX: '3',
  RADIOBOX: '4',
  NUMERIC: '5',
  DATE: '6',
  DATE_TIME: '7',
  TIME: '8',
  TEXT: '9',
  TEXTAREA: '10',
  FILE: '11',
  LINK: '12',
  PHONE_NUMBER: '13',
  ADDRESS: '14',
  EMAIL: '15',
  CALCULATION: '16', //
  RELATION: '17',
  SELECT_ORGANIZATION: '18',
  LOOKUP: '19', // remove when search
  TAB: '20', // remove when search
  TITLE: '21', //remove when search
  OTHER: '99',
};

/**
 * Currency type unit
 */
export const TypeUnit = {
  SYMBOL: 0,
  UNIT: 1,
};

/**
 * Option search text
 */

export const SearchOption = {
  OR: 1,
  AND: 2,
  WORD: 3,
  NOT_OR: 4,
  NOT_AND: 5,
};

/**
 * Type search text
 */
export const SearchType = {
  LIKE: 1,
  LIKE_FIRST: 2,
};

/**
 * Type of url
 */
export const URLType = {
  URL_DYNAMIC: 1,
  URL_STATIC: 2,
};

/**
* Dynamic Form's Modal visible state
*/
export const DynamicFormModalVisible = {
  VISIBLE: 0,
  INVISIBLE: 1,
  INVISIBLE_SAVE: 2,
};

/**
 * Type product suggest
 */
export const TypeSelectProductSuggest = {
  SINGLE: 0,
  MULTI: 1,
};

/**
 * status open modal
 */
export const SuggetionModalVisible = {
  VISIBLE: 0,
  INVISIBLE: 1,
  INVISIBLE_SAVE: 2,
};

export const BUSINESS_CARD_SELECTED_TARGET_TYPE = {
  allBusinessCard: 0,
  receiveBusinessCard: 1,
};

/**
 * Type  suggest
 */
export const TypeSelectSuggest = {
  SINGLE: 0,
  MULTI: 1,
};

/**
 * key search employee suggest
 */
export const KeySearch = {
  NONE: 0,
  DEPARTMENT: 1,
  EMPLOYEE: 2,
  GROUP: 3,
};

/**
 * Status choose type search
 */
export const ChooseTypeSearch = {
  BLANK_SEARCH: 0,
  DETAIL_SEARCH: 1,
  NOT_CHOOSE: 2,
};

/**
  BLANK_SEARCH: 0,
  DETAIL_SEARCH: 1,
  NOT_CHOOSE: 2,
};
/**
 * Status choose Feature Setting
 */
export const ChooseFeatureSetting = {
  PASSWORD: 0,
  LANGUAGE_AND_TIME: 1,
  NOTIFICATION: 2,
};

export const Activity = {
  HAS_ACTIVITY: 1,
};

export const Follow = {
  NO_FOLLOW: 0,
  HAS_FOLLOW: 1,
};

export const DeleteBusinessCardProcessMode = {
  CHECK_STATUS: 0,
  DELETE_CARD: 1,
  DELETE_CUSTOMER_CARD: 2,
};

export const DeleteBnCardModalType = {
  DELETE_LAST_MODAL: 0,
  DELETE_CARD_OTHER_MODAL: 1,
};

export const GetBusinessCard = {
  EDIT: 'edit',
  DETAIL: 'detail',
};

export const FollowTargetType = {
  CUSTOMER: 1,
  BUSINESS_CARD: 2,
  EMPLOYEE: 3,
};

export const AuthorityEnum = {
  // Todo change if need
  MEMBER: 2,
  OWNER: 1,
};

export const AuthorityItemType = {
  EMPLOYEE: 0,
  DEPARTMENT: 1,
  GROUP: 2,
};
/**
 * Status selected time and language
 */
export const SelectedTimeAndLanguage = {
  LANGUAGE: 0,
  TIME_ZONE: 1,
  DATE_FORMAT: 2,
};
/*
 * Status select time
 */
export const ChooseTimeSearch = {
  TIME_FROM: 1,
  TIME_TO: 2,
};

// list type timeline
export const ListTypeTimeline = {
  ALL_TIMELINE: 1,
  PERSONAL_TIMELINE: 2,
  FAVORITE_TIMELINE: 3,
  GROUP_TIMELINE: 4,
  DEPARTMENT_TIMELINE: 5,
  FAVORITE_CUSTOMER_TIMELINE: 6,
  FAVORITE_BUSINESS_CARD_TIMELINE: 7,
};

export enum TaskDetailDialog {
  DELETE_TASK_AND_SUB_TASK_COMPLETE,
  DELETE_TASK_AND_SUB_TASK_NOT_COMPLETE,
  COMPLETE_TASK,
}

export enum BusinessCardDetailDialog {
  DELETE_CARD_MODAL = 1,
  DELETE_LAST_CARD_MODAL = 2,
  REGISTER_MODAL = 3,
  SHOW_IMAGE_MODAL = 4,
}
/**
 * type input register - editer
 */
export const typeInputRegister = {
  firstName: 25,
  lastName: 26,
  firstNameKana: 27,
  lastNameKana: 28,
  departmentName: 30,
  position: 29,
  emailAddress: 35,
  phoneNumber: 36,
  mobileNumber: 37,
  receiveDate: 40,
  memo: 45,
  receiver: 'receiver',
  campaign: 15,
  customerName: 'customerName',
  date: 'date',
};

export const GetBnCardListMode = {
  GET_ALL: 1,
  GET_MY_LIST_SHARE_LIST: 2,
};

export enum Position {
  LEFT = 1,
  RIGHT = 2,
  CENTER = 3,
  TOP = 4,
  BOTTOM = 5,
}

export const BUSINESS_CARD_LIST = {
  FAVOR_LIST: 2,
  MY_LIST: 3,
  SHARED_LIST: 4,
};

export const BUSINESS_CARD_LIST_MODE = {
  handwork: 1,
  auto: 2,
};

export const BUSINESS_CARD_ACTIVE = {
  receiveBusinessCard: 0,
  allBusinessCard: 1,
  favorList: 2,
  myList: 3,
  sharedList: 4,
};

/**
 * define platform os
 */
export const PlatformOS = {
  IOS: 'ios',
  ANDROID: 'android',
};
/**
 * Define category
 */
export const category = {
  CALENDAR: 1,
  TASK: 2,
  BUNSINESS: 3,
  PRODUCT: 4,
};
/**
 * define type task
 */
export const TYPE_TASK = {
  expired: 1,
  complete: -1,
};

/**
 * Type display
 */
export const RelationDisplay = {
  TAB: 1,
  LIST: 2,
};

/**
 * Type suggest relation
 */
export const TypeRelationSuggest = {
  SINGLE: 1,
  MULTI: 2,
};

/**
 * enum trading version
 * status mode sarch
 */
export const EnumTradingVersion = {
  DETAIL_GENERAL_INFO: 0,
  DETAIL_TRADING_TAB: 1,
};
export const TypeTitle = {
  DEPARTMENT: 1,
  POSITION: 2,
};

/**
 * 1: Not done, 2: doing, 3: done
 */
export const StatusTaskId = {
  NOT_DONE: 1,
  DOING: 2,
  DONE: 3,
};

/**
 * status mode sarch
 */
export const ValueSetDateTime = {
  dateFrom: 1,
  dateTo: 2,
  timeFrom: 3,
  timeTo: 4,
  singleTimeFrom: 5,
  singleTimeTo: 6,
  singleDateFrom: 7,
  singleDateTo: 8,
  numberDateBeforeAfterFrom: 9,
  numberDateBeforeAfterTo: 10,
  numberDateBeforeFrom: 11,
  numberDateBeforeTo: 12,
  numberDateAfterFrom: 13,
  numberDateAfterTo: 14,
};

export const ValueAdmin = {
  false: {
    ja_jp: '管理権限がない',
    en_us: '管理権限がない',
    zh_cn: '管理権限がない',
  },
  true: {
    ja_jp: '管理権限がある',
    en_us: '管理権限がある',
    zh_cn: '管理権限がある',
  },
};
export const GroupType = {
  MY_GROUP: 1,
  SHARE_GROUP: 2,
};
export const TargetType = {
  ALL: 0,
  RETAIL: 1,
  DEPARTMENT: 2,
  MY_GROUP: 3,
  SHARE_GROUP: 4,
};
export const TargetID = {
  ZERO: 0,
};
/**
 * status button
 */
export const STATUSBUTTON = {
  DISABLE: 'disable',
  ENABLE: 'enable',
};
/*
 * Type Message
 */
export const MESAGEBUTTON = {
  YES: 'yes',
  NO: 'no',
};
export const StatusButton = {
  DISABLE: 'disable',
  ENABLE: 'enable',
};
/**
 * Type Message
 */
export const TYPEMESSAGE = {
  WARNING: 'WAR',
  INFO: 'INF',
  ERROR: 'ERR',
  SUCCESS: 'SUS',
};

export const TypeMessage = {
  WARNING: 'WAR',
  INFO: 'INF',
  ERROR: 'ERR',
  SUCCESS: 'SUS',
};
/**
 * function id
 */
export const FIELD_BELONG = {
  EMPLOYEE: 8, // 社員
  CUSTOMER: 5, // 顧客
  BUSINESS_CARD: 4, // 名刺
  ACTIVITY: 6, // 活動
  PRODUCT: 14, // 商品
  TASK: 15, // タスク
  PRODUCT_TRADING: 16, // 商談
  MILE_STONE:1502
};

/**
 * Type Button
 */
export const TYPEBUTTON = {
  BUTTONSUCCESS: 1,
  BUTTONNONSUCCESS: 2,
  BUTTONBIGSUCCESS: 3,
  BUTTONBIGNOSUCCESS: 4,
  BUTTONMINIMODALSUCCESS: 5,
  BUTTONMINIMODALNOSUCCESS: 6,
  BUTTONDIALOGSUCCESS: 7,
  BUTTONDIALOGNOSUCCESS: 8,
  MINIBUTTON: 9,
  BUTTONTOTAL: 10,
  BUTTONHISTORY: 11,
  BUTTONCHANGE: 12,
  BUTTONFAVOURITE: 13,
};
export const TypeButton = {
  BUTTON_SUCCESS: 1,
  BUTTON_NON_SUCCESS: 2,
  BUTTON_BIG_SUCCESS: 3,
  BUTTON_BIG_NO_SUCCESS: 4,
  BUTTON_MINI_MODAL_SUCCESS: 5,
  BUTTON_MINI_MODAL_NO_SUCCESS: 6,
  BUTTON_DIALOG_SUCCESS: 7,
  BUTTON_DIALOG_NO_SUCCESS: 8,
  MINI_BUTTON: 9,
  BUTTON_TOTAL: 10,
  BUTTON_HISTORY: 11,
  BUTTON_CHANGE: 12,
  BUTTON_FAVOURITE: 13,
};
/**
 * types of file
 */
export const FileType = {
  DOC: ['doc', 'docx'],
  JPG: ['jpg', 'jpeg', 'png'],
  XLS: ['xls', 'xlsx'],
  PDF: ['pdf'],
};

export const ColorTouch = {
  TYPEA: '#1c4476',
  TYPEB: '#d6e3f3',
  TYPEC: '#8c1515',
};

/**
 * status mode search
 */
export const ValueSetDate = {
  dateFrom: 1,
  dateTo: 2,
  monthFrom: 3,
  dayFrom: 4,
  monthTo: 5,
  dayTo: 6,
  numberDateBeforeAfterFrom: 7,
  numberDateBeforeAfterTo: 8,
  numberDateBeforeFrom: 9,
  numberDateBeforeTo: 10,
  numberDateAfterFrom: 11,
  numberDateAfterTo: 12,
  numberMonthBeforeAfterFrom: 13,
  numberMonthBeforeAfterTo: 14,
  numberYearBeforeAfterFrom: 15,
  numberYearBeforeAfterTo: 16,
};

/**
 * define format date
 */
export const FormatYmd = {
  YYYYMMDD: 'YYYY-MM-DD',
  MMDDYYYY: 'MM-DD-YYYY',
  DDMMYYYY: 'DD-MM-YYYY',
};
export const LanguageCode = {
  EN_US: 'en_us',
  JA_JP: 'ja_jp',
  ZH_CN: 'zh_cn',
};

export const TabScreen = {
  BASIC_INFOR: 0,
  TRADING_PRODUCT: 1,
  CHANGE_LOG: 2,
  BUSSINESS_CARD: 3,
  CLIENT: 4,
  TASK: 5,
  EMAIL: 6,
  GROUP: 7,
  PREDICTION: 8,
  CALENDAR: 9,
};

/**
 * mode select file
 */
export const SelectFileMode = {
  SINGLE: 0,
  MULTI: 1,
};

/**
 * mode select organization
 */
export const SelectOrganizationMode = {
  SINGLE: 1,
  MULTI: 2
};

/**
 * mode select type organization
 */
export const SearchTypeOrganization = {
  DEPARTMENT: 1,
  EMPLOYEE: 2,
  GROUP: 3,
  DEPARTMENT_EMPLOYEE: 4,
  EMPLOYEE_GROUP: 5,
  DEPARTMENT_GROUP: 6,
  ALL: null
};

// enum button common type
export enum EnumButtonType {
  // button width 25%
  dialog,
  // button width 40%
  miniModal,
  // button width for padding text paddingHorizontal
  mini,
  // button width 80%
  large,
  // button width for padding text padding 5
  complete,
}
// enum button common status
export enum EnumButtonStatus {
  disable,
  active,
  inactive,
  normal,
}

export enum FilterModeDate {
  None,
  PeriodYmdHm,
  PeriodHm,
  PeriodYmd,
  PeriodMd,
  DayBeforeAfter,
  TodayBefore,
  TodayAfter,
  MonthBeforeAfter,
  YearBeforeAfter,
}

export const SortType = {
  ASC: 'ASC',
  DESC: 'DESC',
};

// enum position modal
export enum EnumPositionModal {
  center,
  top,
  bottom,
  total,
}
// enum format text
export enum EnumFormatText {
  bold,
  italic,
  underLine,
  strikeThrough,
}
// field belong
export const FieldBelong = {
  EMPLOYEE: 8,
  CUSTOMER: 5,
  BUSSINESS_CARD: 4,
  ACTIVITY: 6,
  PRODUCT: 14,
  TASK: 15,
};
// extension_belong
export const ExtensionBelong = {
  LIST_SCREEN: 1,
  SEARCH_SCREEN: 2,
};
/**
 * Define NameControl
 */
export const NameControl = {
  group: 'groupName',
  groupParticipant: 'groupParticipants',
  customerListName: 'customerListName',
  listParticipants: 'listParticipants',
};

// field name
export const FIELD_NAME = {
  createdUser: 'created_user',
  updatedUser: 'updated_user',
  productCategoryId: 'product_category_id',
  productTypeId: 'product_type_id',
  unitPrice: 'unit_price',
  isDisplay: 'is_display',
  productImageName: 'product_image_name',
  productRelationId: 'product_relation_id',
  alternativeCustomerName: 'alternative_customer_name',
  employeeId: 'employee_id',
  isWorking: 'is_working',
  campaign: 'campaign',
  productId: 'product_id',
  productName: 'product_name',
  quantity: 'quantity',
  departmentName: 'department_name',
  departmentId: 'department_id',
  receiveDate: 'receive_date',
  employeeIcon: 'employee_icon',
  timezoneId: 'timezone_id',
  languageId: 'language_id',
};

//nameSevicer
// export const NAME_SERVICER = ["products", "employees"];
export const NAME_SERVICER = {
  product: 'product-detail',
  employees: 'detail-employee',
};

/**
 * type of contract status
 */
export const ContractStatus = {
  READY: 1,
  PAUSE: 2,
  DELETE: 3,
};
export enum UpdateMemberGroupType {
  UPDATE_PERMISSION = 1,
  APPROVAL = 2,
}

export const JoinGroupStatus = {
  REQUEST: 2,
  JOINED: 1,
};

export const sortDate = {
  createdDate: 1,
  changedDate: 2,
};

export const GetListMode = {
  GET_ALL: 1,
  GET_MY_LIST_SHARE_LIST: 2,
};

export const ProductTradingActive = {
  ALL_PRODUCT_TRADING: 0,
  MY_PRODUCT_TRADING: 1,
  FAVORITE_LIST: 2,
  MY_LIST: 3,
  SHARE_LIST: 4,
};

export const LIST_MODE = {
  handwork: 1,
  auto: 2,
};

/**
 * 1: Only update status for task / subtask => not done
 * 2: Only update the status of the task / subtask => completed
 * 3: Update status of both tasks and subtasks => completed
 * 4: Update task status from unfinished => completed, status update of subtask incomplete => new task
 * 5: Update status of task / subtask => doing
 * 6: Update status for tasks and subtasks => in progress
 */
export const ActionType = {
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
};

/**
 * MODE
 */
export const MODE = {
  DELETE: "delete",
  UPDATE: "update",
  CREATE: "create",
}

/**
 * LIST TYPE
 */
export const LIST_TYPE = {
  myList: 1,
  sharedList: 2,
};
/**
 * Define type of list share customer
 */
export const TypeListShareCustomer = {
  HANDMADE: 1,
  FROM_TOOL_LOCAL: 2,
  FROM_MY_LIST: 3,
};
/**
 * Define type of action list share customer
 */
export const TypeActionListShareCustomer = {
  ADD: 1,
  EDIT: 2,
  COPY: 3,
  CHANGE_TO_SHARE_LIST: 4,
  ADD_FROM_LEFT_MENU: 5,
};

export enum TimelineGroupParticipantModal {
  AUTHORITY = 1,
  OWNER_TO_MEMBER = 2,
  ERROR_CHANGE = 3,
  TOOLTIP_EMPLOYEE = 4,
  SUGGESTION = 5,
}

export const InviteType = {
  EMPLOYEE: 2,
  DEPARTMENT: 1,
};

export const GroupInviteType = {
  DEPARTMENT: 1,
  GROUP_OR_EMPLOYEE: 2,
};

export const ModeScreen = {
  EDIT: 1,
  CREATE: 2,
};

export enum ProductTradingManagerModal {
  MYLIST_TO_SHARE_LIST = 1,
  DELETE_RECORD = 2,
  DELETE_RECORD_FROM_LIST = 3,
}

export const UpdateTaskStatusFlag = {
  ONLY_TASK_NOT_DONE: 1,
  ONLY_TASK_COMPLETE: 2,
  TASK_AND_SUBTASK_COMPLETE: 3,
  TASK_COMPLETE_SUBTASK_NEWTASK: 4,
  TASK_DOING: 5,
  TASK_IN_PROGRESS: 6,
};

export enum IndexChoiceSuggestion {
  EMPLOYEE = 'employee',
  DEPARTMENT = 'employee_department',
  GROUP = 'employee_group',
}

// 1: Only update the status of milestone to unfinished
// 2: Update the status of milestone and the task of milestone to complete
export const MilestoneStatusFlag = {
  ONLY_MILESTONE_UNFINISHED: 1,
  MILESTONE_AND_TASK_COMPLETE: 2,
};

export const deleteTaskFlg = {
  DELETE_ONLY_TASK_SUBTASK: 1,
  DELETE_ALL: 2,
  DELETE_TASK_CONVERT_SUBTASK: 3,
  ONLY_CONVERT_SUBTASK: 4,
};
export enum NOTIFICATION_VALIDATE_SETTING {
  TIME,
  CONTENT,
}

/**
 * type validate notisettong
 */
export const FeedbackDisplayType = {
  AUTO_OPEN: 0,
  PERSON_OPEN: 1,
};

export const FeedbackTerminalType = {
  MOBILE: 0,
  WEB: 1,
};

export const BUTTON = {
  NONE: 0,
  HAPPY: 1,
  ANGRY: 2,
};

export const STATUS_TIMELINE = {
  COMMENT: 'comment',
  REP_COMMENT: 'rep_comment',
  REPLY_COMMENT: 'reply_comment',
  QUOTE: 'quote',
  QUOTE_COMMENT: 'quote_comment',
  QUOTE_REP_COMMENT: 'reply_rep_comment',

}
export const ACTION_TYPE = {
  COMMENT: '1',
  QUOTE: '2'
}
export const TypeShowResult = {
  LIST: 0,
  TABLE: 1
}

export const IS_DONE = {
  TRUE: 1,
  FALSE: 0,
};

export const StatusTask = {
  TO_DO: 1,
  DOING: 2,
  DONE: 3
};

export const formatDateJP = {
  startDate: 'YYYY年MM月DD日から',
  endDate: 'YYYY年MM月DD日まで'
};

export const HELP = {
   LIMIT: 10,
  LIMIT_SEARCH: 3,
}
