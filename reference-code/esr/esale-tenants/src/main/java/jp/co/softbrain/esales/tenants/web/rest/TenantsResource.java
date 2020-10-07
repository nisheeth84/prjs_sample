package jp.co.softbrain.esales.tenants.web.rest;

import java.util.ArrayList;
import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.TenantService;
import jp.co.softbrain.esales.tenants.service.dto.CompanyNameResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.StatusContractDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantDeleteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.DeleteTenantsRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.GetCompanyNameRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.GetStatusContractRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.GetTenantByConditionRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.UpdateTenantsRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.DeleteTenantsResponse;
import jp.co.softbrain.esales.tenants.service.dto.GetStatusTenantDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.GetTenantByConditionResponse;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.GetTenantServicesResponse;

/**
 * api for tenants resource
 *
 * @author phamhoainam
 */
@RestController
public class TenantsResource {
    private final Logger log = LoggerFactory.getLogger(TenantsResource.class);
    @Autowired
    private TenantService tenantService;

    /**
     * Get all tenant with list micro service of tenant
     *
     * @return {@link GetTenantServicesResponse}}
     */
    @PostMapping(path = "/api/get-tenant-services", consumes = MediaType.APPLICATION_JSON_VALUE
            , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetTenantServicesResponse> getTenantServices() {
        log.info("API get-tenant-services START");
        // 1. Get service of tenant has status is active
        GetTenantServicesResponse responseData = new GetTenantServicesResponse();
        responseData.setTenantServices(tenantService.getTenantServices());
        return ResponseEntity.ok(responseData);
    }

    /**
     * Get name and company name of tenant
     *
     * @param {@link GetTenantByConditionRequest}
     * @return {@link GetTenantByConditionResponse} name and company name of tenant
     */
    @PostMapping(path = "/public/api/get-tenant-by-condition", consumes = MediaType.APPLICATION_JSON_VALUE
            , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetTenantByConditionResponse> getTenantByCondition(
            @RequestBody GetTenantByConditionRequest request) {
        log.info("API get-tenant-by-condition START");
        // 1. Get tenant name and company name
        GetTenantByConditionResponse responseData = new GetTenantByConditionResponse();
        responseData.setTenants(tenantService.getTenantByCondition(request.getTenantName(), request.getCompanyName()));
        return ResponseEntity.ok(responseData);
    }

    /**
     * Update tenant
     *
     * @param request {@link UpdateTenantsRequest}
     * @return {@link ContractSiteResponseDTO} response of action update
     */
    @PutMapping(path = "/public/api/update-tenants", consumes = MediaType.APPLICATION_JSON_VALUE
            , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> updateTenants(@RequestBody UpdateTenantsRequest request) {
        log.info("API update-tenants START");
        ContractSiteResponseDTO responseDTO = tenantService.updateTenants(
                request.getContractTenantIds(), request.getStatus(),
                request.getTrialEndDate(), request.getIsDeleteSampleData());

        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Delete tenant by list ID
     *
     * @param request {@link DeleteTenantsRequest}
     * @return {@link DeleteTenantsResponse} response of action delete
     */
    @PostMapping(path = "/api/delete-tenants", consumes = MediaType.APPLICATION_JSON_VALUE
            , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DeleteTenantsResponse> deleteTenants(@RequestBody DeleteTenantsRequest request) {
        log.info("API delete-tenants START");
        // 1. get list tenant need delete
        List<TenantNameDTO> tenantServiceDtos = tenantService.getTenantName(request.getTenantIds());

        // 2. Delete data of tenant
        List<TenantDeleteResponseDTO> tenantDeleteResponseDTO = new ArrayList<>();
        List<Long> tenantIdDeletedList = new ArrayList<>();
        for (TenantNameDTO dto : tenantServiceDtos) {
            TenantDeleteResponseDTO resDto = tenantService.deleteDataTenantByTenantDto(dto);
            tenantDeleteResponseDTO.add(resDto);
            if (resDto.getError() == null) {
                tenantIdDeletedList.add(dto.getTenantId());
            }
        }

        // 3, 4. Delete data relation of Tenant and update deleted date of tenant
        if (!tenantIdDeletedList.isEmpty()) {
            tenantService.deleteDataOfSchemaTenants(tenantIdDeletedList);
        }

        DeleteTenantsResponse responseData = new DeleteTenantsResponse();
        responseData.setDeleteResponses(tenantDeleteResponseDTO);
        return ResponseEntity.ok(responseData);
    }

    /**
     * Get tenant status by contract_id
     *
     * @param contractTenantId The id of contract
     * @return {@link GetStatusTenantDTO}
     */
    @GetMapping(path = "/public/api/get-status-tenant", consumes = MediaType.APPLICATION_JSON_VALUE
            , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> getStatusTenant(@RequestParam("contractTenantId") String contractTenantId) {
        log.info("API get-status-tenant START");
        ContractSiteResponseDTO responseDTO = tenantService.getTenantStatus(contractTenantId);

        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Get data company name by tenant Name.
     *
     * @param request テナント名.
     * @return response include CompanyNameResponseDTO.
     */
    @PostMapping(path = "/api/get-company-name", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CompanyNameResponseDTO> getCompanyName(@RequestBody GetCompanyNameRequest request) {
        String tenantName = request.getTenantName();
        CompanyNameResponseDTO nameResponseDTO = tenantService.getCompanyName(tenantName);
        return ResponseEntity.ok(nameResponseDTO);
    }

    /**
     * Get data contract status by name tenant.
     *
     * @param request テナント名
     * @return response include StatusContractDataDTO
     */
    @PostMapping(path = "/api/get-status-contract", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StatusContractDataDTO> getStatusContract(@RequestBody GetStatusContractRequest request) {
        String tenantName = request.getTenantName();
        StatusContractDataDTO statusContractDataDTO = tenantService.getStatusContract(tenantName);
        return ResponseEntity.ok(statusContractDataDTO);
    }
}
