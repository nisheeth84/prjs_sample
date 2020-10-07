package jp.co.softbrain.esales.employees.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Application constants.
 */
public final class ConstantsEmployees {

    private ConstantsEmployees() {
    }
    public static final String SERVICE_NAME = "employees";
    public static final String LANGUAGE_DEFAULT = "ja_jp";
    public static final List<String> LANGUAGE_LIST = List.of(LANGUAGE_DEFAULT, "en_us", "zh_cn");

    public static final String NOT_EXISTED_MSG = "This record has no longer existed";
    public static final String PARSE_JSON_FAILED_FORMAT = "Parse Json Dynamic Data Failed! Cause by: %s";

    public static final String SLASH_STAND = "\\|";
    public static final String QOUTE = "\"";
    public static final String COLON = ":";
    public static final String EMPTY = "";
    public static final String COMMA = ",";
    public static final String PERIOD = ".";
    public static final String DOT_KEYWORD = ".keyword";
    public static final String SQUARE_BRACKET_OPEN = "[";
    public static final String SQUARE_BRACKET_CLOSE = "]";
    public static final String NOT_WORK = "退職者にする";
    public static final String WORK = "社員に戻す";
    public static final String EMPLOYEE_CAPTION = "employee";
    public static final String EMPLOYEES_DEPARTMENTS_CAPTION = "employeesDepartments";
    public static final String PARAM_EMPLOYEE_ID = "employeeId";
    public static final String PARAM_EMPLOYEE_IDS = "employeeIds";
    public static final String PARAM_RECORD_IDS = "recordIds";
    public static final String PARAM_FIELD_INFO = "fieldInfo";
    public static final String DEPARTMENT_CAPTION = "department";
    public static final Integer GROUP_NAME_LENGTH_MAX = 50;
    public static final Integer MEMBER_TYPE_OWNER = 2;
    public static final Integer MY_GROUP = 1;
    public static final Integer SHARED_GROUP = 2;
    public static final Integer NUMBER_ZERO = 0;
    public static final Long LONG_VALUE_0L = 0L;
    public static final Integer DEFAULT_INTEGER_LIMIT_VALUE = 10000;
    public static final Long DEFAULT_LIMIT_VALUE = 10000L;
    public static final String USER_NOT_PERMISSION = "ERR_COM_0027";
    public static final String VALIDATE_MSG_FAILED = "Validate failed";
    public static final Integer NUMBER_OF_FLOORS_ALLOWED = 20;
    public static final String GREATER_NUMBER_OF_FLOORS_ALLOWED = "ERR_EMP_0022";
    public static final String REGEX_INTEGER = "^[-+]?[0-9]+(.[0-9]+)?$";
    public static final String REGEX_DECIMAL = "^[-+]?[0-9]+(,[0-9]+)*(.[0-9]+([eE][-+]?[0-9]+)?)?$";
    public static final String GROUP_NAME = "groupName";
    public static final String GROUP_TYPE = "groupType";
    public static final String SEARCH_TYPE = "searchType";
    public static final String IS_AUTO_GROUP = "isAutoGroup";
    public static final String GROUP_PARTICIPANT = "groupParticipants";
    public static final String FIELD_ID = "fieldId";
    public static final String SEARCH_CONDITION = "searchCondition";
    public static final String SEARCH_OPTION = "searchOption";
    public static final String SEARCH_VALUE = "searchValue";
    public static final String GROUP_ID = "groupId";
    public static final String ID_OF_LIST = "idOfList";
    public static final String DEPARTMENT_NAME = "departmentName";
    public static final String DEPARTMENT_ID = "department_id";
    public static final String NULL_STRING = "null";
    public static final String EMPLOYEE_ORDER_BY_DEFAULT = " ORDER BY emp.employee_id DESC ";
    public static final String FIELD_NAME_EMPLOYEE_ICON = "employee_icon";
    public static final String KEYWORD_TYPE = "%s.keyword";
    public static final String PACKAGE_ID = "package_id";
    public static final String COLUMN_NAME_CUSTOMER_DATA = "customer_data";

