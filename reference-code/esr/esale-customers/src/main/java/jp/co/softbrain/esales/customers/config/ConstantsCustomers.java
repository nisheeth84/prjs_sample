package jp.co.softbrain.esales.customers.config;

/**
 * Application constants.
 */
public final class ConstantsCustomers {
    private ConstantsCustomers() {
    }

    public static final String SERVICE_NAME = "customers";

    public static final String MSG_NOT_PERMISSION = "User have not permission";
    public static final String MSG_CUSTOMER_NOT_EXISTED = "Can not find this customer";
    public static final String MSG_EXCLUSIVE_ERROR = "Error exclusive checked";
    public static final String MSG_PARAMETER_VALUE_INVALID = "Parameter's value is invalid";
    public static final String MSG_REQUIRE_PARAMERTER = "Require Parameters";
    public static final String VALIDATE_MSG_FAILED = "Validate failed";
    public static final String ERROR_EXCLUSIVE = "error-exclusive";
    public static final String ITEM_VALUE_INVALID = "Item's value is invalid";
    public static final String NOT_ROLE_ADMIN = "User does not have role admin";
    public static final String DATA_HAS_BEEN_CHANGED = "Data of this record has been changed";
    public static final String CALL_API_MSG_FAILED = "Call API %s failed. Status: %s";
    public static final String PARSE_JSON_FAIL = "Parse json fail";
    public static final String CONVERT_DATA_ERROR = "Convert data error while download";

    public static final String INF_SET_0010 = "INF_SET_0010";
    public static final String NOT_EXISTED = "ERR_CUS_0005";
    public static final String ERR_COM_0050 = "ERR_COM_0050";

    public static final Integer DEFAULT_OFFSET = 0;
    public static final Integer DEFAULT_LIMIT = 30;

    public static final String EMPTY_STRING = "";
    public static final Integer DEFAULT_LIMIT_FOR_TAB = 5;
    public static final Long DEFAULT_LIMIT_VALUE = 10000L;
    public static final Integer DEFAULT_INTEGER_LIMIT_VALUE = 10000;
    public static final Long LONG_VALUE_0L = 0L;
    public static final Integer NUMBER_ZERO = 0;
    public static final Integer MY_LIST = 1;
    public static final Integer SHARED_LIST = 2;
    public static final Integer MEMBER_TYPE_OWNER = 2;
    public static final Integer EXTENTION_BELONG_1 = 1;
    public static final Integer EXTENTION_BELONG_2 = 2;
    public static final Boolean PERMITTED_MODIFY_TRUE = true;
    public static final Boolean PERMITTED_MODIFY_FALSE = false;
    public static final String REASON_EDIT = "インポートの実行";
    public static final String EXECUTE_OF_IMPORT = "インポートの実行";
    public static final String USER_ID_CAPTION = "userId";
    public static final String IS_DEFAULT_TRUE = "true";
    public static final String NULL_STRING = "null";
    public static final String OLD_VALUE = "old";
    public static final String NEW_VALUE = "new";
    public static final String SORT_TYPE_ASC = "ASC";
    public static final String SORT_TYPE_DESC = "DESC";
    public static final String STRING_VALUE_TRUE = "true";
    public static final String STRING_VALUE_FALSE = "false";
    public static final String STRING_ARRAY_EMPTY = "[]";
    public static final String COMMA_SYMBOY = ",";
    public static final String NEW_LINE_CHAR = "\n";
    public static final String SPACE_SYMBOY = " ";
    public static final String IS_NUMBER_PATTERN = "\\d";
    public static final String PERIOD = ".";
    public static final Integer MODE_ALL = 1;
    public static final Integer MODE_SHARE_LIST_ALL = 2;
    public static final Integer MODE_SHARE_LIST_OWNER = 3;
    public static final String REGEX_INTEGER = "^[-+]?[0-9]+(.[0-9]+)?$";
    public static final String REGEX_DECIMAL = "^[-+]?[0-9]+(,[0-9]+)*(.[0-9]+([eE][-+]?[0-9]+)?)?$";
    public static final String FILE_NAME_DOWNLOAD_CUSTOMERS = "customer_export";
    public static final String COMMA_BETWEEN_SPACE = " , ";
    public static final Long NUMBER_CHECK_PARENT_ID = 1L;

