package jp.co.softbrain.esales.commons.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.GeneralSetting;

/**
 * Spring Data repository for the GeneralSetting entity
 *
 * @author phamminhphu
 */
@Repository
@XRayEnabled
public interface GeneralSettingRepository extends JpaRepository<GeneralSetting, Long> {

    /**
     * Find all general setting by setting name
     *
     * @param settingName setting_name
     * @return the list Entity response
     */
    GeneralSetting findBySettingName(String settingName);

    Optional<GeneralSetting> findByGeneralSettingId(Long generalSettingId);

    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE general_setting " + " SET setting_value=:settingValue, "
            + "updated_user=:updatedUser", nativeQuery = true)
    void updateSetting(@Param("settingValue") String settingValue, @Param("updatedUser") Long updatedUser);

}
