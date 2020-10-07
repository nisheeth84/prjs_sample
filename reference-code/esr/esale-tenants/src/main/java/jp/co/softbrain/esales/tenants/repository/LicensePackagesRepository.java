package jp.co.softbrain.esales.tenants.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.LicensePackages;

/**
 * Spring Data repository for the LicensePackages entity.
 */
@XRayEnabled
@Repository
public interface LicensePackagesRepository extends JpaRepository<LicensePackages, Long> {

    /**
     * Delete the list of LicensePackages by specified tenant_id
     *
     * @param tenantId The id of tenant
     */
    @Query(value = "DELETE "
            + " FROM license_packages "
            + " WHERE tenant_id = :tenantId ", nativeQuery = true)
    @Modifying(clearAutomatically = true)
    void deleteByTenantId(@Param("tenantId") Long tenantId);

    /**
     * Find list of m_package_id by tenant_id
     *
     * @param tenantId The id of tenant
     * @return List of m_package_id
     */
    @Query(value = "SELECT m_package_id "
            + "FROM license_packages "
            + "WHERE tenant_id = :tenantId", nativeQuery = true)
    List<Long> findMPackageIdByTenantId(@Param("tenantId") Long tenantId);

    /**
     * Delete License packages by list tenant id
     * 
     * @param tenantIds list id of tenant
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = " DELETE FROM license_packages " + 
            " WHERE tenant_id IN (:tenantIds);", nativeQuery = true)
    void deleteLicensePackagesByTenantIds(@Param("tenantIds") List<Long> tenantIds);
}
