package jp.co.softbrain.esales.commons.tenant.util;

/**
 * Class contains default field for each fieldBelong
 * 
 * @author nguyenvanchien3
 */
public final class FieldBelongDefaultUtil {

    public enum EMPLOYEE {
        EMPLOYEE_ID;
    }

    public enum CUSTOMER {}

    public enum BUSINESS_CARD {
        BUSINESS_CARD_ID, FIRST_NAME, LAST_NAME, EMAIL_ADDRESS;
    }

    public enum ACTIVITY {

    }

    public enum PRODUCT {
        PRODUCT_ID, PRODUCT_NAME;
    }
}
