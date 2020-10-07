package jp.co.softbrain.esales.commons.service;

import com.amazonaws.xray.spring.aop.XRayEnabled;
import jp.co.softbrain.esales.commons.service.dto.*;
import jp.co.softbrain.esales.commons.service.dto.FilterConditionsDTO;
import jp.co.softbrain.esales.commons.service.dto.OrderByDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link jp.co.softbrain.esales.commons.domain.AccessLog}.
 */
@XRayEnabled
public interface AccessLogService {

    /**
     * Save a accessLog.
     *
     * @param accessLogDTO the entity to save.
     * @return the persisted entity.
     */
    AccessLogDTO save(AccessLogDTO accessLogDTO);

    /**
     * Get all the accessLogs.
     *
     * @return the list of entities.
     */
    List<AccessLogDTO> findAll();

    /**
     * Get the "id" accessLog.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AccessLogDTO> findOne(Long id);

    /**
     * Delete the "id" accessLog.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * export Access Logs
     *
     * @param dateFrom : date from
     * @param dateTo : date to
     * @param searchLocal : string for search
     * @param filterConditions : filter conditions for  export access logs
     * @param orderBy : order by for export access logs
     * @return ExportAccessLogsOutDTO : DTO out of API exportAccessLogs
     */
    String exportAccessLogs(String dateFrom, String dateTo, String searchLocal,
            List<FilterConditionsDTO> filterConditions, List<OrderByDTO> orderBy);

    /**
     * Get Access Logs
     *
     * @param accessLog
     * @return
     */
    GetAccessLogsOutDTO getAccessLogs(GetAccessLogsInDTO accessLog);
    
}
