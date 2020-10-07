package jp.co.softbrain.esales.tenants.elasticsearch.service.dto.schedules;

import lombok.Data;

import java.util.List;

/**
 * Request call API getDataSyncElasticsearch for Schedule
 *
 * @author tongminhcuong
 */
@Data
public class ScheduleGetDataSyncElasticsearchRequest {

    private List<Long> calendarIds;

    private String languageCode;
}
