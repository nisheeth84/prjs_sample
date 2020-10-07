package jp.co.softbrain.esales.uaa.repository;
import jp.co.softbrain.esales.uaa.domain.UaPasswordHistories;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;


/**
 * Spring Data  repository for the UaPasswordHistories entity.
 */
@SuppressWarnings("unused")
@Repository
@XRayEnabled
public interface UaPasswordHistoriesRepository extends JpaRepository<UaPasswordHistories, Long> {

    /**
     * delete password_histories exclude 3 record lasted
     * @param employeeId
     */
    @Modifying
    @Query(value = "DELETE FROM ua_password_histories WHERE ua_password_history_id IN ("
            + "SELECT ua_password_history_id FROM ua_password_histories WHERE employee_id = :employeeId "
            + "ORDER BY created_date DESC offset 3"
            + ")",
            nativeQuery = true)
    void deletePasswordHistories(@Param("employeeId") Long employeeId);

    /**
     * find by employee id
     *
     * @param employeeId
     * @return List<UaPasswordHistories>
     */
    List<UaPasswordHistories> findByEmployeeId(Long employeeId);
}
