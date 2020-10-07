package jp.co.softbrain.esales.tenants.repository.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.tenants.repository.IpAddressRepositoryCustom;
import jp.co.softbrain.esales.tenants.service.dto.GetIpAddressesResponseDTO;

@Repository
public class IpAddressRepositoryCustomImpl extends RepositoryCustomUtils implements IpAddressRepositoryCustom {
    @Override
    public List<GetIpAddressesResponseDTO> getIpAddresses(String tenantName) {
        Map<String, Object> parameter = new HashMap<>();
        StringBuilder sqlBuilder = new StringBuilder();
        sqlBuilder.append("SELECT   i.ip_address_id ");
        sqlBuilder.append("       , i.ip_address ");
        sqlBuilder.append("       , i.updated_date ");
        sqlBuilder.append("FROM ip_address i ");
        sqlBuilder.append("INNER JOIN tenants t ");
        sqlBuilder.append("ON i.tenant_id = t.tenant_id ");
        sqlBuilder.append("WHERE t.tenant_name = :tenantName ");
        sqlBuilder.append("ORDER BY i.ip_address_id ASC ");

        parameter.put("tenantName", tenantName);
        return this.getResultList(sqlBuilder.toString(), "ipAddressMapping", parameter);
    }
}