    public static final String DATE_MAXTIME = "%s 23:59:59 ";
    public static final String DATE_MINTIME = "%s 00:00:00";

    public static final String APP_DATE_FORMAT_ES = "yyyy-MM-dd";
    public static final String EMPLOYEE_FORMAT_DATE = "formatDate";
    public static final Integer EMPLOYEE_FORMAT_DATE_DEFAULT = 1;

    public static final String DUPLICATE = "ERR_COM_0058";
    /**
     * エラーコードが必要に
     */
    public static final String RIQUIRED_CODE = "ERR_COM_0013";
    public static final String NUMBER_INVALID_CODE = "ERR_EMP_0020";

    /**
     * この部署はすでに登録されています。
     */
    public static final String EXISTS_DEPARTMENT = "ERR_EMP_0001";

    /**
     * 重複したメール入力があります
     */
    public static final String DUPLICATE_EMAIL_ERROR = "ERR_EMP_0002";

    /**
     * 重複したユーザーIDがあります
     */
    public static final String DUPLICATE_USERID_ERROR = "ERR_EMP_0032";
    public static final String DUPLICATE_USERID_SINGLE_ERROR= "ERR_COM_0072";
    public static final String ERR_RELATION_DATA = "ERR_COM_0073";

    /**
     * 部署が削除されました。
     */
    public static final String NOT_EXIST_DEPARTMENT_ERROR = "ERR_EMP_0003";
    public static final String DUPLICATE_DEPARTMEN_AND_POSITION = "ERR_EMP_0033";

    /**
     * 社員の部署は最大3つまで設定できます。
     */
    public static final String MAXIMUM_DEPARTMENT_ERROR = "ERR_EMP_0036";

    public static final String CONDITION_GROUP_AUTO_NOT_EXIST = "ERR_EMP_0041";

    /**
     * のメールを持つユーザーは既に存在します
     */
    public static final String EXIST_EMAIL_ERROR = "ERR_EMP_0004";

    public static final String CANNOT_DELETE_DEPARTMENT = "ERR_EMP_0005";

    public static final String INVAIL_PACKAGE_ID = "ERR_EMP_0016";

    public static final String WAR_LOG_0002 = "WAR_LOG_0002";
    public static final String WAR_LOG_0003 = "WAR_LOG_0003";
    public static final String WAR_LOG_0004 = "WAR_LOG_0004";

    public static final String REASON_EDIT = "編集の実行";
    public static final String OLD_VALUE = "old";
    public static final String NEW_VALUE = "new";
    public static final String COLUMN_NAME_PHOTO_FILE_NAME = "photo_file_name";
    public static final String COLUMN_NAME_PHOTO_FILE_PATH = "photo_file_path";
    public static final String COLUMN_NAME_EMPLOYEE_SURNAME = "employee_surname";
    public static final String COLUMN_NAME_EMPLOYEE_NAME = "employee_name";
    public static final String COLUMN_NAME_EMPLOYEE_SURNAME_KANA = "employee_surname_kana";
    public static final String COLUMN_NAME_EMPLOYEE_NAME_KANA = "employee_name_kana";
    public static final String COLUMN_NAME_EMAIL = "email";
    public static final String COLUMN_NAME_EMAIL_OLD = "email_old";
    public static final String COLUMN_NAME_TELEPHONE_NUMBER = "telephone_number";
    public static final String COLUMN_NAME_CELLPHONE_NUMBER = "cellphone_number";
    public static final String COLUMN_NAME_USER_ID = "user_id";
    public static final String COLUMN_NAME_LANGUAGE_ID = "language_id";
    public static final String COLUMN_NAME_TIMEZONE_ID = "timezone_id";
    public static final String COLUMN_NAME_EMPLOYEE_DATA = "employee_data";
    public static final String COLUMN_NAME_EMPLOYEE_STATUS = "employee_status";
    public static final String COLUMN_NAME_POSITION_ORDER = "position_order";
    public static final String COLUMN_NAME_FORMAT_DATE_ID = "format_date_id";
    public static final String COLUMN_NAME_EMPLOYEE_PACKAGES = "employees_packages";
    public static final String COLUMN_NAME_IS_ADMIN = "is_admin";
    public static final String EMPLOYEE_PACKAGES = "employee_packages";
    public static final String EMPLOYEES_DEPARTMENTS_NAME = "employee_department_name";
    public static final String COLUMN_GROUP_NAME = "group_name";

