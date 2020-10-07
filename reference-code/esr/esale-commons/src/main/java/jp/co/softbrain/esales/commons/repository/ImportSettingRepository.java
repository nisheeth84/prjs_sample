package jp.co.softbrain.esales.commons.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.commons.domain.ImportSetting;

/**
 * @author dohuyhai
 * Spring Data repository for the ImportSetting entity.
 */
@Repository
@XRayEnabled
public interface ImportSettingRepository extends JpaRepository<ImportSetting, Long> {
    
    /**
     * get entiy by importId 
     * @param importId
     * @return
     */
    public ImportSetting findByImportId(Long importId);
}
