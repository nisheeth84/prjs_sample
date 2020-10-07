package jp.co.softbrain.esales.uaa.tenant.util;

import java.io.Serializable;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Component;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.uaa.security.SecurityUtils;

@Component
public class JwtTokenUtil implements Serializable {
    private static final long serialVersionUID = 7357869212851924682L;

    @Autowired
    private TokenStore tokenStore;

    /**
     * get tenantId from token
     *
     * @return
     */
    public String getTenantIdFromToken() {
        return (String) getTokenInfo(Constants.HEADER_TENANT_ID);
    }

    /**
     * Get employeeId from token
     * @return
     */
    public Long getEmployeeIdFromToken() {
        Object objEmployeeId = getTokenInfo(Constants.EMPLOYEE_ID);
        Long employeeId = null;
        if (objEmployeeId != null) {
            employeeId = Long.parseLong(objEmployeeId.toString());
        }
        return employeeId;
    }

    /**
     * get language code from token (ja_jp, en_us, ...)
     *
     * @return
     */
    public String getLanguageCodeFromToken() {
        return (String) getTokenInfo(Constants.LANGUAGE_CODE);
    }

    /**
     * Get Language Key from token (ja, en, ...)
     * @return
     */
    public String getLanguageKeyFromToken() {
        String languageCode = getLanguageCodeFromToken();
        return languageCode.substring(0, 2);
    }
    
    

    /**
     * get email from token
     *
     * @return
     */
    public String getEmailFromToken() {
        return (String) getTokenInfo(Constants.EMAIL);
    }

    /**
     * get employee name from token
     *
     * @return
     */
    public String getEmployeeNameFromToken() {
        return (String) getTokenInfo(Constants.EMPLOYEE_NAME);
    }

    /**
     * get token info
     * @param key
     * @return
     */
    public Object getTokenInfo(String key) {
        Optional<String> tokenValue = SecurityUtils.getTokenValue();
        if (!tokenValue.isPresent()) {
            return null;
        }
        final OAuth2AccessToken accessToken = tokenStore.readAccessToken(tokenValue.get());
        Map<String, Object> additionalInformation = accessToken.getAdditionalInformation();
        return additionalInformation.get(key);
    }
}
