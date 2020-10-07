package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A DTO for tenant service.
 *
 * @author phamhoainam
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenantNameDTO implements Serializable {
    private static final long serialVersionUID = 5112428890828613929L;

    /**
     * ID of tenant in table tenants
     */
    private Long tenantId;

    /**
     * Name of tenant in table tenants
     */
    private String tenantName;

    /**
     * ID of user pool in table cognitor_setting
     */
    private String userPoolId;

    /**
     * Constructor
     * 
     * @param tenantId id of tenant in table tenants
     * @param tenantName name of tenant in table tenants
     */
    public TenantNameDTO(Long tenantId, String tenantName) {
        this.tenantId = tenantId;
        this.tenantName = tenantName;
    }

}
