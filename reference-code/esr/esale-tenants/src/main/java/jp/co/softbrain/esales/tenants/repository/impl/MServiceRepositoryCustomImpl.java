package jp.co.softbrain.esales.tenants.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.amazonaws.util.CollectionUtils;

import jp.co.softbrain.esales.tenants.repository.MServiceRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.GetMasterServicesDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.MServiceDTO;




/**
 * Implement query for  MService repository.
 *
 * @author nguyenvietloi
 */
@Repository
public class MServiceRepositoryCustomImpl extends RepositoryCustomUtils implements MServiceRepositoryCustom {

    /**
     * @see MServiceRepositoryCustom#findMicroServicesByTenantId(Long)
     */
    @Override
    public List<MServiceDTO> findMicroServicesByTenantId(Long tenantId) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append(" SELECT ms.m_service_id ");
        sqlBuilder.append("      , ms.micro_service_name ");
        sqlBuilder.append(" FROM m_services ms ");
        sqlBuilder.append(" INNER JOIN m_subscriptions_services mss ");
        sqlBuilder.append("     ON mss.m_service_id = ms.m_service_id");
        sqlBuilder.append(" INNER JOIN license_subscriptions ls ");
        sqlBuilder.append("     ON ls.m_subscription_id = mss.m_subscription_id ");
        sqlBuilder.append(" WHERE ls.tenant_id = :tenantId");

        Map<String, Object> parameters = new HashMap<>();
        parameters.put("tenantId", tenantId);
        return this.getResultList(sqlBuilder.toString(), "MicroServicesMapping", parameters);
    }
    
    /**
     * @see MServiceRepositoryCustom#getMasterServices(java.util.List)
     */
    @Override
    public List<GetMasterServicesDataDTO> getMasterServices(List<Long> serviceIds) {
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder .append("SELECT m_service_id as serviceId ")
                   .append("     , service_name as serviceName ")
                   .append("     , micro_service_name as microServiceName ")
                   .append("     , is_active as isActive ")
                   .append(" FROM m_services ")
                   .append(" WHERE is_active = true ");

        Map<String, Object> parameters = new HashMap<>();

        if (!CollectionUtils.isNullOrEmpty(serviceIds)) {
            sqlBuilder.append("AND m_service_id IN :serviceIds ");
            parameters.put("serviceIds", serviceIds);
        }

        return getResultList(sqlBuilder.toString(), "GetMasterServicesMapping",  parameters);
    }
    
}
