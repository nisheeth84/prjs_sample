package jp.co.softbrain.esales.commons.config.oauth2;

import java.util.Optional;
import java.util.Set;

import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.stereotype.Component;

import jp.co.softbrain.esales.commons.security.SecurityUtils;

/**
 * Holds the access token and refresh token.
 */
@Component
public class UserOnlineState {

    // remove after 30 minutes
    private static final long STORE_TOKEN_VALIDITY_MILLIS = 1800000l;

    private final ESalesPersistentTokenCache<OAuth2Cookies> authState;
    
    public UserOnlineState() {
        authState = new ESalesPersistentTokenCache<>(STORE_TOKEN_VALIDITY_MILLIS);
    }

    /**
     * Get the result from the cache in a thread-safe manner.
     *
     * @param accessToken the access token for which we want the results.
     * @return a RefreshGrantResult for that token. This will either be empty,
     *         if we are the first one to do the
     *         request, or contain some results already, if another thread
     *         already handled the grant for us.
     */
    public OAuth2Cookies getCachedCookies(String accessToken) {
        return authState.get(accessToken);
    }

    /**
     * Get the result from the cache in a thread-safe manner.
     *
     * @param accessToken the accessToken token for which we want the results.
     * @param licenses
     * @param employeeId
     * @return a RefreshGrantResult for that token. This will either be empty,
     *         if we are the first one to do the
     *         request, or contain some results already, if another thread
     *         already handled the grant for us.
     */
    public void setCachedAuthStateCookies(String accessToken, Set<Integer> licenses, long employeeId) {
        synchronized (authState) {
            OAuth2Cookies ctx = authState.get(accessToken);
            if (ctx == null) {
                ctx = new OAuth2Cookies();
            }
            ctx.setEmployeeId(employeeId);
            ctx.setLastAccess(System.currentTimeMillis());
            ctx.setCookies(accessToken, licenses);
            authState.put(accessToken, ctx);
        }
    }
    
    /**
     * remove user state
     * 
     * @param refreshToken
     */
    public void removeCachedAuthState(TokenStore tokenStore) {
        Optional<String> tokenValue = SecurityUtils.getTokenValue();
        if (!tokenValue.isPresent()) {
            return;
        }
        final OAuth2AccessToken accessToken = tokenStore.readAccessToken(tokenValue.get());
        authState.remove(accessToken.getValue());
    }
}
