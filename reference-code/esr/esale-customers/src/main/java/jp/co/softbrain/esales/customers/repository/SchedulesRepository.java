package jp.co.softbrain.esales.customers.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.Schedules;
import jp.co.softbrain.esales.customers.service.dto.NextSchedulesDTO;

/**
 * Spring Data repository for the Schedules entity.
 *
 */
@Repository
@XRayEnabled
public interface SchedulesRepository extends JpaRepository<Schedules, Long> {

    /**
     * find task Name, id by customer ids
     * 
     * @param customerIds - list Id customer
     * @return list next action
     */
    @Query("SELECT new jp.co.softbrain.esales.customers.service.dto.NextSchedulesDTO("
            + "s.scheduleId, s.scheduleName, s.customerId ) "
            + "FROM Schedules s "
            + "WHERE s.customerId IN (:customerIds)")
    List<NextSchedulesDTO> findIdAndNameByCustomerIds(@Param("customerIds") List<Long> customerIds);
    
    /**
     * Find customer id by scheduleIds
     * 
     * @param scheduleIds - list scheduleIds
     * @return - list cutomer id
     */
    @Query(value = "SELECT customer_id FROM schedules_view "
            + "WHERE schedule_id IN (:scheduleIds)", nativeQuery = true)
    public List<Long> findCustomerIdByScheduleId(@Param("scheduleIds") List<Long> scheduleIds);

    /**
     * Find customer id by scheduleIds with start date greater than present
     * 
     * @param scheduleIds - list scheduleIds
     * @return - list cutomer id
     */
    @Query(value = "SELECT customer_id FROM schedules_view sc "
            + "INNER JOIN calendars_view cal "
            + "   ON sc.calendar_id = cal.calendar_id "
            + "WHERE sc.schedule_id IN (:scheduleIds) "
            + "  AND cal.start_date IS NOT NULL "
            + "  AND cal.start_date > now() "
            + "  AND sc.customer_id IS NOT NULL ", nativeQuery = true)
    public List<Long> findCustomerIdByNextScheduleId(@Param("scheduleIds") List<Long> scheduleIds);

}
