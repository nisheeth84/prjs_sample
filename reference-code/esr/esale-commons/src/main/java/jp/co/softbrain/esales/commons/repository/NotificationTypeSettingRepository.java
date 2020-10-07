package jp.co.softbrain.esales.commons.repository;
import jp.co.softbrain.esales.commons.domain.NotificationTypeSetting;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the NotificationTypeSetting entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotificationTypeSettingRepository extends JpaRepository<NotificationTypeSetting, Long> {

}
