package jp.co.softbrain.esales.tenants.web.rest;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.MPackagesServicesService;
import jp.co.softbrain.esales.tenants.service.UpdatePackagesServicesService;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdatePackagesServicesRequestDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.GetServicesByPackageIdsRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.UpdatePackagesServicesRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.GetServicesByPackageIdsResponse;

/**
 * REST controller for API packages services.
 *
 * @author lehuuhoa
 */
@RestController
public class PackagesServicesResource {

    @Autowired
    private MPackagesServicesService mPackagesServicesService;

    @Autowired
    private UpdatePackagesServicesService updatePackagesServicesService;

    /**
     * Get all the information about packages services.
     *
     * @param packageServiceIds list id package services.
     * @return Response {@link ContractSiteResponseDTO}
     */
    @GetMapping(path = "/public/api/get-packages-services", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> getPackagesServices(
            @RequestParam("packageServiceIds") List<Long> packageServiceIds) {
        return ResponseEntity.ok(new ContractSiteResponseDTO(SUCCESS.getValue(),
                mPackagesServicesService.getPackagesServices(packageServiceIds), null /* errors */));
    }

    /**
     * Get a list of service names to the specified id package query
     *
     * @param request List package id.
     * @return response include GetServicesByPackageIdsResponse
     */

    @PostMapping(path = "/api/get-services-by-package-ids", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetServicesByPackageIdsResponse> getServicesByPackageIds(
            @RequestBody GetServicesByPackageIdsRequest request) {
        GetServicesByPackageIdsResponse response = new GetServicesByPackageIdsResponse();
        response.setData(mPackagesServicesService.getServicesByPackageIds(request.getPackageIds()));
        return ResponseEntity.ok(response);
    }

    /**
     * Update master package service information.
     *
     * @param request list package service update.
     * @return Response {@link ContractSiteResponseDTO}
     */
    @PutMapping(path = "/public/api/update-packages-services", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> updatePackagesServices(
            @RequestBody UpdatePackagesServicesRequest request) {
        List<UpdatePackagesServicesRequestDTO> packagesServices = request.getPackagesServices();
        return ResponseEntity.ok(updatePackagesServicesService.updatePackagesServices(packagesServices));
    }

}
