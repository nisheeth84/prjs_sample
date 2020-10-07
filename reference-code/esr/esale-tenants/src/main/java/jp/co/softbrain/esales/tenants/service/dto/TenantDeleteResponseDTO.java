package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A DTO for ressponse of API delete tenant service.
 * @author phamhoainam
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TenantDeleteResponseDTO implements Serializable {
    private static final long serialVersionUID = -2892133659210659264L;

    /**
     * ID off tenant in table tenants
     */
    private Long tenantId;

    /**
     * DTO for ressponse message
     */
    private  MessageResponseDTO error;
}
