/**
 * 
 */
package jp.co.softbrain.esales.tenants.elasticsearch.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Tenant Dto
 * 
 * @author phamhoainam
 *
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
public class TenantDTO implements Serializable {
    private static final long serialVersionUID = 2045265405014769009L;

    /**
     * Id of table tenants 
     */
    private Long tenantId;

    /**
     * Name of tenant in table tenants
     */
    private String tenantName;

    /**
     * Micro service name of table m_services
     */
    private List<String> serviceNames;
}