    public static final String FILTER_MODE_DATE = "filterModeDate";

    /**
     * Error code when not group information.
     */
    public static final String NOT_GROUP_INFOMATION = "ERR_EMP_0007";

    public static final String MAIL_VALIDATE_FORMAT = "^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$";

    public static final String EMAIL = "email";
    public static final String EMPLOYEE_SURNAME = "employeeSurname";
    /**
     * NOT EXISTED
     */
    public static final String NOT_EXISTED = "ERR_EMP_0006";

    public static final String NOT_EXIST_EMPLOYEE = "ERR_EMP_0034";

    public static final String PARAM_DEPARTMENT_ID = "departmentId";
    public static final String PARAM_DEPARTMENT_NAME = "departmentName";
    public static final String PARAM_MANAGER_ID = "managerId";
    public static final String PARTICIPANT_GROUP_ID = "participantGroupId";

    public static final String EMPLOYEE_STATUS = "employee_status";

    public static final Integer WORK_STATUS = 0;

    public static final Integer NOT_WORK_STATUS = 1;

    public static final String EMPLOYEE_ID = "employee_id";

    // For elasticsearch
    public static final String EMPLOYEE_ID_ATTR = "employeeId";
    public static final String CREATED_USER_ATTR = "createdUser";
    public static final String UPDATED_USER_ATTR = "updatedUser";
    public static final String CREATED_DATE_ATTR = "createdDate";
    public static final String UPDATED_DATE_ATTR = "updatedDate";
    public static final String EMPLOYEE_STATUS_ATTR = "employeeStatus";
    public static final String EMPLOYEE_ICON_ATTR = "employeeIcon";
    public static final String LANGUAGE_ATTR = "language";
    public static final String TIMEZONE_ATTR = "timezone";
    public static final String EMPLOYEE_DEPARTMENTS_ATTR = "employeeDepartments";
    public static final String EMPLOYEE_GROUP_ATTR = "employeeGroups";
    public static final String EMPLOYEE_MANAGERS_ATTR = "employeeManagers";
    public static final String EMPLOYEE_SUBORDINATES_ATTR = "employeeSubordinates";
    public static final String EMPLOYEE_SURNAME_ATTR = "employeeSurname";
    public static final String EMPLOYEE_NAME_ATTR = "employeeName";
    public static final String EMPLOYEE_SURNAME_KANA_ATTR = "employeeSurnameKana";
    public static final String EMPLOYEE_NAME_KANA_ATTR = "employeeNameKana";
    public static final String EMAIL_ATTR = "email";
    public static final String TELEPHONE_NUMBER_ATTR = "telephoneNumber";
    public static final String CELLPHONE_NUMBER_ATTR = "cellphoneNumber";
    public static final String USER_ID_ATTR = "userId";
    public static final String EMPLOYEE_DATA_ATTR = "employeeData";

    public static final String ELASTICSEARCH_INDEX = "%s_employee";
    public static final String FORMAT_FULLNAME = "%s %s";

