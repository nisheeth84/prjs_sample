package jp.co.softbrain.esales.commons.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import jp.co.softbrain.esales.commons.service.dto.FilterConditionsDTO;
import jp.co.softbrain.esales.commons.service.dto.GetAccessLogsInDTO;
import jp.co.softbrain.esales.commons.service.dto.OrderByDTO;
import jp.co.softbrain.esales.commons.service.dto.ResultExportDataAccessLogsDTO;
import jp.co.softbrain.esales.commons.service.dto.ResultGetDataAccessLogsDTO;

/**
 * Access Log Repository Custom
 *
 * @author DatDV
 */
@Repository
public interface AccessLogRepositoryCustom {

    /**
     * get Header Access Logs
     *
     * @return java.util.List<java.lang.String>
     */
    List<String> getHeaderAccessLogs();

    /**
     * getAccessLogs
     *
     * @param accessLog : Object FOR get access logs
     * @return List<ResultGetDataAccessLogsDTO> : lits DTO out of API get access
     *         logs
     */
    List<ResultGetDataAccessLogsDTO> getAccessLogs(GetAccessLogsInDTO accessLog);

    /**
     * export access logs
     *
     * @param dateFrom : date from in api export access logs
     * @param dateTo : date to in api export access logs
     * @param searchLocal : search local in api export access logs
     * @param filterConditions : list DTO filter of API export access logs
     * @param orderBy : list DTO sort of API export access logs
     * @return List<ResultExportDataAccessLogsDTO> : list DTO out of API get
     *         access logs
     */
    List<ResultExportDataAccessLogsDTO> exportAccessLogs(String dateFrom, String dateTo, String searchLocal,
            List<FilterConditionsDTO> filterConditions, List<OrderByDTO> orderBy);

    /**
     * count access logs
     *
     * @param dateFrom : date form of API count access logs
     * @param dateTo : date to of API count access logs
     * @param searchLocal : search local of API count access logs
     * @return Long : param out of API count access logs
     */
    Long countAccessLogs(String dateFrom, String dateTo, String searchLocal,
            List<FilterConditionsDTO> filterConditions);
}
