package jp.co.softbrain.esales.commons.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.ImportHistories;

/**
 * Spring Data repository for the ImportHistories entity.
 */
@Repository
@XRayEnabled
public interface ImportHistoriesRepository extends JpaRepository<ImportHistories, Long> {

    Optional<ImportHistories> getImportHistoriesByImportHistoryId(Long importHistoryId);

    public ImportHistories findByImportId(Long importId);

}
