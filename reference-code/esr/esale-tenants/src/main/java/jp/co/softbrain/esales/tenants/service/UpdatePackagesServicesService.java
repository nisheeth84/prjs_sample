package jp.co.softbrain.esales.tenants.service;

import java.util.List;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdatePackagesServicesRequestDTO;

/**
 * Service interface for update package services
 *
 * @author lehuuhoa
 */
@XRayEnabled
public interface UpdatePackagesServicesService {

    /**
     * Update package service information.
     *
     * @param packagesServices List data package service update.
     * @return String message status update
     */
    ContractSiteResponseDTO updatePackagesServices(List<UpdatePackagesServicesRequestDTO> packagesServices);
}
