package jp.co.softbrain.esales.commons.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import jp.co.softbrain.esales.commons.domain.NotificationInformation;

/**
 *NotificationInformationRepository
 *
 * @author lequyphuc
 *
 */
public interface NotificationInformationRepository extends JpaRepository<NotificationInformation, Long> {

}