    public static final String PARAM_LATITUDE = "latitude";
    public static final String PARAM_LONGITUDE = "longitude";
    public static final String PARAM_CUSTOMER_NAME = "customerName";
    public static final String PARAM_BUSINESS_MAIN_ID = "businessMainId";
    public static final String PARAM_BUSINESS_SUB_ID = "businessSubId";
    public static final String PARAM_CUSTOMER_BUILDING = "building";
    public static final String PARAM_BUSINESSCARD_ID = "businesscard_id";
    public static final String LIST_PARAMS = "listParams";

    public static final String FIELD_NAME_CUSTOMER_ICON = "customer_logo";
    public static final String COLUMN_NAME_PHOTO_FILE_NAME = "photo_file_name";
    public static final String COLUMN_NAME_PHOTO_FILE_PATH = "photo_file_path";
    public static final String COLUMN_NAME_PARENT_ID = "parent_id";
    public static final String COLUMN_NAME_CUSTOMER_NAME = "customer_name";
    public static final String COLUMN_NAME_ALIAS_NAME = "customer_alias_name";
    public static final String COLUMN_NAME_PHONE_NUMBER = "phone_number";
    public static final String COLUMN_NAME_ZIPCODE = "zip_code";
    public static final String COLUMN_NAME_BUILDING = "building";
    public static final String COLUMN_NAME_ADDRESS = "address";
    public static final String COLUMN_NAME_BUSINESS_MAIN_ID = "business_main_id";
    public static final String COLUMN_NAME_BUSINESS_SUB_ID = "business_sub_id";
    public static final String COLUMN_NAME_URL = "url";
    public static final String COLUMN_NAME_EMPLOYEE_ID = "employee_id";
    public static final String COLUMN_NAME_DEPARTMENT_ID = "department_id";
    public static final String COLUMN_NAME_GROUP_ID = "group_id";
    public static final String COLUMN_NAME_MEMO = "memo";
    public static final String COLUMN_NAME_CUSTOMER_DATA = "customer_data";
    public static final String COLUMN_NAME_USER_ID = "user_id";
    public static final String COLUMN_CUSTOMER_ALIAS_NAME = "customer_alias_name";
    public static final String COLUMN_CUSTOMER_ADDRESS = "customer_address";
    public static final String COLUMN_CUSTOMER_PARENT = "customer_parent";
    public static final String COLUMN_CUSTOMER_PARENT_CUSTOMER_NAME = "customer_parent.customer_name";
    public static final String COLUMN_CUSTOMER_LOGO = "customer_logo";
    public static final String COLUMN_PERSON_IN_CHARGE = "person_in_charge";
    public static final String COLUMN_EMPLOYEE_DEPARTMENTS_DEPARTMENT_NAME = "employee_departments.department_name";
    public static final String COLUMN_EMPLOYEE_GROUPS = "employee_groups";
    public static final String COLUMN_EMPLOYEE_GROUPS_ID = "employee_groups_id";
    public static final String COLUMN_EMPLOYEE_DEPARTMENTS = "employee_departments";
    public static final String COLUMN_DEPARTMENT_ID = "department_id";
    public static final String COLUMN_DEPARTMENT_NAME = "department_name";
    public static final String COLUMN_UPDATED_USER = "updated_user";
    public static final String COLUMN_CREATED_USER = "created_user";
    public static final String COLUMN_UPDATED_DATE = "updated_date";
    public static final String COLUMN_CREATED_DATE = "created_date";
    public static final String COLUMN_SCHEDULE_NEXT = "schedule_next";
    public static final String COLUMN_ACTION_NEXT = "action_next";
    public static final String COLUMN_BUSINESS = "business";
    public static final String COLUMN_SCENARIO_ID = "scenario_id";
    public static final String COLUMN_LAST_CONTACT_DATE = "last_contact_date";
    public static final String COLUMN_IS_DISPLAY_CHILD_CUSTOMERS = "is_display_child_customers";
    public static final String COLUMN_SCHEDULE_NAME = "schedule_name";
    public static final String COLUMN_SCHEDULE_ID = "schedule_id";
    public static final String COLUMN_TASK_NAME = "task_name";
    public static final String COLUMN_TASK_ID = "task_id";
    