    public static final String EMPLOYEE_STATUS_FIELD = "employee_status";
    public static final String DEPARTMENT_ID_FIELD = "employee_departments.department_id";
    public static final String GROUP_ID_FIELD = "employee_groups.group_id";
    public static final String EMPLOYEE_FULL_NAME_FIELD = "employee_full_name";
    public static final String EMPLOYEE_FULL_NAME_KANA_FIELD = "employee_full_name_kana";
    public static final String EMPLOYEE_SURNAME_FIELD = "employee_surname";
    public static final String EMPLOYEE_SURNAME_KANA_FIELD = "employee_surname_kana";
    public static final String EMPLOYEE_NAME_FIELD = "employee_name";
    public static final String EMPLOYEE_NAME_KANA_FIELD = "employee_name_kana";
    public static final String TELEPHONE_NUMBER_FIELD = "telephone_number";
    public static final String CELLPHONE_NUMBER_FIELD = "cellphone_number";
    public static final String DEPARTMENT_NAME_FIELD = "employee_departments.department_name";
    public static final String POSITION_NAME_FIELD = "employee_departments.position_name";
    public static final String EMAIL_FIELD = "email";
    public static final String COLUMN_DEPARTMENT_NAME = "department_name";

    public static final String EMPLOYEE = "employee";
    public static final String EMPLOYEE_DEPARTMENT = "employee_department";
    public static final String EMPLOYEE_GROUP = "employee_group";
    public static final Integer DEPARTMENT_GROUP_SEARCH_TYPE = 1;
    public static final Integer EMPLOYEE_SEARCH_TYPE = 2;
    public static final Integer EMPLOYEE_GROUP_SEARCH_TYPE = 3;
    public static final String ID_HISTORY_CHOICE = "idHistoryChoiceList";
    public static final String ID_ITEM_CHOICE = "idItemChoiceList";
    public static final String INVITE_ID = "inviteId";
    public static final Long EMPLOYEES_ELASTICSEARCH_LIMIT = Long.valueOf(10);

    public static final String ASC = "ASC";
    public static final String CALL_API_MSG_FAILED = "Call API %s failed. Status: %s";
    public static final Object CREATE_DATA_CHANGE_API_METHOD = "createDataChangeElasticSearch";
    public static final String EMPLOYEE_DEPARTMENTS_IDS = "employee.departmentIds";
    public static final String SELECT_ORGANIZATION = "select_organization";
    public static final Object GROUP_ID_SNACK = "group_id";

    public static final String POSITION_IDS = "positionIds";
    public static final String POSITION_EXISTED = "INF_SET_0002";
    public static final String URL_API_VALIDATE = "validate";
    public static final String URL_API_GET_TIMEZONES = "get-timezones";
    public static final String URL_API_GET_LANGUAGE = "get-languages";
    public static final String URL_API_GET_CUSTOM_FIELD_INFO = "get-custom-fields-info";
    public static final String URL_API_GET_AVAILABLE_LICENSE = "get-available-license";
    public static final String URL_API_GET_COMPANY_NAME = "get-company-name";
    public static final String URL_API_GET_PACKAGE_NAMES = "get-package-names";
    // Timeline
    public static final String URL_API_GET_TIMELINE_GROUPS = "get-timeline-groups";
    public static final String API_GET_FOLLOWED = "get-followeds";
    public static final Integer FOLLOW_TARGET_TYPE_EMPLOYEE = 3;
    public static final String SEARCH_LIKE = "1";
    public static final String SEARCH_LIKE_FIRST = "2";
    public static final String SEARCH_OTHER = "3";
    public static final String TRUE_VALUE = "true";
    public static final String FALSE_VALUE = "false";
    public static final String URL_API_GET_SERVICES_BY_PACKAGE = "get-services-by-package-ids";
    public static final String COULD_NOT_SEND_MAIL_MESSAGE = "Could not send mail, error : %s";
    public static final String SPACE = " ";
    public static final int TOTAL_DEPARTMENT_CAN_INVITE = 3;
    public static final String ERR_EMP_0037 = "ERR_EMP_0037";
    public static final String STRING_ARRAY_EMPTY = "[]";
    public static final String SEARCH_KEYWORD_EMPLOYEE_MANAGERS = "employee_managers.keyword";
    public static final String SEARCH_KEYWORD_EMPLOYEE_SUBORDINATES = "employee_subordinates.keyword";
    public static final String SEARCH_KEYWORD_TYPE = ".keyword";
    public static final Integer DEPARTMENT_TYPE = 1;
    public static final Integer EMPLOYEE_TYPE = 2;
    public static final Integer STATUS_TYPE = 1;

