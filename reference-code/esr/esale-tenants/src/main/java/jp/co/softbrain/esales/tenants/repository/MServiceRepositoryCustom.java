package jp.co.softbrain.esales.tenants.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.GetMasterServicesDataDTO;

import jp.co.softbrain.esales.tenants.service.dto.MServiceDTO;

/**
 * Query for micro service interface
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface MServiceRepositoryCustom {

    /**
     * Find micro service by tenant id
     *
     * @param tenantId id of tenant
     * @return list string
     */
    List<MServiceDTO> findMicroServicesByTenantId(Long tenantId);

    /**
     * Get all master service
     * 
     * @param serviceIds List id services
     * @return List {@link GetMasterServicesDataDTO}
     */
    List<GetMasterServicesDataDTO> getMasterServices(List<Long> serviceIds);
}
