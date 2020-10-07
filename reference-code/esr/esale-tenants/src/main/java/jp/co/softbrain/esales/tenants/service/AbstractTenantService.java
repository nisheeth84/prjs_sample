package jp.co.softbrain.esales.tenants.service;

import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;

import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteErrorDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ErrorDTO;
import jp.co.softbrain.esales.tenants.tenant.util.JwtTokenUtil;
import jp.co.softbrain.esales.tenants.tenant.util.TenantUtil;

public abstract class AbstractTenantService {

    protected static final String EMPLOYEE_SURNAME = "employee_surname";
    protected static final String CUSTOM_EMPLOYEE_SURNAME = "custom:employee_surname";
    protected static final String EMPLOYEE_NAME = "employee_name";
    protected static final String CUSTOM_EMPLOYEE_NAME = "custom:employee_name";
    protected static final String UPDATED_AT = "updated_at";
    protected static final String EMPLOYEE_ID = "employee_id";
    protected static final String CUSTOM_EMPLOYEE_ID = "custom:employee_id";
    protected static final String LANGUAGE_CODE = "language_code";
    protected static final String CUSTOM_LANGUAGE_CODE = "custom:language_code";
    protected static final String TENANT_ID = "tenant_id";
    protected static final String CUSTOM_TENANT_ID = "custom:tenant_id";
    protected static final String IS_ADMIN = "is_admin";
    protected static final String CUSTOM_IS_ADMIN = "custom:is_admin";
    protected static final String IS_MODIFY_EMPLOYEE = "is_modify_employee";
    protected static final String CUSTOM_IS_MODIFY_EMPLOYEE = "custom:is_modify_employee";
    protected static final String IS_ACCESS_CONTRACT = "is_access_contract";
    protected static final String CUSTOM_IS_ACCESS_CONTRACT = "custom:is_access_contract";
    protected static final String TIMEZONE_NAME = "timezone_name";
    protected static final String CUSTOM_TIMEZONE_NAME = "custom:timezone_name";
    protected static final String FORMAT_DATE = "format_date";
    protected static final String CUSTOM_FORMAT_DATE = "custom:format_date";
    protected static final String RESET_CODE = "reset_code";
    protected static final String CUSTOM_RESET_CODE = "custom:reset_code";
    protected static final String COMPANY_NAME = "company_name";
    protected static final String CUSTOM_COMPANY_NAME = "custom:company_name";

    protected static final String EMAIL = "email";
    protected static final String OPENID = "openid";
    protected static final String ESMS_GROUP = "ESMS";
    protected static final String COGNITO_SETTING_PARAM = "Cognito setting";

    // Regex for acceptable password
    private static final String PASSWORD_REGEX = "((?=.*[0-9a-zA-Z])(?=.*[@#$%!^&+=])(?=\\S+$).{8,32}|(?=.*[0-9@#$%!^&+=])(?=.*[a-zA-Z])(?=\\S+$).{8,32})";
    private static final String PASSWORD_PARAM = "password";

    private static final String ERR_LOG_0001 = "ERR_LOG_0001";
    private static final String ERR_LOG_0004 = "ERR_LOG_0004";
    private static final String ERR_LOG_0012 = "ERR_LOG_0012";
    private static final String ERR_COM_0038 = "ERR_COM_0038";

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;


    /**
     * Get message from properties.
     *
     * @param keyMessage key message
     * @param args       arguments
     * @return message.
     */
    protected String getMessage(String keyMessage, Object... args) {
        return messageSource.getMessage(keyMessage, args, TenantUtil.LOCALE);
    }

    /**
     * Get userId from token.
     *
     * @return employeeId if it not null, else return -1.
     */
    protected long getUserIdFromToken() {
        return Optional.ofNullable(jwtTokenUtil.getEmployeeIdFromToken()).orElse(ConstantsTenants.BATCH_USER_ID);
    }

    /**
     * Create {@link ErrorDTO} for response api.
     *
     * @param errorCode errorCode
     * @param args      arguments
     * @return {@link ErrorDTO}.
     */
    protected ErrorDTO createErrorDTO(String errorCode, Object... args) {
        return new ErrorDTO(errorCode, getMessage(errorCode, args));
    }

    /**
     * Validate format password
     *
     * @param password password
     * @param username username
     * @return error
     */
    protected ContractSiteErrorDataDTO validatePasswordFormat(String password, String username) {
        if (StringUtils.isBlank(password)) {
            return new ContractSiteErrorDataDTO(ERR_LOG_0001, getMessage(ERR_LOG_0001, PASSWORD_PARAM));
        }
        if (password.length() < 8 || 32 < password.length()) {
            return new ContractSiteErrorDataDTO(ERR_COM_0038, getMessage(ERR_COM_0038, 8, 32));
        }
        if (!password.matches(PASSWORD_REGEX)) {
            return new ContractSiteErrorDataDTO(ERR_LOG_0012, getMessage(ERR_LOG_0012));
        }
        if (password.equals(username)) {
            return new ContractSiteErrorDataDTO(ERR_LOG_0004, getMessage(ERR_LOG_0004));
        }
        return null;
    }
}
