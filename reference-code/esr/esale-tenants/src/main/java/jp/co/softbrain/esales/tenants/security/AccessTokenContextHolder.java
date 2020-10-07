package jp.co.softbrain.esales.tenants.security;

/**
 * Access Token Context holder
 */
public class AccessTokenContextHolder {

    private static final ThreadLocal<String> CONTEXT = new ThreadLocal<>();

    private AccessTokenContextHolder() {
        // do nothing
    }
    
    public static void setAccessToken(String token) {
        CONTEXT.set(token);
    }

    public static String getAccessToken() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
