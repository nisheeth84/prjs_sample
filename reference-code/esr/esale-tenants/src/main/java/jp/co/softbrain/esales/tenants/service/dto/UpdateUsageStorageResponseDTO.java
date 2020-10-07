package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for response updateUsageStorage API.
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUsageStorageResponseDTO implements Serializable {

    private static final long serialVersionUID = -8344498933687710686L;

    private Long tenantId;

    private ErrorItemDTO error;
}
