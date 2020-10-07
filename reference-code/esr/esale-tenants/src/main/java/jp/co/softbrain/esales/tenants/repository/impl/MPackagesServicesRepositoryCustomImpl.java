package jp.co.softbrain.esales.tenants.repository.impl;

import java.time.Instant;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.amazonaws.util.CollectionUtils;

import jp.co.softbrain.esales.tenants.config.ConstantsTenants;
import jp.co.softbrain.esales.tenants.repository.MPackagesServicesRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.GetPackagesServicesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesTenantDTO;
import jp.co.softbrain.esales.tenants.service.dto.ServicesPackagesDTO;

/**
 * Implement query for  MService repository.
 *
 * @author nguyenvietloi
 */
@Repository
public class MPackagesServicesRepositoryCustomImpl extends RepositoryCustomUtils implements
    MPackagesServicesRepositoryCustom {

    /**
     * @see MPackagesServicesRepositoryCustom#findPackagesTenant(Long)
     */
    @Override
    public List<PackagesTenantDTO> findPackagesTenant(Long tenantId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT mps.m_package_id ");
        sqlBuilder.append("      , mps.child_id ");
        sqlBuilder.append(" FROM m_packages_services mps ");
        sqlBuilder.append(" INNER JOIN m_packages mp ");
        sqlBuilder.append("     ON mps.m_package_id = mp.m_package_id ");
        sqlBuilder.append(" INNER JOIN license_packages lp ");
        sqlBuilder.append("     ON mps.m_package_id = lp.m_package_id ");
        sqlBuilder.append(" WHERE lp.tenant_id = :tenantId ");
        sqlBuilder.append("     AND mp.type = :type ");
        sqlBuilder.append("     AND (mp.expiration_date >= :expirationDate ");
        sqlBuilder.append("         OR mp.expiration_date IS NULL) ");
        sqlBuilder.append(" ORDER BY mp.m_package_id ASC, mps.child_id ASC");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("tenantId", tenantId);
        parameters.put("type", ConstantsTenants.Type.USER.getValue());
        parameters.put("expirationDate", Instant.now());

        return this.getResultList(sqlBuilder.toString(), "PackagesTenantMapping", parameters);
    }

    /**
     * @see MPackagesServicesRepositoryCustom#findServicesByPackage(List)
     */
    @Override
    public List<ServicesPackagesDTO> findServicesByPackage(List<Long> packageIds) {
        if (packageIds != null && packageIds.isEmpty()) {
            return Collections.emptyList();
        }

        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT mps.m_package_id ");
        sqlBuilder.append("      , mp.package_name ");
        sqlBuilder.append("      , mps.child_id ");
        sqlBuilder.append("      , mps.m_service_id ");
        sqlBuilder.append("      , ms.service_name ");
        sqlBuilder.append("      , ms.micro_service_name ");
        sqlBuilder.append(" FROM m_packages_services mps ");
        sqlBuilder.append(" INNER JOIN m_packages mp ");
        sqlBuilder.append("     ON mps.m_package_id = mp.m_package_id ");
        sqlBuilder.append(" LEFT JOIN m_services ms ");
        sqlBuilder.append("     ON mps.m_service_id = ms.m_service_id ");
        sqlBuilder.append(" WHERE mp.type = :type ");
        sqlBuilder.append("     AND (mp.expiration_date >= :expirationDate ");
        sqlBuilder.append("         OR mp.expiration_date IS NULL) ");
        sqlBuilder.append("     AND ms.is_active = TRUE ");
        sqlBuilder.append("     AND mps.is_active = TRUE ");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("type", ConstantsTenants.Type.USER.getValue());
        parameters.put("expirationDate", Instant.now());

        if (packageIds != null) {
            sqlBuilder.append(" AND mp.m_package_id IN :packageIds ");
            parameters.put("packageIds", packageIds);
        }
        sqlBuilder.append(" ORDER BY mp.m_package_id ASC, mps.child_id ASC");

        return this.getResultList(sqlBuilder.toString(), "ServicesPackagesMapping", parameters);
    }

    /**
     * @see MPackagesServicesRepositoryCustom#getMasterPackages(java.util.List)
     */
    @Override
    public List<GetPackagesServicesDataDTO> getPackagesServices(List<Long> packageServiceIds) {
        StringBuilder sqlBuilder = new StringBuilder()
                .append(" SELECT m_package_service_id as packageServiceId ")
                .append("      , m_package_id as packageId ")
                .append("      , m_service_id as serviceId ")
                .append("      , child_id as childId ")
                .append("      , is_active as isActive ")
                .append(" FROM m_packages_services ")
                .append(" WHERE is_active = true ");

        Map<String, Object> parameters = new HashMap<>();
        if (!CollectionUtils.isNullOrEmpty(packageServiceIds)) {
            sqlBuilder.append(" AND m_package_service_id IN ( :packageServiceIds )");
            parameters.put("packageServiceIds", packageServiceIds);
        }

        return this.getResultList(sqlBuilder.toString(), "GetPackagesServicesMapping", parameters);
    }
}