    public static final String API_GET_IDS_OF_GET_ACTIVITIES = "get-ids-of-get-activities";
    public static final String API_GET_IDS_OF_GET_BUSINESS_CARDS = "get-ids-of-get-business-cards";
    public static final String API_GET_IDS_OF_GET_TASKS = "get-ids-of-get-tasks";
    public static final String API_GET_IDS_OF_GET_EMPLOYEES = "get-ids-of-get-employees";
    public static final String API_GET_IDS_OF_GET_PRODUCTS = "get-ids-of-get-products";
    public static final String API_GET_IDS_OF_GET_PRODUCTS_TRADINGS = "get-ids-of-get-product-tradings";
    public static final String API_GET_IDS_OF_GET_CUSTOMERS = "get-ids-of-get-customers";

    // TMS Constants
    public static final String EMPLOYEES_PACKAGES_ID = "employee_package_id";
    public static final String MANAGER_ID = "manager_id";
    public static final String TABLE_NAME_EMPLOYEES = "employees";

    public enum SELECT_TARGET_TYPE {
        QUIT_JOB(1, "Quit job"), DEPARTMENT(2, "Department"), GROUP(3, "Group"), GROUP_SHARED(4, "Group shared");

        private Integer code;
        private String name;

        private SELECT_TARGET_TYPE(Integer code, String name) {
            this.code = code;
            this.name = name;
        }

        public Integer getCode() {
            return code;
        }

        public String getName() {
            return name;
        }
    }

    /**
     * OperaDivision enum
     */
    public enum OperaDivision {
        EMPLOYEES(1), DEPARTMENT(2), GROUP(3);

        private int value;

