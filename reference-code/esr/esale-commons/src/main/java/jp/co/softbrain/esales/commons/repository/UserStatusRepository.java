package jp.co.softbrain.esales.commons.repository;

import jp.co.softbrain.esales.commons.domain.UserStatus;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UserStatus entity.
 */
@Repository
public interface UserStatusRepository extends JpaRepository<UserStatus, Long> {
}
