package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response entity of contract APIs
 *
 * @author tongminhcuong
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContractSiteResponseDTO implements Serializable {

    private static final long serialVersionUID = 8708159046879042277L;

    private int status;

    private Object data;

    private List<ContractSiteErrorDataDTO> errors;
}
