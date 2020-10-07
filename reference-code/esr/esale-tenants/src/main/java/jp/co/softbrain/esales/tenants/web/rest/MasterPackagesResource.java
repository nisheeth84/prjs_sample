package jp.co.softbrain.esales.tenants.web.rest;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.ERROR;
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

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.service.MPackagesService;
import jp.co.softbrain.esales.tenants.service.UpdateMasterPackagesService;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteErrorDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetMasterPackagesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateMasterPackagesRequestDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.GetPackagesNameRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.UpdateMasterPackagesRequest;
import jp.co.softbrain.esales.tenants.web.rest.vm.response.GetPackagesNameResponse;

/**
 * REST controller for API master packages
 *
 * @author lehuuhoa
 */
@RestController
public class MasterPackagesResource {

    @Autowired
    private MPackagesService mPackagesService;

    @Autowired
    private UpdateMasterPackagesService updateMasterPackagesService;

    /**
     * Get all the information about packages.
     *
     * @param packageIds list id packages.
     * @return Response GetMasterPackagesResponse.
     */
    @GetMapping(path = "/public/api/get-master-packages", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> getMasterPackages(
            @RequestParam("packageIds") List<Long> packageIds) {
        try {
            List<GetMasterPackagesDataDTO> packages = mPackagesService.getMasterPackages(packageIds);
            return ResponseEntity.ok(new ContractSiteResponseDTO(SUCCESS.getValue(), packages, null /* errors */));
        } catch (Exception e) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.INTERRUPT_API, e.getMessage());
            return ResponseEntity.ok(new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error)));
        }
    }

    /**
     * Get data package names.
     *
     * @param request List package id.
     * @return response include GetPackagesNameResponse
     */
    @PostMapping(path = "/api/get-package-names", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetPackagesNameResponse> getPackageNames(@RequestBody GetPackagesNameRequest request) {
        GetPackagesNameResponse response = new GetPackagesNameResponse();
        response.setPackages(mPackagesService.getPackageNames(request.getPackageIds()));
        return ResponseEntity.ok(response);
    }

    /**
     * Update package information.
     *
     * @param request list packages update.
     * @return Response {@link ContractSiteResponseDTO}
     */
    @PutMapping(path = "/public/api/update-master-packages", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> updateMasterPackages(@RequestBody UpdateMasterPackagesRequest request) {
        List<UpdateMasterPackagesRequestDTO> packages = request.getPackages();
        return ResponseEntity.ok(updateMasterPackagesService.updateMasterPackages(packages));
    }
}
