package jp.co.softbrain.esales.tenants.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.service.dto.GetDatabaseStorageResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.UpdateUsageStorageResponseDTO;

import java.util.List;

/**
 * Service interface for process database storage.
 *
 * @author nguyenvietloi
 */
@XRayEnabled
public interface DatabaseStorageService {

    /**
     * Get database storage of services by contractId.
     *
     * @param contractId id of contract
     * @return {@link GetDatabaseStorageResponseDTO}.
     */
    GetDatabaseStorageResponseDTO getDatabaseStorage(String contractId);

    /**
     * Update usage storage of postgres, elasticsearch, and S3 of the tenants.
     *
     * @param tenantIds ids of tenants.
     * @return list of {@link UpdateUsageStorageResponseDTO}
     */
    List<UpdateUsageStorageResponseDTO> updateUsageStorage(List<Long> tenantIds);
}