    public static final String FIELD_CUSTOMER_DATA = "customerData";
    public static final String FIELD_CUSTOMER_NAME = "customerName";
    public static final String FIELD_CUSTOMER_ALIAS_NAME = "customerAliasName";
    public static final String FIELD_PHONE_NUMBER = "phoneNumber";
    public static final String FIELD_ZIPCODE = "zipCode";
    public static final String FIELD_ADDRESS = "address";
    public static final String FIELD_PREFECTURE = "prefecture";
    public static final String FIELD_BUILDING = "building";
    public static final String FIELD_URL = "url";
    public static final String FIELD_PHOTO_FILE_NAME = "photoFileName";
    public static final String FIELD_PHOTO_FILE_PATH = "photoFilePath";
    public static final String FIELD_MEMO = "memo";
    public static final String FIELD_BUSINESS_MAIN_ID = "business_main_id";
    public static final String FIELD_BUSINESS_SUB_ID = "business_sub_id";
    public static final String FIELD_EMPLOYEE_NAME = "employee_name";
    public static final String FIELD_EMPLOYEE_SURNAME = "employee_surname";
    public static final String FIELD_EMPLOYEE_FULL_NAME = "employee_full_name";
    public static final String FIELD_EMPLOYEE_NAME_KANA = "employee_name_kana";
    public static final String FIELD_EMPLOYEE_SURNAME_KANA = "employee_surname_kana";
    public static final String FIELD_EMPLOYEE_FULL_NAME_KANA = "employee_full_name_kana";
    public static final String FIELD_PERSON_IN_CHANGE = "person_in_charge";

    public static final String CUSTOMERS = "customers";
    public static final String CUSTOMER = "customer";
    public static final String CUSTOMERS_LIST = "customersList";
    public static final String CUSTOMER_LIST_NAME = "customerListName";
    public static final String CUSTOMER_LIST_TYPE = "customerListType";
    public static final String CUSTOMER_IDS_DELETE = "customerIdsDelete";
    public static final String CUSTOMER_INDEX = "customerIndex";
    public static final String CUSTOMER_LIST_FAVOURITE_IDS = "customerListFavouriteIds";
    public static final String CUSTOMER_IDS = "customerIds";
    public static final String CUSTOMER_LIST_ID = "customerListId";
    public static final String CUSTOMER_ID = "customerId";
    public static final String CUSTOMER_PARENT = "customerParent";

    public static final String BUSINESS_CARD_COMPANY_ID = "businessCardCompanyId";
    public static final String BUSINESS_CARD_DEPARTMENT_ID = "businessCardDepartmentId";
    public static final String BUSINESS_CARD_ID = "businessCardId";

    public static final String SOURCE_LIST_ID = "sourceListId";
    public static final String DEST_LIST_ID = "destListId";
    public static final String EMPLOYEE_ID = "employeeId";
    public static final String GROUP_IDS = "groupIds";
    public static final String DEPARTMENT_IDS = "departmentIds";
    public static final String NETWORK_STAND_ID = "networkStandId";

