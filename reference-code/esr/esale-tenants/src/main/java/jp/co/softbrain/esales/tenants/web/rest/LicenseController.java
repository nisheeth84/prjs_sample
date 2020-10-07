package jp.co.softbrain.esales.tenants.web.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.LicenseService;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.UpdateLicenseRequest;

/**
 * Spring MVC RESTful Controller to handle Licenses.
 *
 * @author tongminhcuong
 */
@RestController
@RequestMapping("/public/api")
public class LicenseController {

    @Autowired
    private LicenseService licenseService;

    /**
     * Get information of available license by tenant
     *
     * @param tenantName The name of tenant Target
     * @return {@link ContractSiteResponseDTO}
     */
    @GetMapping(path = "/get-available-license", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> getAvailableLicense(@RequestParam("tenantName") String tenantName) {

        return ResponseEntity.ok(licenseService.getAvailableLicense(tenantName));
    }

    /**
     * Get information of used license by contract
     *
     * @param contractTenantId The id of Contract
     * @return {@link ContractSiteResponseDTO}
     */
    @GetMapping(path = "/get-used-license", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> getUsedLicense(@RequestParam("contractTenantId") String contractTenantId) {

        return ResponseEntity.ok(licenseService.getUsedLicense(contractTenantId));
    }

    /**
     * Update license
     *
     * @param request request
     * @return {@link ContractSiteResponseDTO}
     */
    @PutMapping(path = "/update-licenses", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> updateLicenses(@RequestBody UpdateLicenseRequest request) {

        return ResponseEntity.ok(licenseService.updateLicenses(request.getContractTenantId(), request.getPackages()));
    }
}
