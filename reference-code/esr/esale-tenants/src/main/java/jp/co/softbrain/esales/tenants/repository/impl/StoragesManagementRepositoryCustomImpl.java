package jp.co.softbrain.esales.tenants.repository.impl;

import jp.co.softbrain.esales.tenants.repository.StoragesManagementRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.GetUsedStorageDTO;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Implement query for  StoragesManagement repository.
 *
 * @author nguyenvietloi
 */
@Repository
public class StoragesManagementRepositoryCustomImpl extends RepositoryCustomUtils implements StoragesManagementRepositoryCustom {

    /**
     * @see StoragesManagementRepositoryCustom#getDatabaseStorage(String)
     */
    @Override
    public List<GetUsedStorageDTO> getDatabaseStorage(String contractTenantId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT sm.micro_service_name ");
        sqlBuilder.append("      , sm.used_storage_s3 ");
        sqlBuilder.append("      , sm.used_storage_elasticsearch ");
        sqlBuilder.append("      , sm.used_storage_database ");
        sqlBuilder.append(" FROM storages_management sm ");
        sqlBuilder.append(" INNER JOIN tenants t ");
        sqlBuilder.append("     ON sm.tenant_id = t.tenant_id ");
        sqlBuilder.append(" WHERE t.contract_id = :contractTenantId");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("contractTenantId", contractTenantId);

        return this.getResultList(sqlBuilder.toString(), "DatabaseStorageMapping", parameters);
    }
}
