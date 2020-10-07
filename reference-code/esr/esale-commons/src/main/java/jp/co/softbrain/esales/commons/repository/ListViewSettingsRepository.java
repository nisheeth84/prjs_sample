package jp.co.softbrain.esales.commons.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.ListViewSettings;

/**
 * Spring Data repository for the ListViewSettings entity.
 * 
 * @author nguyenvanchien3
 */
@Repository
@XRayEnabled
public interface ListViewSettingsRepository extends JpaRepository<ListViewSettings, Long> {

    /**
     * find and convert entity to DTO by conditions
     * 
     * @param fieldBelong - id feature in used
     * @param employeeId id user
     * @return DTO contain informations list view setting.
     */
    ListViewSettings findOneByFieldBelongAndEmployeeId(Integer fieldBelong, Long employeeId);
}
