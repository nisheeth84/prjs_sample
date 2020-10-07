package jp.co.softbrain.esales.commons.repository;

import jp.co.softbrain.esales.commons.domain.AccessLog;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the AccessLog entity.
 */
@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
}
