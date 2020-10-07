package jp.co.softbrain.esales.uaa.security;

/**
 * Access Token Context holder
 */
public class AccessTokenContextHolder {

    private AccessTokenContextHolder() {
    
    }
    
    private static final ThreadLocal<String> CONTEXT = new ThreadLocal<>();

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
