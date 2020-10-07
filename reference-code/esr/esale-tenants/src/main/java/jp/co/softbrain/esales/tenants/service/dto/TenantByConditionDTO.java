package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * A DTO for tenant by condition.
 * @author phamhoainam
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
public class TenantByConditionDTO implements Serializable {
    private static final long serialVersionUID = -7446145919960305633L;

    /**
     * Name of tenant in table tenants
     */
    private  String tenantName;

    /**
     * Company name of tenant in table tenants
     */
    private  String companyName;

    /**
     * Last update of tenant in table tenants
     */
    private Instant updatedDate;
}
