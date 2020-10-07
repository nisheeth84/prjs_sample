package jp.co.softbrain.esales.tenants.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.service.dto.GetUsedStorageDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Query for storages management interface
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface StoragesManagementRepositoryCustom {

    /**
     * Get database storage by contractTenantId.
     *
     * @param contractTenantId id of contract.
     * @return list of {@link GetUsedStorageDTO}.
     */
    List<GetUsedStorageDTO> getDatabaseStorage(String contractTenantId);
}