    public static final String CREATE_DATA_CHANGE_API_METHOD = "createDataChangeElasticSearch";
    public static final String CURRENT_PAGE = "currentPage";
    public static final String DELETED_SCENARIOS = "deletedScenarios";
    public static final String FIELD_ID = "fieldId";
    public static final String IS_AUTO_LIST = "isAutoList";
    public static final String OFFSET = "offset";
    public static final String LIMIT = "limit";
    public static final String PARTICIPANT_TYPE = "participantType";
    public static final String TAB_BELONG = "tabBelong";
    public static final String UPDATE_DATE = "updatedDate";
    public static final String SEARCH_VALUE = "searchValue";
    public static final String SEARCH_OPTION = "searchOption";
    public static final String SEARCH_TYPE = "searchType";
    public static final String MODIFY_ACTION_DELETE = "DELETE";
    public static final String MODIFY_ACTION_UPDATE = "UPDATE";
    public static final String MODIFY_ACTION_CREATE = "CREATE";
    public static final String LIST_MEMBER = "listMembers";
    public static final String LIST_PARTICIPANT = "listParticipants";
    public static final String LIST_SEARCH_CONDITION = "searchConditions";
    public static final String SCENARIO_ID = "scenarioId";
    public static final String SCENARIONAME_NULL = "scenarioName_Null";
    public static final String SCENARIOID_NULL = "scenarioId_Null";

    public static final String API_GET_EMPLOYEES = "get-employees";
    public static final String API_GET_GROUPS = "get-groups";
    public static final String API_GET_DEPARTMENTS = "get-departments";
    public static final String API_GET_CUSTOM_FIELDS_INFO = "get-custom-fields-info";
    public static final String API_FIELDS_INFO_PERSONALS = "get-field-info-personals";
    public static final String API_GET_TASKS_BY_IDS = "get-tasks-by-ids";
    public static final String API_VALIDATE_COMMON = "validate";
    public static final String API_GET_FIELD_INFO_TABS = "get-field-info-tabs";
    public static final String API_GET_TABS_INFO = "get-tabs-info";
    public static final String API_GET_PRODUCT_TRADINGS = "get-product-tradings";
    public static final String API_GET_EMPLOYEES_BY_IDS = "get-employees-by-ids";
    public static final String API_GET_PARTICIPANT_DATA_BY_IDS = "get-participant-data-by-ids";
    public static final String API_DELETE_MILESTONE = "delete-milestone";
    public static final String API_CREATE_NOTIFICATION = "create-notification";
    public static final String API_CREATE_DATA_CHANGE_ELASTIC_SEARCH = "create-data-change-elastic-search";
    public static final String API_GET_EMPLOYEE_SUGGESTION_CHOICE = "get-employee-suggestions-choice";
    public static final String API_GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID = "get-custom-fields-info-by-field-ids";
    public static final String API_UPDATE_LIST_VIEW_SETTING = "update-list-view-setting";
    public static final String API_GET_DETAIL_ELASTIC_SEARCH = "get-detail-elastic-search";
    public static final String API_GET_GROUP_AND_DEPARTMENT_BY_EMPLOYEE_IDS = "get-group-and-department-by-employee-ids";
    public static final String API_GET_TASK_TAB = "get-tasks-tab";
    public static final String DELETE_MASTER_SCENARIO = "deleleMasterScenario";
    public static final String API_TASK_CUSTOMER_RELATION = "update-task-customer-relation";
    public static final String API_GET_TASKS_AND_SCHEDULES_BY_CUSTOMER_IDS = "get-tasks-and-schedules-by-customer-ids";
    public static final String API_GET_FULL_EMPLOYEES_BY_PARTICIPANT = "get-full-employees-by-participant";

