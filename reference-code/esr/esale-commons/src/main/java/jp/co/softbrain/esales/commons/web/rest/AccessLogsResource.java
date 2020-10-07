package jp.co.softbrain.esales.commons.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jp.co.softbrain.esales.commons.service.AccessLogService;
import jp.co.softbrain.esales.commons.service.dto.FilterConditionsDTO;
import jp.co.softbrain.esales.commons.service.dto.GetAccessLogsInDTO;
import jp.co.softbrain.esales.commons.service.dto.GetAccessLogsOutDTO;
import jp.co.softbrain.esales.commons.service.dto.OrderByDTO;
import jp.co.softbrain.esales.commons.web.rest.vm.request.ExportAccessLogsRequest;

/**
 * AccessLogsResource
 *
 * @author DatDV
 */
@RestController
@RequestMapping("/api")
public class AccessLogsResource {

    @Autowired
    private AccessLogService accessLogService;

    /**
     * export Access Logs
     *
     * @param dateFrom
     * @param dateTo
     * @param searchLocal
     * @param filterConditions
     * @param orderBy
     * @return
     */
    @PostMapping(path = "/export-access-logs", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> exportAccessLogs(@RequestBody ExportAccessLogsRequest request) {
        String dateFrom = request.getDateFrom();
        String dateTo = request.getDateTo();
        String searchLocal = request.getSearchLocal();
        List<FilterConditionsDTO> filterConditions = request.getFilterConditions();
        List<OrderByDTO> orderBy = request.getOrderBy();
        return ResponseEntity
                .ok(accessLogService.exportAccessLogs(dateFrom, dateTo, searchLocal, filterConditions, orderBy));
    }

    /**
     * getAccessLogs : get access logs
     *
     * @param accessLog : DTO in of API getAccessLogs
     * @return GetAccessLogsOutDTO : DTO out of API getAccessLogs
     */
    @PostMapping(path = "/get-access-logs", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<GetAccessLogsOutDTO> getAccessLogs(@RequestBody GetAccessLogsInDTO accessLog) {
        return ResponseEntity.ok(accessLogService.getAccessLogs(accessLog));
    }
}
