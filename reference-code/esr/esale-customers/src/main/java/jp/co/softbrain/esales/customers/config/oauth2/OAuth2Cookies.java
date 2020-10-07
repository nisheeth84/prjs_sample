package jp.co.softbrain.esales.customers.config.oauth2;

import java.util.Set;

/**
 * Holds the access token and refresh token.
 */
public class OAuth2Cookies {
    private String accessToken;
    private Set<Integer> licenses;
    private Long employeeId;
    private long lastAccess;

    public String getAccessToken() {
        return accessToken;
    }

    public Set<Integer> getLicenses() {
        return licenses;
    }

    public void setCookies(String accessToken, Set<Integer> licenses) {
        this.accessToken = accessToken;
        this.licenses = licenses;
    }

    /**
     * @return the employeeId
     */
    public Long getEmployeeId() {
        return employeeId;
    }

    /**
     * @param employeeId the employeeId to set
     */
    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    /**
     * @return the lastAccess
     */
    public long getLastAccess() {
        return lastAccess;
    }

    /**
     * @param lastAccess the lastAccess to set
     */
    public void setLastAccess(long lastAccess) {
        this.lastAccess = lastAccess;
    }
}
