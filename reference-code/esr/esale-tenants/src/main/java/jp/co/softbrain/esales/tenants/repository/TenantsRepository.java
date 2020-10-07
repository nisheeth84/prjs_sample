package jp.co.softbrain.esales.tenants.repository;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.Tenants;
import jp.co.softbrain.esales.tenants.service.dto.AvailableLicensePackage;
import jp.co.softbrain.esales.tenants.service.dto.StatusContractDataDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantEnvironmentDTO;
import jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO;

/**
 * Spring Data repository for the Tenants entity.
 *
 * @author phamhoainam
 */
@Repository
@XRayEnabled
public interface TenantsRepository extends JpaRepository<Tenants, Long>, TenantsRepositoryCustom {
    /**
     * update deleted date of tenant by list tenant id
     *
     * @param tenantIds list id of tenant
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = " UPDATE tenants " +
            " SET deleted_date = :deletedDate " +
            " WHERE tenant_id IN (:tenantIds);", nativeQuery = true)
    void updateDeletedDate(@Param("tenantIds") List<Long> tenantIds, @Param("deletedDate") Instant deletedDate);

    /**
     * Get information of tenant
     *
     * @param tenantName The name of tenant target
     * @return object contains tenant_id and contract_id
     */
    @Query("SELECT new jp.co.softbrain.esales.tenants.service.dto.AvailableLicensePackage( "
            + "   lp.mPackageId, "
            + "   mp.packageName, "
            + "   lp.availableLicenseNumber "
            + ") "
            + "FROM LicensePackages lp "
            + "    INNER JOIN MPackages mp ON lp.mPackageId = mp.mPackageId "
            + "    INNER JOIN Tenants te ON te.tenantId = lp.tenantId "
            + "WHERE te.tenantName = :tenantName "
            + "   AND te.isActive = TRUE "
            + "   AND mp.type = 1 "
            + "   AND (mp.expirationDate IS NULL OR mp.expirationDate >= :currentDate) ")
    List<AvailableLicensePackage> findTenantLicensePackage(@Param("tenantName") String tenantName,
            @Param("currentDate") Instant currentDate);

    /**
     * Get tenant_name by contract_id
     *
     * @param contractId The id of Contract
     * @return tenant name
     */
    @Query(value = "SELECT tenants.tenant_name "
            + "FROM tenants "
            + "WHERE tenants.contract_id = :contractId ", nativeQuery = true)
    String getTenantNameByContractId(@Param("contractId") String contractId);

    /**
     * Update creation status
     *
     * @param tenantId The id of Tenant
     * @param creationStatus updated status
     */
    @Query(value = "UPDATE tenants "
            + "SET creation_status = :creationStatus "
            + "WHERE tenant_id = :tenantId ", nativeQuery = true)
    @Modifying(clearAutomatically = true)
    void updateCreationStatus(@Param("tenantId") Long tenantId, @Param("creationStatus") Integer creationStatus);

    /**
     * Get information of tenant
     *
     * @param contractTenantId contract id
     * @return {@link TenantContractDTO}
     */
    @Query("SELECT new jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO( "
            + "   te.tenantId, "
            + "   te.tenantName "
            + ") "
            + "FROM Tenants te "
            + "WHERE te.contractId = :contractTenantId ")
    Optional<TenantNameDTO> getTenantContractByContractId(@Param("contractTenantId") String contractTenantId);

    /**
     * Get information of tenant that will be used to initiate environment
     *
     * @param tenantId The id of tenant target
     * @return {@link TenantEnvironmentDTO}
     */
    @Query("SELECT new jp.co.softbrain.esales.tenants.service.dto.TenantEnvironmentDTO( "
        + "   te.contractId, "
        + "   te.mIndustryId, "
        + "   mi.industryTypeName, "
        + "   mi.schemaName, "
        + "   te.creationStatus, "
        + "   te.tenantName, "
        + "   te.email, "
        + "   te.companyName, "
        + "   te.departmentName, "
        + "   te.positionName, "
        + "   te.employeeSurname, "
        + "   te.employeeName, "
        + "   te.telephoneNumber, "
        + "   te.password, "
        + "   te.accountClosingMonth, "
        + "   te.productName, "
        + "   te.customerName, "
        + "   te.calendarDay, "
        + "   te.businessMainId, "
        + "   te.businessSubId "
        + ") "
        + "FROM Tenants te "
        + "INNER JOIN MIndustries mi ON te.mIndustryId = mi.mIndustryId "
        + "WHERE te.tenantId = :tenantId ")
    TenantEnvironmentDTO findTenantEnvironmentForUpdate(@Param("tenantId") Long tenantId);

