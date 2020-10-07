package jp.co.softbrain.esales.tenants.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.QuickSightSettings;
import jp.co.softbrain.esales.tenants.service.dto.GetQuickSightSettingDTO;

/**
 * Spring Data repository for the QuickSightSettings entity.
 *
 * @author nguyenvietloi
 */
@Repository
@XRayEnabled
public interface QuickSightSettingsRepository extends JpaRepository<QuickSightSettings, Long> {

    /**
     * Get quicksight setting info by tenant name
     *
     * @param tenantName The tenant name
     * @return {@link GetQuickSightSettingDTO}
     */
    @Query("SELECT new jp.co.softbrain.esales.tenants.service.dto.GetQuickSightSettingDTO("
            + "   qs.postgresqlAccount, "
            + "   qs.postgresqlPassword, "
            + "   qs.namespace, "
            + "   qs.groupName, "
            + "   qs.groupArn, "
            + "   qs.datasourceArn "
            + ")"
            + " FROM QuickSightSettings qs "
            + "    INNER JOIN Tenants te ON qs.tenantId = te.tenantId "
            + " WHERE te.tenantName = :tenantName ")
    Optional<GetQuickSightSettingDTO> findQuickSightSettingByTenantName(@Param("tenantName") String tenantName);
}
