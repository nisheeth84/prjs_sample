package jp.co.softbrain.esales.commons.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.ListViewSettingsFilters;

/**
 * Spring Data repository for the ListViewSettingsFilters entity
 * 
 * @author nguyenvanchien3
 */
@Repository
@XRayEnabled
public interface ListViewSettingsFiltersRepository
        extends JpaRepository<ListViewSettingsFilters, Long>, ListViewSettingsFiltersRepositoryCustom {
    /**
     * Delete old filter informations
     * 
     * @param savedId - list_view_setting_id
     * @param selectedTargetType - target_type
     * @param selectedTargetId - target_id
     */
    @Modifying(clearAutomatically = true)
    void deleteByListViewSettingIdAndTargetTypeAndTargetId(Long listViewSettingId, Integer selectedTargetType,
            Long selectedTargetId);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE list_view_settings_filters"
                 + "SET "
                 + "filter_value  = jsonb_set(filter_value, '{field_id}', ':fieldIdTo')"
                 + "WHERE "
                 + "field_id = :fieldIdFrom", nativeQuery = true)
    void updateFieldId(@Param("fieldIdFrom") Long fieldIdFrom, @Param("fieldIdTo") Long fieldIdTo );
}