	 /**
     * Get the company name by tenant name
     *
     * @param tenantName : String Tenant Name
     * @return String Company Name
     */
    @Query(value = "SELECT tenants.company_name "
            + "FROM tenants "
            + "WHERE tenants.tenant_name = :tenantName ", nativeQuery = true)
    String findCompanyNameByTenantName(@Param("tenantName") String tenantName);

    /**
     * get get Status Contract by Tenant Name
     *
     * @param tenantName : String Tenant Name
     * @return StatusContractDataDTO
     */
    @Query("SELECT new jp.co.softbrain.esales.tenants.service.dto.StatusContractDataDTO("
            + " t.contractStatus, "
            + " t.trialEndDate) "
            + " FROM Tenants t "
            + " WHERE t.tenantName = :tenantName ")
    StatusContractDataDTO getStatusContract(@Param("tenantName") String tenantName);

    /**
     * get tenant by contractId and Creation status
     * @param contractIds list contract id
     * @param creationStatus creation Status of tenant
     * @return list {@linkTenantServicesDTO}
     */
    @Query(value = " SELECT new jp.co.softbrain.esales.tenants.service.dto.TenantNameDTO(tenantId, tenantName) " +
            " FROM Tenants " +
            " WHERE contractId IN (:contractIds) " +
            "     AND creationStatus = :creationStatus ")
    List<TenantNameDTO> getTenantForUpdate(
            @Param("contractIds") List<String> contractIds,
            @Param("creationStatus") int creationStatus);

    /**
     * update tenant status where isActive is True, status = 1
     *
     * @param tenantIds list tenants id will update
     * @param isActive status active of tenants
     * @param stopDate date of stop license
     * @param contractStatus status of contract
     * @param trialEndDate trial end date
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = " UPDATE tenants " +
            " SET is_active = :isActive , " +
            "     stop_date = null , " +
            "     contract_status = :contractStatus , " +
            "     trial_end_date = :trialEndDate " +
            " WHERE tenant_id IN (:tenantIds);", nativeQuery = true)
    void updateTenantStatus(@Param("tenantIds") List<Long> tenantIds, @Param("isActive") boolean isActive,
            @Param("contractStatus") Integer contractStatus,
            @Param("trialEndDate") Date trialEndDate);

    /**
     * update tenant status where isActive is True, status = 2
     *
     * @param tenantIds list tenants id will update
     * @param isActive status active of tenants
     * @param stopDate date of stop license
     * @param contractStatus status of contract
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = " UPDATE tenants " +
            " SET is_active = :isActive , " +
            "     stop_date = :stopDate , " +
            "     contract_status = :contractStatus " +
            " WHERE tenant_id IN (:tenantIds);", nativeQuery = true)
    void updateTenantStatus(@Param("tenantIds") List<Long> tenantIds, @Param("isActive") boolean isActive,
            @Param("stopDate") Date stopDate, @Param("contractStatus") Integer contractStatus);

    /**
     * update tenant status where isActive is True, status = 3
     *
     * @param tenantIds list tenants id will update
     * @param isActive status active of tenants
     * @param contractStatus status of contract
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query(value = "UPDATE tenants " +
            " SET is_active = :isActive," +
            "     contract_status = :contractStatus" +
            " WHERE tenant_id IN (:tenantIds);", nativeQuery = true)
    void updateTenantStatus(@Param("tenantIds") List<Long> tenantIds, @Param("isActive") boolean isActive,
            @Param("contractStatus") Integer contractStatus);

    /**
     * Get tenant status by contract_id
     *
     * @param contractTenantId The id of contract
     * @return creation status
     */
    @Query(value = "SELECT creation_status "
            + " FROM tenants "
            + " WHERE contract_id = :contractTenantId ", nativeQuery = true)
    Optional<Integer> getTenantStatus(@Param("contractTenantId") String contractTenantId);

    /**
     * find tenants by tenant name
     *
     * @param tenantName - tenant name
     * @return
     */
    Optional<Tenants> findByTenantName(String tenantName);

    /**
     * Find all of tenant with deleted_date is null
     *
     * @return List of tenant name
     */
    @Query(value = "SELECT tenant_name "
        + " FROM tenants "
        + " WHERE deleted_date IS NULL;", nativeQuery = true)
    List<String> findAllTenantName();

	 /**
     * getByTenantName : get tenant id by tenant name
     * @param tenantName : tenant name
     * @return Tenants : the entity
     */
    @Query(value = "SELECT tenant_id " +
        "FROM tenants t " +
        "WHERE t.tenant_name = :tenantName", nativeQuery = true)
    Long getByTenantName(@Param("tenantName") String tenantName);
}
