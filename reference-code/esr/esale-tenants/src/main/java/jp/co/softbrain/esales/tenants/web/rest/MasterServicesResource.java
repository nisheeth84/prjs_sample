package jp.co.softbrain.esales.tenants.web.rest;

import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.ERROR;
import static jp.co.softbrain.esales.tenants.config.ConstantsTenants.ResponseStatus.SUCCESS;

import java.util.List;

import jp.co.softbrain.esales.config.Constants;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteErrorDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.tenants.service.MServiceService;
import jp.co.softbrain.esales.tenants.service.UpdateMasterServicesService;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.GetMasterServicesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateMasterServicesRequestDTO;
import jp.co.softbrain.esales.tenants.web.rest.vm.request.UpdateMasterServicesRequest;

/**
 * REST controller for API master services
 *
 * @author lehuuhoa
 */
@RequestMapping("/public/api")
@RestController
public class MasterServicesResource {

    @Autowired
    private MServiceService mServiceService;

    @Autowired
    private UpdateMasterServicesService updateMasterServicesService;

    /**
     * Get all the information about packages.
     *
     * @param serviceIds list id packages.
     * @return Response {@link ContractSiteResponseDTO}.
     */
    @GetMapping(path = "/get-master-services", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> getMasterServices(
            @RequestParam("serviceIds") List<Long> serviceIds) {
        try {
            List<GetMasterServicesDataDTO> services = mServiceService.getMasterServices(serviceIds);
            return ResponseEntity.ok(new ContractSiteResponseDTO(SUCCESS.getValue(), services, null /* errors */));
        } catch (Exception e) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.INTERRUPT_API, e.getMessage());
            return ResponseEntity.ok(new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error)));
        }
    }

    /**
     * Update master service information.
     *
     * @param request list master service update.
     * @return Response {@link ContractSiteResponseDTO}
     */
    @PutMapping(path = "/update-master-services", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ContractSiteResponseDTO> updateMasterServices(@RequestBody UpdateMasterServicesRequest request) {
        try {
            List<UpdateMasterServicesRequestDTO> services = request.getServices();
            return ResponseEntity.ok(updateMasterServicesService.updateMasterServices(services));
        } catch (Exception e) {
            ContractSiteErrorDataDTO error = new ContractSiteErrorDataDTO(Constants.INTERRUPT_API, e.getMessage());
            return ResponseEntity.ok(new ContractSiteResponseDTO(ERROR.getValue(), null /* data */, List.of(error)));
        }
    }
}