        private OperaDivision(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    public static final class ApiUrl {
        private ApiUrl() {
            // do nothing
        }
        public static final class Commons {
            private Commons() {}
            public static final String GET_CUSTOM_FIELDS_INFO_BY_FIELD_ID = "get-custom-fields-info-by-field-ids";
        }
    }
    public static final class SpecialItem {
        private SpecialItem() {
            // do nothing
        }
        public static final Integer SPECIAL_TYPE = 99;
        public static final Integer SEARCH_FIELD_TYPE = 9;
        public static final String EMPLOYEE_DEPARTMENTS = "employee_departments";
        public static final String EMPLOYEE_POSITIONS = "employee_positions";
        public static final String EMPLOYEE_MANAGERS = "employee_managers";
        public static final String EMPLOYEE_SUBORDINATES = "employee_subordinates";
        public static final String EMPLOYEE_PACKAGES = "employee_packages";
        public static final String IS_ADMIN = "is_admin";

        /**
         * define special item map
         */
        private static Map<String, String> specialItemMap = new HashMap<>();
        static {
            specialItemMap.put(EMPLOYEE_DEPARTMENTS, "employee_departments.department_name.keyword");
            specialItemMap.put(EMPLOYEE_POSITIONS, "employee_departments.position_name.keyword");
            specialItemMap.put(EMPLOYEE_MANAGERS, "employee_departments.employee_full_name.keyword");
            specialItemMap.put(EMPLOYEE_SUBORDINATES, "employee_subordinates.employee_full_name.keyword");
            specialItemMap.put(COLUMN_NAME_TIMEZONE_ID, "timezone.timezone_name.keyword");
            specialItemMap.put(COLUMN_NAME_LANGUAGE_ID, "language.language_name.keyword");
        }

        /**
         * define special item map
         */
        private static Map<String, String> specialItemCkeckboxMap = new HashMap<>();
        static {
            specialItemCkeckboxMap.put(EMPLOYEE_DEPARTMENTS, "dep.department_id");
            specialItemCkeckboxMap.put(EMPLOYEE_POSITIONS, "pos.position_id");
            specialItemCkeckboxMap.put(IS_ADMIN, "emp.is_admin");
        }

        /**
         * define special item text map
         */
        private static Map<String, String> specialItemTextmap = new HashMap<>();
        static {
            specialItemTextmap.put(EMPLOYEE_MANAGERS, "employee_departments.employee_full_name.keyword");
            specialItemTextmap.put(EMPLOYEE_SUBORDINATES, "employee_subordinates.employee_full_name.keyword");
        }

        private static Map<String, Boolean> specialItemNestedMap = new HashMap<>();
        static {
            specialItemNestedMap.put(EMPLOYEE_DEPARTMENTS, false);
            specialItemNestedMap.put(EMPLOYEE_POSITIONS, false);
            specialItemNestedMap.put(EMPLOYEE_MANAGERS, false);
            specialItemNestedMap.put(EMPLOYEE_SUBORDINATES, false);
            specialItemNestedMap.put(COLUMN_NAME_TIMEZONE_ID, false);
            specialItemNestedMap.put(COLUMN_NAME_LANGUAGE_ID, false);
            specialItemNestedMap.put(IS_ADMIN, false);
        }

        /**
         * getspecial column
         * @param key
         * @return
         */
        public static String getSpecialColumn(String key) {
            return specialItemMap.get(key);
        }

        /**
         * nested column
         *
         * @param key
         * @return
         */
        public static boolean isNested(String key) {
            return specialItemNestedMap.get(key);
        }

        /**
         * check special text column
         *
         * @param key
         * @return
         */
        public static boolean hasSpecialTextColumn(String key) {
            return specialItemTextmap.get(key) != null;
        }

    }


    public static final Integer USER_AWAY_TIME = 300000; // 5 minute
    public static final String INF_EMP_0003 = "INF_EMP_0003";
    public static final CharSequence BACK_SLASH = "\\";
    public static final String ERR_EMP_0034 = "ERR_EMP_0034";

    // API COMMONS
    public static final String API_GET_FIELD_INFO_PERSONAL = "get-field-info-personals";
    public static final String API_GET_CUSTOM_FIELDS_INFO = "get-custom-fields-info";
    public static final String API_GET_DETAIL_ELASTIC_SEARCH = "get-detail-elastic-search";
    public static final String API_GET_RELATION_DATA = "get-relation-data";
    public static final String API_GET_TABS_INFO = "get-tabs-info";

    // API SCHEDULES
    public static final String API_GET_TASKS_TAB = "get-tasks-tab";

    // API CUSTOMERS
    public static final String API_GET_CUSTOMERS = "get-customers";

    // API BUSINESS CARDS
    public static final String API_GET_BUSINESS_CARDS_TAB = "get-business-cards-tab";

    // API SALES
    public static final String API_GET_PRODUCT_TRADING_TAB = "get-product-trading-tab";

    public static final String EMPLOYEES = "employees";
    public static final String DEPARTMENTS = "departments";
    public static final String GROUPS = "groups";

    public static final String FILE_PATH_ATTR = "file_path";
    public static final String FILE_URL_ATTR = "file_url";

    public static final int TAB_SALES = 1;
    public static final int TAB_CHANGE_HISTORY = 2;
    public static final int TAB_BUSINESS_CARDS = 3;
    public static final int TAB_CUSTOMERS = 4;
    public static final int TAB_TASKS = 5;

    public static final Integer DEFAULT_LIMIT_FOR_TAB = 5;

    public static final String SORT_TYPE_DESC = "DESC";
    public static final String SORT_TYPE_ASC = "ASC";

    public static final Integer DEFAULT_OFFSET = 0;
    public static final Integer DEFAULT_LIMIT = 30;
    public static final String CONDITIONS = "conditions";

}
