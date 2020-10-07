package jp.co.softbrain.esales.tenants.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.service.dto.GetWeightChargeResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.SummaryWeightChargeResponseDTO;

import java.util.List;

/**
 * Service interface for process weight charge.
 *
 * @author nguyenvietloi
 */
@XRayEnabled
public interface WeightChargeService {

    /**
     * Get data calculate weight number of used.
     *
     * @param contractTenantId id of contract
     * @param paymentType type of payment
     * @param yearMonth year-month payment
     * @return {@link GetWeightChargeResponseDTO}.
     */
    GetWeightChargeResponseDTO getWeightCharge(String contractTenantId, String paymentType, String yearMonth);

    /**
     * Statistics of the monthly use weight calculation of the tenants.
     *
     * @param tenantIds ids of tenants. If not specified then statistics all tenant active.
     * @return List of {@link SummaryWeightChargeResponseDTO}.
     */
    List<SummaryWeightChargeResponseDTO> summaryWeightCharge(List<Long> tenantIds);
}
