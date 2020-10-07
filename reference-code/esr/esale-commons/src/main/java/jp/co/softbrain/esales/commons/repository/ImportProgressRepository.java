package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.ImportProgress;

/**
 * @author dohuyhai
 * Spring Data repository for the ImportProgress entity.
 */
@Repository
@XRayEnabled
public interface ImportProgressRepository extends JpaRepository<ImportProgress, Long> {
    
    /**
     * get entiy by importProgressId or importId 
     * @param importProgressId
     * @param importId
     * @return
     */
    public List<ImportProgress> findByImportProgressIdOrImportId(Long importProgressId, Long importId);
    
    /**
     * get entiy by importProgressId 
     * @param importProgressId
     * @return
     */
    public ImportProgress findByImportProgressId(Long importProgressId);
}
