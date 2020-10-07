package jp.co.softbrain.esales.tenants.repository;

import java.util.List;

import jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.TenantActiveDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantByConditionDTO;

/**
 * Query for tenants interface
 *
 * @author phamhoainam
 */
@Repository
@XRayEnabled
public interface TenantsRepositoryCustom {

    /**
     * Get tenant with micro service name
     *
     * @param creationStatus status create of tenant
     * @param isActive active status of tenant
     * @return {@link List} of {@link TenantNameDTO}
     */
    List<TenantNameDTO> getTenantServices(int creationStatus, boolean isActive);

    /**
     * Get name and company name of tenant
     *
     * @param tenantName name of tenant is condition
     * @param companyName name of company is condition
     * @return {@link List} name anf company name of tenant
     */
    List<TenantByConditionDTO> getTenantByCondition(String tenantName, String companyName);

    /**
     * Count tenant by conditions.
     *
     * @param tenantName name of tenant
     * @param contractId id of contract
     * @return number tenant matching conditions.
     */
    int countTenantsByTenantNameAndContractId(String tenantName, String contractId);

    /**
     * Get Tenant active by ids.
     *
     * @param tenantIds ids param.
     * @return list of {@link TenantActiveDTO}
     */
    List<TenantActiveDTO> getTenantActiveByIds(List<Long> tenantIds);

    /**
     * get tenant name by tenant id
     *
     * @param tenantIds list id of tenant
     * @return list of {@link TenantNameDTO}
     */
    List<TenantNameDTO> getTenantNameByIDs(List<Long> tenantIds);
}
