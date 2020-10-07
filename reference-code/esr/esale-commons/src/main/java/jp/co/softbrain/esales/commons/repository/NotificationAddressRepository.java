package jp.co.softbrain.esales.commons.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.domain.NotificationAddress;

/**
 * Spring Data repository for the NotificationAddress entity.
 *
 * @author QuangLV
 */
@Repository
public interface NotificationAddressRepository extends JpaRepository<NotificationAddress, Long> {

    /**
     * findByEmployeeIdAndNotificationId : Get all the notificationAddresses.
     *
     * @param employeeId : employee id
     * @param notificationId : notification id
     * @return List<NotificationAddress> : the list of entities.
     */
    NotificationAddress findByEmployeeIdAndNotificationId(Long employeeId, Long notificationId);

    /**
     * updateConfirmDateNotificationAddress :
     * updateConfirmDateNotificationAddress
     *
     * @param employeeId : employeeId
     * @param notificationId : notification id
     * @param updatedUser : updated user
     */
    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE notification_address " + "SET confirm_notification_date = CURRENT_TIMESTAMP, "
            + "    updated_user = :updatedUser " + "WHERE employee_id = :employeeId "
            + "AND notification_id = :notificationId", nativeQuery = true)
    void updateConfirmDateNotificationAddress(@Param("employeeId") Long employeeId,
                                              @Param("notificationId") Long notificationId, @Param("updatedUser") Long updatedUser);
}
