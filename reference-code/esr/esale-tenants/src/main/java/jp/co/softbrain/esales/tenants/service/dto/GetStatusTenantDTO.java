package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO response from API get-status-tenant
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
public class GetStatusTenantDTO implements Serializable {

    private static final long serialVersionUID = -8293174320735513690L;

    /**
     * Status of tenant
     */
    private Integer creationStatus;
}
