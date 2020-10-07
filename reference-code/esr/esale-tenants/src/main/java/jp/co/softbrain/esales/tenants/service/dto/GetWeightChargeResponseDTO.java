package jp.co.softbrain.esales.tenants.service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response for getWeightCharge api.
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GetWeightChargeResponseDTO implements Serializable {

    private static final long serialVersionUID = -8377798933687710776L;

    private Integer status;

    private GetWeightChargeDataDTO data;

    private List<ErrorDTO> errors;
}
