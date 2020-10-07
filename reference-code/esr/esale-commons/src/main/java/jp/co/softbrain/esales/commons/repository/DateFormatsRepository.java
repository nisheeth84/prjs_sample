package jp.co.softbrain.esales.commons.repository;

import jp.co.softbrain.esales.commons.domain.DateFormats;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the DateFormats entity.
 */
@Repository
public interface DateFormatsRepository extends JpaRepository<DateFormats, Long> {
}
