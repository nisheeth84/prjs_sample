package jp.co.softbrain.esales.tenants.repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.tenants.domain.StoragesManagement;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data repository for the StoragesManagement entity.
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface StoragesManagementRepository extends JpaRepository<StoragesManagement, Long>, StoragesManagementRepositoryCustom {

    /**
     * Count storages_management by tenant_id.
     *
     * @param tenantId id of tenant.
     * @return number of storages_management.
     */
    int countByTenantId(@Param("tenantId") Long tenantId);

    /**
     * Delete storages_managements by tenant_id.
     *
     * @param tenantId id of tenant.
     */
    void deleteByTenantId(@Param("tenantId") Long tenantId);

    /**
     * Delete Storages Management by list tenant id
     * 
     * @param tenantIds list id of tenant
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = " DELETE FROM storages_management " + 
            " WHERE tenant_id IN (:tenantIds);", nativeQuery = true)
    void deleteStoragesManagementByTenantIds(@Param("tenantIds") List<Long> tenantIds);
}
