package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.commons.domain.PushNotification;

@Repository
@XRayEnabled
public interface PushNotificationRepository extends JpaRepository<PushNotification, Long> {

    @Query(value = "SELECT * " + "FROM push_notification "
            + "WHERE device_unique_id = :deviceUniqueId ", nativeQuery = true)
    List<PushNotification> getPushNotificationFromDeviceUniqueId(@Param("deviceUniqueId") String deviceUniqueId);

    @Query(value = "SELECT * " + "FROM push_notification " + "WHERE employee_id = :employeeId ", nativeQuery = true)
    List<PushNotification> getPushNotificationFromEmployeeId(@Param("employeeId") Long employeeId);

    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE push_notification "
            + "SET "
            + "employee_id = :employeeId, "
            + "device_token = :deviceToken, "
            + "endpoint = :endpoint, "
            + "is_logged = :isLogged, "
            + "tenant_id = :tenantId "
            + "WHERE "
            + "device_unique_id = :deviceUniqueId", nativeQuery = true)
    void updatePushNotification(@Param("employeeId") Long employeeId, @Param("deviceUniqueId") String deviceUniqueId,
            @Param("deviceToken") String deviceToken, @Param("endpoint") String endpoint,
            @Param("tenantId") String tenantId, @Param("isLogged") Boolean isLogged);
    
    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE push_notification "
            + "SET "
            + "is_logged = :isLogged "
            + "WHERE "
            + "employee_id = :employeeId "
            + "AND tenant_id = :tenantId", nativeQuery = true)
    void updatePushNotification(@Param("employeeId") Long employeeId, @Param("tenantId") String tenantId, @Param("isLogged") Boolean isLogged);
}
