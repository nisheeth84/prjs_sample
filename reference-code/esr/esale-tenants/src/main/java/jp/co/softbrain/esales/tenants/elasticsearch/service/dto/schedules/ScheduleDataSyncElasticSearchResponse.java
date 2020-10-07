package jp.co.softbrain.esales.tenants.elasticsearch.service.dto.schedules;

import java.io.Serializable;
import java.util.List;

import jp.co.softbrain.esales.elasticsearch.dto.schedules.CalendarDataSyncElasticSearchDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ScheduleDataSyncElasticSearchResponse
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleDataSyncElasticSearchResponse implements Serializable {

    private static final long serialVersionUID = -1852124758658748499L;

    private List<CalendarDataSyncElasticSearchDTO> calendars;
}
