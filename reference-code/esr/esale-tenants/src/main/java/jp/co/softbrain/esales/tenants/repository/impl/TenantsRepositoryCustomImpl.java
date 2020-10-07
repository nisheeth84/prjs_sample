package jp.co.softbrain.esales.tenants.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.amazonaws.util.StringUtils;

import jp.co.softbrain.esales.tenants.repository.TenantsRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.TenantActiveDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantByConditionDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO;

/**
 * Implement query for Tenant repository
 *
 * @author phamhoainam
 */
@Repository
public class TenantsRepositoryCustomImpl extends RepositoryCustomUtils implements TenantsRepositoryCustom {

    /**
     * @see TenantsRepositoryCustom#getTenantServices(int, boolean)
     */
    @Override
    public List<TenantNameDTO> getTenantServices(int creationStatus, boolean isActive) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT tn.tenant_id ");
        sqlBuilder.append("     , tn.tenant_name ");
        sqlBuilder.append(" FROM tenants tn ");
        sqlBuilder.append(" WHERE tn.creation_status = :creationStatus");
        sqlBuilder.append("     AND tn.is_active = :isActive");
        sqlBuilder.append(" ORDER BY tn.tenant_id ASC;");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("creationStatus", creationStatus);
        parameters.put("isActive", isActive);

        return this.getResultList(sqlBuilder.toString(), "TenantServicesMapping", parameters);
    }

    /**
     * @see TenantsRepositoryCustom#getTenantByCondition(String, String)
     */
    @Override
    public List<TenantByConditionDTO> getTenantByCondition(String tenantName, String companyName) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT te.tenant_name ");
        sqlBuilder.append("     , te.company_name ");
        sqlBuilder.append("     , te.updated_date ");
        sqlBuilder.append(" FROM tenants te ");
        sqlBuilder.append(" WHERE 1 = 1");
        if (tenantName != null && !tenantName.isBlank()) {
            sqlBuilder.append("     AND te.tenant_name = :tenantName");
        }
        if (companyName != null && !companyName.isBlank()) {
            sqlBuilder.append("     AND te.company_name LIKE :companyName");
        }
        sqlBuilder.append(" ORDER BY te.tenant_id ASC;");

        Map<String, Object> parameters = new HashMap<>();
        if (tenantName != null && !tenantName.isBlank()) {
            parameters.put("tenantName", tenantName);
        }
        if (companyName != null && !companyName.isBlank()) {
            parameters.put("companyName", "%" + companyName + "%");
        }

        return this.getResultList(sqlBuilder.toString(), "TenantByConditionMapping", parameters);
    }

    /**
     * @see TenantsRepositoryCustom#countTenantsByTenantNameAndContractId(String, String)
     */
    @Override
    public int countTenantsByTenantNameAndContractId(String tenantName, String contractId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT COUNT(*) ");
        sqlBuilder.append(" FROM tenants t ");
        sqlBuilder.append(" WHERE 1 = 1 ");

        Map<String, Object> parameters = new HashMap<>();
        if (!StringUtils.isNullOrEmpty(tenantName)) {
            sqlBuilder.append("AND t.tenant_name = :tenantName ");
            parameters.put("tenantName", tenantName);
        }
        if (!StringUtils.isNullOrEmpty(contractId)) {
            sqlBuilder.append("AND t.contract_id = :contractId ");
            parameters.put("contractId", contractId);
        }

        Object result = this.getSingleResult(sqlBuilder.toString(), parameters);
        return result != null ? Integer.parseInt(result.toString()) : 0;
    }

    /**
     * @see TenantsRepositoryCustom#getTenantActiveByIds(List)
     */
    @Override
    public List<TenantActiveDTO> getTenantActiveByIds(List<Long> tenantIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT t.tenant_id, ");
        sqlBuilder.append("        t.tenant_name ");
        sqlBuilder.append(" FROM tenants t ");
        sqlBuilder.append(" WHERE t.is_active = true ");

        Map<String, Object> parameters = new HashMap<>();
        if (tenantIds != null && !tenantIds.isEmpty()) {
            sqlBuilder.append("AND t.tenant_id IN (:tenantIds) ");
            parameters.put("tenantIds", tenantIds);
        }
        sqlBuilder.append("ORDER BY t.tenant_id ASC ");

        return this.getResultList(sqlBuilder.toString(), "TenantActiveMapping", parameters);
    }

    /**
     * @see TenantsRepositoryCustom#getTenantNameByIDs(List)
     */
    @Override
    public List<TenantNameDTO> getTenantNameByIDs(List<Long> tenantIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT te.tenant_id ");
        sqlBuilder.append("     , te.tenant_name ");
        sqlBuilder.append("     , cs.user_pool_id ");
        sqlBuilder.append(" FROM tenants te ");
        sqlBuilder.append(" INNER JOIN cognito_settings cs ");
        sqlBuilder.append("     ON cs.tenant_id = te.tenant_id ");
        sqlBuilder.append(" WHERE te.tenant_id IN :tenantIds");
        sqlBuilder.append(" ORDER BY te.tenant_id ASC;");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("tenantIds", tenantIds);

        return this.getResultList(sqlBuilder.toString(), "TenantNameByIDsMapping", parameters);
    }
}
