package jp.co.softbrain.esales.tenants.config.oauth2;

import java.nio.CharBuffer;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.security.oauth2.common.util.JsonParser;
import org.springframework.security.oauth2.common.util.JsonParserFactory;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.tenant.util.TenantContextHolder;

/**
 * Improved {@link JwtAccessTokenConverter} that can handle lazy fetching of public verifier keys.
 */
public class OAuth2JwtAccessTokenConverter extends JwtAccessTokenConverter {
    private final Logger log = LoggerFactory.getLogger(OAuth2JwtAccessTokenConverter.class);

    private JsonParser objectMapper = JsonParserFactory.create();

    @Autowired
    private HttpServletRequest request;

    public OAuth2JwtAccessTokenConverter() {
        // do nothing
    }

    /**
     * Try to decode the token with the current public key.
     * If it fails, contact the OAuth2 server to get a new public key, then try again.
     * We might not have fetched it in the first place or it might have changed.
     *
     * @param token the JWT token to decode.
     * @return the resulting claims.
     * @throws InvalidTokenException if we cannot decode the token.
     */
    @Override
    protected Map<String, Object> decode(String token) {
        try {
            String claimsStr = decodeJWT(token);
            Map<String, Object> claimsMap = objectMapper.parseMap(claimsStr);
            if (claimsMap.get("exp") != null) {
                claimsMap.put("exp", Long.valueOf(claimsMap.get("exp").toString()));
            }
            if (claimsMap.get("email") != null) {
                claimsMap.put("user_name", claimsMap.get("email").toString());
            }
            if (claimsMap.get("aud") != null) {
                claimsMap.put("client_id", claimsMap.get("aud").toString());
                claimsMap.remove("aud");
            }
            if (claimsMap.get("custom:is_admin") != null) {
                Set<String> authorities = new HashSet<>();
                if (Boolean.valueOf(claimsMap.get("custom:is_admin").toString())) {
                    authorities.add(Constants.Roles.ROLE_ADMIN);
                    authorities.add(Constants.Roles.ROLE_USER);
                }
                else {
                    authorities.add(Constants.Roles.ROLE_USER);
                }
                claimsMap.put("authorities", authorities);
            }

            Object tenantId = claimsMap.get(Constants.Authenticate.TENANT_ID);
            String tenantIdInHeader = request.getHeader(Constants.HEADER_TENANT_ID);
            if (Constants.TENANTS_BATCH.equals(tenantId)
                    && StringUtils.isNotBlank(tenantIdInHeader) && tenantIdInHeader.matches(Constants.TENANT_FORMAT)) {
                log.info("Replace tenant_id in token by tenant_id in header because cognito account is batch"
                        + "\n tenant_id befor replace: {}"
                        + "\n tenant_id after replace: {}", tenantId, tenantIdInHeader);
                tenantId = tenantIdInHeader.trim();
                claimsMap.replace(Constants.Authenticate.TENANT_ID, tenantId);
            }

            TenantContextHolder.setTenantId(String.valueOf(tenantId));

            // TODO DUMY : get from API getServices
            Set<Integer> licenses = new HashSet<>();
            licenses.add(8);
            licenses.add(5);
            licenses.add(4);
            licenses.add(6);
            licenses.add(14);
            licenses.add(15);
            licenses.add(16);
            licenses.add(1401);
            licenses.add(3);
            licenses.add(301);
            licenses.add(1501);
            licenses.add(2);
            licenses.add(2101);
            licenses.add(1401);
            claimsMap.put("licenses", licenses);
            return claimsMap;
        } catch (InvalidTokenException ex) {
            log.error("licenses errors");
            throw ex;
        }
    }
    
    public String decodeJWT(String jwtToken){
        int firstPeriod = jwtToken.indexOf('.');
        int lastPeriod = jwtToken.lastIndexOf('.');
        CharBuffer buffer = CharBuffer.wrap(jwtToken, 0, firstPeriod);
        buffer.limit(lastPeriod).position(firstPeriod + 1);
        Base64 base64Url = new Base64(true);
        return new String(base64Url.decode(buffer.toString()));
    }
    
    /**
     * Extract JWT claims and set it to OAuth2Authentication decoded details.
     * Here is how to get details:
     *
     * <pre>
     * <code>
     *  SecurityContext securityContext = SecurityContextHolder.getContext();
     *  Authentication authentication = securityContext.getAuthentication();
     *  if (authentication != null) {
     *      Object details = authentication.getDetails();
     *      if (details instanceof OAuth2AuthenticationDetails) {
     *          Object decodedDetails = ((OAuth2AuthenticationDetails) details).getDecodedDetails();
     *          if (decodedDetails != null &amp;&amp; decodedDetails instanceof Map) {
     *             String detailFoo = ((Map) decodedDetails).get("foo");
     *          }
     *      }
     *  }
     * </code>
     *  </pre>
     * @param claims OAuth2JWTToken claims.
     * @return {@link OAuth2Authentication}.
     */
    @Override
    public OAuth2Authentication extractAuthentication(Map<String, ?> claims) {
        OAuth2Authentication authentication = super.extractAuthentication(claims);
        authentication.setDetails(claims);
        return authentication;
    }
}