    // sale
    public static final String API_SALSES_UPDATE_CUSTOMER_RELATION = "update-customer-relation";
    public static final String API_GET_PROGRESSES = "get-progresses";
    public static final String AMPERSAND_PROCESS_EQUAL = "&progess=";
    public static final Integer LIST_LIMIT = 30;
    public static final String API_GET_COUNT_PRODUCT_TRADING_BY_CUSTOMERS = "get-count-product-trading-by-customers";
    public static final String API_DELETE_PRODUCT_TRADING_BY_CUSTOMERS = "delete-product-trading-by-customers";
    public static final String API_GET_PRODUCT_TRADING_TAB = "get-product-trading-tab";
    // analysis
    public static final String API_GET_REPORTS = "get-reports";
    public static final String API_GET_DASHBOARD_EMBED_URL = "get-dashboard-embed-url";
    // Businesscard
    public static final String API_GET_BUSINESSCARD_DEPARTMENTS = "get-business-card-departments";
    public static final String API_GET_BUSINESS_CARDS = "get-business-cards";
    public static final String API_GET_BUSINESS_CARDS_BY_IDS = "get-business-cards-by-ids";
    public static final String API_SAVE_NET_WORK_MAP = "save-net-work-map";
    public static final String API_COUNT_BUSINESS_CARDS_BY_CUSTOMER = "count-business-cards-by-customer";
    public static final String API_GET_BUSINESS_CARD_CONTACTS = "get-business-card-contacts";
    public static final String API_DELETE_BUSINESS_CARDS = "delete-business-cards";
    public static final String API_BUSINESS_CARD_UPDATE_CUSTOMER_RELATION = "update-customer-relation";
    // Schedules
    public static final String API_DELETE_TASK = "delete-tasks";
    public static final String API_GET_MILESTONES = "get-milestones";
    public static final String API_CREATE_MILESTONE = "create-milestone";
    public static final String API_UPDATE_TASK = "update-task";
    public static final String API_UPDATE_MILESTONE = "update-milestone";
    public static final String API_GET_MILESTONES_BY_CUSTOMER = "get-milestones-by-customer";
    public static final String API_GET_TASKS = "get-tasks";
    public static final String API_GET_TASKS_TAB = "get-tasks-tab";
    public static final String API_COUNT_TASK_BY_CUSTOMER_IDS = "count-task-by-customer-ids";
    public static final String API_DELETE_SCHEDULES = "delete-schedules";
    public static final String API_DELETE_TASK_CUSTOMER_RELATION = "delete-task-customer-relation";
    public static final String API_UPDATE_SCHEDULE_CUSTOMER_RELATION = "update-schedule-customer-relation";
    public static final String API_COUNT_SCHEDULES = "count-schedules";
    // Employees
    public static final String API_GET_SELECTED_ORGANIZATION_INFO = "get-selected-organization-info";
    // Timeline
    public static final String API_DELETE_TIMELINES = "delete-timelines";
    public static final String API_CREATE_TIMELINES_AUTO = "create-timeline-auto";
    public static final String API_COUNT_TIME_LINES = "count-time-lines";
    public static final String API_TIMELINE_UPDATE_RELATION_DATA = "update-relation-data";
    // Activities
    public static final String API_GET_ACTIVITIES = "get-activities";
    public static final String API_COUNT_ACTIVITY_BY_CUSTOMERS = "count-activity-by-customers";
    public static final String API_DELETE_ACTIVITY_BY_CUSTOMERS = "delete-activity-by-customers";
    public static final String API_ACTIVITY_UPDATE_CUSTOMER_RELATION = "update-customer-relation";

    public static final Integer SELECTED_TARGET_TYPE_1 = 1;
    public static final Integer SELECTED_TARGET_TYPE_2 = 2;
    public static final Integer SELECTED_TARGET_TYPE_3 = 3;
    public static final Integer SELECTED_TARGET_TYPE_4 = 4;

    public static final String INDEX_CUSTOMER = "%s_customer";
    public static final String INDEX_EMPLOYEE = "%s_employee";
    public static final String INDEX_PRODUCT = "%s_product";
    public static final String INDEX_CALENDAR = "%s_calendar";
    public static final String EMPLOYEE_COLUMN_ID = "employee_id";
    public static final String CUSTOMER_COLUMN_ID = "customer_id";

