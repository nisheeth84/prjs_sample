package jp.co.softbrain.esales.tenants.config;

import java.util.List;

import com.google.common.collect.ImmutableList;

/**
 * Application constants.
 */
public final class ConstantsTenants {
    private ConstantsTenants() {
        // do nothing
    }

    /**
     * Micro service name
     */
    public static final String EMPLOYEE_SERVICE_NAME = "employees";
    public static final String SCHEDULE_SERVICE_NAME = "schedules";
    public static final String PRODUCT_SERVICE_NAME = "products";
    public static final String CUSTOMERS_SERVICE_NAME = "customers";
    public static final String BUSINESSCARDS_SERVICE_NAME = "businesscards";
    public static final String ACTIVITIES_SERVICE_NAME = "activities";
    public static final String TIMELINES_SERVICE_NAME = "timelines";
    public static final String SALES_SERVICE_NAME = "sales";
    public static final String COMMONS_SERVICE_NAME = "commons";
    public static final String ANALYSIS_SERVICE_NAME = "analysis";
    public static final String EXTERNALS_SERVICE_NAME = "externals";

    public static final String SERVICE_NAME = "tenants";
    public static final String SCHEMA_NAME = "tenants";
    public static final String SYSTEM_ACCOUNT = "system";
    public static final String TENANT_ID = "softbrain";
    public static final Long BATCH_USER_ID = -1L;
    public static final int YEAR_MONTH_MAX_LENGTH = 6;
    public static final String TENANT_ITEM = "テナント";
    public static final String PACKAGE_ID = "packageId";
    public static final String DEFAULT_LANG = "ja_jp";

    public static final String COLUMN_NAME_USER_ID = "user_id";
    public static final String DUPLICATE = "ERR_COM_0058";
    public static final String UPDATE_IP_ADDRESSES = "updateIpAddresses";
    public static final String VALIDATE_MSG_FAILED = "Validate failed";
    public static final String URL_API_VALIDATE = "validate";
    public static final String META_FILE_INVALID = "ERR_TEN_0005";

    /**
     * List config table in database
     */
    public static final List<String> LIST_CONFIG_TABLES = List.of(
            "masters_stands",
            "masters_motivations",
            "api_tokens",
            "schedules_google_calendar",
            "schedules_types",
            "holidays",
            "company_holidays",
            "equipments",
            "equipments_types",
            "periods",
            "ip_address",
            "authentication_saml",
            "url_api_setting",
            "mails_servers",
            "activities_formats",
            "positions",
            "products_tradings_progress",
            "products_types",
            "masters_scenarios",
            "masters_scenarios_details",
            "access_log",
            "schema_version"); // flyway schema history

    /**
     * List of mirco services that are not target in setting tenant process
     */
    public static final List<String> IGNORE_MICROSERVICE_NAME = ImmutableList.of(
            SERVICE_NAME,
            "sb",
            "feedback",
            "tutorials");

    /**
     * Creation status of tenant in table Tenants
     */
    public enum TenantCreationStatus {
        NOT_CREATE(1), CREATING(2), CREATED(3);

        private int value;

        private TenantCreationStatus(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    /**
     * Response status of api.
     */
    public enum ResponseStatus {
        SUCCESS(0), ERROR(1);

        private int value;

        private ResponseStatus(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    /**
     * Payment status of payments management.
     */
    public enum PaymentStatus {
        BUSINESS_CARD(1);

        private int value;

        private PaymentStatus(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    /**
     * Type of packages.
     */
    public enum Type {
        USER(1), TENANT(2);

        private int value;

        private Type(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }
    /**
     * Contract status of tenant
     */
    public enum TenantContractStatus {
        START(1, "起動"), SUSPENDED(2, "停止"), DELETED(3, "削除");

        private Integer statusCode;
        private String label;

        private TenantContractStatus(Integer statusCode, String label) {
            this.statusCode = statusCode;
            this.label = label;
        }

        public String getLabel() {
            return label;
        }

        public Integer getStatusCode() {
            return statusCode;
        }
    }

    public enum ElasticsearchIndexEnum {
        EMPLOYEE_INDEX(EMPLOYEE_SERVICE_NAME, "employee"),
        SCHEDULE_INDEX(SCHEDULE_SERVICE_NAME, "calendar"),
        PRODUCT_INDEX(PRODUCT_SERVICE_NAME, "product"),
        CUSTOMER_INDEX(PRODUCT_SERVICE_NAME, "customer"),
        BUSINESSCARD_INDEX(BUSINESSCARDS_SERVICE_NAME, "businesscard"),
        ACTIVITY_INDEX(ACTIVITIES_SERVICE_NAME, "activity"),
        TIMELINE_INDEX(TIMELINES_SERVICE_NAME, "timeline"),
        SALE_INDEX(SALES_SERVICE_NAME, "sale");

        private final String microServiceName;

        private final String suffix;

        ElasticsearchIndexEnum(String microServiceName, String suffix) {
            this.microServiceName = microServiceName;
            this.suffix = suffix;
        }

        public String getMicroServiceName() {
            return microServiceName;
        }

        public String getSuffix() {
            return suffix;
        }
    }

    public static final String CANNOT_MODIFY_COGNITO_ACCOUNT = "ERR_TEN_0006";
}
