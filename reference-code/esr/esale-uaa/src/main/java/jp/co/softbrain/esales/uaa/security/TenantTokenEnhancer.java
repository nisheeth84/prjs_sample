package jp.co.softbrain.esales.uaa.security;

import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.TokenEnhancer;
import org.springframework.stereotype.Component;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.uaa.tenant.util.TenantContextHolder;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Adds the standard "tenant" claim to tokens so we know when they have been created.
 * This is needed for a session timeout due to inactivity (ignored in case of "remember-me").
 */
@Component
public class TenantTokenEnhancer implements TokenEnhancer {

    @Override
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        addClaims((DefaultOAuth2AccessToken) accessToken);
        return accessToken;
    }

    private void addClaims(DefaultOAuth2AccessToken accessToken) {
        DefaultOAuth2AccessToken token = accessToken;
        Map<String, Object> additionalInformation = token.getAdditionalInformation();
        if (additionalInformation.isEmpty()) {
            additionalInformation = new LinkedHashMap<>();
        }
        //add "tenant" claim with current time in secs
        //this is used for an inactive session timeout
        additionalInformation.put(Constants.HEADER_TENANT_ID, TenantContextHolder.getTenant());
        token.setAdditionalInformation(additionalInformation);
    }
}
