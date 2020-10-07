package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for query getTenantActiveByIds.
 *
 * @author nguyenvietloi
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TenantActiveDTO implements Serializable {

    private static final long serialVersionUID = -8377798910644713336L;

    private Long tenantId;

    private String tenantName;
}
