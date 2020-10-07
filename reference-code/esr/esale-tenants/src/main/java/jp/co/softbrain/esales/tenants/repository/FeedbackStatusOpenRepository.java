package jp.co.softbrain.esales.tenants.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.tenants.domain.FeedbackStatusOpen;

/**
 * FeedbackStatusOpenRepository
 *
 * @author DatDV
 */
@Repository
@XRayEnabled
public interface FeedbackStatusOpenRepository extends JpaRepository<FeedbackStatusOpen, Long> {

    /**
     * findByEmployeeId
     *
     * @param employeeId
     * @return
     */
    Optional<FeedbackStatusOpen> findByEmployeeId(Long employeeId);

    /**
     * findByEmployeeIdAndTenantName
     *
     * @param employeeId
     * @param tenantName
     * @return
     */
    Optional<FeedbackStatusOpen> findByEmployeeIdAndTenantName(Long employeeId , String tenantName);

    /**
     * deleteByEmployeeId
     *
     * @param employeeId
     */
    void deleteByEmployeeId(Long employeeId);

    @Modifying(clearAutomatically = true)
    @Query(value = "INSERT INTO "
                 + "feedback_status_open("
                 + "    employee_id,"
                 + "    created_user,"
                 + "    updated_user,"
                 + "    tenant_name) "
                 + "VALUES ("
                 + "    :employeeId ,"
                 + "    :createdUser , "
                 + "    :updatedUser , "
                 + "    :tenantName)" , nativeQuery = true)
    void insertFeedbackStatusOpen(@Param("employeeId") Long employeeId , @Param("createdUser") Long createdUser , @Param("updatedUser") Long updatedUser ,@Param("tenantName") String tenantName);
}
