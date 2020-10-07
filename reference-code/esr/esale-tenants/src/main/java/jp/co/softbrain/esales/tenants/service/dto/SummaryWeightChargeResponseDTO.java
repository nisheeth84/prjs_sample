package jp.co.softbrain.esales.tenants.service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * DTO for response summaryWeightCharge API.
 *
 * @author nguyenvietloi
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryWeightChargeResponseDTO implements Serializable {

    private static final long serialVersionUID = -8388898933687710776L;

    private Long tenantId;

    private ErrorItemDTO error;
}
