package jp.co.softbrain.esales.tenants.repository.impl;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.amazonaws.util.CollectionUtils;

import jp.co.softbrain.esales.tenants.repository.MPackagesRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.GetMasterPackagesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.PackagesDTO;

/**
 * Repository implementation for {@link MPackagesRepositoryCustom}
 *
 * @author tongminhcuong
 */
@Repository
public class MPackagesRepositoryCustomImpl extends RepositoryCustomUtils implements MPackagesRepositoryCustom {

    /**
     * @see MPackagesRepositoryCustom#getPackages(List)
     */
    @Override
    public List<PackagesDTO> getPackages(List<Long> packageIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT m_package_id ");
        sqlBuilder.append("     , package_name ");
        sqlBuilder.append("FROM m_packages ");
        sqlBuilder.append("WHERE type = 1 ");
        sqlBuilder.append("    AND (expiration_date IS NULL OR expiration_date >= :currentDate) ");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("currentDate", Instant.now());

        if (!CollectionUtils.isNullOrEmpty(packageIds)) {
            sqlBuilder.append("AND m_package_id IN :packageIds ");
            parameters.put("packageIds", packageIds);
            return getResultList(sqlBuilder.toString(), "PackagesMapping", parameters);
        } else {
            return getResultList(sqlBuilder.toString(), "PackagesMapping");
        }
    }
    
    /**
     * @see MPackagesRepositoryCustom#getMasterPackages(java.util.List)
     */
    @Override
    public List<GetMasterPackagesDataDTO> getMasterPackages(List<Long> packageIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT m_package_id as packageId ")
                  .append("     , package_name as packageName ")
                  .append("     , type as type ")
                  .append("     , to_char( expiration_date, 'yyyy/MM/dd') as expirationDate ")
                  .append(" FROM m_packages ")
                  .append("    WHERE (expiration_date IS NULL OR expiration_date >= :currentDate) ");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("currentDate", Instant.now());

        if (!CollectionUtils.isNullOrEmpty(packageIds)) {
            sqlBuilder.append("AND m_package_id IN :packageIds ");
            parameters.put("packageIds", packageIds);
        } 
        
        return getResultList(sqlBuilder.toString(), "GetMasterPackagesMapping", parameters);
    }
}