    public static final String DOT_REGEX = "\\.";
    public static final String DOT_KEYWORD = ".keyword";
    public static final String SEARCH_KEYWORD_TYPE = "%s.keyword";
    public static final String SEARCH_LIKE_FIRST = "2";
    public static final String SEARCH_LIKE = "1";
    public static final String ALL_WORD = "3";
    public static final String AND_CONDITION = "2";
    public static final String OR_CONDITION = "1";
    public static final String OR = " OR ";
    public static final String AND = " AND ";
    public static final String OPEN_BRACKET = " ( ";
    public static final String CLOSE_BRACKET = " ) ";
    public static final String OPEN_SQUARE_BRACKET = "[";
    public static final String CLOSE_SQUARE_BRACKET = "]";
    public static final String ENCLOSURE = "\"";
    public static final String ELEMENT_BETWEEN_BRACKET = " ( %s ) ";
    public static final String FILE_PATH_ATTR = "file_path";
    public static final String FILE_URL_ATTR = "file_url";
    public static final String URL_START = "http";

    // format date
    public static final String APP_DATE_FORMAT_ES = "yyyy-MM-dd";
    public static final String CUSTOMER_FORMAT_DATE = "formatDate";

    public static final String DELETE_MASTERSCENARIO = "WAR_COM_0001";

    public static final String PARENT_TREE = "parent_tree";
    public static final String INSERT_DATA_CHANGE_FAILED = "Insert data change failed";
    public static final String UPDATE_DATA_CHANGE_FAILED = "Update data change failed";
    public static final String DELETE_DATA_CHANGE_FAILED = "Delete data change failed";

    public static final String INDEX_CUSTOMER_SUGGEST = "customer";
    public static final String ELASTICSEARCH_INDEX = "%s_employee";
    public static final String GET_DATA_ELASTICSEARCH = "getDataElasticSearch";

    // Index ElasticSearch
    public static final String EMPLOYEE_ID_FIELD = "employee_id";
    public static final String EMPLOYEE_FULL_NAME_FIELD = "employee_full_name";
    public static final String EMPLOYEE_FULL_NAME_KANA_FIELD = "employee_full_name_kana";
    public static final String DEPARTMENT_ID_FIELD = "employee_departments.department_id";
    public static final String EMPLOYEE_GROUP_ID_FIELD = "employee_groups_id";
    public static final String CUSTOMER_ELASTICSEARCH_INDEX = "%s_customer";
    public static final String CUSTOMER_NAME_FIELD = "customer_name";
    public static final String CUSTOMER_ALIAS_NAME_FIELD = "customer_alias_name";
    public static final String CUSTOMER_PARENT_NAME_FIELD = "customer_parent";
    public static final String PARENT_IN_CHANGE_EMP_ID_FIELD = "person_in_charge.employee_id";
    public static final String PARENT_IN_CHANGE_DEPARTMENT_ID_FIELD = "person_in_charge.department_id";
    public static final String PARENT_IN_CHANGE_GROUP_ID_FIELD = "person_in_charge.group_id";

    public static final Integer PROCESS_FLG_TYPE_2 = 2;
    // field type
    public static final int FIELD_TYPE_ENUM_FULLTEXT = 0;
    public static final int FIELD_TYPE_ENUM_PULLDOWN = 1;
    public static final int FIELD_TYPE_ENUM_MULTIPLE_PULLDOWN = 2;
    public static final int FIELD_TYPE_ENUM_CHECKBOX = 3;
    public static final int FIELD_TYPE_ENUM_RADIO = 4;
    public static final int FIELD_TYPE_ENUM_NUMBER = 5;
    public static final int FIELD_TYPE_ENUM_DATE = 6;
    public static final int FIELD_TYPE_ENUM_DATETIME = 7;
    public static final int FIELD_TYPE_ENUM_TIME = 8;
    public static final int FIELD_TYPE_ENUM_TEXT = 9;
    public static final int FIELD_TYPE_ENUM_TEXTAREA = 10;
    public static final int FIELD_TYPE_ENUM_FILE = 11;
    public static final int FIELD_TYPE_ENUM_LINK = 12;
    public static final int FIELD_TYPE_ENUM_PHONE = 13;
    public static final int FIELD_TYPE_ENUM_ADDRESS = 14;
    public static final int FIELD_TYPE_ENUM_EMAIL = 15;
    public static final int FIELD_TYPE_ENUM_CALCULATION = 16;
    public static final int FIELD_TYPE_ENUM_RELATION = 17;
    public static final int FIELD_TYPE_ENUM_SELECT_ORGANIZATION = 18;
    public static final int FIELD_TYPE_ENUM_LOOKUP = 19;
    public static final int FIELD_TYPE_ENUM_TAB = 20;
    public static final int FIELD_TYPE_ENUM_HEADING = 21;
    public static final int FIELD_TYPE_ENUM_BOOL = 90;
    public static final int FIELD_TYPE_ENUM_OTHER = 99;

