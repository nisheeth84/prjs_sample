package jp.co.softbrain.esales.tenants.service;

import java.util.List;
import java.util.Optional;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.service.dto.AvailableLicensePackage;
import jp.co.softbrain.esales.tenants.service.dto.CompanyNameResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.ContractSiteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.StatusContractDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantActiveDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantByConditionDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantDeleteResponseDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantEnvironmentDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantServicesResDTO;

/**
 * Interface of business logic for tenant
 * @author phamhoainam
 *
 */
@XRayEnabled
public interface TenantService {

    /**
     * Get list tenant and services that tenant used
     *
     * @return {@link List} of {@link TenantServicesResDTO}
     */
    List<TenantServicesResDTO> getTenantServices();

    /**
     * Get name and company name of tenant
     *
     * @param tenantName name of tenant is condition
     * @param companyName name of company is condition
     * @return list {@link TenantByConditionDTO}
     */
    List<TenantByConditionDTO> getTenantByCondition(String tenantName, String companyName);

    /**
     * Get Tenant active by ids.
     *
     * @param tenantIds ids param.
     * @return list of {@link TenantActiveDTO}
     */
    List<TenantActiveDTO> getTenantActiveByIds(List<Long> tenantIds);

	/**
     * Get tenant by tenant_name
     *
     * @param tenantName The name of tenant
     * @return {@link AvailableLicensePackage}
     */
    List<AvailableLicensePackage> getTenantLicensePackage(String tenantName);

    /**
     * Get tenant_name by contract_id
     *
     * @param contractId The id of Contract
     * @return tenant
     */
    String getTenantNameByContractId(String contractId);

	/**
     * Get information of tenant that will be used to initiate environment
     *
     * @param tenantId The id of tenant target
     * @return {@link TenantEnvironmentDTO}
     */
    TenantEnvironmentDTO getTenantEnvironmentForUpdate(Long tenantId);

    /**
     * Update creation status
     *
     * @param tenantId The id of tenant target
     * @param creationStatus creation status
     */
    void updateCreationStatus(Long tenantId, Integer creationStatus);

    /**
     * Get information of tenant
     *
     * @param contractTenantId contract id
     * @return {@link TenantLicensePackageDTO}
     */
    Optional<TenantNameDTO> getTenantContractByContractId(String contractTenantId);

	    /**
     * Perform the company name after tenant name.
     * @param tenantName: String Tenant name
     * @return CompanyNameResponseDTO
     */
    CompanyNameResponseDTO getCompanyName(String tenantName);

	    /**
     * get Status Contract by Tenant Name
     *
     * @param tenantName: String Tenant name
     * @return {@link StatusContractDataDTO}}
     */
    StatusContractDataDTO getStatusContract(String tenantName);

    /**
     * get lisst tenant name by list ID
     *
     * @param tenantIds {@link List} id of tenant
     * @return {@link List} of {@link TenantNameDTO}
     */
    List<TenantNameDTO> getTenantName(List<Long> tenantIds);

    /**
     * delete tenant data include: elastic search, S3, Schema tenant in micro service DB
     * @param tenantServiceDTO dto of tenantId, tenantName
     * @return TenantDeleteResponseDTO with error field null if delete success, error field not null if delete fail
     */
    TenantDeleteResponseDTO deleteDataTenantByTenantDto(TenantNameDTO tenantServiceDTO);

    /**
     * delete tenant data in table:
     *     license_subscriptions,
     *     license_options,
     *     storages_management,
     *     payments_management
     * and update deleted_date of table tenants

     *  @param tenantIds {@link List} id of tenant
     */
    void deleteDataOfSchemaTenants(List<Long> tenantIds);

    /**
     * Update tenant
     *
     * @param contractIds  list contract id
     * @param status new status of tenant
     * @param trialEndDate trial end date
     * @param isDeleteSampleData delete sample data or not
     * @return message of update logic
     */
    ContractSiteResponseDTO updateTenants(List<String> contractIds, int status, String trialEndDate, Boolean isDeleteSampleData);

    /**
     * Get tenant status by contract_id
     *
     * @param contractTenantId The id of contract
     * @return creation status
     */
    ContractSiteResponseDTO getTenantStatus(String contractTenantId);
}
