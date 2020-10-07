package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for getDatabaseStorage API.
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetDatabaseStorageResponseDTO implements Serializable {

    private static final long serialVersionUID = -8377798933687710686L;

    private Integer status;

    private GetDatabaseStorageDataDTO data;

    private List<ErrorDTO> errors;
}
