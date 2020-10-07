package jp.co.softbrain.esales.employees.config.oauth2;

import java.nio.CharBuffer;
import java.security.interfaces.RSAPublicKey;
import java.util.Date;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.common.exceptions.InvalidTokenException;
import org.springframework.security.oauth2.common.util.JsonParser;
import org.springframework.security.oauth2.common.util.JsonParserFactory;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;

import com.amazonaws.xray.AWSXRay;
import com.auth0.jwk.GuavaCachedJwkProvider;
import com.auth0.jwk.InvalidPublicKeyException;
import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkException;
import com.auth0.jwk.UrlJwkProvider;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.employees.service.AuthenticationService;
import jp.co.softbrain.esales.employees.service.EmployeesPackagesService;
import jp.co.softbrain.esales.employees.service.dto.CognitoSettingInfoDTO;
import jp.co.softbrain.esales.employees.tenant.util.TenantContextHolder;
import jp.co.softbrain.esales.employees.web.rest.vm.response.GetServicesByPackageIdsResponse;

/**
 * Improved {@link JwtAccessTokenConverter} that can handle lazy fetching of
 * public verifier keys.
 */
public class OAuth2JwtAccessTokenConverter extends JwtAccessTokenConverter {
    private final Logger log = LoggerFactory.getLogger(OAuth2JwtAccessTokenConverter.class);

    private JsonParser objectMapper = JsonParserFactory.create();

    @Value("${XRAY_ENABLED:false}")
    private String xRayEnabled = "false";

    @Value("${spring.application.name}")
    private String appName = "Employees";
    
    @Autowired
    private HttpServletRequest request;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private EmployeesPackagesService employeesPackagesService;

    private final CognitoProperties cognitoProperties;

    private final UserOnlineState userOnlineState;

    /**
     * When did we last fetch the public key?
     */
    private long lastKeyFetchTimestamp;

    /**
     * for public keys to verify JWT tokens (in ms)
     */
    private static final long TIME_TO_LOAD = 3600000;

    public OAuth2JwtAccessTokenConverter(CognitoProperties cognitoProperties, UserOnlineState userOnlineState) {
        this.cognitoProperties = cognitoProperties;
        this.userOnlineState = userOnlineState;
    }

    /**
     * Try to decode the token with the current public key.
     * If it fails, contact the OAuth2 server to get a new public key, then try
     * again.
     * We might not have fetched it in the first place or it might have changed.
     *
     * @param token the JWT token to decode.
     * @return the resulting claims.
     * @throws InvalidTokenException if we cannot decode the token.
     */
    @Override
    protected Map<String, Object> decode(String token) {
        String claimsStr = decodeJWT(token);
        Map<String, Object> claimsMap = objectMapper.parseMap(claimsStr);

        boolean useXRay = "true".equalsIgnoreCase(xRayEnabled);
        if (useXRay) {
            if (AWSXRay.getCurrentSegmentOptional().isEmpty()) {
                AWSXRay.beginSegment(appName);
            }
            if (AWSXRay.getCurrentSubsegmentOptional().isEmpty()) {
                AWSXRay.beginSubsegment("decode");
            }
        }

        Object tenantId = claimsMap.get(Constants.Authenticate.TENANT_ID);
        if (tenantId == null || claimsMap.get("email") == null || claimsMap.get("aud") == null
                || (claimsMap.get(Constants.Authenticate.EMPLOYEE_ID) == null && "true".equalsIgnoreCase((String) claimsMap.get("is_modify_employee")))
                || claimsMap.get("custom:is_admin") == null || !isTokenValid(token, String.valueOf(tenantId))) {
            throw new InvalidTokenException("token invalid");
        }

        if (claimsMap.get("exp") == null || isExpire(Long.valueOf(claimsMap.get("exp").toString()))) {
            throw new InvalidTokenException("access token has expired");
        }
        claimsMap.put("exp", Long.valueOf(claimsMap.get("exp").toString()));
        claimsMap.put("user_name", claimsMap.get("email").toString());

        claimsMap.put("client_id", claimsMap.get("aud").toString());
        claimsMap.remove("aud");

        // set role
        Set<String> authorities = new HashSet<>();
        if (Boolean.TRUE.equals(Boolean.valueOf(claimsMap.get("custom:is_admin").toString()))) {
            authorities.add(Constants.Roles.ROLE_ADMIN);
            authorities.add(Constants.Roles.ROLE_USER);
        }
        else {
            authorities.add(Constants.Roles.ROLE_USER);
        }
        claimsMap.put("authorities", authorities);

        Long employeeId = null;
        if (claimsMap.get(Constants.Authenticate.EMPLOYEE_ID) != null) {
            employeeId = Long.parseLong(claimsMap.get(Constants.Authenticate.EMPLOYEE_ID).toString());
        }

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
        claimsMap.put("licenses", getLicense(token, String.valueOf(tenantId), employeeId));

        if (useXRay) {
            AWSXRay.endSubsegment();
        }
        
        return claimsMap;
    }
    
