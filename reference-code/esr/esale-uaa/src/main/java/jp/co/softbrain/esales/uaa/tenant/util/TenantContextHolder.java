package jp.co.softbrain.esales.uaa.tenant.util;

/**
 * Tenant Context hoder
 */
public class TenantContextHolder {

    private TenantContextHolder() {
        // do nothing
    }

    private static final ThreadLocal<String> CONTEXT = new ThreadLocal<>();

    public static void setTenantId(String tenant) {
        CONTEXT.set(tenant);
    }

    public static String getTenant() {
        return CONTEXT.get();
    }

    public static void clear() {
        CONTEXT.remove();
    }
}