    public static final int TAB_TAB_SUMARY = 0;
    public static final int TAB_SALES = 1;
    public static final int TAB_CHANGE_HISTORY = 2;
    public static final int TAB_TASK = 5;
    public static final int TAB_MAIL = 6;
    public static final int TAB_CALENDAR = 9;
    public static final int TAB_REVENUE = 10;
    public static final int TAB_NETWORK_CONECTION = 11;
    public static final int TAB_ACTIVITIES = 12;
    public static final int TAB_SCENARIO = 20;

    public static final Integer OPERATOR_TYPE_1 = 1;
    public static final Integer OPERATOR_TYPE_2 = 2;
    public static final Integer OPERATOR_TYPE_3 = 3;

    public static final String FILTER_MODE_DATE = "filterModeDate";
    public static final String DATE_MAXTIME = "%s 23:59:59 ";
    public static final String DATE_MINTIME = "%s 00:00:00";

    // Constants Task
    public static final Integer STATUS_NOT_STARTED = 1;
    public static final Integer STATUS_STARTING = 2;
    public static final Integer STATUS_DONE = 3;

    // Relation get-record-by-ids
    public static final String PARAM_RECORD_IDS = "recordIds";
    public static final String PARAM_FIELD_INFO = "fieldInfo";
    public static final Integer RELATION_FORMAT_SINGLE = 1;
    public static final String ERR_RELATION_DATA = "ERR_COM_0073";

    // My list, shared list and favorites list
    public static final Integer PARTICIPANT_TYPE_OWNER = 2;
    public static final Integer PARTICIPANT_TYPE_VIEWER = 1;

    public static final String CUSTOMER_DATA_PERSON_IN_CHARGE = "customer_data.person_in_charge";
    public static final String SELECT_ORGANIZATION_KEY = "select_organization_";
    public static final String SELECT_RELATION_KEY = "relation_";

    public static final String CUSTOMER_PARENT_INVAIL = "ERR_CUS_0015";

    public static final Integer TIMELINE_TYPE_CUSTOMER = 1;

    // Mode api createTimelineAuto
    public static final Integer MODE_CREATE_TIMELINE_AUTO = 0;
    public static final Integer MODE_EDIT_TIMELINE_AUTO = 1;

    public static final String API_GET_IDS_OF_GET_ACTIVITIES = "get-ids-of-get-activities";
    public static final String API_GET_IDS_OF_GET_BUSINESS_CARDS = "get-ids-of-get-business-cards";
    public static final String API_GET_IDS_OF_GET_TASKS = "get-ids-of-get-tasks";
    public static final String API_GET_IDS_OF_GET_EMPLOYEES = "get-ids-of-get-employees";
    public static final String API_GET_IDS_OF_GET_PRODUCTS = "get-ids-of-get-products";
    public static final String API_GET_IDS_OF_GET_PRODUCTS_TRADINGS = "get-ids-of-get-product-tradings";
    public static final String API_GET_IDS_OF_GET_CUSTOMERS = "get-ids-of-get-customers";

}
