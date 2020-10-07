package jp.co.softbrain.esales.commons.config;

import java.util.List;

/**
 * Application constants.
 */
public final class ConstantsCommon {

    private ConstantsCommon() {
    }

    public static final String SERVICE_NAME = "commons";

    // language list
    public static final List<String> LANGUAGE_LIST = List.of("en_us", "ja_jp", "zh_cn");
    public static final String FIELD_TYPE_KEY_WORD = "fieldType";
    public static final String EXTENSION_BELONG_KEY_WORD = "extensionBelong";
    public static final String SPACE = " ";
    public static final String OPEN_BRACKET = "[";
    public static final String CLOSE_BRACKET = "]";
    public static final String EMPTY_STRING = "";
    public static final String PARAM_FIELD_BELONG = "fieldBelong";
    public static final String PARAM_FIELD_TYPE = "fieldType";
    public static final String PARAM_FIELD_ID = "fieldId";
    public static final String PARAM_TAB_BELONG = "tabBelong";
    public static final String PARAM_TAB_ID = "tabId";
    public static final String EMPLOYEE_ID = "employeeId";
    public static final String FIELD_INFOS = "fieldInfos";
    public static final String UPDATED_DATE = "updateDate";
    public static final String FIELD_INFO_TAB_PERSONAL_ID = "fieldInfoTabPersonalId";
    public static final String FIELD_INFO_TAB_ID = "fieldInfoTabId";
    public static final String EMPTY_JSON_OBJECT_STRING = "{}";
    public static final String SETTING_VALUE = "setting value";
    public static final String COMMA = ",";
    public static final String EMPTY = "";

    public static final String FIELD_ID = "field_id";

    public static final String EXTENSION_BELONG = "extension_belong";

    public static final String FIELD_BELONG = "field_belong";

    public static final String DISPLAY_FIELD_ID = "display_field_id";

    public static final String DISPLAY_FIELD = "display_field";

    public static final String DISPLAY_TAB = "display_tab";

    public static final String SEARCH_KEY = "search_key";

    public static final String FIELD_ID_REFLECT = "field_id_reflect";

    public static final String FIELD_LABEL = "field_label";

    public static final String ITEM_REFLECT = "item_reflect";

    public static final String EXCLUSIVE_ERROR = "exclusive_error";

    public static final String UPDATE_DATE = "update date";

    public static final int MAX_LENGHT_PHONE = 20;

    public static final String REGEX_PHONE = "^(\\(?\\+?[0-9]*\\)?)?[0-9_\\- \\(\\)]*$";

    public static final String REGEX_LINK = "^((?:http(s)?|ftp):\\/\\/)(([\\w.-]+(?:\\.[\\w\\.-]+)+)|localhost)[\\w\\-\\._~:/?#\\[\\]@!\\$&'\\(\\)\\*\\+,;=.]+$";

    public static final String REGEX_LINK_LOCAL = "^(?:\\.{1,2})?(?:\\/\\.{1,2})*(\\/[a-zA-Z0-9.]+)+$";

    public static final String REGEX_NUMBER = "^[0-9]+\\.([0-9])+$";

    public static final String REGEX_TIME_HHMM = "^[0-2][0-9]:[0-5][0-9]$";

    public static final String REGEX_IP_ADDRESS = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";

    public static final String DOT = ".";
    
    public static final String REGEX_DOT = "\\.";
    
    public static final String MINUS = "-";

    public static final String COLON = ":";

    public static final String HOUR_MAX = "24";

    public static final String DOUBLE_HYPHEN = "--";

    public static final String PARENTHESIS = "()";

    public static final String OPEN_PARENTHESIS = "(";

    public static final String CLOSE_PARENTHESIS = ")";

    public static final String PARENTHESIS_AND_PLUS = "(+)";

    public static final String PARENTHESIS_AND_MINUS = "(-)";

    public static final String PARENTHESIS_REVERSE = ")(";

    public static final String LIMIT = "limit";

    public static final String OFFSET = "offset";

    public static final String ZIP_CODE = "zipCode";

    public static final String PARAM_INDEX = "index";
    public static final String PARAM_EMPLOYEE_ID = "employeeId";
    public static final String PARAM_LIMIT = "limit";
    
    public static final Long BYTE_TO_MB_RATIO = 1048576L;

    public static final String VALUE = "value";

    public static final int LANGUAGE_EN_US = 0;
    public static final Integer INTEGER_ONE = 1;
    public static final int LANGUAGE_JA_JP = 1;
    public static final int LANGUAGE_ZN_CN = 2;
    public static final String LABEL = "label";
    public static final String DATE = "date";
    public static final String MD_FORMAT = "md_format";
    public static final String DATE_TIME = "date_time";
    public static final String HM_FORMAT = "hm_format";
    public static final String FILE_NAME = "file_name";
    public static final String FILE_PATH = "file_path";
    public static final String FIELD_ZIP_CODE = "zip_code";
    public static final String ADDRESS_NAME = "address_name";
    public static final String BUILDING_NAME = "building_name";
    public static final String ADDRESS = "address";
    public static final String FIELD_EMPLOYEE_ID = "employee_id";
    public static final String DEPARTMENT_ID = "department_id";
    public static final String GROUP_ID = "group_id";

    public static final String FORMAT_ELASTICSEARCH_INDEX = "%s%s";

    public static final String KEY_RELATION_FIELD_BELONG = "field_belong";
    public static final String KEY_RELATION_FIELD_ID = "field_id";
    public static final String KEY_RELATION_FORMAT = "format";
    public static final String KEY_RELATION_DISPLAY_FIELD_ID = "display_field_id";
    public static final String KEY_RELATION_DISPLAY_TAB = "display_tab";
    public static final String KEY_RELATION_DISPLAY_FIELDS = "display_fields";
    public static final String KEY_RELATION_FIELD_NAME = "field_name";
    public static final String KEY_RELATION_RELATION_ID = "relation_id";
    public static final String KEY_RELATION_ASSELF = "as_self";
    public static final String LIST_IDS = "listIds";
    public static final String FIELD_IDS = "fieldIds";
    public static final Integer SHARE_LIST = 4;
    public static final Long EMPLOYEE_ID_SHARE_LIST = -1L;
    public static final String API_GET_DATA_BY_RECORD_IDS = "get-data-by-record-ids";

	public static final String DATE_TO_AFTER_DATE_FROM = "ERR_COM_0037";

    public static final String URL_API_UPDATE_PRODUCT_TYPES = "update-product-types";
    public static final String URL_API_UPDATE_ACTIVITY_FORMATS = "update-activity-formats";

    /**
     * Group Participants
     */
    public static final Integer MY_LIST = 1;
    public static final Integer SHARED_LIST = 2;
    public static final Integer MEMBER_TYPE_OWNER = 2;
    public static final Integer MEMBER_TYPE_VIEWER = 1;
    public static final int MIN_YEAR = 1753;
    
    public static final int MAX_YEAR = 9999;

    public static final String URL_TARGER = "url_target";
    
    public static final String URL_TEXT = "url_text";

    public static final Integer URL_NO_FIXED = 1;
    
    public static final String CHILDREN_ITEM = "childrenItem";

    public static final String ARRAY_ERROR = "arrayError";

}
