package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Response bean of API getTenantServices
 * @author phamhoainam
 *
 */
@Data
@EqualsAndHashCode
@AllArgsConstructor
public class TenantServicesResDTO implements Serializable {
    private static final long serialVersionUID = -4511537693610821551L;

    /**
     * ID off tenant in table tenants
     */
    private Long tenantId;

    /**
     * Name of tenant in table tenants
     */
    private  String tenantName;

    /**
     * List micro service name of tenant in table m_services
     */
    private List<String> serviceNames;

}