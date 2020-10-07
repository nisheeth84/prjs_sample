package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateMasterPackagesRequestDTO;

/**
 * Service interface for update master packages
 *
 * @author lehuuhoa
 */
@XRayEnabled
public interface UpdateMasterPackagesService {

    /**
     * Update package information.
     *
     * @param packagesRequestDTOs List data packages update
     * @return String Message status update
     */
    ContractSiteResponseDTO updateMasterPackages(List<UpdateMasterPackagesRequestDTO> packagesRequestDTOs);
}
