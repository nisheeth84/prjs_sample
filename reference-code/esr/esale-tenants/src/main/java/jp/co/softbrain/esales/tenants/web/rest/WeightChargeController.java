package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.WeightChargeService;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.SummaryWeightChargeRequest;
import jp.co.softbrain.esales.tenants.service.dto.GetWeightChargeResponseDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.SummaryWeightChargeResponse;

/**
 * REST-ful Controller to handle digital business card.
 *
 * @author nguyenvietloi
 */
@RestController
public class WeightChargeController {

    @Autowired
    private WeightChargeService weightChargeService;

    /**
     * Get weight charge
     *
     * @param contractTenantId The id of contract
     * @param paymentType Type of payment
     * @param yearMonth year month
     * @return {@link GetWeightChargeResponseDTO}
     */
    @GetMapping(path = "/public/api/get-weight-charge",
        consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetWeightChargeResponseDTO> getWeightCharge(
            @RequestParam("contractTenantId") String contractTenantId,
            @RequestParam("paymentType") String paymentType,
            @RequestParam("yearMonth") String yearMonth) {

        return ResponseEntity.ok(weightChargeService.getWeightCharge(contractTenantId, paymentType, yearMonth));
    }

    /**
     * Summary weight charge
     *
     * @param request request
     * @return {@link SummaryWeightChargeResponse}
     */
    @PostMapping(path = "/api/summary-weight-charge",
        consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SummaryWeightChargeResponse> summaryWeightCharge(
        @RequestBody SummaryWeightChargeRequest request) {
        SummaryWeightChargeResponse response = new SummaryWeightChargeResponse();
        response.setSummaryWeightChargeResponses(weightChargeService.summaryWeightCharge(request.getTenantIds()));
        return ResponseEntity.ok(response);
    }
}
