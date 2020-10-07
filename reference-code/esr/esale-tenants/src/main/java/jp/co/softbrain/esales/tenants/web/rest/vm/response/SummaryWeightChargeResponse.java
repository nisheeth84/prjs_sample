package jp.co.softbrain.esales.tenants.web.rest.vm.response;

import jp.co.softbrain.esales.tenants.service.dto.SummaryWeightChargeResponseDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * Response for SummaryWeightCharge api
 *
 * @author nguyenvietloi
 */
@Data
public class SummaryWeightChargeResponse implements Serializable {

    private static final long serialVersionUID = 1333768758091720465L;

    private List<SummaryWeightChargeResponseDTO> summaryWeightChargeResponses;
}