    /**
     * get license
     * 
     * @param token
     * @param tenantId
     * @param employeeId
     * @return
     */
    private Set<Integer> getLicense(String token, String tenantId, Long employeeId) {
        Set<Integer> licenses = new HashSet<>();
        if (employeeId == null) {
            return licenses;
        }
        OAuth2Cookies cookies = userOnlineState.getCachedCookies(token);
        if (cookies == null || cookies.getLicenses().isEmpty()) {
            try {
                // get from API getServices
                GetServicesByPackageIdsResponse services = employeesPackagesService.getServices(employeeId,
                        token, String.valueOf(tenantId));
                if (services != null && services.getData() != null) {
                    services.getData().forEach(
                            service -> licenses.add(Integer.valueOf(service.getServiceId().toString())));
                    userOnlineState.setCachedAuthStateCookies(token, licenses, employeeId);
                }
            } catch (IllegalStateException e) {
                log.warn(e.getLocalizedMessage());
            }
        }
        else {

            // update user state
            userOnlineState.setCachedAuthStateCookies(token, cookies.getLicenses(), employeeId);
            licenses.addAll(cookies.getLicenses());
        }
        return licenses;
    }

    public String decodeJWT(String jwtToken) {
        int firstPeriod = jwtToken.indexOf('.');
        int lastPeriod = jwtToken.lastIndexOf('.');
        CharBuffer buffer = CharBuffer.wrap(jwtToken, 0, firstPeriod);
        buffer.limit(lastPeriod).position(firstPeriod + 1);
        Base64 base64Url = new Base64(true);
        return new String(base64Url.decode(buffer.toString()));
    }

    private boolean isTokenValid(String token, String tenantId) {
        long t = System.currentTimeMillis();
        if (t - lastKeyFetchTimestamp < TIME_TO_LOAD) {
            return true;
        }
        lastKeyFetchTimestamp = t;
        TenantContextHolder.setTenantId(tenantId);
        
        CognitoSettingInfoDTO cognitoSettings = authenticationService.getCognitoSetting();

        // Decode the key and set the kid
        DecodedJWT decodedJwtToken = JWT.decode(token);

        String kid = decodedJwtToken.getKeyId();
        String region = cognitoProperties.getSignatureVerification().getRegion(); 
        String urlTemplate = "https://cognito-idp.%s.amazonaws.com/%s";

        String jwtTokenIssuer = String.format(urlTemplate, region, cognitoSettings.getUserPoolId());
        UrlJwkProvider http = new UrlJwkProvider(jwtTokenIssuer);

        // Let's cache the result from Cognito for the default of 10 hours
        GuavaCachedJwkProvider provider = new GuavaCachedJwkProvider(http);
        Jwk jwk;
        try {
            jwk = provider.get(kid);
        } catch (JwkException e2) {
            log.error("could not get public key from Cognito server to create SignatureVerifier", e2);
            return false;
        }

        Algorithm algorithm;
        try {
            algorithm = Algorithm.RSA256((RSAPublicKey) jwk.getPublicKey(), null);
        } catch (IllegalArgumentException | InvalidPublicKeyException e1) {
            log.warn("could not contact Cognito server to get public key");
            return false;
        }

        // Reusable verifier instance
        JWTVerifier verifier = JWT.require(algorithm).withIssuer(jwtTokenIssuer).build();
        DecodedJWT jwt = null;
        try {
            jwt = verifier.verify(token);
        } catch (Exception e) {
            return false;
        }
        return (jwt != null);
    }

    private boolean isExpire(long exp) {
        Date expiration = new Date(exp * 1000L);
        return expiration.before(new Date());
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
     * </pre>
     * 
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
