package jp.co.softbrain.esales.customers.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.amazonaws.xray.spring.aop.XRayEnabled;

import jp.co.softbrain.esales.customers.domain.Calendars;

/**
 * Spring Data repository for the Calendars entity.
 */
@Repository
@XRayEnabled
public interface CalendarsRepository extends JpaRepository<Calendars, Long> {

    /**
     * findByCalendarId
     * 
     * @param calendarId calendarId
     * @return the entity of Calendars
     */
    Calendars findByCalendarId(Long calendarId);

    /**
     * Find list calendars by list id calendar
     * 
     * @param calendarIdList - List id of calendar
     * @return the list entity of Calendars
     */
    List<Calendars> findByCalendarIdIn(List<Long> calendarIdList);

    /**
     * Find list calendars by list id calendar order by item_division
     * 
     * @param calendarIdList - List id of calendar
     * @return the list entity of Calendars
     */
    List<Calendars> findByCalendarIdInOrderByItemDivisionAsc(List<Long> calendarIdList);

    /**
     * findByCalendarIdAndItemDivision
     * 
     * @param calendarId calendarId
     * @param itemDivision itemDivision
     * @return the entity of Calendars
     */
    Calendars findByCalendarIdAndItemDivision(Long calendarId, Integer itemDivision);

    /**
     * Delete calendars by list id of calendars
     * 
     * @param calendarIdList - List id of calendars
     */
    @Modifying(clearAutomatically = true)
    void deleteByCalendarIdIn(List<Long> calendarIdList);

    /**
     * Find startDate by calendar id
     * 
     * @param calendarId - Id of calendars
     * @return start date
     */
    Instant findStartDateByCalendarId(Long calendarId);

    /**
     * get all ID in table
     * 
     * @return List id
     */
    @Query(value = "SELECT cal.calendar_id FROM calendars cal", nativeQuery = true)
    List<Long> findAllId();
}
